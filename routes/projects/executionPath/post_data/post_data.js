const express = require('express')
const {databaseConnector} = require('../../../../tools/database/database.js')
const router = express.Router()
const {io} = require('socket.io-client')

require('dotenv').config()

const socket = io(process.env.BACKENDLINK)

router.post('/executionSteps',(req,res)=>{
    
    console.log("ROUTE: data received...",req.query)
    const id = req.query.sessionID;
    const steps = req.query.steps;
    const executionObjects = JSON.parse(steps); 
    
    
    const dataFormat = [{
        appName: executionObjects[0].appName,
        snapshot_comment: null,
        snapshot: steps
    }]

    // Store in database
    databaseConnector.insertValuesIntoTable('execution_steps',["appName","snapshot_comment","snapshot"],dataFormat).then(res=>{
        // Storage successful
    })
    .catch(err=>{
        // Storage failed.
        console.log("Route: /execution step\n Status: Failed")
        console.log(err)
    })
    // Send to the app
    socket.emit('display steps in execution path socket server route',{
        id: id,
        steps: executionObjects
    })
    res.send({status: true, data: req.query})
})

module.exports = {router}

