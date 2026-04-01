import { Server } from "socket.io";

const socketServer = (server) => {
    const io = new Server(server, {
        cors: {
            origin: "*", // In production, replace "*" with your actual domain
            methods: ["GET", "POST"]
        }
    })
    return io
}

export default socketServer