
require = require("esm")(module/*, options*/)
var proxify = require('../core/protocol/proxify').default
var deproxify = require('../core/protocol/deproxify').default
var copyProxy = require('../core/protocol/copyProxy').default
const Protocol = require('../core/protocol/Protocol').default
var lhtnet = require('..').default

//import proxify from '../core/protocol/proxify'
//import deproxify from '../core/protocol/deproxify'
//import copyProxy from '../core/protocol/copyProxy'
//import lhtnet from '../index'

const config = {
    ID_BINARY_TYPE: lhtnet.UInt16,
    TYPE_BINARY_TYPE: lhtnet.UInt8, 

    ID_PROPERTY_NAME: 'nid',
    TYPE_PROPERTY_NAME: 'ntype', 
}

/*
* Proxification is the conversion of any object described by a protocol
* into a serialized array. The data in the proxy is a copy of the original
* and can be reconstituted into an object using the schem as a guide. This
* is of course not the original object, but a copy - called a proxy. Why
* is a proxy an array and not an object? Most of its performance-critical usage
* involves iterating through its contents. It also parallels the data eventually
* written to buffer.
*/
describe('proxification', function() {
    it('of a simple object', function() {
        var obj = {
            number: 1234567890,
            string: 'Hello world'
        }

        var objProtocol = new Protocol({
            number: lhtnet.UInt32,
            string: lhtnet.ASCIIString
        }, config)

        var proxy = proxify(obj, objProtocol)

        // NOTE: order of properties is alphabetical which works out
        // for this test, but access should use the protocol (see next test)
        expect(proxy.number).toEqual(obj.number)
        expect(proxy.string).toEqual(obj.string)

        var recreatedObj = deproxify(proxy, objProtocol)

        // equivalent but distinct
        expect(recreatedObj).toEqual(obj)
        expect(recreatedObj).not.toBe(obj)
    })

    it('of floats', function() {
        var obj = {
            a: Math.PI * 123,
            b: Math.PI * 321
        }

        var objProtocol = new Protocol({
            a: lhtnet.Float64,
            b: lhtnet.Float32
        }, config)

        var proxy = proxify(obj, objProtocol)

        expect(proxy.a).toEqual(obj.a)
        expect(proxy.b).toEqual(obj.b)

        var recreatedObj = deproxify(proxy, objProtocol)

        // equivalent but distinct
        expect(recreatedObj).toEqual(obj)
        expect(recreatedObj).not.toBe(obj)
    })

    it('of path syntax', function() {
        var obj = {
            number: 1234567890,
            string: 'Hello world',
            physics: {
                velocity: {
                    x: 55,
                    y: -24
                }
            }
        }

        var objProtocol = new Protocol({
            number: lhtnet.UInt32,
            string: lhtnet.ASCIIString,
            'physics.velocity.x': lhtnet.Int8,
            'physics.velocity.y': lhtnet.Int8
        }, config)

        var proxy = proxify(obj, objProtocol)
 
        expect(proxy.number).toEqual(obj.number)
        expect(proxy.string).toEqual(obj.string)

        var recreatedObj = deproxify(proxy, objProtocol)

        // equivalent but distinct
        expect(recreatedObj).toEqual(obj)
        expect(recreatedObj).not.toBe(obj)

        expect(recreatedObj.physics.velocity.y).toEqual(-24)
    }, config)

    it('of an object containing an array of values', function() {
        var obj = {
            number: 1234567890,
            string: 'Hello world',
            array: [ 1, 2, 3, 4, 5 ]
        }

        var objProtocol = new Protocol({
            number: lhtnet.UInt32,
            string: lhtnet.ASCIIString,
            array: { type: lhtnet.UInt8, indexType: lhtnet.UInt8 }
        }, config)

        var proxy = proxify(obj, objProtocol)

        expect(proxy.number).toEqual(obj.number)
        expect(proxy.string).toEqual(obj.string)

        var recreatedObj = deproxify(proxy, objProtocol)

        // equivalent but distinct
        expect(recreatedObj).toEqual(obj)
        expect(recreatedObj).not.toBe(obj)
        // explicitly checking that the array is a copy of the original
        expect(recreatedObj.array).not.toBe(obj.array)
        expect(recreatedObj.array).toEqual(obj.array)
    })

    it('of an object containing an array of strings', function() {
        var obj = {
            array: [ 'foo', 'bar', 'baz' ]
        }

        var objProtocol = new Protocol({
            array: { type: lhtnet.ASCIIString, indexType: lhtnet.UInt8 }
        }, config)

        var proxy = proxify(obj, objProtocol)

        expect(proxy.array).toEqual(obj.array)

        var recreatedObj = deproxify(proxy, objProtocol)

        // equivalent but distinct
        expect(recreatedObj).toEqual(obj)
        expect(recreatedObj).not.toBe(obj)
        // explicitly checking that the array is a copy of the original
        expect(recreatedObj.array).not.toBe(obj.array)
        expect(recreatedObj.array).toEqual(obj.array)
    })


    /*
    it('of an object containing an array of objects without protocols', function() {
        // TODO: proxify can handle this, but can the rest of the lib?
        // this was never an intended feature, and could never be read 
        // out of a binary buffer without additional data

        var obj = {
            number: 1234567890,
            string: 'Hello world',
            array: [ { x: 5 }, { x: 6 } ]
        }

        var objProtocol = new lhtnet.Protocol({
            number: lhtnet.UInt32,
            string: lhtnet.ASCIIString,
            array: { type: lhtnet.UInt8, indexType: lhtnet.UInt8 }
        })

        var proxy = proxify(obj, objProtocol)

        expect(proxy[objProtocol.properties.number.key]).toEqual(obj.number)
        expect(proxy[objProtocol.properties.string.key]).toEqual(obj.string)

        var recreatedObj = deproxify(proxy, objProtocol)

        console.log(recreatedObj, proxy)

        // equivalent but distinct
        expect(recreatedObj).toEqual(obj)
        expect(recreatedObj).not.toBe(obj)
        // explicitly checking that the array is a copy of the original
        expect(recreatedObj.array).not.toBe(obj.array)
        expect(recreatedObj.array).toEqual(obj.array)
    })
    */

    it('of an object containing another object with their own protocol', function() {
        var obj = {
            number: 1234567890,
            string: 'Hello world',
            foo: { test: 123 }
        }

        var fooProtocol = new Protocol({
            test: lhtnet.UInt8
        }, config)

        var objProtocol = new Protocol({
            number: lhtnet.UInt32,
            string: lhtnet.ASCIIString,
            foo: fooProtocol
        }, config)

        var proxy = proxify(obj, objProtocol)

        expect(proxy.number).toEqual(obj.number)
        expect(proxy.string).toEqual(obj.string)

        var recreatedObj = deproxify(proxy, objProtocol)

        // equivalent but distinct
        expect(recreatedObj).toEqual(obj)
        expect(recreatedObj).not.toBe(obj)
        // explicitly checking that the sub object is distinct
        expect(recreatedObj.foo).not.toBe(obj.foo)
        expect(recreatedObj.foo).toEqual(obj.foo)
    })

    it('of an object containing an array of objects described by a protocol', function() {
        /*
        var obj = {
            number: 1234567890,
            string: 'Hello world',
            foo: [
                { test: 123 },
                { test: 456 },
                { test: 789 }
            ] 
        }
        */

       class Foo {
            constructor(test) {
                this.test = test
            }
        }
        Foo.prototype.protocol = new Protocol({
            test: lhtnet.UInt8
        }, config)

        class Obj {
            constructor(number, string, foo) {
                this.number = number
                this.string = string
                this.foo = foo
            }
        }
        Obj.prototype.protocol = new Protocol({
            number: lhtnet.UInt32,
            string: lhtnet.ASCIIString,
            foo: { type: Foo, indexType: lhtnet.UInt8 }
        }, config)


        var obj = new Obj(
            1234567890, 
            'Hello world',
            [
                new Foo(1),
                new Foo(2),
                new Foo(3),
            ] 
        )
        var proxy = proxify(obj, obj.protocol)
        //console.log('PROXY', proxy)

        expect(proxy.number).toEqual(obj.number)
        expect(proxy.string).toEqual(obj.string)

        var recreatedObj = deproxify(proxy, obj.protocol)

        // equivalent but distinct
        expect(recreatedObj.number).toEqual(obj.number)
        expect(recreatedObj.string).toEqual(obj.string)
        expect(recreatedObj).not.toBe(obj)

        // equivalent but distinct subobjects
        //expect(recreatedObj.foo).not.toBe(obj.foo)
        //expect(recreatedObj.foo).toEqual(obj.foo)
        expect(recreatedObj.foo[0].test).toEqual(obj.foo[0].test)
        expect(recreatedObj.foo[0]).not.toBe(obj.foo[0])
    })

    it('of arbitrarily complicated objects', function() {

        // NOTE: it is possible to create a cyclic relationship, and that will
        // cause an infinite loop.

        var obj = {}
        obj.number = 16
        obj.string = 'I am a container'
        obj.foo = {}
        obj.foo.array = []

        for (var i = 0; i < 5; i++) {
            var bar = {
                index: i,
                message: 'Hello I am ' + i
            }
            obj.foo.array.push(bar)
            obj.foo.test = i
        }

        var barProtocol = new Protocol({
            index: lhtnet.UInt8,
            message: lhtnet.ASCIIString
        }, config)

        var fooProtocol = new Protocol({
            test: lhtnet.UInt8,
            array: { type: barProtocol, indexType: lhtnet.UInt8 }
        }, config)

        var objProtocol = new Protocol({
            number: lhtnet.UInt32,
            string: lhtnet.ASCIIString,
            foo: fooProtocol
        }, config)

        var proxy = proxify(obj, objProtocol)

        expect(proxy.number).toEqual(obj.number)
        expect(proxy.string).toEqual(obj.string)

        var recreatedObj = deproxify(proxy, objProtocol)

        // equivalent but distinct
        expect(recreatedObj).toEqual(obj)
        expect(recreatedObj).not.toBe(obj)
    })

    it('copy, advanced', function() {

        // testing copyProxy using the complicated example

        var obj = {}
        obj.number = 16
        obj.string = 'I am a container'
        obj.component = {
            x: 50,
            y: 50
        }
        obj.foo = {}
        obj.foo.array = []

        for (var i = 0; i < 5; i++) {
            var bar = {
                index: i,
                message: 'Hello I am ' + i
            }
            obj.foo.array.push(bar)
            obj.foo.test = i
        }

        var barProtocol = new Protocol({
            index: lhtnet.UInt8,
            message: lhtnet.ASCIIString
        }, config)

        var fooProtocol = new Protocol({
            test: lhtnet.UInt8,
            array: { type: barProtocol, indexType: lhtnet.UInt8 }
        }, config)

        var objProtocol = new Protocol({
            number: lhtnet.UInt32,
            string: lhtnet.ASCIIString,
            'component.x': lhtnet.UInt8,
            'component.y': lhtnet.UInt8,
            foo: fooProtocol
        }, config)

        var proxy = proxify(obj, objProtocol)

        var copy = copyProxy(proxy, objProtocol)

        expect(copy).toEqual(proxy)
        expect(copy).not.toBe(proxy)
    })
})