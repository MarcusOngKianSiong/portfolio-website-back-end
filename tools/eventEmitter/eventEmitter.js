const { EventEmitter } = require("events");
const eventEmitter = new EventEmitter();

/**
 * @abstract Receivers
 * @description run the function locally at specific locations in the app to receive any emit signals from within the app.
 * @param {*} socket 
 */

// Receiver
function dataVisualizationReceiver(socketToEmit){
    eventEmitter.on("visualize data",(data)=>{
        socketToEmit(data)
    })
}

// Emitter
const dataVisualizationEmitter = {
    visualizeData: (data)=>{
        eventEmitter.emit("visualize data",data)
    }
}

module.exports = {dataVisualizationEmitter, dataVisualizationReceiver,eventEmitter}
