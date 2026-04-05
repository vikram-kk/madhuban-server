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
import productRoute from './routes/product.route.js'
import cartRoute from './routes/order.route.js'

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

//auth
app.use("/api/auth", authRoute)
//product
app.use('/api/product', productRoute)
//cart / order
app.use('/api/cart', cartRoute)


//server start 
serverService(server)
//socket server start
const io = socketServer(server)


io.on('connection', (socket) => {
    console.log('a user connected');
});



