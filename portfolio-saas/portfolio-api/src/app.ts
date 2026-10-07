import express from 'express'
import cors from 'cors'
import tenantRoutes from './routes/tenant.routes'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/api', tenantRoutes)

export default app
