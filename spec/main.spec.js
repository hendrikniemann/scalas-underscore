'use strict';

if(!_) {
  var _ = require('../src/index.js');
}

var testobj;

describe('_', function() {

  beforeEach(function() {
    testobj = {
      attr1: 'attr_1',
      attr2: 2,
      attr3: {
        attr: 3,
        fun1: function() {
          return 'Correctly mapped!';
        },
        fun2: function( param ) {
          return this.attr * param;
        },
      },
      attr4: ['arr1', 'arr2', 'arr3', 'arr4'],
      fun1: function() {
        return 'Correctly mapped!';
      },
      fun2: function() {
        return { attr: 'fun_2' };
      },
      fun3: function( param ) {
        return 'This is a ' + param + '.';
      },
      fun4: function( param ) {
        return this.attr2 * param;
      },
      fun5: function( param1, param2 ) {
        return param1 + ' ' + param2;
      },
      funN: function () {
        var args = Array.prototype.slice.call(arguments);

        return args.reduce(function(p, n) { return p + n });
      },
    }
  });

  describe('chainable property mapper', function() {

    describe('unchained calls', function() {

      it('should map single attributes correctly', function() {
        var result = _.attr1;
        expect( result(testobj) ).toBeDefined();
        expect( result(testobj) ).toBe('attr_1');
      });

      it('should map single numeric attributes correctly', function() {
        var testarr = ['correctly mapped!', 'also mapped correctly...'];
        var result1 = _[0];
        var result2 = _[1];
        expect( result1(testarr) ).toBeDefined();
        expect( result1(testarr) ).toBe('correctly mapped!');
        expect( result2(testarr) ).toBeDefined();
        expect( result2(testarr) ).toBe('also mapped correctly...');
      });

      it('should map a method with no arguments correctly', function() {
        var result = _.fun1();

        expect( result(testobj) ).toBeDefined();
        expect( result(testobj) ).toBe('Correctly mapped!');
      });

      it('should map a method with one argument correctly', function() {
        var result = _.fun3('test');

        expect( result(testobj) ).toBeDefined();
        expect( result(testobj) ).toBe('This is a test.');
      });

      it('should map a method with n arguments correctly', function() {
        expect( _.funN(1, 2)(testobj) ).toBe(3);
        expect( _.funN(1, 2, 4)(testobj) ).toBe(7);
        expect( _.funN(1, 2, 4, 1, 7)(testobj) ).toBe(15);
      });

      it('should map a method with a this reference correctly', function() {
        expect( _.fun4(3)(testobj) ).toBe(6);

        testobj.attr2 = 1;
        expect( _.fun4(4)(testobj) ).toBe(4);
      });
      
      it('should map function attributes correctly', function() {
        var result = _.fun1;

        expect( result(testobj) ).toEqual( jasmine.any(Function) );
        expect( result(testobj)() ).toBe( 'Correctly mapped!' );
      });

    });

    describe('chained calls', function() {
      
      it('should map chained attributes correctly', function() {
        var result = _.attr3.attr;

        expect( result(testobj) ).toBeDefined();
        expect( result(testobj) ).toBe(3);
      });

      it('should map chained method calls correctly', function() {
        var attrFun = _.attr3.fun1();

        var funAttr = _.fun2().attr;

        expect( attrFun(testobj) ).toBeDefined();
        expect( attrFun(testobj) ).toBe('Correctly mapped!');

        expect( funAttr(testobj) ).toBeDefined();
        expect( funAttr(testobj) ).toBe('fun_2');
      });

      it('should map chained method calls with one argument correctly', function() {
        var result = _.attr3.fun2(3);

        expect( result(testobj) ).toBe(9);
      });

      it('should map chained method calls with multiple arguments correctly', function() {
        var result = _.attr1.substr(1, 2);

        expect( result(testobj) ).toBe("tt");
      });
    
    });

    describe('unchained calls with placeholders', function() {

      it('should map a single placeholder correctly', function() {
        var testobj = { fun: function( arg ) { return 'arg: ' + arg } };

        var result = _.fun( _ );

        expect( result(testobj, 'testarg') ).toBe('arg: testarg');
      });

      it('should map two placeholders correctly', function() {
        var testobj = { fun: function( arg1, arg2 ) { return arg1 + '-' + arg2 } };

        var result = _.fun( _, _ );

        expect( result(testobj, 'argument1', 'argument2') ).toBe('argument1-argument2');
      });

    });

    describe('unchained calls with chained placeholders', function() {

      it('should map method calls correctly', function() {
          var testobj2 = { someAttr: 92 };

          var result = _.fun4( _.someAttr );

          expect( result(testobj, testobj2) ).toBe( 184 );
      });      

      it('should map function calls correctly', function() {
        var add = _(function(a, b) { return a + b; });

        expect( add(_.attr2, 7)(testobj) ).toBe(9);
      });

    });

  });

  describe('function mapper', function() {

    describe('unchained functions', function() {

      it('should map single placeholder parameters correctly', function() {
        function sayHi( person ) {
          return 'Hi, ' + person + '!';
        }
        var _sayHi = _(sayHi);
        var result = _sayHi(_);

        expect( result('Hendrik') ).toBeDefined();
        expect( result('Hendrik') ).toBe('Hi, Hendrik!');
      });

      it('should map two placeholder parameters correctly', function() {
        function sayGreeting( greeting, person ) {
          return greeting + ', ' + person + '!';
        }
        var _sayGreeting = _(sayGreeting);
        var result = _sayGreeting(_, _);

        expect( result('Hello', 'Hendrik') ).toBeDefined();
        expect( result('Hello', 'Hendrik') ).toBe('Hello, Hendrik!');
      });

      it('should map two mixed parameters correctly', function() {
        function sayGreeting( greeting, person ) {
          return greeting + ', ' + person + '!';
        }
        var _sayGreeting = _(sayGreeting);
        var result = _sayGreeting('Oh hi', _);

        expect( result('Hendrik') ).toBeDefined();
        expect( result('Hendrik') ).toBe('Oh hi, Hendrik!');
      });

    });

  });

});
