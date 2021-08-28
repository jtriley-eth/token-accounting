import { AccountDocumentType } from './src/types'

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
