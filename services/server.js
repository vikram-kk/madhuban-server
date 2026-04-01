const serverService = (server) => {


    server.listen(process.env.PORT, () => {
        console.log(`app connected at port ${process.env.PORT}`)
    })
}

export default serverService