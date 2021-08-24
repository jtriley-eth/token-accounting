import { getFlowState, getTransfers } from './accounting'
import { getSuperTokens } from './api'
import { unixToEthTime, roundDownToDay, getSecondsIn } from '../../helpers/time'
import {
	ChainName,
	OutputFlow,
	OutputTransfer,
	TableData
} from '../../superTokenTypes'
import { chainNameToId } from '../../helpers/network'

export const getTableInfo = async (
	address: string,
	chainName: ChainName,
	start: number,
	end: number
): Promise<TableData> => {
	const startDay = unixToEthTime(roundDownToDay(start))
	const endDay = unixToEthTime(roundDownToDay(end))
	const secondsInDay = getSecondsIn('day')
	const networkId = chainNameToId(chainName)

	const superTokens = await getSuperTokens(address, chainName)

	// GET FLOWS
	let flowState: Array<OutputFlow> = []
	let transfers: Array<OutputTransfer> = []

	for (let day = startDay; day <= endDay; day += secondsInDay) {
		flowState.push(...getFlowState(day, superTokens, networkId))
		transfers.push(...getTransfers(day, superTokens, networkId))
	}

	// sort
	flowState.sort((a, b) => {
		// sort by timestamp
		if (a.date === b.date) {
			return a.date - b.date
		}
		// sort by token symbol
		return a.token.symbol < b.token.symbol ? 1 : -1
	})

	transfers.sort((a, b) => {
		// sort by timestamp
		if (a.date === b.date) {
			return a.date - b.date
		}
		// sort by token symbol
		return a.token.symbol < b.token.symbol ? 1 : -1
	})

	return { flowState, transfers }
}
