// MUST be first
import dotenv from 'dotenv'
dotenv.config()

import { getSuperTokenDataAsync } from './superToken'
import { getTransactionsAsync } from './erc20'
import PriceFeeder from './priceFeed'
import { ethNow, getSecondsIn } from '../helpers/time'
import {
	isERC20TokenMetadata,
	isSuperTokenMetadata,
	OutputFlow,
	OutputTransfer,
	AccountDocumentType
} from '../types'
import Decimal from 'decimal.js'

const etherscanKey = process.env.ETHERSCAN_KEY
const polygonKey = process.env.POLYGON_KEY
// in case no start date provided :)
const ETHEREUM_LAUNCH = 1438214400

export const aggregateDataAsync = async (
	addresses: string[],
	start?: number,
	end?: number
): Promise<AccountDocumentType[]> => {
	if (
		typeof etherscanKey === 'undefined' ||
		typeof polygonKey === 'undefined'
	) {
		throw Error('dotenv failed to load ETHERSCAN_KEY or POLYGON_KEY')
	}
	const startTime = typeof start === 'undefined' ? ETHEREUM_LAUNCH : start
	const endTime = typeof end === 'undefined' ? Date.now() : end
	const secondsInDay = getSecondsIn('day')

	// iterate through all addresses
	const tableData: AccountDocumentType[] = []
	for await (const address of addresses) {
		console.log('getting supertoken data')
		// iterate through tx data from xdai, polygon subgraphs
		const {
			flowState,
			transfers: superTransfers,
			gradeEvents
		}: AccountDocumentType = await Promise.all([
			getSuperTokenDataAsync(address, 'polygon-pos', startTime, endTime),
			getSuperTokenDataAsync(address, 'xdai', startTime, endTime)
		]).then(data => {
			const fullFlowState = data[0].flowState.concat(data[1].flowState)
			const fullTransfers = data[0].transfers.concat(data[1].transfers)
			const fullGradeEvents = data[0].gradeEvents.concat(
				data[1].gradeEvents
			)
			return {
				address,
				flowState: fullFlowState,
				transfers: fullTransfers,
				gradeEvents: fullGradeEvents
			}
		})
		console.log('getting erc20 transfers')
		// iterate through erc20 transfers on ethereum, polygon, xdai
		const transfersERC20: OutputTransfer[] = await Promise.all([
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
					gradeEvent => gradeEvent.transaction.id === transfer.txHash
				)
				return index === -1
			})
			.filter(transfer => {
				// SuperToken transfers show up on erc20 queries ¯\_(ツ)_/¯
				// filtering if it's an erc20 transfer starting with 'super'
				if (isERC20TokenMetadata(transfer.token)) {
					const { name } = transfer.token
					return !name.toLowerCase().startsWith('super')
				} else {
					return true
				}
			})
		console.log('getting prices')
		const flowStateWithPrice: OutputFlow[] = []
		for await (const flow of flowState) {
			const daysBack = Math.floor(
				(ethNow() - flow.date) / secondsInDay
			).toString()
			// 2 second rate limit
			await new Promise(resolve => setTimeout(resolve, 2000))
			const exchangeRate = await PriceFeeder.getAverageCoinPrice({
				id: flow.networkId,
				contractAddress: flow.token.underlyingAddress,
				vsCurrency: 'usd',
				daysBack
			})
			const tokenAmountDecimal = new Decimal(flow.amountToken).mul(
				new Decimal(1e-18)
			)
			const amountFiat = tokenAmountDecimal
				.mul(new Decimal(exchangeRate))
				.toString()

			flowStateWithPrice.push(
				Object.assign({}, flow, { amountFiat, exchangeRate })
			)
		}

		const transfersWithPrice: OutputTransfer[] = []
		for await (const transfer of transfers) {
			const daysBack = Math.floor(
				(ethNow() - transfer.date) / secondsInDay
			).toString()

			const { token } = transfer
			const contractAddress = isSuperTokenMetadata(token)
				? token.underlyingAddress
				: token.id
			// 2 second rate limit
			await new Promise(resolve => setTimeout(resolve, 2000))
			const exchangeRate = await PriceFeeder.getAverageCoinPrice({
				id: transfer.networkId,
				contractAddress,
				vsCurrency: 'usd',
				daysBack
			})
			const tokenAmountD = new Decimal(transfer.amountToken).mul(
				new Decimal(1e-18)
			)
			// if exchangeRate not found, it's set to -1, as is the amountFiat
			const amountFiat =
				exchangeRate !== '-1'
					? tokenAmountD.mul(new Decimal(exchangeRate)).toString()
					: '-1'

			transfersWithPrice.push(
				Object.assign({}, transfer, { amountFiat, exchangeRate })
			)
		}
		tableData.push({
			address,
			flowState: flowStateWithPrice,
			transfers: transfersWithPrice,
			gradeEvents
		})
	}
	console.log('all resolved')
	return tableData
}
