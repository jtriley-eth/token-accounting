// MUST be first
import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import accountsRouter from './routes/accounts'
import Connector from './database/dbCommunicator'

const app = express()
const port = 5000

Connector.ConnectToDB()
app.use(express.json())
app.route('/test').get((_, res) => res.send('Everything Is Fine :)'))
app.use('/accounts', accountsRouter)

app.listen(port, () => console.log(`Listening on port ${port}`))

// for testing
export default app
