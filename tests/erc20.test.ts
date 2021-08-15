// MUST be first
// for testing
import dotenv from 'dotenv'
dotenv.config()

import { getTransactionsAsync } from '../src/aggregation/erc20'
import { expect } from 'chai'

describe('erc20 tests', () => {
	it('getTransactionsAsync', async () => {
		const address = process.env.ADDRESS
		const apiKey = process.env.ETHERSCAN_KEY
		if (typeof address === 'string' && typeof apiKey === 'string') {
			const response = await getTransactionsAsync(address, apiKey)
			console.log(response.body)
		} else {
			throw Error('dotenv failed to load')
		}
	})
})
