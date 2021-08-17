import { PLATFORMS } from 'coingecko-api-v3/dist/Enum'

export interface CoinHistoryInput {
	id: string //bitcoin, etherium,etc
	vs_currency: string //usd,eur,etc
	from: number //unix
	to: number //unix
}

export interface CoinHistoryInput_Contract {
	id: PLATFORMS //of the the asset platform (etherium,xdai, etc. )
	contract_address: string
	vs_currency: string //usd, etc
	from?: number | undefined
	to: number
}
