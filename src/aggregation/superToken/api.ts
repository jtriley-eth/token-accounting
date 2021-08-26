import gql from 'graphql-tag'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import fetch from 'isomorphic-fetch'
import { supertokenQuery } from '../../constants/theGraphQuery'
import {
	QueryAccountToken,
	AccountToken,
	Flow,
	TokenEvent,
	FlowEvent,
	ChainName
} from '../../types'
import { graphEndpoint } from '../../constants/theGraphEndpoint'

export const getSuperTokens = async (
	userAddress: string,
	chain: ChainName
): Promise<Array<AccountToken>> => {
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
				userAddress: userAddress.toLowerCase()
			}
		})
		.then(data => {
			const queryAccountTokens: Array<QueryAccountToken> =
				data.data.accountTokens
			console.log('queryAccountTokens: ', queryAccountTokens)

			const accountTokens = queryAccountTokens.map(
				(accountToken): AccountToken => {
					const { token, inTransfers, outTransfers } = accountToken
					// underlyingAddress refers to the ID of the base token, NOT
					// the Super Token. Coin Gecko requires the underlying
					// address for price conversions
					const { underlyingAddress: id, name, symbol } = token
					// Destructured this way to prevent 'flows' naming collision
					const { inFlows, outFlows } = accountToken.flows
					const allFlows = inFlows.concat(outFlows)

					const flows = allFlows.map(
						(flow): Flow => ({
							id: flow.id,
							flowRate: flow.flowRate,
							lastUpdate: parseInt(flow.lastUpdate),
							sender: flow.owner.id,
							recipient: flow.recipient.id
						})
					)

					const flowEvents = allFlows.reduce(
						(events: Array<TokenEvent>, flow) => {
							return events.concat(
								flow.events.map(
									(event): FlowEvent => ({
										id: event.id,
										timestamp: parseInt(
											event.transaction.timestamp
										),
										txHash: event.transaction.id,
										sender: flow.owner.id,
										recipient: flow.recipient.id,
										oldFlowRate: event.oldFlowRate,
										flowRate: event.flowRate,
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
							timestamp: parseInt(transfer.transaction.timestamp),
							txHash: transfer.transaction.id,
							sender: transfer.from.account.id,
							recipient: transfer.to.account.id,
							value: transfer.value,
							type: 'transfer'
						})
					)

					const events = flowEvents.concat(transferEvents)
					return {
						metadata: {
							id,
							name,
							symbol
						},
						events,
						flows
					}
				}
			)
			return accountTokens
		})
		.catch(error => {
			console.error(error)
			return []
		})
}
