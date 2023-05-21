const {io} = require('socket.io-client')


class socket{
    constructor(serverOrClient,serverLink){
        this.socket = null
        if(serverOrClient === "client"){
            this.socket = io(serverLink)
        }
    }
    testServerFunction(emitName,data){
        this.socket.emit(emitName,data)
    }
    testOneEmitOneResponse(emitNames,responseName,data){
        this.socket.on(responseName,(data)=>{
            console.log(data)
        })
        this.socket.emit(emitNames,data);
    }
}

const x = [{    
    "grouping": "authentication",    
    "functionname": "loginUser",    
    "class": "AuthController",    
    "file": "auth.js",   
     "input": "email, password",    
     "output": "token",    
     "app": "myapp"  
}]


const instance = new socket('client','http://localhost:3001')
instance.testServerFunction('executed',x)
instance.testOneEmitOneResponse('executed','executed and stored',x)

