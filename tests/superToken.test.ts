import { expect } from 'chai'
import { getTableInfo } from '../src/aggregation/superToken'
import {
	getFlowState,
	getTransfers
} from '../src/aggregation/superToken/accounting'
import { graphEndpoint } from '../src/constants/theGraphEndpoint'
import { chainNameToId } from '../src/helpers/network'
import {
	ethNow,
	ethToUnixTime,
	getSecondsIn,
	roundDownToDay
} from '../src/helpers/time'
import { AccountToken } from '../src/superTokenTypes'

// tests container
describe('superTokens.ts tests', () => {
	it('checking graphEndpoint()', () => {
		const xdaiEndpoint = graphEndpoint('xdai')
		const maticEndpoint = graphEndpoint('polygon-pos')

		expect(xdaiEndpoint).to.equals(
			'https://api.thegraph.com/subgraphs/name/superfluid-finance/superfluid-xdai'
		)
		expect(maticEndpoint).to.equals(
			'https://api.thegraph.com/subgraphs/name/superfluid-finance/superfluid-matic'
		)
		expect(() => graphEndpoint('ethereum')).to.throw(
			'ethereum mainnet not supported'
		)
	})

	it('calling getTableInfo()', async () => {
		// call async function
		// check for error now
		await getTableInfo(
			'',
			'polygon-pos',
			Date.now() - ethToUnixTime(getSecondsIn('day') * 30),
			Date.now()
		)
	})

	it('checking getFlowState()', () => {
		const day = roundDownToDay(ethNow() - getSecondsIn('day'))
		const accountTokens: Array<AccountToken> = [
			{
				metadata: {
					id: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
					symbol: 'DAIx',
					name: 'Super DAI (PoS)'
				},
				events: [],
				flows: []
			}
		]
		const flowState = getFlowState(
			day,
			accountTokens,
			chainNameToId('polygon-pos')
		)
		expect(flowState).to.have.length(0)
	})

	it('checking getTransfers()', () => {
		const day = roundDownToDay(ethNow() - getSecondsIn('day'))
		const accountTokens: Array<AccountToken> = [
			{
				metadata: {
					id: '0x6B175474E89094C44Da98b954EedeAC495271d0F',
					symbol: 'DAIx',
					name: 'Super DAI (PoS)'
				},
				events: [],
				flows: []
			}
		]
		const flowState = getTransfers(
			day,
			accountTokens,
			chainNameToId('polygon-pos')
		)
		expect(flowState).to.have.length(0)
	})
})
