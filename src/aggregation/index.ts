import { getSuperTokenDataAsync } from './superToken'
import { getTransactionsAsync } from './erc20'
import PriceFeeder from './priceFeed'
import { ethNow, getSecondsIn } from '../helpers/time'
import {
	isSuperTokenMetadata,
	OutputFlow,
	OutputTransfer,
	TableData
} from '../types'
import Decimal from 'decimal.js'

const etherscanKey = process.env.ETHERSCAN_KEY
const polygonKey = process.env.POLYGON_KEY
// in case no start date provided :)
const ETHEREUM_LAUNCH = 1438214400

export const aggregateDataAsync = async (
	addresses: Array<string>,
	start?: number,
	end?: number
): Promise<Array<TableData>> => {
	if (
		typeof etherscanKey === 'undefined' ||
		typeof polygonKey === 'undefined'
	) {
		throw Error('dotenv failed to load')
	}
	const startTime = typeof start === 'undefined' ? ETHEREUM_LAUNCH : start
	const endTime = typeof end === 'undefined' ? Date.now() : end
	const secondsInDay = getSecondsIn('day')

	// iterate through all addresses
	return await Promise.all(
		addresses.map(async (address): Promise<TableData> => {
			// iterate through tx data from xdai, polygon subgraphs
			const {
				flowState,
				transfers: superTransfers,
				gradeEvents
			}: TableData = await Promise.all([
				getSuperTokenDataAsync(
					address,
					'polygon-pos',
					startTime,
					endTime
				),
				getSuperTokenDataAsync(address, 'xdai', startTime, endTime)
			]).then(data => {
				const flowState = data[0].flowState.concat(data[1].flowState)
				const transfers = data[0].transfers.concat(data[1].transfers)
				const gradeEvents = data[0].gradeEvents.concat(
					data[1].gradeEvents
				)
				return { flowState, transfers, gradeEvents }
			})

			// iterate through erc20 transfers on ethereum, polygon, xdai
			const transfersERC20: Array<OutputTransfer> = await Promise.all([
				getTransactionsAsync(address, 'ethereum', etherscanKey),
				getTransactionsAsync(address, 'polygon-pos', polygonKey),
				getTransactionsAsync(address, 'xdai')
			]).then(data => {
				const ethereumTransfers = data[0]
				const polygonTransfers = data[1]
				const xdaiTransfers = data[2]
				return ethereumTransfers
					.concat(polygonTransfers)
					.concat(xdaiTransfers)
			})

			// ALL transfers, filter upgrades by transaction hash
			const transfers = superTransfers
				.concat(transfersERC20)
				.filter(transfer => {
					// this indicates the erc20 transfer was *actually*
					// a super token upgrade/downgrade, compares txHash
					const index = gradeEvents.findIndex(
						gradeEvent =>
							gradeEvent.transaction.id === transfer.txHash
					)
					return index === -1
				})

			const flowStateWithPrice = await Promise.all(
				flowState.map(async (flow): Promise<OutputFlow> => {
					const daysBack = Math.floor(
						(ethNow() - flow.date) / secondsInDay
					).toString()
					// get price feed
					const exchangeRate = await PriceFeeder.getAverageCoinPrice({
						id: flow.networkId,
						contractAddress: flow.token.underlyingAddress,
						vsCurrency: 'usd',
						daysBack
					})
					const tokenAmountD = new Decimal(flow.amountToken).mul(
						new Decimal(1e-18)
					)
					const amountFiat = tokenAmountD
						.mul(new Decimal(exchangeRate))
						.toString()

					return Object.assign({}, flow, { amountFiat, exchangeRate })
				})
			)

			const transfersWithPrice = await Promise.all(
				transfers.map(async (transfer): Promise<OutputTransfer> => {
					const daysBack = Math.floor(
						(ethNow() - transfer.date) / secondsInDay
					).toString()
					const { token } = transfer
					const contractAddress = isSuperTokenMetadata(token)
						? token.underlyingAddress
						: token.id
					const exchangeRate = await PriceFeeder.getAverageCoinPrice({
						id: transfer.networkId,
						contractAddress,
						vsCurrency: 'usd',
						daysBack
					})
					const tokenAmountD = new Decimal(transfer.amountToken).mul(
						new Decimal(1e-18)
					)
					const amountFiat = tokenAmountD
						.mul(new Decimal(exchangeRate))
						.toString()

					return Object.assign({}, transfer, {
						amountFiat,
						exchangeRate
					})
				})
			)

			return {
				flowState: flowStateWithPrice,
				transfers: transfersWithPrice,
				gradeEvents
			}
		})
	)
}
