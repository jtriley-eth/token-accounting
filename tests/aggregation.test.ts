// MUST be first
// for testing
import dotenv from 'dotenv'
dotenv.config()
import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import { aggregateDataAsync } from '../src/aggregation'
import fs from 'fs'

chai.use(chaiHttp)

describe('aggregation tests', () => {
	// check dotenv
	const address = process.env.TEST_ADDRESS
	if (typeof address === 'undefined') throw Error('dotenv failed')

	it('should aggregate', async () => {
		try {
			const data = (await aggregateDataAsync([address]))[0]
			fs.writeFile('./temp.json', JSON.stringify(data, null, 4), e =>
				console.error(e)
			)
			console.log('written')
			assert.ok(true)
		} catch (error) {
			console.error('testing error:', error)
			assert.ok(false)
		}
	})
})
