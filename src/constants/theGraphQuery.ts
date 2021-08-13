// some `id` fields are redundant, but due to apollo client """feature"""
// either NONE or EVERY field has to have an id
// see https://stackoverflow.com/a/56402056
export const supertokenQuery = `
query ($userAddress: ID!) {
    accountTokens: accountWithTokens(
        where: {
            account: $userAddress
        }
    ) {
        id
        token {
            id
            name
            symbol
        }
        inTransfers: transferEventsReceived {
            id
            transaction {
                id
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
        outTransfers: transferEventsSent {
            id
            transaction {
                id
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
            id
            outFlows: flows(
                where: {
                    owner: $userAddress
                }
            ) {
                id
                sum
                flowRate
                lastUpdate
                owner {
                    id
                }
                recipient {
                    id
                }
                events {
                    id
                    transaction {
                        timestamp
                    }
                    oldFlowRate
                    flowRate
                    sum
                }
            }
            inFlows: flows(
                where: {
                    recipient: $userAddress
                }
            ) {
                id
                sum
                flowRate
                lastUpdate
                owner {
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
                    flowRate
                    sum
                }
            }
        }
    }
}
`
