// MUST be first
import dotenv from 'dotenv'
dotenv.config()
import { expect } from 'chai'
import Communicator from '../src/database/dbCommunicator'
import { AccountDocumentType } from '../src/types'
import { assert } from 'chai'

const dbUrl = process.env.DB_URL
if (dbUrl === undefined) throw Error('dotenv failed to load DB_URL')

//document I will be adding and looking up
const dummyData: AccountDocumentType = {
	address: '0x00000000000000000000000000000000',
	flowState: [
		{
			date: 0,
			start: 0,
			end: 0,
			sender: '0x00000000000000000000000000000000',
			recipient: '0x00000000000000000000000000000000',
			txHash: '0x00000000000000000000000000000000',
			networkId: 'xdai',
			amountToken: '0',
			amountFiat: '0',
			exchangeRate: '0',
			token: {
				id: '0x00000000000000000000000000000000',
				name: 'name',
				symbol: 'symbol',
				underlyingAddress: '0x00000000000000000000000000000000'
			}
		},
		{
			date: 0,
			start: 0,
			end: 0,
			sender: '0x00000000000000000000000000000000',
			recipient: '0x00000000000000000000000000000000',
			txHash: '0x00000000000000000000000000000000',
			networkId: 'polygon-pos',
			amountToken: '0',
			amountFiat: '0',
			exchangeRate: '0',
			token: {
				id: '0x00000000000000000000000000000000',
				name: 'name',
				symbol: 'symbol',
				underlyingAddress: '0x00000000000000000000000000000000'
			}
		}
	],
	transfers: [
		{
			date: 0,
			sender: '0x00000000000000000000000000000000',
			recipient: '0x00000000000000000000000000000000',
			txHash: '0x00000000000000000000000000000000',
			networkId: 'xdai',
			amountToken: '0',
			amountFiat: '0',
			exchangeRate: '0',
			token: {
				id: '0x00000000000000000000000000000000',
				name: 'name',
				symbol: 'symbol',
				underlyingAddress: '0x00000000000000000000000000000000'
			}
		},
		{
			date: 0,
			sender: '0x00000000000000000000000000000000',
			recipient: '0x00000000000000000000000000000000',
			txHash: '0x00000000000000000000000000000000',
			networkId: 'polygon-pos',
			amountToken: '0',
			amountFiat: '0',
			exchangeRate: '0',
			token: {
				id: '0x00000000000000000000000000000000',
				name: 'name',
				symbol: 'symbol',
				underlyingAddress: '0x00000000000000000000000000000000'
			}
		}
	],
	gradeEvents: [
		{
			id: '0x00000000000000000000000000000000',
			transaction: {
				id: '0x00000000000000000000000000000000',
				timestamp: 0
			},
			token: {
				id: '0x00000000000000000000000000000000',
				name: 'name',
				symbol: 'symbol',
				underlyingAddress: '0x00000000000000000000000000000000'
			},
			amount: '0'
		},
		{
			id: '0x00000000000000000000000000000000',
			transaction: {
				id: '0x00000000000000000000000000000000',
				timestamp: 0
			},
			token: {
				id: '0x00000000000000000000000000000000',
				name: 'name',
				symbol: 'symbol',
				underlyingAddress: '0x00000000000000000000000000000000'
			},
			amount: '0'
		}
	]
}

describe('dbCommunicator tests', () => {
	it('checking ConnectToDB', async () => {
		Communicator.ConnectToDB(dbUrl)
			.then(() => {
				//successfully connected
				assert.ok(true)
			})
			.catch(err => {
				console.log(err) //failed for some reason
				assert.ok(false) //force a failure
			})
	})

	it('checking AddAccountData', async () => {
		await Communicator.AddAccountData(dummyData)
			.then(added => {
				//console.log(myFoundData)
				expect(added).is.true
				assert.ok(true)
			})
			.catch((err: string) => {
				console.log(err) //failed for some reason
				assert.ok(false) //force a failure
			})
	})

	it('checking GetAccountData', async () => {
		const addressToFind = '0x00000000000000000000000000000000'
		await Communicator.GetAccountData(addressToFind)
			.then(() => {
				assert.ok(true)
			})
			.catch((err: string) => {
				console.log(err) //failed for some reason
				assert.ok(false) //force a failure
			})
	})
})
