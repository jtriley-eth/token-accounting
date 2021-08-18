// MUST be first
// for testing
import dotenv from 'dotenv'
dotenv.config()

import { getTransactionsAsync } from '../src/aggregation/erc20'
// import { expect } from 'chai'
import fs from 'fs'

describe('erc20 tests', () => {
	it('getTransactionsAsync', async () => {
		const address = process.env.ADDRESS
		const apiKey = process.env.ETHERSCAN_KEY

		if (typeof address === 'string' && typeof apiKey === 'string') {
			await getTransactionsAsync(address, apiKey)
		} else {
			throw Error('dotenv failed to load')
		}
	})
})
