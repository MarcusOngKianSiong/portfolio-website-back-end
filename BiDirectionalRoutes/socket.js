const { Server } = require("socket.io");
const cors = require('cors')
const {createServer} = require('http')

let numberOfChatters = [];
const chatLog = [];

// send "chatter that left"
function removeChatter(socket,io){
    
    // keep pinging to check who is there
    socket.on('disconnect',()=>{
        console.log("\x1b[31m","----DISCONNECTING CHATTER.....");
        const id = socket.id;
        const arrLength = numberOfChatters.length;
        console.log("CHECKING ID: ",id);
        let usernameThatLeft = null;
        for(let i = 0 ; i < arrLength ; i++){
            if(numberOfChatters[i].id === id){
                usernameThatLeft = numberOfChatters[i].username;
                numberOfChatters.splice(i,1);
                break;
            }
        }
        io.emit('chatter that left',usernameThatLeft);
        io.emit('change participant number',numberOfChatters.length)
    })
    
}

// send "update chat"
function addNewMessage(socket,io){
    // expect: {name: 'bob', message: '....'}
    
    socket.on('new message',(message)=>{
      console.log('\x1b[34m',"---Adding new message.....")
        console.log("THIS: ",numberOfChatters)
        console.log("Checking id: ",socket.id)
        const obj = numberOfChatters.find(item=>item.id===socket.id);
        const containerizeMessage = {username: obj.username,id: socket.id, message: message}
        chatLog.push(containerizeMessage)
        console.log(chatLog)
        io.emit('update chat',containerizeMessage)
    })
    
}

// send "username"
function collectingUserName(socket,id,io){
  
  socket.on('username',(username)=>{
      console.log("\x1b[34m","---Collecting username....")
      numberOfChatters.push({username: username,id: id})
      console.log(numberOfChatters)
      passChatLogs(socket)
      socket.broadcast.emit('show new chatter',username)
      io.emit('change participant number',numberOfChatters.length)
  })

}

function passChatLogs(socket){
  console.log("\x1b[34m","---Collecting username....")
  socket.emit("get chat logs",chatLog)
}

function setUpSocket(app, server){
  
    const httpServer = createServer(app);    
    const io = new Server(httpServer, { cors: {
      origin: "*"
    } });
    
    io.on('connection',(socket)=>{
        console.log("\x1b[32m","---new connection established....: ")
        
        

        collectingUserName(socket,socket.id,io)

        addNewMessage(socket,io)

        removeChatter(socket,io)
        // socket.emit('checking again','checking the send again...')
    })

    io.attach(server)
}

module.exports = {setUpSocket}
