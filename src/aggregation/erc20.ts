import { getEndpoint } from '../constants/erc20Endpoint'
import axios from 'axios'
import {
	ChainName,
	OutputTransfer,
	QueryERC20Transfer,
	QueryxDaiTransfer
} from '../types'

export const getTransactionsAsync = async (
	address: string,
	chain: ChainName,
	apiKey?: string
): Promise<OutputTransfer[]> => {
	// 0.2 second rate limit
	await new Promise(resolve => setTimeout(resolve, 200))
	if (chain === 'xdai') {
		return await xdaiErc20Query(address)
	} else if (typeof apiKey !== 'undefined') {
		return await erc20Query(address, apiKey, chain)
	} else {
		throw Error(`no api key provided for ${chain} api`)
	}
}

// POLYGON AND ETHEREUM
const erc20Query = async (
	address: string,
	apiKey: string,
	chain: ChainName
): Promise<OutputTransfer[]> => {
	const client = axios.create({
		baseURL: getEndpoint(chain),
		timeout: 5000
	})
	return client
		.get(
			`/api?module=account&action=tokentx&address=${address}&apikey=${apiKey}`
		)
		.then(response => {
			const { data } = response
			if (data.status === '1') {
				return data.result.map(
					(transfer: QueryERC20Transfer): OutputTransfer => {
						const {
							timeStamp,
							from,
							to,
							hash,
							value,
							tokenName,
							tokenSymbol,
							contractAddress
						} = transfer

						return {
							date: parseInt(timeStamp, 10),
							sender: from,
							recipient: to,
							txHash: hash,
							networkId: 'ethereum',
							amountToken: value,
							amountFiat: '',
							exchangeRate: '',
							token: {
								id: contractAddress,
								name: tokenName,
								symbol: tokenSymbol
							}
						}
					}
				)
			} else if (data.message === 'No transactions found') {
				return []
			} else {
				throw Error(JSON.stringify(data, null, 4))
			}
		})
		.catch(error => {
			throw error
		})
}

// XDAI (breaking diffs in xDAI)
const xdaiErc20Query = async (address: string): Promise<any> => {
	const networkId = 'xdai'
	const client = axios.create({
		baseURL: getEndpoint(networkId),
		timeout: 5000
	})

	return client
		.get(`/api?module=account&action=tokentx&address=${address}`)
		.then(response => {
			const { data } = response
			if (data.status === '1') {
				const transfers: OutputTransfer[] = data.result.map(
					(transfer: QueryxDaiTransfer): OutputTransfer => {
						const {
							timeStamp,
							from,
							to,
							hash,
							value,
							contractAddress,
							tokenName,
							tokenSymbol
						} = transfer

						return {
							date: parseInt(timeStamp, 10),
							sender: from,
							recipient: to,
							txHash: hash,
							networkId,
							amountToken: value,
							amountFiat: '',
							exchangeRate: '',
							token: {
								id: contractAddress,
								name: tokenName,
								symbol: tokenSymbol
							}
						}
					}
				)
				// handle non-value transfers (POAP, ERC721, etc)
				return transfers.filter(
					transfer => typeof transfer.amountToken !== 'undefined'
				)
			} else {
				throw Error(JSON.stringify(data, null, 4))
			}
		})
		.catch(error => {
			throw error
		})
}
