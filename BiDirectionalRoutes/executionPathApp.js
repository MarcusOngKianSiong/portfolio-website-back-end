const {client, databaseConnector} = require('../tools/database/database.js')
const {validateObject} = require('../tools/inputValidation/inputValidation.js')
require('dotenv').config();

const clientInstances = [];

function checkInstance(id){
    for(let i = 0; i<clientInstances.length ; i++){
        const instance = clientInstances[i]
        console.log("CHECKING ID RETREIVING: ",instance.id)
        if(id === instance.id){
            console.log('id: ', id, ' -> stored instance: ',instance.id)
            return instance
        }
    }
    return false
}

const executionPathApp = {
    // Step 1 (This is route): After receiving the steps from the program, send the steps to the socket server.
    sendDataToSocketServer: (io,data)=>{
        io.emit('display steps in execution path socket server route',data)
    },
    // Step 2 (This is socket server): Listen for steps coming in. Once receiving the steps from the route, send the steps to the front end. 
    sendDataToApp: (socket,io)=>{
        socket.on('display steps in execution path socket server route',(data)=>{
            console.log("SOCKET: Data received: ",data)
            const id = data.id;
            const steps = data.steps; 
            // Does the ID exist?
            try {
                const assignedInstance = checkInstance(id);
                // Send data to the instance
                if(assignedInstance){
                    assignedInstance.emit('send steps to the app', steps)
                }else{
                    // ERROR HERE
                    
                }    
            } catch (error) {
                
            }
            
        })
    },
    createApplicationInstance: (socket)=>{
        socket.on('create execution path app instance',(data)=>{
            socket.emit('create execution path app instance',socket.id);
        })
        clientInstances.push(socket); 
    },
    clearApplicationInstance: (socket)=>{
        socket.on('disconnect',(data)=>{
            for(let i = 0; i< clientInstances.length;i++){
                if(socket.id === clientInstances[i]){
                    clientInstances.splice(i,1);
                }
            }
        })
    },
    

    displayFunctionDetails: (socket,io)=>{
        let instance = false;
        socket.on('display function details',(data)=>{
            
            try {
                    instance = this.checkInstance(data.id)          
                    data.data.forEach(element => {
                        validateObject(element,["grouping", "functionName", "class", "file", "input", "output", "app"])    
                    });
                    checks = true;
            } catch (error) {
                    socket.emit('Error',"An error has occurred...")
            }
            
            if(instance){
                // databaseConnector.insertValuesIntoTable('programExecutionApp',["grouping", "functionname", "class", "file", "input", "output", "app"], data.data).then(res=>{
                //     if(res=== true){
                        socket.emit('display function details',data.data)
                //     }
                // })
            }else{
                console.log("ERROR...")
            }
            
        })
    },
    // When you start up the app
    storeAppInstance: (instance) => {
        clientInstances.push(instance)
        console.log("CHECKING INSTANCE STORAGE: ",clientInstances[clientInstances.length-1].id)
        return true
    }, 
    // When you send the executed function details
    
    
}



module.exports = {executionPathApp}