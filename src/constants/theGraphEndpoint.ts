// MUST be first
import dotenv from 'dotenv'
dotenv.config()

import { ChainName } from '../types'
const baseUrl =
	process.env.SUPERFLUID_SUBGRAPH_ENDPOINT ||
	'https://api.thegraph.com/subgraphs/name/superfluid-finance/superfluid-'

export const graphEndpoint = (chain: ChainName) => {
	// this is the only place it MUST be matic
	if (chain === 'polygon-pos') return `${baseUrl}matic`
	if (chain === 'ethereum') throw new Error('ethereum mainnet not supported')
	return `${baseUrl}${chain}`
}
