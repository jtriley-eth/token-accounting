import express from 'express'
import accountsRouter from './routes/accounts'

const app = express()
const port = 5000

app.use(express.json())
app.use('/accounts', accountsRouter)

app.listen(port, () => console.log(`Listening on port ${port}`))

// for testing
export default app
