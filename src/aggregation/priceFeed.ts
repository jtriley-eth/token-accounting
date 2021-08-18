// 1. Import coingecko-api
import { CoinGeckoClient } from 'coingecko-api-v3'
import { CoinHistoryInput, CoinHistoryInput_Contract } from '../priceFeedTypes'

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

//get coin history via contract address and num days back
const getCoinHistoryViaContract = async (input: CoinHistoryInput_Contract) => {
	const data = await client.contractMarketChartRange(input)
	return data
}

const PriceFeeder = {
	getACoinsHistory,
	getAllCoins,
	pingCoinGecko,
	getCoinHistoryViaContract
}

export default PriceFeeder
