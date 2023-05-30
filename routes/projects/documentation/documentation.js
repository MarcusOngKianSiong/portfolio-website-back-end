const express = require('express')
const upload = require('express-fileupload')
const fs = require('fs')
const router = express.Router()
const {databaseConnector} = require('../../../tools/database/database.js')
const {uploadFile, getShareableLink} = require('../../../tools/googleServices/googleAPIOperations.js')

router.use(upload())

router.post('/savesnapshotandgetsharablelink',async (req,res)=>{

    console.log("RUNNING SAVE SNAP SHOT....")
    // This require express-fileupload
    const snapshot = req.files.image; 
    console.log("AM I GETTING THE IMAGE? -> ",snapshot)
    
    // Upload the file
    const outcome = await uploadFile(snapshot.name,snapshot)
    console.log("CHecking outcome: ",outcome)
    const sharableLink = await getShareableLink(outcome.id);
    console.log("Checking sharable Link: ",sharableLink);
    const parts = sharableLink.split('/');
    // Find the index of 'd' in the array
    const dIndex = parts.findIndex(part => part === 'd');
    // Extract the value between 'd' and 'view'
    const fileId = parts[dIndex + 1];
    const newLink = `https://drive.google.com/uc?id=${fileId}`;
    console.log("New link: ",newLink)
    return res.send({status: true, link: newLink});
    
    // snapshot.mv('./image.png', (err) => {
    //     if (err) {
    //       // Handle error during file saving
    //       console.error(err);
    //       return res.status(500).send('Error saving file.');
    //     }
    
    //     // File saved successfully
    //     return res.send('File uploaded and saved.');
    //   });
    
    
})

router.post('/storeDocumentation',(req,res)=>{
        const query = req.query.document;
        databaseConnector.insertValuesIntoTable('',[],[]).then(res=>{
            databaseConnector.getTableData('').then(res=>{
                return res.rows;
            })
            .then(res=>{
                for(let i = 0; i<res.length; i++){
                    const currentRow = res[i].document
                    if(currentRow === query){
                        res.send({status: true,data: currentRow})
                        break;
                    }
                }
                res.send({status: false, message: 'data not stored.'})
            })
        })
        
})

router.get('/getDocumentation',(req,res)=>{
    const project_id = req.query.project_id;
    databaseConnector.getTableData('documentation').then(data=>{
        console.log('FOUND')
        
        // res.send({data: data[1].documentation})
        console.log(data)
        const length = data.length;
        for(let i = 0;i<length;i++){
            const projectID = data[i].project_id;
            console.log(projectID,project_id)
            if(project_id == projectID){
                res.send({status: true, documentation: data[i].documentation});
                break;
            }
            
        }
    })
})

module.exports = {router}