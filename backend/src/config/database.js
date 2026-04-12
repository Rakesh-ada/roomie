const mongoose = require("mongoose")

function connectToDb(){
    mongoose.connect(process.env.MONGO_URI,{dbName:"users"})
    .then(()=>{
        console.log("DB CONNECTED")
    })
    .catch((err)=>{
        console.log("ERROR:",err.message)
    })
}

module.exports = connectToDb