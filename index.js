//imports 
import env from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import cors from 'cors'


//js imports
import serverService from './services/server.js'
import socketServer from './services/socket.service.js'
import authRoute from './routes/auth.route.js'
import connectDb from './configurations/mongoDB.config.js'

//express app
const app = express()

// middlewares
env.config()
app.use(express.json())
app.use(cors())


//server
connectDb()
const server = createServer(app)

//Routes
app.use("/api/auth", authRoute)


//server start 
serverService(server)
//socket server start
const io = socketServer(server)


io.on('connection', (socket) => {
    console.log('a user connected');
});



