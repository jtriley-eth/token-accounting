import { ChainId, ChainName } from '../types'

export const chainIdToName = (id: ChainId): ChainName => {
	switch (id) {
		case '0x01':
			return 'ethereum'
		case '0x64':
			return 'xdai'
		case '0x89':
			return 'polygon-pos'
	}
}

export const chainNameToId = (name: ChainName): ChainId => {
	switch (name) {
		case 'ethereum':
			return '0x01'
		case 'xdai':
			return '0x64'
		case 'polygon-pos':
			return '0x89'
	}
}
