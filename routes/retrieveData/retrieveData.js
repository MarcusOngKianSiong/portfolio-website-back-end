const express = require('express');
const {databaseConnector} = require('../../tools/database/database.js')
const router = express.Router();

router.get('/getAllTableContents', (req, res) => {
    databaseConnector.getTableData(req.query.tableName).then(outcome=>{
        res.send(outcome);
    }).catch(err=>{
        console.log("Error in get all table contents: ")
    })
});

router.get('/getProjectDocumentation',(req,res)=>{
    
    try{
        const project_id = req.query.project_id;
        databaseConnector.getMultipleTableData(project_id).then(outcome=>{
            console.log(outcome)
            res.send(outcome)
        }).catch(err=>{
            console.log("ERROR HANDLING OF GETPROJECTDOCUMENTATION!!!")
            res.send(err)
        })    
    }catch(err){
        res.send({status: "error in inputs"})
    }
    
})

module.exports = router;

