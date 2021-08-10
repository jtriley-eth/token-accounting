import express from 'express'
import { getSuperTokens } from '../aggregation/theGraph'

const Router = express.Router()

Router.route('/tokens').get(async (_, res) => {
    getSuperTokens('0xb47a9b6f062c33ed78630478dff9056687f840f2', 'goerli').then(data => {
        console.log(JSON.stringify(data, null, 4))
        res.send(data)
    })
})

export default Router
