import dotenv from 'dotenv'
dotenv.config()
import mongoose from 'mongoose'
import { AccountDocumentType } from '../types'
import accountModel from './models/accountModel'
import tokenModel from './models/tokenModel'

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

// accounts

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
		return await accountModel.findOne({
			address: addressToFind.toLowerCase()
		})
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
		await accountModel.deleteOne({ address })
		return true
	} catch (error) {
		throw error
	}
}

// tokens

type DBToken = {
	address: string
	superTokenAddress?: string
	decimals: string
}

const AddToken = async (token: DBToken): Promise<boolean> => {
	try {
		const doc = new tokenModel(token)
		await doc.save()
		return true
	} catch (error) {
		throw error
	}
}

const UpdateToken = async (token: DBToken): Promise<boolean> => {
	try {
		const update = await tokenModel.updateOne(
			{ addresss: token.address },
			token
		)
		return update.acknowledged
	} catch (error) {
		throw error
	}
}

const GetToken = async (address: string): Promise<DBToken | null> => {
	try {
		return await tokenModel.findOne({ address })
	} catch (error) {
		throw error
	}
}

const RemoveToken = async (address: string): Promise<boolean> => {
	try {
		await tokenModel.deleteOne({ address })
		return true
	} catch (error) {
		throw error
	}
}

// exports

const Communicator = {
	ConnectToDB,
	AddAccountData,
	UpdateAccountData,
	GetAccountData,
	GetAllAccounts,
	RemoveAccountData,
	AddToken,
	UpdateToken,
	GetToken,
	RemoveToken
}

export default Communicator
