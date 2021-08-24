// Flow State Types
export type ChainName =
	| 'xdai'
	| 'matic'
	| 'mumbai'
	| 'goerli'
	| 'ropsten'
	| 'kovan'
	| 'rinkeby'

export interface TimeFrame {
	start: number
	end: number
}

export interface TransferEvent {
	id: string
	timestamp: number
	sender: string
	recipient: string
	value: string
	type: 'transfer'
}

export interface FlowEvent {
	id: string
	timestamp: number
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
	events: TokenEvent[]
	flows: Flow[]
}

// The Graph Query Types
export interface QueryToken {
	id: string
	name: string
	symbol: string
}

export interface QueryTransfer {
	id: string
	transaction: {
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

export interface QueryFlowEvent {
	id: string
	transaction: {
		timestamp: string
	}
	oldFlowRate: string
	flowRate: string
}

export interface QueryFlow {
	id: string
	flowRate: string
	lastUpdate: string
	owner: {
		id: string
	}
	recipient: {
		id: string
	}
	events: QueryFlowEvent[]
}

export interface QueryAccountToken {
	token: QueryToken
	inTransfers: QueryTransfer[]
	outTransfers: QueryTransfer[]
	flows: {
		inFlows: QueryFlow[]
		outFlows: QueryFlow[]
	}
}
