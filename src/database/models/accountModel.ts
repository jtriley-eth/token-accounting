import { model, Schema } from 'mongoose'

const accountSchema = new Schema({
	address: String,
	transfers: [
		{
			date: Number,
			sender: String,
			recipient: String,
			txHash: String,
			networkId: String,
			amountToken: String,
			amountFiat: String,
			exchangeRate: String,
			token: {
				id: String,
				symbol: String,
				name: String
			}
		}
	],
	flows: [
		{
			date: Number,
			start: Number,
			end: Number,
			sender: String,
			recipient: String,
			networkId: String,
			txHash: String,
			amountToken: String,
			amountFiat: String,
			exchangeRate: String,
			token: {
				id: String,
				symbol: String,
				name: String
			}
		}
	],
	gradeEvents: [
		{
			id: String,
			transaction: {
				id: String,
				timestamp: Number
			},
			token: {
				id: String,
				symbol: String,
				name: String,
				underlyingAddress: String
			},
			amount: String
		}
	]
})

const accountModel = model('accountCollection', accountSchema)

export default accountModel
