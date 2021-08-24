import { ChainName } from '../superTokenTypes'
const baseUrl =
	'https://api.thegraph.com/subgraphs/name/superfluid-finance/superfluid-'

export const graphEndpoint = (chain: ChainName) => {
	// this is the only place it MUST be matic
	if (chain === 'polygon-pos') return `${baseUrl}matic`
	if (chain === 'ethereum') throw new Error('ethereum mainnet not supported')
	return `${baseUrl}${chain}`
}
