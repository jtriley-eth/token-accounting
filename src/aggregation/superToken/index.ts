import { getTimestampBalance } from './accounting'
import { getSuperTokens } from './api'
import { unixToEthTime, roundToDay, getSecondsIn } from '../../helpers/time'
import { ChainName } from '../../superTokenTypes'

const getTableInfo = async (
	address: string,
	chainName: ChainName,
	start: number,
	end: number
) => {
	const startDay = unixToEthTime(roundToDay(start))
	const endDay = unixToEthTime(roundToDay(end))

	const superTokens = await getSuperTokens(address, chainName)
}
