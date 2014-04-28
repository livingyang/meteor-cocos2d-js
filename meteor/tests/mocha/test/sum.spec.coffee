assert = require 'assert'
add = (require '../../../lib/sum.coffee').add

describe 'Sum', ->
	it 'test add', ->
		assert.equal 3, add 1, 2