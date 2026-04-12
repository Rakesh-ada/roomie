require("dotenv").config()

const app = require("./src/app")
const connectToDb = require("./src/config/database")
const dns = require("dns")

dns.setServers(["8.8.8.8", "1.1.1.1"])

connectToDb()

app.listen(3000,()=>{
    console.log("Server Running on Port 3000")
})