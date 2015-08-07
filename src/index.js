'use strict';

var _ = (function() {


let intnl = Symbol('internal');

// Shim for v8 Proxy objects since v8's implementation does not match
// the ES2015 specification
if( typeof Proxy === 'object' ) {
  require('harmony-reflect');

  // v8 </3 Proxys with Symbols
  // @see https://github.com/tvcutsem/harmony-reflect/issues/57
  intnl = 'lkjagsgislkcjbksefvksljcbkvjeghvkjhkb';
}

/**
 * Small helper class to make argument handling easier
 */
class ArgumentPool {
  constructor(args) {
    this.args = args;
    this.currArg = 0;

    if(!this.args.slice) {
      this.args = Array.prototype.slice.call(this.args);
    }
  }

  getArgs( amount ) {
    this.currArg += amount;
    return this.args.slice(this.currArg - amount, this.currArg);
  }
}

/**
 * the standard handler, when the target function is already created
 */
let underscoreHandler = {
  get: function(target, propKey, receiver) {
    // trap also matches Symbol calls from this library
    if(propKey === intnl) {
      return target[intnl];
    }

    target[intnl].callStack.push({
      propName: propKey,
      called: false,
      args: [],
    });
    return target;
  }
};

/**
 * The initial handler for the _
 * This one is different from the chained handler since it has to
 * create the function, that is simply returned in the chained handler
 */
let initialHandler = {
  get: function(target, propKey, receiver) {

    // trap also matches Symbol calls from this library
    if(intnl === propKey) {
      // return the Symbol property then
      return target[intnl];
    }

    // Create callable function
    let _ = function _() {
      // Create array with arguments
      const args = Array.prototype.slice.call(arguments);
      // Diffentiate between mapped Function calls
      // an the actual mapping call
      if (this && this[intnl]) {
        // apply arguments to the last attribute gotten
        let stack = _[intnl].callStack;

        // calculate new gained length
        for(let i = 0, arglen = args.length; i < arglen; i++) {
          if(args[i][intnl]) {
            _[intnl].length += args[i][intnl].length;
          }
        }
        stack[stack.length - 1].called = true;
        stack[stack.length - 1].args = args;
        // Proxy gets lost otherwise?
        return new Proxy(_, underscoreHandler);
      } else {
        return _[intnl].evaluate(args);
      }
    };

    _[intnl] = new InternalState(false, [{
      propName: propKey,
      called: false,
      args: [],
    }]);

    return new Proxy(_, underscoreHandler);
  }
}



class InternalState {

  constructor( expecting, callStack ) {
    this.expecting = expecting;
    this.length = 1;
    
    if ( typeof callStack !== 'undefined' ) {
      this.callStack = callStack;
    } else {
      this.callStack = [];
    }
  }

  evaluate( args ) {

    // if this is a single unnamed parameter
    if( this.callStack.length === 0 && this.expecting === false ) {
      return args[0];
    }

    // if this is a single named parameter
    if( this.callStack.length === 0 && this.expecting !== false ) {
      return args[ this.expecting ];
    }

    if( this.expecting === false ) {
      return this.evaluateUnnamed( args );
    }
  }

  evaluateUnnamed( args ) {
    let stack = this.callStack;

    let pool = new ArgumentPool(args);

    // set starting 
    let val = pool.getArgs(1)[0];

    // go through call stack and apply attributes and calls
    for( let i = 0, le = stack.length; i < le; i++ ) {
      let curr = stack[i];
      // reduce method calls
      if (curr.called) {
        if (typeof val[curr.propName] !== 'function') {
          throw new TypeError('Property ' + curr.propName +
              ' is not a function in ' + JSON.stringify(val));
        }
        let callArgs = [];
        // Replace placeholders with arguments
        for( let k = 0, al = curr.args.length; k < al; k++ ) {
          let currArg = curr.args[k];
          if(currArg[intnl]) {
            // call the evaluation with needed amount of arguments
            callArgs.push(currArg[intnl].evaluate( pool.getArgs(currArg[intnl].length) ));
          } else {
            callArgs.push(currArg);
          }
        }
        val = val[curr.propName].apply(val, callArgs);
      } else  { // Property calls
        val = val[curr.propName];
      }
    }
    return val;
  }
}



/**
 * Creates a wrapper around a function, so that it accepts placeholders and
 * creates a new function.
 * @param origin the function to transform
 */
function placeholderify( origin ) {
  return function() {
    const bound = arguments;

    return function() {
      const pool = new ArgumentPool(arguments);
      const callArgs = [];

      for(let i = 0, arglen = bound.length; i < arglen; i++) {
        let arg = bound[i];
        if( arg[intnl] ) {
          if( arg[intnl].expecting === false) {
            callArgs.push(arg[intnl].evaluate(pool.getArgs(arg[intnl].length)));
          }
        } else {
          callArgs.push(arg);
        }
      }

      return origin.apply(null, callArgs);
    };

  };
}

/**
 * The initial underscore function. It accepts various kinds of parameters:
 * A function: Creates a wrapper with placeholderify
 * A number: Create a named placeholder
 */
let placeholder = function( param ) {
  if( typeof param === 'function' ) {
    // This function is ready to accept placeholder parameters
    return placeholderify( param );
  }
};

placeholder[intnl] = new InternalState( false );

const _ = new Proxy( placeholder, initialHandler );

return _;

})();

module.exports = _;