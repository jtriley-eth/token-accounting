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
ETHERSCAN_KEY=[API_KEY_FOR_ETHERSCAN]
POLYGON_KEY=[API_KEY_FOR_POLYGON]
DB_URL=mongodb://127.0.0.1:27017/flowstateDB
ADDRESS=[TESTING_ADDRESS]
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
http://localhost:5000/accounts/data/
```

### Get Account Data by Address

GET

```
http://localhost:5000/accounts/data/0x0000
```

### Get All Registered Addresses (No Data)

GET

```
http://localhost:5000/accounts/registry
```

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
