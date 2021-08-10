import { ChainName } from '../types'
const baseUrl = 'https://api.thegraph.com/subgraphs/name/superfluid-finance/superfluid-'

export const graphEndpoint = (chain: ChainName) => `${baseUrl}${chain}`
