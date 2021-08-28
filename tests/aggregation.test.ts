// MUST be first
// for testing
import dotenv from 'dotenv'
dotenv.config()
import { aggregateDataAsync } from '../src/aggregation'
import chai, { assert } from 'chai'
import chaiHttp from 'chai-http'
import fs from 'fs'

chai.use(chaiHttp)

describe('aggregation tests', () => {
	it('aggregateDataAsync', async () => {
		try {
			const address = process.env.ADDRESS
			if (typeof address === 'string') {
				const tableData = await aggregateDataAsync([address])
				fs.writeFile(
					'./temp.json',
					JSON.stringify(tableData, null, 4),
					e => {
						throw e
					}
				)
				console.log('done')
				assert.ok(true)
			} else {
				throw Error('dotenv failed to load')
			}
		} catch (error) {
			console.error('testing error:', error)
			assert.ok(false)
		}
	})
})
