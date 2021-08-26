import { expect } from 'chai'
import Communicator from '../src/database/dbCommunicator'
import mongoose from 'mongoose'
import { TestDocumentType } from '../src/types'

//document I will be adding and looking up
const myDoc: TestDocumentType = {
	price: '100.00',
	other: 1
}

describe('dbCommunicator tests', () => {
	it('checking ConnectToDB', async () => {
		Communicator.ConnectToDB()
			.then(() => {
				//successfully connected
				expect(true).equals(true)
			})
			.catch(err => {
				console.log(err) //failed for some reason
				expect(true).equals(false) //force a failure
			})
	})

	it('checking AddDataToTestCollection', async () => {
		Communicator.AddDataToTestCollection(myDoc)
			.then((docAdded: mongoose.Document) => {
				if (docAdded == undefined) {
					expect(true).equals(false) //force a failure
				} else {
					expect(true).equals(true)
				}
			})
			.catch((err: string) => {
				console.log(err) //failed for some reason
				expect(true).equals(false) //force a failure
			})
	})

	it('checking GetAllDataFromTestCollection', async () => {
		Communicator.GetAllDataFromTestCollection(myDoc)
			.then((myFoundData: mongoose.Document[]) => {
				expect(myFoundData).to.have.length.greaterThan(0)
			})
			.catch((err: string) => {
				console.log(err) //failed for some reason
				expect(true).equals(false) //force a failure
			})
	})

	it('checking GetOneDataFromTestCollection', async () => {
		Communicator.GetOneDataFromTestCollection(myDoc)
			.then((myFoundData: mongoose.Document) => {
				expect(myFoundData).is.not.null
			})
			.catch((err: string) => {
				console.log(err) //failed for some reason
				expect(true).equals(false) //force a failure
			})
	})
})
