// MUST be first
// for testing
import dotenv from 'dotenv'
dotenv.config()
import {
	getTransactionsAsync,
	decimalQueryAsync
} from '../src/aggregation/erc20'
import { assert, expect } from 'chai'

const testAddress = process.env.TEST_ADDRESS!
const etherscanKey = process.env.ETHERSCAN_KEY!
const polygonKey = process.env.POLYGON_KEY!

describe('decimal queries', () => {
	const usdc = {
		mainnet: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
		polygonPos: '0x2791bca1f2de4661ed88a30c99a7a9449aa84174',
		xdai: '0xDDAfbb505ad214D7b80b1f830fcCc89B60fb7A83'
	}

	const usdcx = {
		polygonPos: '0xcaa7349cea390f89641fe306d93591f87595dc1f'
	}

	const dai = {
		mainnet: '0x6b175474e89094c44da98b954eedeac495271d0f',
		polygonPos: '0x8f3cf7ad23cd3cadbd9735aff958023239c6a063',
		xdai: '0x44fA8E6f47987339850636F88629646662444217'
	}

	const daix = {
		polygonPos: '0x1305f6b6df9dc47159d12eb7ac2804d4a33173c2'
	}

	it('mainnet USDC', async () => {
		const data = await decimalQueryAsync(usdc.mainnet, 'ethereum')
		expect(data).to.equal('6')
		assert.ok(true)
	})

	it('polygon USDC', async () => {
		const data = await decimalQueryAsync(usdc.polygonPos, 'polygon-pos')
		expect(data).to.equal('6')
		assert.ok(true)
	})

	it('xdai USDC', async () => {
		const data = await decimalQueryAsync(usdc.xdai, 'xdai')
		expect(data).to.equal('6')
		assert.ok(true)
	})

	it('poygon USDCx', async () => {
		const data = await decimalQueryAsync(usdcx.polygonPos, 'polygon-pos')
		expect(data).to.equal('18')
		assert.ok(true)
	})

	it('mainnet DAI', async () => {
		const data = await decimalQueryAsync(dai.mainnet, 'ethereum')
		expect(data).to.equal('18')
		assert.ok(true)
	})

	it('polygon DAI', async () => {
		const data = await decimalQueryAsync(dai.polygonPos, 'polygon-pos')
		expect(data).to.equal('18')
		assert.ok(true)
	})

	it('xdai DAI', async () => {
		const data = await decimalQueryAsync(dai.xdai, 'xdai')
		expect(data).to.equal('18')
		assert.ok(true)
	})

	it('polygon DAIx', async () => {
		const data = await decimalQueryAsync(daix.polygonPos, 'polygon-pos')
		expect(data).to.equal('18')
		assert.ok(true)
	})
})
/*
describe('etherscan tokens', () => {
	const address = process.env.TEST_ADDRESS
	const apiKey = process.env.POLYGON_KEY
	if (typeof address === 'string' && typeof apiKey === 'string') throw Error('dotenv failed')

	it('getTransactionsAsync (polygon)', async () => {
		await getTransactionsAsync(address, 'polygon-pos', apiKey)
		assert.ok(true)
	})

	it('xdaiErc20 (xdai)', async () => {
		const address = process.env.TEST_ADDRESS
		if (typeof address === 'string') {
			await getTransactionsAsync(address, 'xdai')
			assert.ok(true)
		} else {
			throw Error('dotenv failed to load')
		}
	})
})

describe('etherscan tokens', () => {
	const address = process.env.TEST_ADDRESS
	if (typeof address === 'string') throw Error('dotenv failed')

	it('xdaiErc20 (xdai)', async () => {
		await getTransactionsAsync(address, 'xdai')
		assert.ok(true)
	})
})
*/
