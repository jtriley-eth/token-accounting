import Communicator from '../../database/dbCommunicator'

export const registerAddress = async (address: string): Promise<boolean> => {
	let accounts = []
	try {
		accounts = await registry()
		if (accounts.includes(address)) return false
	} catch (error) {
		throw error
	}
	try {
		return await Communicator.AddAccountData({
			address: address.toLowerCase(),
			flowState: [],
			transfers: [],
			gradeEvents: []
		})
	} catch (error) {
		throw error
	}
}

export const deleteAddress = async (address: string): Promise<boolean> => {
	try {
		return await Communicator.RemoveAccountData(address.toLowerCase())
	} catch (error) {
		throw error
	}
}

export const registry = async (): Promise<string[]> => {
	try {
		const accounts = await Communicator.GetAllAccounts()
		if (accounts !== null) {
			return accounts.map(account => account.address)
		} else return []
	} catch (error) {
		throw error
	}
}
