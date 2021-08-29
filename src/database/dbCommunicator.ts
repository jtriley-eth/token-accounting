import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import { AccountDocumentType } from '../types'
import accountModel from './models/accountModel'

const ConnectToDB = async (dbUrl: string) => {
	try {
		await mongoose.connect(dbUrl, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		})
	} catch (error) {
		throw error
	}
}

const AddAccountData = async (
	docToAdd: AccountDocumentType
): Promise<boolean> => {
	try {
		const doc = new accountModel(docToAdd)
		await doc.save()
		return true
	} catch (error) {
		throw error
	}
}

const UpdateAccountData = async (
	doc: AccountDocumentType
): Promise<boolean> => {
	try {
		const update = await accountModel.updateOne(
			{ address: doc.address },
			doc
		)
		return update.acknowledged
	} catch (error) {
		throw error
	}
}

const GetAccountData = async (
	addressToFind: string
): Promise<AccountDocumentType | null> => {
	try {
		return await accountModel.findOne({ address: addressToFind })
	} catch (error) {
		throw error
	}
}

const GetAllAccounts = async (): Promise<AccountDocumentType[] | null> => {
	try {
		return await accountModel.find()
	} catch (error) {
		throw error
	}
}

const RemoveAccountData = async (address: string): Promise<boolean> => {
	try {
		await accountModel.remove({ address })
		return true
	} catch (error) {
		throw error
	}
}

const Communicator = {
	ConnectToDB,
	AddAccountData,
	UpdateAccountData,
	GetAccountData,
	GetAllAccounts,
	RemoveAccountData
}

export default Communicator
