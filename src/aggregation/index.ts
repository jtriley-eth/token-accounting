import { getSuperTokenDataAsync } from './superToken'
import { getTransactionsAsync } from './erc20'
import PriceFeeder from './priceFeed'
import { ethNow, getSecondsIn } from '../helpers/time'
import {
	isERC20TokenMetadata,
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
	console.log('start addresses')
	let tableData: Array<TableData> = []
	for await (const address of addresses) {
		// iterate through tx data from xdai, polygon subgraphs
		console.log('get superTokens')
		const {
			flowState,
			transfers: superTransfers,
			gradeEvents
		}: TableData = await Promise.all([
			getSuperTokenDataAsync(address, 'polygon-pos', startTime, endTime),
			getSuperTokenDataAsync(address, 'xdai', startTime, endTime)
		]).then(data => {
			console.log('superTokens resolved')
			const flowState = data[0].flowState.concat(data[1].flowState)
			const transfers = data[0].transfers.concat(data[1].transfers)
			const gradeEvents = data[0].gradeEvents.concat(data[1].gradeEvents)
			return { flowState, transfers, gradeEvents }
		})

		// iterate through erc20 transfers on ethereum, polygon, xdai
		console.log('get erc20 transfers')
		const transfersERC20: Array<OutputTransfer> = await Promise.all([
			getTransactionsAsync(address, 'ethereum', etherscanKey),
			getTransactionsAsync(address, 'polygon-pos', polygonKey),
			getTransactionsAsync(address, 'xdai')
		]).then(data => {
			console.log('erc20 transfers resolved')
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
			.filter((transfer, idx, arr) => {
				// SuperToken transfers show up on erc20 queries ¯\_(ツ)_/¯
				// filtering if it's an erc20 transfer starting with 'super'
				if (isERC20TokenMetadata(transfer.token)) {
					const { name } = transfer.token
					return !name.toLowerCase().startsWith('super')
				} else {
					return true
				}
			})

		console.log('get prices (flows)\n==========')
		let flowStateWithPrice: Array<OutputFlow> = []
		for await (const flow of flowState) {
			const daysBack = Math.floor(
				(ethNow() - flow.date) / secondsInDay
			).toString()
			console.log('\tget price (flow)')
			// 1.2 second rate limit
			await new Promise(resolve => setTimeout(resolve, 2000))
			const exchangeRate = await PriceFeeder.getAverageCoinPrice({
				id: flow.networkId,
				contractAddress: flow.token.underlyingAddress,
				vsCurrency: 'usd',
				daysBack
			})
			console.log('\tprice resolved')
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

		console.log('get prices (transfers)\n==========')
		let transfersWithPrice: Array<OutputTransfer> = []
		for await (const transfer of transfers) {
			const daysBack = Math.floor(
				(ethNow() - transfer.date) / secondsInDay
			).toString()

			const { token } = transfer
			const contractAddress = isSuperTokenMetadata(token)
				? token.underlyingAddress
				: token.id
			console.log('get price (transfer)')
			console.log(`${JSON.stringify(transfer, null, 4)}`)
			// 1.2 second rate limit
			await new Promise(resolve => setTimeout(resolve, 2000))
			const exchangeRate = await PriceFeeder.getAverageCoinPrice({
				id: transfer.networkId,
				contractAddress,
				vsCurrency: 'usd',
				daysBack
			})
			console.log('price resolved (transfer)')
			const tokenAmountD = new Decimal(transfer.amountToken).mul(
				new Decimal(1e-18)
			)
			const amountFiat = tokenAmountD
				.mul(new Decimal(exchangeRate))
				.toString()

			transfersWithPrice.push(
				Object.assign({}, transfer, { amountFiat, exchangeRate })
			)
		}
		tableData.push({
			flowState: flowStateWithPrice,
			transfers: transfersWithPrice,
			gradeEvents
		})
	}
	console.log('all resolved')
	return tableData
}
