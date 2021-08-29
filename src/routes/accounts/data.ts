import Communicator from '../../database/dbCommunicator'
import { AccountDocumentType } from '../../types'

export const getAllData = async (): Promise<AccountDocumentType[] | null> => {
	return await Communicator.GetAllAccounts()
}

export const getDataByAddress = async (
	address: string
): Promise<AccountDocumentType | null> => {
	return await Communicator.GetAccountData(address)
}
