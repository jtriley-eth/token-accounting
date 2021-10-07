// MUST be first
import dotenv from 'dotenv'
dotenv.config()

import { CoinHistoryInputContract, DailyPrice } from '../types'
import { ethereumLaunch, ethNow, unixToEthTime } from '../helpers/time'
import axios from 'axios'

const baseUrl =
	process.env.COIN_GECKO_ENDPOINT || 'https://api.coingecko.com/api/v3'

// get coin history via contract address and num days back
export const getDailyTokenPrice = async (
	input: CoinHistoryInputContract
): Promise<DailyPrice[]> => {
	const url = `${baseUrl}/coins/${input.id}/contract/${
		input.contractAddress
	}/market_chart/range?vs_currency=${
		input.vsCurrency
	}&from=${ethereumLaunch}&to=${ethNow()}`
	return axios
		.get(url)
		.then(res => {
			if (res.data === undefined) {
				throw Error('result is undefined')
			} else {
				const prices: number[][] = res.data.prices
				return prices.map(
					(price): DailyPrice => ({
						timestamp: unixToEthTime(price[0]),
						conversion: price[1].toString()
					})
				)
			}
		})
		.catch(error => {
			console.log({ error })
			console.log({ token: input.contractAddress })
			return []
		})
}
