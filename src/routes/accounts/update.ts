import { AccountDocumentType } from '../../types'
import { aggregateDataAsync } from '../../aggregation'
import Communicator from '../../database/dbCommunicator'

export const update = async () => {
	let aggregatedAccounts: AccountDocumentType[] = []

	try {
		const accounts = await Communicator.GetAllAccounts()
		if (accounts !== null) {
			const addresses = accounts.map(account => account.address)
			aggregatedAccounts = await aggregateDataAsync(addresses)
		} else return
	} catch (error) {
		throw error
	}

	try {
		for await (const aggregatedAccount of aggregatedAccounts) {
			const { address, flowState, transfers, gradeEvents } =
				aggregatedAccount
			await Communicator.UpdateAccountData({
				address,
				flowState,
				transfers,
				gradeEvents
			})
		}
	} catch (error) {
		throw error
	}
}
