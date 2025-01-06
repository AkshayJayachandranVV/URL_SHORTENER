import express from 'express'
import dotenv from 'dotenv'
import authRouter from '../../interface/routes/authRoutes'
import urlRouter from '../../interface/routes/urlRouter'
import urlRedirectRouter  from '../../interface/routes/urlRedirectRoute'
import { dbConnection } from '../database/mongodb';
import cors from 'cors'
dotenv.config()

const app = express()
const PORT = process.env.PORT



const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    credentials: true,
}

dbConnection();


app.use(cors(corsOptions))
app.use(express.json())
app.use('/auth',authRouter)
app.use('/url',urlRouter)
app.use('/',urlRedirectRouter)


app.listen(PORT,()=>console.log(`server running on port : ${PORT}`))