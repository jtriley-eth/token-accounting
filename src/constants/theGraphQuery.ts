export const supertokenQuery = `
query ($userAddress: String!) {
    accountTokens: accountWithTokens(
        where: {
            account: $userAddress
        }
    ) {
        token {
            id
            name
            symbol
        }
        inTransfers: transferEventsReceived {
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
        outTransfers: transferEventsSent {
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