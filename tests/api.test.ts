import chai from 'chai'
import chaiHttp from 'chai-http'
import server from '../src'

const should = chai.should()
const testAddress = '0xb47A9B6F062c33ED78630478dFf9056687F840f2'
chai.use(chaiHttp)

describe('/accounts', () => {
	describe('/data', () => {
		it('GET', done => {
			chai.request(server)
				.get('/accounts/data')
				.end((_, res) => {
					res.should.have.status(200)
					res.text.should.equal('sim: data')
					done()
				})
		})
	})

	describe('/address', () => {
		it('POST', done => {
			chai.request(server)
				.post(`/accounts/address/${testAddress}`)
				.end((_, res) => {
					res.should.have.status(200)
					res.text.should.equal(
						`sim: added: ${testAddress.toLowerCase()}`
					)
					done()
				})
		})
		it('DELETE', done => {
			chai.request(server)
				.delete(`/accounts/address/${testAddress}`)
				.end((_, res) => {
					res.should.have.status(200)
					res.text.should.equal(
						`sim: removed: ${testAddress.toLowerCase()}`
					)
					done()
				})
		})
	})

	describe('/force_update', () => {
		it('PUT', done => {
			chai.request(server)
				.put('/accounts/force_update')
				.end((_, res) => {
					res.should.have.status(200)
					res.text.should.equal('sim: forced update')
					done()
				})
		})
	})
})
