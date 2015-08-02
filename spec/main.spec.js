'use strict';

var _ = require('../src/index');

describe('_', function() {

  describe('chainable property mapper', function() {

    describe('unchained calls', function() {

      it('should map single attributes correctly', function() {
        var testobj = { attr: 'correctly mapped!' };
        var result = _.attr;
        expect( result(testobj) ).toBeDefined();
        expect( result(testobj) ).toBe('correctly mapped!');
      });

      it('should map a function with no arguments correctly', function() {
        var testobj = { fun: function() { return 'correctly mapped!' } };
        var result = _.fun();

        expect( result(testobj) ).toBeDefined();
        expect( result(testobj) ).toBe('correctly mapped!');
      });

      it('should map a function with one argument correctly', function() {
        var testobj = { fun: function() { return 'correctly mapped!' } };
        var result = _.fun();

        expect( result(testobj) ).toBeDefined();
        expect( result(testobj) ).toBe('correctly mapped!');
      });

      it('should map a function with n arguments correctly', function() {
        var testobj = {
          fun: function () {
            var args = Array.prototype.slice.call(arguments);

            return args.reduce(function(p, n) { return p + n });
          },
        };
        
        expect( _.fun(1, 2)(testobj) ).toBe(3);
        expect( _.fun(1, 2, 4)(testobj) ).toBe(7);
        expect( _.fun(1, 2, 4, 1, 7)(testobj) ).toBe(15);
      });

      it('should map a function with a this reference correctly', function() {
        var testobj = {
          attr: 2,
          fun: function (multipler) {
            return multipler * this.attr;
          },
        };

        expect( _.fun(3)(testobj) ).toBe(6);

        testobj.attr = 1;
        expect( _.fun(4)(testobj) ).toBe(4);
      });
      
      it('should map function attributes correctly', function() {
        var testobj = { fun: function() { return 'correctly mapped!' } };

        var result = _.fun;

        // expect( (_.fun)(testobj) ).toBe( jasmine.any(Function) );
        expect( result(testobj)() ).toBe( 'correctly mapped!' );
      });

    });

    describe('chained calls', function() {
      
      it('should map chained attributes correctly', function() {
        var testobj = {
          attr1: { attr2: 'correctly mapped!' },
        };

        var result = _.attr1.attr2;

        expect( result(testobj) ).toBeDefined();
        expect( result(testobj) ).toBe('correctly mapped!');
      });

      it('should map chained function calls correctly', function() {
        var testobj = {
          attr1: 1,
          fun: function() {
            return { attr2: 'correctly mapped!' };
          },
        };

        var attr1ToString = _.attr1.toString();

        var attr2OfFunCall = _.fun().attr2;

        expect( attr1ToString(testobj) ).toBe("1");

        expect( attr2OfFunCall(testobj) ).toBeDefined();
        expect( attr2OfFunCall(testobj) ).toBe('correctly mapped!');
      });

      it('should map chained function calls with one argument correctly', function() {
        var testobj = { attr: 123 };

        var result = _.attr.toString().substr(1);

        expect( result(testobj) ).toBe("23");
      });

      it('should map chained function calls with multiple arguments correctly', function() {
        var testobj = { attr: 123 };

        var result = _.attr.toString().substr(1, 1);

        expect( result(testobj) ).toBe("2");
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