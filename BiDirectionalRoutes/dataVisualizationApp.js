const dataVisualization = {
    visualizeData: (socket)=>{
        socket.emit("visualise data")
    }
    
}

module.exports = {dataVisualization}