// QUERY RETURNS

interface QueryToken {
	id: string
	name: string
	symbol: string
	underlyingAddress: string
}

interface QueryTransfer {
	id: string
	transaction: {
		id: string
		timestamp: string
	}
	to: {
		account: {
			id: string
		}
	}
	from: {
		account: {
			id: string
		}
	}
	value: string
}

interface QueryFlowEvent {
	id: string
	transaction: {
		id: string
		timestamp: string
	}
	oldFlowRate: string
	flowRate: string
}

interface QueryFlow {
	id: string
	flowRate: string
	lastUpdate: string
	owner: {
		id: string
	}
	recipient: {
		id: string
	}
	events: Array<QueryFlowEvent>
}

export interface QueryAccountToken {
	token: QueryToken
	inTransfers: Array<QueryTransfer>
	outTransfers: Array<QueryTransfer>
	flows: {
		inFlows: Array<QueryFlow>
		outFlows: Array<QueryFlow>
	}
}

// INPUT
export type ChainName = 'xdai' | 'polygon-pos' | 'ethereum'

export type ChainId = '0x64' | '0x89' | '0x01'

export interface TransferEvent {
	id: string
	timestamp: number
	txHash: string
	sender: string
	recipient: string
	value: string
	type: 'transfer'
}

export interface FlowEvent {
	id: string
	timestamp: number
	txHash: string
	sender: string
	recipient: string
	oldFlowRate: string
	flowRate: string
	type: 'flow'
}

export type TokenEvent = TransferEvent | FlowEvent

export interface Flow {
	id: string
	flowRate: string
	lastUpdate: number
	sender: string
	recipient: string
}

export interface TokenMetadata {
	id: string
	name: string
	symbol: string
}

export interface AccountToken {
	metadata: TokenMetadata
	events: Array<TokenEvent>
	flows: Array<Flow>
}

export interface UserState {
	address: string
	chain: ChainName
	isDark: boolean
	tokens: Array<AccountToken>
}

// TYPE GUARDS
export function isTransferEvent(event: TokenEvent): event is TransferEvent {
	return event.type === 'transfer'
}

export function isFlowEvent(event: TokenEvent): event is FlowEvent {
	return event.type === 'flow'
}

// OUTPUT
export interface OutputFlowEvent {
	id: string
	transaction: {
		id: string
		timestamp: string
	}
	oldFlowRate: string
	newFlowRate: string
	flow: {
		id: string
		sender: {
			id: string
		}
		recipient: {
			id: string
		}
	}
}

export interface OutputFlow {
	date: number
	start: number
	end: number
	sender: string
	recipient: string
	networkId: string
	txHash: string
	amountToken: string
	amountFiat: string
	exchangeRate: string
	token: TokenMetadata
}

export interface OutputTransfer {
	date: number
	sender: string
	recipient: string
	txHash: string
	networkId: string
	amountToken: string
	amountFiat: string
	exchangeRate: string
	token: TokenMetadata
}

export interface TableData {
	flowState: Array<OutputFlow>
	transfers: Array<OutputTransfer>
}
