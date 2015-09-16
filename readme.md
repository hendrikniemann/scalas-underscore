# Scalas underscore syntax for anonymous functions

## About

This library brings some of the syntactical sugar from Scala's short syntax for creating anonymous functions to JavaScript. These functions are often used to map Lists and Arrays.

This library uses the experimental features Symbols and Proxies from ES2015 (ES6). Since Proxies can not be converted to ES5, an environment that implements Proxies is required. This is currently only the case in the newsest versions of Firefox. It also runs on io.js with the `--harmony_proxies` flag.

## Installation

```
npm install git+https://git@github.com/hendrikniemann/scalas-underscore.git
```

## Comparison

```javascript
// Classic
[1, 2, 3].map( function( element ) { return element.toString() } );
// => ['1', '2', '3']

// ES2015 Arrow Functions
[1, 2, 3].map(e => e.toString());

// Underscore Syntax
[1, 2, 3].map(_.toString());
```

For more complex examples see Usage section below:

## Usage

### Property mapping

The following examples may use this array of objects:

```javascript
var objects = [
  { label: 'object1',
    data: { weight: 3, length: 7 } },
  { label: 'object2',
    data: { weight: 2, length: 5 } },
  { label: 'object3',
    data: { weight: 9, length: 12 } }
];
```

#### Mapping single properties

Properties can directly be mapped with `_.propertyName`:

```javascript
objects.map(_.label);
// => ['object1', 'object2', 'object3']
```

Also numeric properties e.g. in arrays can be selected without a problem.

```javascript
[[1, 2], [3, 4]].map(_[0]);
// => [1, 3]
```

#### Mapping chained properties

Nested properties can be accessed just as easily.

```javascript
objects.map(_.data.weight);
// => [3, 2, 9]
```

### Method mapping

#### Mapping method calls

The method call syntax as expected.

```javascript
[1, 2, 3].map(_.toString());
// => ['1', '2', '3']
```

#### Mapping method calls with parameters

Want to assign parameters to the calls? It is really simple.

```javascript
['abc', 'def', 'ghi'].map(_.substr(1, 1));
// => ['b', 'e', 'h']
```

#### Mapping method calls with placeholders

We can also add placeholders for method arguments and create functions, that accept more than one parameter.

```javascript
['Hello, ', 'kind ', 'stranger!'].reduce(_.concat(_));
// => 'Hello, kind stranger!'
```

Mixing predefined parameters with placeholders enables us to recreate the `Array.prototype.join` method:

```javascript
['apple', 'banana', 'orange'].reduce(_.concat(',', _));
// => 'apple,banana,orange'
```

### Function mapping

In order to acceppt placeholders, functions need to be transformed with a function call on `_`.

```javascript
function le(a, b) {
  return a <= b;
};

let transformed = _(le);
 
[12, 16, 23].filter(transformed(_, 20));
// =>  [12, 16]
```

This is not much different from currying. It gets interesting when combined with attribute mapping:

```javascript
// here we transform instantly
let descending = _(function(a, b) {
  return b - a;
});

objects
  .sort(descending(_.data.weight, _.data.weight))
  .map(_.label)
  .join(', ');
// => 'object3, object1, object2'
```

### Named parameters

Named parameters let you specify the parameter, that is inserted. In the previous examples parameters were inserted from left to right. With this behaviour we are not able to use the same parameter twice, or change the order of parameters. 

```javascript
['a', 'b', 'c'].reduce(_.concat(_));
// => 'abc'
```

What if we want the first parameter concated on the second parameter in order to receive the string backwards? Here named parameters come in handy. Named placeholders can be created by calling the `_` function with the parameter number. The first parameter is returned when calling the function with 0, since arrays and javascripts `arguments` variable in functions start with 0:

```javascript
['a', 'b', 'c'].reduce(_(1).concat(_(0)));
```

It might be useful to create variables for the named placeholders:

```javascript
// store our named placeholders in variables
const _0 = _(0);
const _1 = _(1);
// If you don't like starting with 0 you can use
//   _1 = _(0) or x1 = _(0)

// Now use the generated variables
['a', 'b', 'c'].reduce(_1.concat(_0));
// => 'cba'
```

You can use named placeholders just as you use unnamed placeholders. Though the parameter loses the function characteristics for transforming functions and creating named placeholders:

```javascript
const _0 = _(0);

_0(function() {}); // doesn't work, returns the function
const _1 = _0(0); // doesn't work either, returns 0
```

Both function calls on `_(0)` return the first argument, calls on `_(1)` will return the second argument and so on.

You can in theory use named placehodlers with unnamed placeholders. This is extremely discouraged and not tested. You should either use named placeholders or unnamed placeholders in the same function.

## Run the tests

### Browser

Clone the repo and `bower install`. Open the `SpecRunner.html` in your Browser.

### node.js / io.js

Clone the repo and `npm install`. Install jasmine if you haven't `npm install jasmine -g` and execute `jasmine`.