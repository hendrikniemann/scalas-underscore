'use strict';

const is_ = Symbol('is_');
const callStack = Symbol('call');
const evaluate = Symbol('eval');

/**
 * This function is called, when the the actual mapping starts.
 * It evaluates the result with the given arguments and the call stack.
 */
function evalFn(args) {
  let arglen = args.length;
  let stack = this[callStack];
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
          curr.args[k] = args.shift();
        }
      }
      console.log(curr.args);
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
    if(propKey === is_) {
      return target[is_];
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
    // Create callable function
    let _ = function _() {
      // Create array with arguments
      const args = Array.prototype.slice.call(arguments);
      // Diffentiate between mapped Function calls
      // an the actual mapping call
      if (this && this[is_]) {
        // apply arguments to the last attribute gotten
        let stack = _[callStack];
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
    return new Proxy(_, underscoreHandler);
  }
}

let target = Object.create(null);
target[is_] = true;
target[evaluate] = args => args[0].args[0];

const _ = new Proxy(target, initialHandler);

export default _