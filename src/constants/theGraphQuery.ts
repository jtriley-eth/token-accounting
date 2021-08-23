// some `id` fields are redundant, but due to apollo client """feature"""
// either NONE or EVERY field has to have an id
// see https://stackoverflow.com/a/56402056

export const supertokenQuery = `
query ($userAddress: ID!) {
    accountTokens: accountWithTokens(
        where: {
            account: $userAddress
        }
        first: 1000
    ) {
        token {
            id
            name
            symbol
        }
        inTransfers: transferEventsReceived (first: 1000) {
            id
            transaction {
                timestamp
            }
            to {
                account {
                    id
                }
            }
            from {
                account {
                    id
                }
            }
            value
        }
        outTransfers: transferEventsSent (first: 1000) {
            id
            transaction {
                timestamp
            }
            to {
                account {
                    id
                }
            }
            from {
                account {
                    id
                }
            }
            value
        }
        flows: token {
            outFlows: flows(
                where: {
                    owner: $userAddress
                }
                first: 1000
            ) {
                id
                flowRate
                lastUpdate
                owner {
                    id
                }
                recipient {
                    id
                }
                events (first: 1000) {
                    id
                    transaction {
                        timestamp
                    }
                    oldFlowRate
                    flowRate
                }
            }
            inFlows: flows(
                where: {
                    recipient: $userAddress
                }
                first: 1000
            ) {
                id
                flowRate
                lastUpdate
                owner {
                    id
                }
                recipient {
                    id
                }
                events (first: 1000) {
                    id
                    transaction {
                        timestamp
                    }
                    oldFlowRate
                    flowRate
                }
            }
        }
    }
}
`

export const query = `
query ($userAddress: ID!) {
    account (
        id: $userAddress
    )
    flowsReceived: flowsOwned (first: 1000) {
        id
        flowRate
        sender: owner {
            id
        }
        recipient {
            id
        }
        events {
            id
            transaction {
                id
                timestamp
            }
            oldFlowRate
            newFlowRate: flowRate
        }
    }
    flowsSent (first: 1000) {
        id
        flowRate
        sender: owner {
            id
        }
        recipient {
            id
        }
        events {
            id
            transaction {
                id
                timestamp
            }
            oldFlowRate
            newFlowRate: flowRate
        }
    }
    upgradeEvents (first: 1000) {
        id
        transaction {
            id
            timestamp
        }
        token {
            id
            name
            symbol
            underlyingAddress
        }
        amount
    }
    downgradeEvents (first: 1000) {
        id
        transaction {
            id
            timestamp
        }
        token {
            id
            name
            symbol
            underlyingAddress
        }
        amount
    }
    accountWithToken {
        id
        transferEventsSent(first: 1000) {
            id
            transaction {
                id
                timestamp
            }
            sender: from {
                id
            }
            recipient: to {
                id
            }
            value
        }
        transferEventsReceived(first: 1000) {
            id
            transaction {
                id
                timestamp
            }
            sender: from {
                id
            }
            recipient: to {
                id
            }
            value
        }
        token {
            id
            name
            symbol
            underlyingAddress
        }
    }
}
`

export const flowsReceivedQuery = `
query ($userAddress: ID!, $skip: Int!, $first: Int!) {
    account(
        id: $userAddress
    ) {
        flowsReceived: flowsOwned (first: $first, skip: $skip) {
            id
            flowRate
            token {
                id
                symbol
                name
                underlyingAddress
            }
            sender: owner {
                id
            }
            recipient {
                id
            }
            events {
                id
                transaction {
                    id
                    timestamp
                }
                oldFlowRate
                newFlowRate: flowRate
            }
        }
    }
}
`

export const flowsSentQuery = `
query ($userAddress: ID!, $skip: Int!, $first: Int!) {
    account(
        id: $userAddress
    ) {
        flowsSent (first: $first, skip: $skip) {
            id
            flowRate
            token {
                id
                symbol
                name
                underlyingAddress
            }
            sender: owner {
                id
            }
            recipient {
                id
            }
            events {
                id
                transaction {
                    id
                    timestamp
                }
                oldFlowRate
                newFlowRate: flowRate
            }
        }
    }
}
`

export const upgradeEventsQuery = `
query ($userAddress: ID!, $skip: Int!, $first: Int!) {
    account(
      id: $userAddress
    ) {
      upgradeEvents (first: $first, skip: $skip) {
        id
        transaction {
          id
          timestamp
        }
        token {
          id
          name
          symbol
          underlyingAddress
        }
        amount
      }
    }
  }
  
`

export const downgradeEventsQuery = `
query ($userAddress: ID!, $skip: Int!, $first: Int!) {
    account(
      id: $userAddress
    ) {
      downgradeEvents (first: $first, skip: $skip) {
        id
        transaction {
          id
          timestamp
        }
        token {
          id
          name
          symbol
          underlyingAddress
        }
        amount
      }
    }
  }
  
`

export const transferEventsSent = `
query ($userAddress: ID!, $tokenId: ID!, $skip: Int!, $first: Int!) {
    account(
      id: $userAddress
    ) {
      accountWithToken (
          where {
              token: $tokenId
          }
      ) {
        id
        transferEventsSent(skip: $skip, first: $first) {
            id
            transaction {
                id
                timestamp
            }
            from {
                id
            }
            to {
                id
            }
            value
        }
        token {
            id
            name
            symbol
            underlyingAddress
        }
      }
    }
  }
`

export const transferEventsReceived = `
query ($userAddress: ID!, $tokenId: ID!, $skip: Int!, $first: Int!) {
    account(
      id: $userAddress
    ) {
      accountWithToken (
          where {
            token: $tokenId
          }
      ) {
        id
        transferEventsReceived(skip: $skip, first: $first) {
            id
            transaction {
                id
                timestamp
            }
            from {
                id
            }
            to {
                id
            }
            value
        }
        token {
            id
            name
            symbol
            underlyingAddress
        }
      }
    }
  }
`
