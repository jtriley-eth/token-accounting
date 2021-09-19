import { ChainName } from '../types'

const etherscanTransferUrl = 'https://api.etherscan.io'
const maticTransferUrl = 'https://api.polygonscan.com'
const xdaiTransferUrl = 'https://blockscout.com/xdai/mainnet'

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
	'https://mainnet.infura.io/v3/8833ce81fbcc4cd5b72dddbdff46ff77'
const maticTokenUrl =
	'https://polygon-mainnet.infura.io/v3/8833ce81fbcc4cd5b72dddbdff46ff77'
const xdaiTokenUrl = 'https://dai.poa.network'

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
