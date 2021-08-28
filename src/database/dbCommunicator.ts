import mongoose from 'mongoose'
import testModel from './models/testModel'
import { AccountDocumentType, TestDocumentType } from '../types'
import accountModel from './models/accountModel'

// const url = 'mongodb+srv://flowstate:flowstate@mycluster.5rvrq.mongodb.net/flowstateAccounting?retryWrites=true&w=majority'

const ConnectToDB = async () => {
	return mongoose.connect(DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
}

//FAKE SHIT
const AddDataToTestCollection = async (docToFind: TestDocumentType) => {
	const testDocument = new testModel(docToFind)
	return testDocument.save()
}

const GetAllDataFromTestCollection = (docToFind: TestDocumentType) => {
	return testModel.find(docToFind, (err, data) => {
		if (err) console.log(err)
	})
}

const GetOneDataFromTestCollection = (docToFind: TestDocumentType) => {
	return testModel.findOne(docToFind, (err: any, data: any) => {
		if (err) console.log(err)
	})
}

//REAL SHIT

const AddAccountData = async (docToAdd: AccountDocumentType) => {
	const doc = new accountModel(docToAdd)
	return doc.save()
}

const GetAccountData = (addressToFind: string) => {
	return accountModel.findOne({ address: addressToFind })
}

const Communicator = {
	ConnectToDB,
	AddDataToTestCollection,
	GetAllDataFromTestCollection,
	GetOneDataFromTestCollection,
	AddAccountData,
	GetAccountData
}

export default Communicator
