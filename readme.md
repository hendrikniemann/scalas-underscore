# Scalas underscore syntax for anonymous functions

## About

This library brings some of the syntactical sugar from Scala's short syntax for creating anonymous functions to JavaScript. These functions are often used to map Lists and Arrays.

This library uses the experimental features Symbols and Proxies from ES2015 (ES6). Since Proxies can not be converted to ES5, a environment that implements Proxies is required. This is currently only the case in the newsest versions of Firefox. 

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

#### Mapping single properties

#### Mapping chained properties

### Method mapping

#### Mapping method calls

```javascript
[1, 2, 3].map(_.toString());
// => ['1', '2', '3']
```

#### Mapping placeholded method calls

```javascript
['Hello, ', 'kind ', 'stranger!'].reduce(_.concat(_));
// => 'Hello, kind stranger!'
```
