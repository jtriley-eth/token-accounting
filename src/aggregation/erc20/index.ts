import {
	getTokenEndpoint,
	getTransferEndpoint
} from '../../constants/erc20Endpoint'
import axios from 'axios'
import Web3 from 'web3'
import ABI from './abi.json'
import {
	ChainName,
	OutputTransfer,
	QueryERC20Transfer,
	QueryxDaiTransfer
} from '../../types'
import { AbiItem } from 'web3-utils'

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
		baseURL: getTransferEndpoint(chain),
		timeout: 5000
	})
	const transferQuery = `/api?module=account&action=tokentx&address=${address}&apikey=${apiKey}`
	return client
		.get(transferQuery)
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
		baseURL: getTransferEndpoint(networkId),
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

// Why cant we all just have 18 decimals :(
// etherscan
export const decimalQueryAsync = async (
	address: string,
	chain: ChainName
): Promise<number> => {
	const url = getTokenEndpoint(chain)
	const web3 = new Web3(new Web3.providers.HttpProvider(url))
	const abi: AbiItem = JSON.parse(JSON.stringify(ABI))
	const erc20Contract = new web3.eth.Contract(abi, address)
	const data = await erc20Contract.methods.decimals().call()
	return data
}
