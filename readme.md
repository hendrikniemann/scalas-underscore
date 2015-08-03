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
  { name: 'object1',
    data: { weight: 3, length: 7 } },
  { name: 'object2',
    data: { weight: 2, length: 5 } },
  { name: 'object3',
    data: { weight: 9, length: 12 } }
];
```

#### Mapping single properties

Properties can directly be mapped with `_.propertyName`:

```javascript
objects.map(_.name);
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

The method call syntax is no suprise for us.

```javascript
[1, 2, 3].map(_.toString());
// => ['1', '2', '3']
```

#### Mapping method calls with parameters

Why not assign parameters to the calls? It is really simple.

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
 
[12, 16, 23].filter(_(le)(_, 20));
// =>  [12, 16]
```

This is not much different from currying. It gets interesting when combined with attribute mapping:

```javascript
let descending = _(function(a, b) {
  return b - a;
});

objects
  .sort(descending(_.data.weight, _.data.weigth))
  .map(_.name)
  .join(', ');
// => 'object3, object1, object2'
```

## Run the tests

### Browser

Clone the repo and `bower install`. Open the `SpecRunner.html` in your Browser.

### node.js / io.js

Clone the repo and `npm install`. Install jasmine if you haven't `npm install jasmine -g` and execute `jasmine`.