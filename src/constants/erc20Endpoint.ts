import { ChainName } from '../types'

export const etherscanUrl = 'https://api.etherscan.io'
export const maticUrl = 'https://api.polygonscan.com'
export const xdaiUrl = 'https://blockscout.com/xdai/mainnet'

export const getEndpoint = (chain: ChainName): string => {
	switch (chain) {
		case 'ethereum':
			return etherscanUrl
		case 'polygon-pos':
			return maticUrl
		case 'xdai':
			return xdaiUrl
	}
}
