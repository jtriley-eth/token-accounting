import gql from 'graphql-tag'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import fetch from 'isomorphic-fetch'
import { supertokenQuery } from '../constants/theGraphQuery'
import { Account, OutputFlow } from '../superTokenTypes'
import { ChainName } from '../types'
import { graphEndpoint } from '../constants/theGraphEndpoint'
import { getSecondsIn, roundToDay, unixToEthTime } from '../helpers/time'

// DONT ANY THIS
export const getSuperTokens = async (
	userAddress: string,
	chain: ChainName,
	start: number,
	end: number
): Promise<any> => {
	const startDay = unixToEthTime(roundToDay(start))
	const endDay = unixToEthTime(roundToDay(end))

	const httpLink = createHttpLink({
		uri: graphEndpoint(chain),
		fetch
	})

	const client = new ApolloClient({
		link: httpLink,
		cache: new InMemoryCache()
	})

	const query = gql(supertokenQuery)
	return client
		.query({
			query,
			variables: {
				userAddress: userAddress
			}
		})
		.then(data => {
			const { account }: { account: Account } = data.data
			const {
				flowsReceived,
				flowsSent,
				upgradeEvents,
				downgradeEvents,
				accountWithToken
			} = account

			const flows = flowsReceived.concat(flowsSent).sort((a, b) => {
				const { timestamp: aTime } = a.events[0].transaction
				const { timestamp: bTime } = b.events[0].transaction
				return parseInt(aTime) - parseInt(bTime)
			})
			const days = (endDay - startDay) / getSecondsIn('day')

			let outputFlows: Array<OutputFlow> = []

			// iterate over days
			for (let iter = 0; iter < days; iter++) {
				const date = startDay + iter * getSecondsIn('day')

				//
				flows.forEach(flow => {})
			}
		})
}
