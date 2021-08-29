import express from 'express'
import { registerAddress, deleteAddress, registry } from './address'
import { update } from './update'
import { utils } from 'ethers'
import { getAllData, getDataByAddress } from './data'

const Router = express.Router()

Router.route('/data/:id?').get((req, res) => {
	const { id } = req.params
	if (typeof id === 'undefined') {
		getAllData()
			.then(data => {
				if (data !== null)
					res.status(200).send(
						data.map(account => ({
							address: account.address,
							flowState: account.flowState,
							transfers: account.transfers,
							gradeEvents: account.gradeEvents
						}))
					)
				else res.status(404).send('no data found')
			})
			.catch(error => res.status(500).render('error', { error }))
	} else {
		getDataByAddress(id)
			.then(data => {
				if (data !== null)
					res.status(200).send({
						address: data.address,
						flowState: data.flowState,
						transfers: data.transfers,
						gradeEvents: data.gradeEvents
					})
				else res.status(404).send(`data for address: ${id} not found`)
			})
			.catch(error => res.status(500).render('error', { error }))
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
					else res.status(500).send(`not added: ${id}`)
				})
				.catch(error => res.status(500).render('error', { error }))
		} else {
			res.status(400).send('invalid address')
		}
	})
	.delete((req, res) => {
		const { id } = req.params
		// checks if is valid address (hex or icap)
		if (utils.isAddress(id)) {
			// format to hex, lower case
			deleteAddress(utils.getAddress(id).toLowerCase())
				.then(deleted => {
					if (deleted) res.status(200).send(`deleted: ${id}`)
					else res.status(500).send(`not deleted: ${id}`)
				})
				.catch(error => res.status(500).render('error', { error }))
		} else {
			res.status(400).send('invalid address')
		}
	})

Router.route('/force_update').put((_, res) => {
	// force aggregation
	update()
		.then(() => res.status(200).send('updated'))
		.catch(error => res.status(500).render('error', { error }))
})

export default Router
