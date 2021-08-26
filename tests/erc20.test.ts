// MUST be first
// for testing
import dotenv from 'dotenv'
dotenv.config()
import { getTransactionsAsync } from '../src/aggregation/erc20'
import { assert } from 'chai'

describe('erc20 tests', () => {
	it('getTransactionsAsync (mainnet)', async () => {
		const address = process.env.ADDRESS
		const apiKey = process.env.ETHERSCAN_KEY

		if (typeof address === 'string' && typeof apiKey === 'string') {
			await getTransactionsAsync(address, 'ethereum', apiKey)
			assert.ok(true)
		} else {
			throw Error('dotenv failed to load')
		}
	})

	it('getTransactionsAsync (polygon)', async () => {
		const address = process.env.ADDRESS
		const apiKey = process.env.POLYGON_KEY

		if (typeof address === 'string' && typeof apiKey === 'string') {
			await getTransactionsAsync(address, 'polygon-pos', apiKey)
			assert.ok(true)
		} else {
			throw Error('dotenv failed to load')
		}
	})

	it('xdaiErc20 (xdai)', async () => {
		const address = process.env.ADDRESS
		if (typeof address === 'string') {
			await getTransactionsAsync(address, 'xdai')
			assert.ok(true)
		} else {
			throw Error('dotenv failed to load')
		}
	})
})
