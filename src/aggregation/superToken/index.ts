import { getFlowState, getTransfers } from './accounting'
import { getSuperTokens } from './api'
import {
	unixToEthTime,
	roundDownToDay,
	getSecondsIn,
	ethToUnixTime
} from '../../helpers/time'
import {
	ChainName,
	GradeEvent,
	OutputFlow,
	OutputTransfer,
	AccountDocumentType
} from '../../types'

export const getSuperTokenDataAsync = async (
	address: string,
	networkId: ChainName,
	start: number,
	end: number
): Promise<AccountDocumentType> => {
	const startDay = unixToEthTime(roundDownToDay(ethToUnixTime(start)))
	const endDay = unixToEthTime(roundDownToDay(ethToUnixTime(end)))
	const secondsInDay = getSecondsIn('day')

	const superTokens = await getSuperTokens(address, networkId)

	// GET FLOWS
	const flowState: OutputFlow[] = []
	const transfers: OutputTransfer[] = []
	let day = startDay
	let iter = 0
	for (day = startDay; day <= endDay; day += secondsInDay) {
		flowState.push(...getFlowState(day, superTokens, networkId))
		transfers.push(...getTransfers(day, superTokens, networkId))
		iter++
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

	const gradeEvents = superTokens.reduce(
		(gEvents: GradeEvent[], superToken) => {
			const { upgradeEvents, downgradeEvents } = superToken.gradeEvents
			return gEvents.concat(upgradeEvents).concat(downgradeEvents)
		},
		[]
	)

	return { address, flowState, transfers, gradeEvents }
}
