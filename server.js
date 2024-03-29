const express = require('express')
const cors = require('cors')
const retrieveData = require('./routes/retrieveData/retrieveData.js')
const executionPath = require('./routes/projects/executionPath/executionPath.js')
const documentation = require('./routes/projects/documentation/documentation.js')
const dataVisualization = require('./routes/projects/dataVisualization/dataVisualization.js')
const app = express()

const {setUpSocket} = require('./BiDirectionalRoutes/socket.js')

// Setups
app.use(cors({
    origin: '*'
}))
app.use(express.json())


/**
 * @Purpose Error checking
 * @Description It shows these items in the console:
 *  - Route taken
 *  - Request query
 *  - Response data
 */
// Error checking: Console.log route taken, input and output
app.use((req,res,next)=>{
    console.log("------------------")
    console.log("\x1b[31m%s\x1b[0m","New request: ",`${req.path}`)
    console.log("\x1b[31m%s\x1b[0m","Query: ",JSON.stringify(req.query,null,2))
    const originalSend = res.send;
    
    res.send = function (data) {
        
        
        // You can also manipulate the data here if needed
        // For example, modify the response data
        // data = { message: 'Modified data' };
        
            // Log the data before sending the response
            console.log('Data to be sent:', data);


        // Call the original res.send method with the original arguments
        originalSend.apply(res, arguments);
        
      };
    
    // res.send = (data)=>{
    //     console.log("\x1b[31m%s\x1b[0m","response: ",JSON.stringify(data,null,2))
    // }
    next()
})


// Projects
app.use('/executionPath',executionPath.router)
app.use('/documentation',documentation.router)
app.use('/retrieveData',retrieveData)
app.use('/datavisualization',dataVisualization.router)

app.get('/test',(req,res)=>{
    res.send({status: "testing successful"})
})

app.get('/testDatabase',(req,res)=>{
    
})

const server = app.listen(3001,()=>{
    console.log("listening to 3001.......")
})

setUpSocket(app,server)


