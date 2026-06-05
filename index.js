//imports 
import env from 'dotenv'
import express from 'express'
import { createServer } from 'http'
import cors from 'cors'


//js imports
import serverService from './services/server.js'
import socketServer from './services/socket.service.js'
import connectDb from './configurations/mongoDB.config.js'
import authRoute from './routes/auth.route.js'
import productRoute from './routes/product.route.js'
import cartRoute from './routes/cart.route.js'
import wishRoute from './routes/wishlist.routes.js'
import orderRoute from './routes/order.route.js'
import addressRoute from './routes/address.route.js'

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
//wihslist
app.use('/api/wishlist', wishRoute)
// order 
app.use('/api/order', orderRoute)
// address
app.use('/api/address', addressRoute)


//server start 
serverService(server)
//socket server start
const io = socketServer(server)


io.on('connection', (socket) => {
    console.log('a user connected');
});



