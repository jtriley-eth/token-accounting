// MUST be first
// for testing
import dotenv from 'dotenv'
dotenv.config()

import { getSuperTokens, testForChaiDemo } from '../src/aggregation/superToken'
import { expect } from 'chai'

// tests container
describe('superTokens.ts tests', () => {
	// test async
	it('checking getSuperTokens()', async () => {
		// call async function
		const address = process.env.ADDRESS
		if (typeof address === 'string') {
			const superTokens = await getSuperTokens(address, 'goerli')
			expect(superTokens).to.have.lengthOf(2)
		} else {
			throw Error('dotenv failed to load')
		}
	})

	// test
	it('checking testForChaiDemo()', () => {
		expect(testForChaiDemo()).to.equal('asdf')
	})
})
