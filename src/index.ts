// MUST be first
import dotenv from 'dotenv'
dotenv.config()

import express from 'express'
import accountingRouter from './routes/accounting'

const app = express()
const port = 5000

app.use(express.json())
app.use('/account_data', accountingRouter)

app.listen(port, () => console.log(`Listening on port ${port}`))
