# Superfluid Spec

## Overview

We would like to start using streaming in order to pay employees and contractors. To do so effectively due to the legal requirements for bookkeeping and taxation we need to be able to add streams as entries in our accounting software (Xero/Quickbooks). Thus the need for a tool to make streams compatible with the transaction only environment.

The tool should allow bookkeeping of all streams (and normal transactions) of any wallet address added to the system. 

## User Journey

1. User inputs the wallet addresses they would like to track.
2. User selects the time period to export (allows full months only).
3. User selects the price granularity for conversion (ie daily). In this case the software will take the average daily price of an asset and multiply the streamed amount over one day for the average asset price in that day.
4. User selects the stream virtualization cadence (ie monthly). In this case the software will export one single transaction per month per stream (one transaction per every calendar month for simplicity, dated on the last day of such month).
5. The user clicks an Export button, transactions are exported in CSV format compatible with Xero with descriptions that allow reconstruction of the network and TX hash. See the CSV template below:

    [StatementImportTemplate.csv](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/c4a1a161-cc63-41cd-9e03-c9b67c69cd6e/StatementImportTemplate.csv)

## How the software operates

1. The Software runs a daily task, checking each wallet address for
    - All Streams created-updated-deleted events
    - All ERC20 Transaction events
    - All gas token spend on that day's transactions
    - The current price of all assets required (Coingecko?)
2. The software will input the information into a database, which will contain detailed and 100% precise and "raw" information, copied directly from the chain or calculated, and then enriched with fiat currency conversion. Both for transfers and streams

    Date | network | from | to | total amount -token | flowrate -token | start time | end time | total amount -fiat | FX rate | stream created timestamp

3. When a user exports a report, this should take information from the table, and make it digestible for XERO by aggregating some of the streams information, combined with simple transactions ones. Specifically, any consecutive stream between two users (we sometimes call them *logical stream)* would need to be aggregated and reported as if it were one single transaction, occuring at the last date possible (end of month, or timestamp of stream closed). This will include the fiat value based on the sum of the individual "transactions" recorded inside.

## Important details:

- Everything in the export file must be in fiat currency (of user's choice)
- Tracking must work across multiple networks. A wallet could be active on Ethereum mainnet, Matic, or xDAI, and the tool should be able to handle more networks in the future (ie Arbitrum, Optimism)
    - It would be convenient to have filters on all tables
    - It should track all ERC20 transfers and native gas coin transfers (ETH/MATIC/XDAI)
- The tool should work for ERC20 Transfers as well, not only streams
- Transaction fees paid by the tracked wallet should be considered separately in another CSV file/sheet per network (due to local gas tokens)
- Allow the possibility to name addresses (both from and to) such that the CSV reflects the associated name instead of the wallet address
- The Description field in the CSV should be in the format < NetworkName - Stream/TransactionHash - Counterparty - Stream Month >
- Transfers or streams among wallets a user controls are ignored, but still accounted for GAS
- Approve transactions, etc are not included in the CSV export and only accounted for GAS
- Transactions to bridges must be accounted for as internal. A whitelist of bridges would be helpful.

