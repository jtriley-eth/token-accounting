// MUST be first
import dotenv from 'dotenv'
dotenv.config()

import { ChainName } from '../types'

const etherscanTransferUrl =
	process.env.ETHERSCAN_TRANSFER_ENDPOINT || 'https://api.etherscan.io'
const maticTransferUrl =
	process.env.MATIC_TRANSFER_ENDPOINT || 'https://api.polygonscan.com'
const xdaiTransferUrl =
	process.env.XDAI_TRANSFER_ENDPOINT || 'https://blockscout.com/xdai/mainnet'

export const getTransferEndpoint = (chain: ChainName): string => {
	switch (chain) {
		case 'ethereum':
			return etherscanTransferUrl
		case 'polygon-pos':
			return maticTransferUrl
		case 'xdai':
			return xdaiTransferUrl
	}
}

// this is literally just for token data
const mainnetTokenUrl =
	process.env.ETHEREUM_RPC ||
	'https://mainnet.infura.io/v3/8833ce81fbcc4cd5b72dddbdff46ff77'
const maticTokenUrl =
	process.env.MATIC_RPC ||
	'https://polygon-mainnet.infura.io/v3/8833ce81fbcc4cd5b72dddbdff46ff77'
const xdaiTokenUrl = process.env.XDAI_RPC || 'https://dai.poa.network'

export const getTokenEndpoint = (chain: ChainName): string => {
	switch (chain) {
		case 'ethereum':
			return mainnetTokenUrl
		case 'polygon-pos':
			return maticTokenUrl
		case 'xdai':
			return xdaiTokenUrl
	}
}
