```javascript
// call object properties
_.attr
_.toString()
_.someFunction('arg1', arg2, 3)

// call object property chains
_.attr1.attr2
_.toString().substr(3)

// call operators
_( _, '+', _ )
_( _, '<=', _ )
_( _, '||', _ )
_( _, '&', _ )

// call functions
_( someFunction(_) )
_( someOtherFunction(_, _, ''))

// create objects
_( { propA: _, propB: _ } )

```