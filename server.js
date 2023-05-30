const express = require('express')
const cors = require('cors')
const retrieveData = require('./routes/retrieveData/retrieveData.js')
const executionPath = require('./routes/projects/executionPath/executionPath.js')
const documentation = require('./routes/projects/documentation/documentation.js')

const app = express()
const {setUpSocket} = require('./BiDirectionalRoutes/socket.js')

app.use(cors({
    origin: '*'
}))



app.use('/executionPath',executionPath.router)

app.use('/documentation',documentation.router)

app.use('/retrieveData',retrieveData)



app.get('/test',(req,res)=>{
    res.send({status: "testing successful"})
})

const server = app.listen(3001,()=>{
    console.log("listening to 3001.......")
})

setUpSocket(app,server)

