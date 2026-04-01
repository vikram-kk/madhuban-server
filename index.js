//imports 
import env from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import cors from 'cors'


//js imports
import serverService from './services/server.js'
import socketServer from './services/socket.service.js'


//express app
const app = express()

// middlewares
env.config()
app.use(cors)


//server
const server = createServer(app)


//server start 
serverService(server)
//socket server start
const io = socketServer(server)


io.on('connection', (socket) => {
    console.log('a user connected');
});



app.use("/", (req, res) => {
    res.json("hello Vikram Thakur")
})
