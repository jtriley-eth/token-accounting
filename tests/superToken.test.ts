import { getSuperTokens } from '../src/aggregation/superToken'
import { expect } from 'chai'
import { ethToUnixTime, getSecondsIn } from '../src/helpers/time'

// tests container
describe('superTokens.ts tests', () => {
	// test async
	it('checking getSuperTokens()', async () => {
		// call async function
		const superTokens = await getSuperTokens(
			'0xb47a9b6f062c33ed78630478dff9056687f840f2',
			'goerli',
			Date.now() - ethToUnixTime(getSecondsIn('day') * 30),
			Date.now()
		)

		console.log(superTokens)
		expect(superTokens).to.equal(30)

		// expect(superTokens).to.have.lengthOf(2)
	})
})
