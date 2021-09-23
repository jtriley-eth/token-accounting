import {
	isFlowEvent,
	AccountToken,
	OutputFlow,
	OutputTransfer,
	isTransferEvent,
	ChainName,
	SuperTokenMetadata
} from '../../types'
import { getSecondsIn } from '../../helpers/time'
import BN from 'bn.js'

export const getFlowState = (
	day: number,
	accountTokens: AccountToken[],
	networkId: ChainName
): OutputFlow[] => {
	const secondsInDay = getSecondsIn('day')
	const flows: {
		start: number
		end: number
		sender: string
		recipient: string
		txHash: string
		flowRate: string
		token: SuperTokenMetadata
		flowRateChanges: {
			// ONLY FOR CHANGES *DURING* DAY
			timestamp: number
			previousFlowRate: string
		}[]
	}[] = []
	const outputFlows: OutputFlow[] = []

	accountTokens.forEach(accountToken => {
		const { metadata: token, events } = accountToken
		const eventsBeforeDay = events.filter(event => event.timestamp < day)

		// BEFORE DAY
		eventsBeforeDay.forEach(event => {
			// typescript wont recognize a `.filter()` type-guard.
			if (isFlowEvent(event)) {
				// get index of flow if exists
				const index = flows.findIndex(
					flow =>
						flow.sender === event.sender &&
						flow.recipient === event.recipient &&
						flow.token.id === token.id
				)

				// destruct event
				const { timestamp, sender, recipient, txHash, flowRate } = event

				// flow start
				if (event.oldFlowRate === '0') {
					if (index === -1) {
						flows.push({
							start: timestamp,
							end: -1, // indicates flow is open
							sender,
							recipient,
							txHash,
							flowRate,
							token,
							flowRateChanges: []
						})
					} else {
						throw Error('duplicate flow (sender, recipient, token)')
					}

					// flow stop
				} else if (event.flowRate === '0') {
					if (index !== -1) {
						flows.splice(index, 1)
					} else {
						throw Error(
							'flow-stop event triggered on non-existent flow'
						)
					}

					// flow update
				} else {
					if (index !== -1) {
						flows[index].flowRate = event.flowRate
					} else {
						throw Error(
							'flow-update event triggered on non-existent flow'
						)
					}
				}
			}
		})

		const eventsDuringDay = events.filter(
			event =>
				day <= event.timestamp && event.timestamp < day + secondsInDay
		)

		// DURING DAY
		eventsDuringDay.forEach(event => {
			// typescript wont recognize a `.filter()` type-guard.
			if (isFlowEvent(event)) {
				// get last index
				let lastIndex
				let iterator = flows.length - 1
				// assign lastIndex to -1 if not found
				while (iterator > -1) {
					if (
						flows[iterator].sender === event.sender &&
						flows[iterator].recipient === event.recipient &&
						flows[iterator].token.id === token.id
					) {
						break
					}
					iterator -= 1
				}
				lastIndex = iterator

				// destruct event
				const { timestamp, sender, recipient, txHash, flowRate } = event

				// this gets weird :)
				if (event.oldFlowRate === '0') {
					// flow start
					flows.push({
						start: timestamp,
						end: -1, // indicates flow is open
						sender,
						recipient,
						txHash,
						flowRate,
						token,
						flowRateChanges: []
					})
				} else {
					if (lastIndex === -1)
						throw Error('FlowRate updated on non-existent flow')
					// flow update / stop
					flows[lastIndex].flowRateChanges.push({
						timestamp: event.timestamp,
						previousFlowRate: flows[lastIndex].flowRate
					})
					flows[lastIndex].flowRate = event.flowRate

					// ONLY if flow stopped
					if (event.flowRate === '0')
						flows[lastIndex].end = event.timestamp
				}
			}
		})

		// get outputFlows from flows present during day
		flows.forEach(flow => {
			const {
				start,
				end,
				sender,
				recipient,
				txHash,
				flowRate,
				flowRateChanges
			} = flow

			// calculate amount for the day
			let amountToken: string
			if (flowRateChanges.length === 0) {
				// flowRate was unchanged during day
				amountToken = new BN(flowRate)
					.mul(new BN(secondsInDay))
					.toString()
			} else {
				// flowRate was changed
				amountToken = flowRateChanges.reduce(
					(amount, curr, idx, arr) => {
						if (idx === 0) {
							// start of day or start of flow, whichever is most recent
							const dayStartOrFlowStart =
								day < start ? start : day

							// amount + (timestamp - dayStartOrFlowStart) * previousFlowRate
							return new BN(amount)
								.add(
									new BN(
										curr.timestamp - dayStartOrFlowStart
									).mul(new BN(curr.previousFlowRate))
								)
								.toString()
						} else {
							// amount + (timestamp - previousTimestamp) * previousFlowRate
							return new BN(amount)
								.add(
									new BN(
										curr.timestamp - arr[idx - 1].timestamp
									).mul(new BN(curr.previousFlowRate))
								)
								.toString()
						}
					},
					'0'
				)
			}

			outputFlows.push({
				date: day,
				start,
				end,
				sender,
				recipient,
				networkId,
				txHash,
				amountToken,
				amountFiat: '',
				exchangeRate: '',
				token
			})
		})
	})
	return outputFlows
}

export const getTransfers = (
	day: number,
	accountTokens: AccountToken[],
	networkId: ChainName
): OutputTransfer[] => {
	const outputTransfers: OutputTransfer[] = []

	accountTokens.forEach(accountToken => {
		const { metadata: token, events } = accountToken
		const secondsInDay = getSecondsIn('day')
		const dayEvents = events.filter(
			event =>
				event.timestamp > day && event.timestamp < day + secondsInDay
		)

		dayEvents.forEach(event => {
			// typescript wont recognize a `.filter()` type-guard.
			if (isTransferEvent(event)) {
				const { txHash, sender, recipient, value: amountToken } = event

				outputTransfers.push({
					date: day,
					sender,
					recipient,
					txHash,
					networkId,
					amountToken,
					amountFiat: '',
					exchangeRate: '',
					token
				})
			}
		})
	})

	return outputTransfers
}
