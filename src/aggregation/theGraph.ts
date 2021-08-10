import gql from 'graphql-tag'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import fetch from 'node-fetch'
import { supertokenQuery } from '../constants/theGraphQuery'
import {
	QueryAccountToken,
	FlowEvent,
	TokenEvent,
	AccountToken,
	Flow,
	ChainName
} from '../types'
import { graphEndpoint } from '../constants/theGraphEndpoint'

export const getSuperTokens = async (
	userAddress: string,
	chain: ChainName
): Promise<AccountToken[]> => {
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
			variables: [userAddress]
		})
		.then(data => {
			const queryAccountTokens: QueryAccountToken[] =
				data.data.accountTokens

			const accountTokens = queryAccountTokens.map(
				(accountToken): AccountToken => {
					const { token, inTransfers, outTransfers } = accountToken
					const { id, name, symbol } = token
					// Destructured this way to prevent 'flows' naming collision
					const { inFlows, outFlows } = accountToken.flows
					const allFlows = inFlows.concat(outFlows)

					const flows = allFlows.map(
						(flow): Flow => ({
							id: flow.id,
							sum: flow.sum,
							flowRate: flow.flowRate,
							lastUpdate: parseInt(flow.lastUpdate, 10),
							sender: flow.owner.id,
							recipient: flow.recipient.id
						})
					)

					const flowEvents = allFlows.reduce(
						(events: TokenEvent[], flow) => {
							return events.concat(
								flow.events.map(
									(event): FlowEvent => ({
										id: event.id,
										timestamp: parseInt(
											event.transaction.timestamp,
											10
										),
										sender: flow.owner.id,
										recipient: flow.recipient.id,
										oldFlowRate: event.oldFlowRate,
										flowRate: event.flowRate,
										sum: event.sum,
										type: 'flow'
									})
								)
							)
						},
						[]
					)

					const transferEvents = inTransfers.concat(outTransfers).map(
						(transfer): TokenEvent => ({
							id: transfer.id,
							timestamp: parseInt(
								transfer.transaction.timestamp,
								10
							),
							sender: transfer.from.account.id,
							recipient: transfer.to.account.id,
							value: transfer.value,
							type: 'transfer'
						})
					)

					const tokenEvents = flowEvents.concat(transferEvents)
					return {
						metadata: {
							id,
							name,
							symbol
						},
						events: tokenEvents,
						flows
					}
				}
			)
			return accountTokens
		})
		.catch(error => {
			console.log(error)
			return []
		})
}
