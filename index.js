var promise = require('selenium-webdriver').promise
var _ = require('lodash')

module.exports = {
	fulfilled: promise.fulfilled,
	rejected: promise.rejected,
	isPromise: promise.isPromise,
	all: promise.all,
	delayed: promise.delayed,
	inverse: function (p) {
        p = promise.isPromise(p) ? p : this.fulfilled(p)
        return p.then(function (value) {
        	throw value
        }, _.identity)
	},
	any: function (arr) {
        return this.inverse(this.all(arr.map(this.inverse)));
    },
	any2: function (arr) {
		return this.all(arr.map(iteratee)).then(_.any)
	}
}