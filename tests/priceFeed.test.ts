import { expect } from 'chai'
import {
	CoinHistoryInput,
	CoinHistoryInput_Contract
} from '../src/priceFeedTypes'
import PriceFeeder from '../src/aggregation/priceFeed'

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

	it('checking priceFeeder getCoinHistoryViaContract()', async () => {
		const input2: CoinHistoryInput_Contract = {
			id: 'ethereum',
			contract_address: '0x0000000000000000000000000000000000000000',
			vs_currency: 'usd',
			to: 20
		}

		// call async function
		var resp = PriceFeeder.getCoinHistoryViaContract(input2)
		resp.then(data => {
			console.log(data.prices)
			expect(data.prices).to.equal(undefined)
		})
	})
})
