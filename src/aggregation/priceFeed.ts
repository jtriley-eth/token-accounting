// 1. Import coingecko-api
import { CoinGeckoClient } from 'coingecko-api-v3'
import { CoinHistoryInput, CoinHistoryInputContract } from '../types'
import axios from 'axios'
import BN from 'bn.js'

// { RESPONSES
//   success: Boolean,
//   message: String,
//   code: Number,
//   data: Object
// }

// 2. Initiate the CoinGecko API Client
const client = new CoinGeckoClient()

// checks if is
const pingCoinGecko = async () => {
	const data = await client.ping()
	return data
}

// pulls all the coins current data
const getAllCoins = async () => {
	const data = await client.coinList
	return data
}

// pull a specific coin's history
const getACoinsHistory = async (input: CoinHistoryInput) => {
	const data = await client.coinIdMarketChartRange({
		id: input.id,
		vs_currency: input.vsCurrency,
		from: input.from,
		to: input.to
	})
	return data
}

// get coin history via contract address and num days back
const getAverageCoinPrice = async (
	input: CoinHistoryInputContract
): Promise<string> => {
	return axios
		.get(
			'https://api.coingecko.com/api/v3/coins/' +
				input.id +
				'/contract/' +
				input.contractAddress +
				'/market_chart/?vs_currency=' +
				input.vsCurrency +
				'&days=' +
				input.daysBack +
				''
		)
		.then(res => {
			if (res.data == undefined) {
				throw Error('result is undefined')
			} else {
				//loop through all prices and calculate the average
				let prices: Array<Array<number>> = res.data.prices
				const sum = prices.reduce((sum, item) => sum + item[1], 0)
				const average = sum / prices.length
				return average.toString()
			}
		})
		.catch(err => {
			console.log(err.toJSON().message)
			return '0'
		})
}

const PriceFeeder = {
	getACoinsHistory,
	getAllCoins,
	pingCoinGecko,
	getAverageCoinPrice
}

export default PriceFeeder
