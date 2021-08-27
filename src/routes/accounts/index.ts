import express from 'express'

const Router = express.Router()

Router.route('/data').get((_, res) => {
	// fetch aggregated data
	res.send('sim: data')
})

Router.route('/address/:id')
	.post((req, res) => {
		const id = req.params.id.toLowerCase()
		// add account by id
		res.send(`sim: added: ${id}`)
	})
	.delete((req, res) => {
		const id = req.params.id.toLowerCase()
		// remove account by id
		res.send(`sim: removed: ${id}`)
	})

Router.route('/force_update').put((_, res) => {
	// force aggregation
	res.send('sim: forced update')
})

export default Router
