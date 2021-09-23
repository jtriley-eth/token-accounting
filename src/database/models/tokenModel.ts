import { model, Schema } from 'mongoose'

const tokenSchema = new Schema({
	address: String,
	superTokenAddress: String,
	decimals: String
})

const tokenModel = model('tokenCollection', tokenSchema)

export default tokenModel
