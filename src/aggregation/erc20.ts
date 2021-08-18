import { baseUrl } from '../constants/etherscanEndpoints'
// import zlib from 'zlib'

// TODO: DONT USE `ANY`
export const getTransactionsAsync = async (
	address: string,
	apiKey: string,
	startBlock: string = '0',
	endBlock: string = '99999999',
	sort: 'asc' | 'desc' = 'asc'
): Promise<any> => {
	const url = `${baseUrl}module=account&action=txlist&address=${address}&startblock=${startBlock}&endblock=${endBlock}&sort=${sort}&apikey=${apiKey}`
	try {
		const response = await fetch(url)
		// if (response.body !== null) {
		// zlib.gunzip(response.body, (err, result) => {

		// })
		// }
		return response
	} catch (error) {
		throw error
	}
}

// https://api.etherscan.io/api?module=account&action=txlist&address=0xddbd2b932c763ba5b1b7ae3b362eac3e8d40121a&startblock=0&endblock=99999999&sort=asc&apikey=YourApiKeyToken
