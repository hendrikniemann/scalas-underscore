'use strict';



const is_ = Symbol('is_');
const callStack = Symbol('call');
const evaluate = Symbol('eval');
const len = Symbol('length');

/**
 * This function is called, when the the actual mapping starts.
 * It evaluates the result with the given arguments and the call stack.
 */
function evalFn(args) {
  let stack = this[callStack];
  let currArg = 0;

  // get n arguments from the argument list provided to this function
  let getArgs = function(amount) {
    const ret = args.slice(currArg, currArg + amount);
    currArg += amount;
    
    return ret;
  };

  let val = args.shift();

  // go through call stack and apply attributes and calls
  for( let i = 0, le = stack.length; i < le; i++ ) {
    let curr = stack[i];
    if (curr.called) {
      if (typeof val[curr.propName] !== 'function') {
        throw new TypeError('Property ' + curr.propName +
            ' is not a function in ' + JSON.stringify(val));
      }
      // Replace placeholders with arguments
      for( let k = 0, al = curr.args.length; k < al; k++ ) {
        if(curr.args[k][is_]) {
            // call the evaluation with needed amount of arguments
            curr.args[k] = curr.args[k][evaluate]( getArgs(curr.args[k][len]) );
        }
      }
      val = val[curr.propName].apply(val, curr.args);
    } else {
      if (typeof val[curr.propName] == 'undefined') {
        throw new TypeError('Property ' + curr.propName +
            ' is undefined in ' + JSON.stringify(val));
      }
      val = val[curr.propName];
    }
  }
  return val;
}

/**
 * the standard handler, when the target function is already created
 */
let underscoreHandler = {
  get: function(target, propKey, receiver) {
    // trap also matches Symbol calls from this library
    if([is_, len, callStack, evaluate].indexOf(propKey) >= 0) {
      return target[propKey];
    }
    target[callStack].push({
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
    if([is_, len, callStack, evaluate].indexOf(propKey) >= 0) {
      return target[propKey];
    }

    // Create callable function
    let _ = function _() {
      // Create array with arguments
      const args = Array.prototype.slice.call(arguments);
      // Diffentiate between mapped Function calls
      // an the actual mapping call
      if (this && this[is_]) {
        // apply arguments to the last attribute gotten
        let stack = _[callStack];

        // calculate new gained length
        for(let i = 0, arglen = args.length; i < arglen; i++) {
          if(args[i][is_]) {
            _[len] += args[i][len];
          }
        }
        stack[stack.length - 1].called = true;
        stack[stack.length - 1].args = args;
        // Proxy gets lost otherwise?
        return new Proxy(_, underscoreHandler);
      } else {
        return _[evaluate](args);
      }
    };
    _[is_] = true;
    _[callStack] = [{
      propName: propKey,
      called: false,
      args: [],
    }];
    _[evaluate] = evalFn;
    _[len] = 1;
    return new Proxy(_, underscoreHandler);
  }
}

function placeholderify(origin) {
  return function() {
    const bound = arguments;

    return function() {
      const args = Array.prototype.slice.call(arguments);
      const callArgs = [];

      for(let i = 0, arglen = bound.length; i < arglen; i++) {
        if( bound[i][is_] ) {
          callArgs.push(args.shift());
        } else {
          callArgs.push(bound[i]);
        }
      }

      return origin.apply(null, callArgs);
    };

  };
}

let target = function(param) {
  if( typeof param === 'function' ) {
    // This function is ready to accept placeholder parameters
    return placeholderify(param);
  }
};
target[is_] = true;

// identical function for single placeholders to evaluate (expects 1 param)
target[evaluate] = id => id;
target[len] = 1;

const _ = new Proxy(target, initialHandler);

export default _;