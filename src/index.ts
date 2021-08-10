import express from 'express'
import accountingRouter from './routes/accounting'

const app = express()
const port = 5000

app.use(express.json())
app.use('/accounting', accountingRouter)

app.listen(port, () => console.log(`Listening on port ${port}`))

