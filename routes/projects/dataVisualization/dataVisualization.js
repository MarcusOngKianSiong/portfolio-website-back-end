const express = require('express')
const eventEmitter = require('../../../tools/eventEmitter/eventEmitter.js')
const router = express.Router()

router.post('/visualizeData',(req,res)=>{
    const data = req.body
    console.log("Checking body: ",data)
    
    eventEmitter.dataVisualizationEmitter.visualizeData(data);
    // eventEmitter.emit('receiving data from library',data)
    res.send({status: true, comment: "Data received"})
})

module.exports = {router}
