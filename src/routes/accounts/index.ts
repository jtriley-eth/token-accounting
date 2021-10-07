import express from 'express'
import { registerAddress, deleteAddress, registry } from './address'
import { update } from './update'
import { utils } from 'ethers'
import { getAllData, getDataByAddress } from './data'
import { getCsvFlowState, getCsvTransfers } from './helper'
import { UserQueryType } from '../../types'
import { ethereumLaunch, ethNow } from '../../helpers/time'

const Router = express.Router()

Router.route('/data').get((req, res) => {
	const { id, start: queryStart, end: queryEnd }: UserQueryType = req.params
	const start = queryStart || ethereumLaunch
	const end = queryEnd || ethNow()
	if (typeof id === 'undefined') {
		getAllData()
			.then(data => {
				if (data !== null)
					res.status(200).send(
						data.map(account => ({
							address: account.address,
							flowState: account.flowState.filter(
								fs => start < fs.date && fs.date < end
							),
							transfers: account.transfers.filter(
								t => start < t.date && t.date < end
							),
							gradeEvents: account.gradeEvents.filter(
								ge =>
									start < ge.transaction.timestamp &&
									ge.transaction.timestamp < end
							)
						}))
					)
				else res.status(404).send('no data found')
			})
			.catch(error => res.status(500).json({ error }))
	} else {
		getDataByAddress(id)
			.then(data => {
				if (data !== null)
					res.status(200).send({
						address: data.address,
						flowState: data.flowState.filter(
							fs => start < fs.date && fs.date < end
						),
						transfers: data.transfers.filter(
							t => start < t.date && t.date < end
						),
						gradeEvents: data.gradeEvents.filter(
							ge =>
								start < ge.transaction.timestamp &&
								ge.transaction.timestamp < end
						)
					})
				else res.status(404).send(`data for address: ${id} not found`)
			})
			.catch(error => res.status(500).json({ error }))
	}
})

Router.route('/csv/transfers').get((req, res) => {
	const { id, start: queryStart, end: queryEnd }: UserQueryType = req.params
	const start = queryStart || ethereumLaunch
	const end = queryEnd || ethNow()
	if (typeof id === 'undefined') {
		res.status(404).json('csv can only be fetched with an address')
	} else {
		getDataByAddress(id)
			.then(data => {
				console.log(data)
				if (data !== null) {
					const csv = getCsvTransfers(
						data.transfers.filter(
							t => start < t.date && t.date < end
						)
					)
					res.status(200).attachment('transfers.csv').send(csv)
				} else res.status(404).send(`data for address: ${id} not found`)
			})
			.catch(error => res.status(500).json({ error }))
	}
})

Router.route('/csv/flowstate').get((req, res) => {
	const { id, start: queryStart, end: queryEnd }: UserQueryType = req.params
	const start = queryStart || ethereumLaunch
	const end = queryEnd || ethNow()
	if (typeof id === 'undefined') {
		res.status(404).json('csv can only be fetched with an address')
	} else {
		getDataByAddress(id).then(data => {
			console.log(data)
			if (data !== null) {
				const csv = getCsvFlowState(
					data.flowState.filter(
						fs => start < fs.date && fs.date < end
					)
				)
				res.status(200).attachment('flowstate.csv').send(csv)
			} else res.status(404).send(`data for address: ${id} not found`)
		})
	}
})

Router.route('/registry').get((_, res) => {
	registry().then(addresses => res.status(200).send(addresses))
})

Router.route('/address/:id')
	.post((req, res) => {
		const { id } = req.params
		// checks if is valid address (hex or icap)
		if (utils.isAddress(id)) {
			// format to hex, lower case
			registerAddress(utils.getAddress(id).toLowerCase())
				.then(registered => {
					if (registered) res.status(200).send(`added: ${id}`)
					else res.status(403).send(`not added: ${id}`)
				})
				.catch(error => res.status(500).json({ error }))
		} else {
			res.status(400).send('invalid address')
		}
	})
	.delete((req, res) => {
		const { id } = req.params
		// format to hex, lower case
		deleteAddress(id.toLowerCase())
			.then(deleted => {
				if (deleted) res.status(200).send(`deleted: ${id}`)
				else res.status(500).send(`not deleted: ${id}`)
			})
			.catch(error => res.status(500).json({ error }))
	})

Router.route('/force_update').put((_, res) => {
	// force aggregation
	update().then(() => res.status(200).send('updated'))
})

export default Router
