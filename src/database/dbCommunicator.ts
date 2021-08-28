import mongoose from 'mongoose'
import { AccountDocumentType } from '../types'
import accountModel from './models/accountModel'
import { DB_URL } from '../constants/database'

const ConnectToDB = async () => {
	return mongoose.connect(DB_URL, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
}

const AddAccountData = async (docToAdd: AccountDocumentType) => {
	const doc = new accountModel(docToAdd)
	return doc.save()
}

const GetAccountData = (addressToFind: string) => {
	return accountModel.findOne({ address: addressToFind })
}

const Communicator = {
	ConnectToDB,
	AddAccountData,
	GetAccountData
}

export default Communicator
