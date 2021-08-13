import { getSuperTokens, testForChaiDemo } from '../src/aggregation/superToken'
import { expect } from 'chai'

// tests container
describe('superTokens.ts tests', () => {
	// test async
	it('checking getSuperTokens()', async () => {
		// call async function
		const superTokens = await getSuperTokens(
			'0xb47a9b6f062c33ed78630478dff9056687f840f2',
			'goerli'
		)

		expect(superTokens).to.have.lengthOf(2)
	})

	// test
	it('checking testForChaiDemo()', () => {
		expect(testForChaiDemo()).to.equal('asdf')
	})
})
