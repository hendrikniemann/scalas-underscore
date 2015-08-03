if(!_) {
  var _ = require('../src/index.js');
}

var objects = [
  { label: 'object1',
    data: { weight: 3, length: 7 } },
  { label: 'object2',
    data: { weight: 2, length: 5 } },
  { label: 'object3',
    data: { weight: 9, length: 12 } }
];

describe('Readme examples', function() {

  it('Mapping single properties', function() {
    expect(
      objects.map(_.label)
    ).toEqual(
      ['object1', 'object2', 'object3']
    );

    expect(
      [[1, 2], [3, 4]].map(_[0])
    ).toEqual(
      [1, 3]
    );
  });

  it('Mapping chained properties', function() {
    expect(
      objects.map(_.data.weight)
    ).toEqual(
      [3, 2, 9]
    );
  });

  it('Mapping method calls', function() {
    expect(
      [1, 2, 3].map(_.toString())
    ).toEqual(
      ['1', '2', '3']
    );
  });

  it('Mapping method calls with parameters', function() {
    expect(
      ['abc', 'def', 'ghi'].map(_.substr(1, 1))
    ).toEqual(
      ['b', 'e', 'h']
    );
  });

  it('Mapping method calls with placeholders', function() {
    expect(
      ['Hello, ', 'kind ', 'stranger!'].reduce(_.concat(_))
    ).toEqual(
      'Hello, kind stranger!'
    );

    expect(
      ['apple', 'banana', 'orange'].reduce(_.concat(',', _))
    ).toEqual(
      'apple,banana,orange'
    );
  });

  it('Mapping functions', function() {
    function le(a, b) {
      return a <= b;
    };
 
    expect(
      [12, 16, 23].filter(_(le)(_, 20))
    ).toEqual(
      [12, 16]
    );

    var descending = _(function(a, b) {
      return b - a;
    });

    expect(
      objects
        .sort(descending(_.data.weight, _.data.weight))
        .map(_.label)
        .join(', ')
    ).toEqual(
      'object3, object1, object2'
    );
  });
});