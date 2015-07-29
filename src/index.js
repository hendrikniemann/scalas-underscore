'use strict';

const is_ = Symbol('is_');
const callStack = Symbol('call');
const evaluate = Symbol('eval');

function Func() {
  return function() {};
}

function evalFn(args) {
  let arglen = args.length;
  let stack = this[callStack];
  let val = args[0];
  for( let i = 0, le = stack.length; i < le; i++ ) {
    let curr = stack[i];
    if (curr.called) {
      if (typeof val[curr.propName] !== 'function') {
        throw new TypeError('Property ' + curr.propName +
            ' is not a function in ' + JSON.stringify(val));
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

let underscoreHandler = {
  get: function(target, propKey, receiver) {
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

let initialHandler = {
  get: function(target, propKey, receiver) {
    let _ = function _() {
      if (this && this[is_]) {
        let stack = _[callStack];
        stack[stack.length - 1].called = true;
        stack[stack.length - 1].args = arguments;
        return new Proxy(_, underscoreHandler);
      } else {
        return _[evaluate](arguments);
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

const _ = new Proxy(target, initialHandler);

export default _