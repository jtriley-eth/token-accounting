import { expect } from 'chai'
import { CoinHistoryInput, CoinHistoryInputContract } from '../src/types'
import PriceFeeder from '../src/aggregation/priceFeed'
import { assert } from 'chai'

describe('Price Feeder Tests', () => {
	// test async
	it('checking CoinGecko ping', async () => {
		// call async function
		var resp = PriceFeeder.pingCoinGecko()
		resp.then(data => {
			expect(data.gecko_says).to.contain('To the Moon!')
		})
	})

	it('checking priceFeeder getACoinsHistory()', async () => {
		const input: CoinHistoryInput = {
			id: 'ethereum',
			vs_currency: 'usd',
			from: 1609459200,
			to: 1629163698
		}

		// call async function
		var resp = PriceFeeder.getACoinsHistory(input)
		resp.then(data => {
			expect(data.prices).to.have.length.greaterThan(0)
		})
	})

	it('checking priceFeeder average price using polygon-pos for GRT', async () => {
		const input2: CoinHistoryInputContract = {
			id: 'polygon-pos',
			contract_address: '0x5fe2b58c013d7601147dcdd68c143a77499f5531',
			vs_currency: 'usd',
			daysBack: '14'
		}

		// call async function
		await PriceFeeder.GetAverageCoinPrice(input2)
		assert.ok(true)
	})

	// Testing contract from polygon
	it('checking ethereum for Tether', async () => {
		const params: CoinHistoryInputContract = {
			id: 'ethereum',
			contract_address: '0xdac17f958d2ee523a2206206994597c13d831ec7',
			vs_currency: 'usd',
			daysBack: '3'
		}
		await PriceFeeder.GetAverageCoinPrice(params)
		assert.ok(true)

		// call function with params
		// avg price for that day
	})

	it('checking xdai for WETH', async () => {
		const params: CoinHistoryInputContract = {
			id: 'xdai',
			contract_address: '0x6A023CCd1ff6F2045C3309768eAd9E68F978f6e1',
			vs_currency: 'usd',
			daysBack: '3'
		}
		await PriceFeeder.GetAverageCoinPrice(params)
		assert.ok(true)

		// call function with params
		// avg price for that day
	})
})
