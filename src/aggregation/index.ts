// MUST be first
import dotenv from 'dotenv'
dotenv.config()

import { getSuperTokenDataAsync } from './superToken'
import { getTransactionsAsync, getTokenDecimalPlaces } from './erc20'
import { getDailyTokenPrice } from './priceFeed'
import { ethNow, ethereumLaunch } from '../helpers/time'
import {
	isERC20TokenMetadata,
	OutputFlow,
	OutputTransfer,
	AccountDocumentType,
	DailyPrice
} from '../types'
import Decimal from 'decimal.js'

const etherscanKey = process.env.ETHERSCAN_KEY
const polygonKey = process.env.POLYGON_KEY
// in case no start date provided.

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
	const startTime = typeof start === 'undefined' ? ethereumLaunch : start
	const endTime = typeof end === 'undefined' ? ethNow() : end

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
		])
			.then(data => {
				const fullFlowState = data[0].flowState.concat(
					data[1].flowState
				)
				const fullTransfers = data[0].transfers.concat(
					data[1].transfers
				)
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
			.catch(error => {
				throw error
			})
		console.log('getting erc20 transfers')
		// iterate through erc20 transfers on ethereum, polygon, xdai
		const transfersERC20: OutputTransfer[] = await Promise.all([
			getTransactionsAsync(address, 'ethereum', etherscanKey),
			getTransactionsAsync(address, 'polygon-pos', polygonKey),
			getTransactionsAsync(address, 'xdai')
		])
			.then(data => {
				const ethereumTransfers = data[0]
				const polygonTransfers = data[1]
				const xdaiTransfers = data[2]
				return ethereumTransfers
					.concat(polygonTransfers)
					.concat(xdaiTransfers)
			})
			.catch(error => {
				throw error
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
				// filtering if it's a transfer starting with 'super' for now.
				if (isERC20TokenMetadata(transfer.token)) {
					const { name } = transfer.token
					return !name.toLowerCase().startsWith('super')
				} else {
					return true
				}
			})
		// Not all ERC20's have 18 decimals. Looking at you, USDC :(
		// BUT all Super Tokens have 18 decimals :)
		const allTokens = transfersERC20
			.map(transfer => ({
				token: transfer.token.id,
				chain: transfer.networkId,
				isSuperToken: false
			}))
			.concat(
				superTransfers.map(sTransfer => ({
					token: sTransfer.token.id,
					chain: sTransfer.networkId,
					isSuperToken: false
				}))
			)
			.concat(
				flowState.map(sFlow => ({
					token: sFlow.token.underlyingAddress,
					chain: sFlow.networkId,
					isSuperToken: true
				}))
			)
			.concat(
				gradeEvents.map(gEvent => ({
					token: gEvent.token.underlyingAddress,
					chain: gEvent.networkId,
					isSuperToken: true
				}))
			)

		const uniqueTokens = [...new Set(allTokens)]
		const uniqueTokensWithDecimal: {
			id: string
			decimals: string
			prices: DailyPrice[]
		}[] = []
		for await (const uToken of uniqueTokens) {
			console.log('getting token decimal places')
			const isSuperToken = true
			let decimalPlaces = '18'
			if (!isSuperToken) {
				try {
					decimalPlaces = await getTokenDecimalPlaces(
						uToken.token,
						uToken.chain
					)
				} catch (error) {
					throw error
				}
			}
			// 2 second rate limit
			await new Promise(resolve => setTimeout(resolve, 2000))
			console.log('getting token price data')
			const prices = await getDailyTokenPrice({
				id: uToken.chain,
				contractAddress: uToken.token,
				vsCurrency: 'usd'
			})
			uniqueTokensWithDecimal.push({
				id: uToken.token,
				decimals: decimalPlaces,
				prices
			})
		}

		const flowStateWithPrice: OutputFlow[] = []
		for await (const flow of flowState) {
			const tokenIdx = uniqueTokensWithDecimal.findIndex(
				uTokenWithDecimal =>
					uTokenWithDecimal.id === flow.token.underlyingAddress
			)
			const { decimals, prices } = uniqueTokensWithDecimal[tokenIdx]
			const exchangeIdx = prices.findIndex(
				price => flow.date <= price.timestamp
			)
			const exchangeRate =
				exchangeIdx !== -1 ? prices[exchangeIdx].conversion : '-1'
			const tokenAmountDecimal = new Decimal(flow.amountToken).mul(
				new Decimal(10).pow(new Decimal(`-${decimals}`))
			)
			const amountFiat = tokenAmountDecimal
				.mul(new Decimal(exchangeRate))
				.toString()

			flowStateWithPrice.push(
				Object.assign({}, flow, {
					amountFiat,
					exchangeRate,
					amountToken: tokenAmountDecimal
				})
			)
		}

		const transfersWithPrice: OutputTransfer[] = []
		for await (const transfer of transfers) {
			const tokenIdx = uniqueTokensWithDecimal.findIndex(
				uTokenWithDecimal => uTokenWithDecimal.id === transfer.token.id
			)
			const { decimals, prices } = uniqueTokensWithDecimal[tokenIdx]
			const exchangeIdx = prices.findIndex(
				price => transfer.date <= price.timestamp
			)
			const exchangeRate =
				exchangeIdx !== -1 ? prices[exchangeIdx].conversion : '-1'
			const tokenAmountDecimal = new Decimal(transfer.amountToken).mul(
				new Decimal(10).pow(new Decimal(`-${decimals}`))
			)
			// if exchangeRate not found, it's set to -1, as is the amountFiat
			const amountFiat =
				exchangeRate !== '-1'
					? tokenAmountDecimal
							.mul(new Decimal(exchangeRate))
							.toString()
					: '-1'

			transfersWithPrice.push(
				Object.assign({}, transfer, {
					amountFiat,
					exchangeRate,
					amountToken: tokenAmountDecimal
				})
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
