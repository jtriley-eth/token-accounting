import {
	TokenEvent,
	isFlowEvent,
	AccountToken,
	TokenMetadata,
	OutputFlow
} from '../../superTokenTypes'
import { getSecondsIn, unixToEthTime } from '../../helpers/time'
import BN from 'bn.js'

export const getTimestampBalance = (
	address: string,
	timestampDesired: number,
	tokenEvents: Array<TokenEvent>
): string => {
	// remove events after timestamp
	const events = tokenEvents.filter(
		event => event.timestamp < unixToEthTime(timestampDesired)
	)
	let flowUpdates: Array<{
		sender: string
		recipient: string
		lastUpdate: number
	}> = []
	return events.reduce((balance, event) => {
		const balanceBN = new BN(balance)
		const { sender, recipient, timestamp } = event
		if (isFlowEvent(event)) {
			// flow start
			if (event.oldFlowRate === '0') {
				flowUpdates.push({
					sender,
					recipient,
					lastUpdate: timestamp
				})
				return balance
			} else {
				const index = flowUpdates.findIndex(
					flowUpdate =>
						flowUpdate.sender === sender &&
						flowUpdate.recipient === recipient
				)
				const lastUpdateBN = new BN(flowUpdates[index].lastUpdate)
				const balanceUpdateBN = new BN(timestamp)
					.sub(lastUpdateBN)
					.mul(new BN(event.oldFlowRate))

				// flow stop
				if (event.flowRate === '0') {
					flowUpdates = flowUpdates.splice(index, 1)
					return sender === address
						? balanceBN.sub(balanceUpdateBN).toString()
						: balanceBN.add(balanceUpdateBN).toString()
				}

				// flow update
				flowUpdates[index].lastUpdate = timestamp
				return sender === address
					? balanceBN.sub(balanceUpdateBN).toString()
					: balanceBN.add(balanceUpdateBN).toString()
			}
		} else {
			const valueBN = new BN(event.value)

			return sender === address
				? balanceBN.sub(valueBN).toString()
				: balanceBN.add(valueBN).toString()
		}
	}, '0')
}

export const getFlowState = (
	day: number,
	accountTokens: Array<AccountToken>
) => {
	const flowState = accountTokens.map(accountToken => {
		const { metadata: token, events: allEvents } = accountToken
		const events = allEvents.filter(event => event.timestamp < day)
		let flows: Array<{
			start: number
			end: number
			sender: string
			recipient: string
			txHash: string
			flowRate: string
			token: TokenMetadata
		}> = []

		events.forEach(event => {
			if (isFlowEvent(event)) {
				if (event.oldFlowRate === '0') {
					const {
						timestamp: start,
						sender,
						recipient,
						txHash,
						flowRate
					} = event

					flows.push({
						start,
						end: -1,
						sender,
						recipient,
						txHash,
						flowRate,
						token
					})
				} else if (event.flowRate === '0') {
					const index = flows.findIndex(
						flow =>
							flow.sender === event.sender &&
							flow.recipient === event.recipient &&
							flow.end === -1
					)
					flows[index].end = event.timestamp
				} else {
					const index = flows.findIndex(
						flow =>
							flow.sender === event.sender &&
							flow.recipient === event.recipient &&
							flow.end === -1
					)
					flows[index].flowRate = event.flowRate
				}
			}
		})
	})
}
