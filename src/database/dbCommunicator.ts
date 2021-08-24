import mongoose from 'mongoose'
import testModel from './models/testModel'
import { TestDocumentType } from '../DBTypes'
// const url = 'mongodb+srv://flowstate:flowstate@mycluster.5rvrq.mongodb.net/flowstateAccounting?retryWrites=true&w=majority'

const url = 'mongodb://127.0.0.1:27017/myDatabase'

const ConnectToDB = async () => {
	return mongoose.connect(url, {
		useNewUrlParser: true,
		useUnifiedTopology: true
	})
}

const AddDataToTestCollection = async (docToFind: TestDocumentType) => {
	const testDocument = new testModel(docToFind)
	return testDocument.save()
}

const GetAllDataFromTestCollection = (docToFind: TestDocumentType) => {
	return testModel.find(docToFind, (err, data) => {
		if (err) console.log(err)
	})
}

const GetOneDataFromTestCollection = (docToFind: TestDocumentType) => {
	return testModel.findOne(docToFind, (err: any, data: any) => {
		if (err) console.log(err)
	})
}

const Communicator = {
	ConnectToDB,
	AddDataToTestCollection,
	GetAllDataFromTestCollection,
	GetOneDataFromTestCollection
}

export default Communicator
