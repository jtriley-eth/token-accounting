import mongoose from 'mongoose'

const schema = mongoose.Schema

const testSchema = new schema({
	price: {
		type: String,
		required: true
	},

	other: {
		type: Number,
		required: true
	}
})

const testModel = mongoose.model('testcollection', testSchema)

export default testModel
