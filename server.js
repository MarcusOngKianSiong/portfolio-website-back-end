const express = require('express')
const cors = require('cors')
const retrieveData = require('./routes/retrieveData/retrieveData.js')
const app = express()

app.use(cors({
    origin: '*'
}))

app.use('/retrieveData',retrieveData)



app.listen(3001,()=>{
    console.log("listening to 3001.......")
})

