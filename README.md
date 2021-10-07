# token-accounting

Accounting for ERC20 tokens and Superfluid Super Tokens

---

## Set Up Project Locally

Clone and `cd` into repo

```bash
git clone https://github.com/JoshuaTrujillo15/token-accounting.git\
    && cd token-accounting
```

Install Deps

```bash
yarn install
```

Start Local MongoDB

```bash
# NOTE ensure the mongo cli is installed
# see: https://docs.mongodb.com/manual/installation/
mongo

# IN the mongo prompt, type:
use flowStateDB
```

Set Environment Variables:

```bash
# IN `.env
# etherscan api key: https://etherscan.io/apis
# polygonscan api key: https://polygonscan.com/apis
ETHERSCAN_KEY=
POLYGON_KEY=
DB_URL=
TEST_ADDRESS=
SERVER_PORT=
ETHERSCAN_TRANSFER_ENDPOINT=
MATIC_TRANSFER_ENDPOINT=
XDAI_TRANSFER_ENDPOINT=
ETHEREUM_RPC=
MATIC_RPC=
XDAI_RPC=
SUPERFLUID_SUBGRAPH_ENDPOINT=
```

Build and Run

```bash
# lints, compiles, and runs
# MUST have mongo daemon running
yarn start
```

Project should run on port 5000.

---

## Endpoints

**NOTE: Replace `0x0000` with desired address**

### Smoke Test:

```
http://localhost:5000/test
```

### Register Account:

POST

```
http://localhost:5000/accounts/address/0x0000
```

### Delete Account:

DELETE

```
http://localhost:5000/accounts/address/0x0000
```

### Force Update:

PUT

```
http://localhost:5000/accounts/force_update
```

### Get All Acount Data:

GET

```
# _start_time_ and _end_time_ are optional
http://localhost:5000/accounts/data?start=_start_time_&end=_end_time_
```

### Get Account Data by Address

GET

```
# _start_time_ and _end_time_ are optional
http://localhost:5000/accounts/data?id=0x0000&start=_start_time_&end=_end_time_
```

### Get All Registered Addresses (No Data)

GET

```
http://localhost:5000/accounts/registry
```

### Get CSV File of Transfers By Address

GET

```
# _start_time_ and _end_time_ are optional
http://localhost:5000/accounts/csv/transfers?id=0x0000&start=_start_time_&end=_end_time_
```

### Get CSV File of FlowState By Address

GET

```
# _start_time_ and _end_time_ are optional
http://localhost:5000/accounts/csv/flowstate?id=0x0000&start=_start_time_&end=_end_time_
```

---

## Note about Price Feeds

Not all tokens have a token price on Coin Gecko.

Obscure ERC20 tokens, as well as Uniswap v2 LP tokens, return a `404` from
Coin Gecko.

To reduce confusion on prices, any price queries that return a `404` will be
recorded as having `-1` on the exchangeRate and amountFiat.

Any Coin Gecko `404` responses are logged in the Flow State console.

---

## Contributing

See `./CONTRIBUTING.md`

---

## Project Structure

Entry: `./src/index.ts`

Types: `./src/types`

Data Aggregation: `./src/aggregation`

Endpoints: `./src/routes`

Constants: `./src/constants`

---
