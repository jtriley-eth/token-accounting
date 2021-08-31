// MUST be first
// for testing
import dotenv from 'dotenv'
dotenv.config()

import { expect, assert } from 'chai'
import { getSuperTokenDataAsync } from '../src/aggregation/superToken/index'
import {
	getFlowState,
	getTransfers
} from '../src/aggregation/superToken/accounting'
import { graphEndpoint } from '../src/constants/theGraphEndpoint'
import {
	ethNow,
	ethToUnixTime,
	getSecondsIn,
	roundDownToDay
} from '../src/helpers/time'
import { AccountToken } from '../src/types'

// tests container
describe('superTokens.ts tests', () => {
	it('checking graphEndpoint()', () => {
		const xdaiEndpoint = graphEndpoint('xdai')
		const maticEndpoint = graphEndpoint('polygon-pos')

		expect(xdaiEndpoint).to.equals(
			'https://api.thegraph.com/subgraphs/name/superfluid-finance/superfluid-xdai'
		)
		expect(maticEndpoint).to.equals(
			'https://api.thegraph.com/subgraphs/name/superfluid-finance/superfluid-matic'
		)
		expect(() => graphEndpoint('ethereum')).to.throw(
			'ethereum mainnet not supported'
		)
	})

	it('calling getSuperTokenDataAsync()', async () => {
		const address = process.env.ADDRESS
		// check for error now
		if (typeof address === 'string') {
			await getSuperTokenDataAsync(
				address.toLowerCase(),
				'polygon-pos',
				Date.now() - ethToUnixTime(getSecondsIn('day') * 30),
				Date.now()
			)
			assert.ok(true)
		} else {
			throw Error('dotenv failed to load')
		}
	})
})
