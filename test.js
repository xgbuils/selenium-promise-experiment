var expect = require('chai').expect
var promise = require('./index.js')

function createEveryPromiseIsFulfilled (arr) {
    return arr.map(function (ms) {
        return promise.delayed(ms).then(function () {
            return ms
        })
    })
}

function createEveryPromiseIsRejected (arr) {
    return arr.map(function (ms) {
        return promise.delayed(ms).then(function () {
            return promise.rejected(ms)
        })
    })
}

function createOddFulfilledEvenRejected (arr) {
    return arr.map(function (ms, index) {
        return promise.delayed(ms).then(function () {
            return index % 2 ? ms : promise.rejected(ms)
        })
    })
}

describe('selenium-experiment-promise', function () {
    describe('all', function () {
        describe('if all of promises are fulfilled', function () {
            it('returns a promise that will be resolved to array of values of resolved promises', function () {
                var allFulfilledPromises = createEveryPromiseIsFulfilled([150, 50, 100, 200])
                return promise.all(allFulfilledPromises).then(function (arr) {
                    expect(arr).to.be.deep.equal([150, 50, 100, 200])
                })
            })
        })

        describe('if all promises are rejected', function () {
            it('returns a promise that will be rejected with the reason of the promise that is rejected in first time', function () {
                var allRejectedPromises = createEveryPromiseIsRejected([150, 50, 100, 200])
                return promise.all(allRejectedPromises).catch(function (reason) {
                    expect(reason).to.be.equal(50)
                })
            })
        })

        describe('if some promises are rejected and others fulfilled', function () {
            it('returns a promise that will be rejected with the reason of the promise that is rejected in first time', function () {
                var someFulfilledSomeRejected = createOddFulfilledEvenRejected([150, 50, 100, 200])
                return promise.all(someFulfilledSomeRejected).catch(function (reason) {
                    expect(reason).to.be.equal(100)
                })
            })
        })
    })

    describe('any', function () {
        describe('if all of promises are fulfilled', function () {
            it('returns a promise that will be resolved with the value of the promise that is resolved in first time', function () {
                var allFulfilledPromises = createEveryPromiseIsFulfilled([150, 50, 100, 200])
                return promise.any(allFulfilledPromises).then(function (value) {
                    expect(value).to.be.deep.equal(50)
                })
            })
        })

        describe('if all promises are rejected', function () {
            it('returns a promise that will be resolved with array of reasons of rejected promises', function () {
                var allRejectedPromises = createEveryPromiseIsRejected([150, 50, 100, 200])
                return promise.any(allRejectedPromises).catch(function (reasons) {
                    expect(reasons).to.be.deep.equal([150, 50, 100, 200])
                })
            })
        })

        describe('if some promises are rejected and others fulfilled', function () {
            it('returns a promise that will be fulfilled with the value of the promise that is fulfilled in first time', function () {
                var someFulfilledSomeRejected = createOddFulfilledEvenRejected([150, 50, 100, 200])
                return promise.any(someFulfilledSomeRejected).then(function (value) {
                    expect(value).to.be.equal(50)
                })
            })
        })
    })
})