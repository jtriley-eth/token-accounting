// 1. Import coingecko-api
import { CoinGeckoClient } from 'coingecko-api-v3'
import { CoinHistoryInput, CoinHistoryInputContract } from '../priceFeedTypes'
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
	const data = await client.coinIdMarketChartRange(input)
	return data
}

// get coin history via contract address and num days back
const GetAverageCoinPrice = async (input: CoinHistoryInputContract) => {
	return axios
		.get(
			'https://api.coingecko.com/api/v3/coins/' +
				input.id +
				'/contract/' +
				input.contract_address +
				'/market_chart/?vs_currency=' +
				input.vs_currency +
				'&days=' +
				input.daysBack +
				''
		)
		.then(res => {
			if (res.data == undefined) {
				return 0
			} else {
				//loop through all prices and calculate the average
				let prices: Array<Array<number>> = res.data.prices
				const sum = prices.reduce((sum, item) => sum + item[1], 0)
				const average = sum / prices.length
				return average
			}
		})
		.catch(err => {
			console.log(err)
		})
}

const PriceFeeder = {
	getACoinsHistory,
	getAllCoins,
	pingCoinGecko,
	GetAverageCoinPrice
}

export default PriceFeeder
