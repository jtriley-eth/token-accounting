// INPUT

interface FlowEvent {
	id: string
	transaction: {
		id: string
		timestamp: string
	}
	oldFlowRate: string
	newFlowRate: string
}

interface Flow {
	id: string
	flowRate: string
	sender: {
		id: string
	}
	recipient: {
		id: string
	}
	events: Array<FlowEvent>
}

interface Token {
	id: string
	name: string
	symbol: string
	underlyingAddress: string
}

interface GradeEvent {
	id: string
	transaction: {
		id: string
		timestamp: string
	}
	token: Token
	amount: string
}

interface TransferEvent {
	id: string
	transaction: {
		id: string
		timestamp: string
	}
	sender: {
		id: string
	}
	recipient: {
		id: string
	}
	value: string
}

export interface Account {
	flowsReceived: Array<Flow>
	flowsSent: Array<Flow>
	upgradeEvents: Array<GradeEvent>
	downgradeEvents: Array<GradeEvent>
	accountWithToken: Array<{
		id: string
		transferEventsSent: Array<TransferEvent>
		transferEventsReceived: Array<TransferEvent>
		token: Token
	}>
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
	from: string
	to: string
	networkId: string
	txHash: string
	amountToken: string
	amountFiat: string
	exchangeRate: string
}

export interface OutputTransfer {
	date: number
	from: string
	to: string
	networkId: string
	amountToken: string
	amountFiat: string
	exchangeRate: string
}
