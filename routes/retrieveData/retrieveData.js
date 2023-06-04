const express = require('express');
const {databaseConnector} = require('../../tools/database/database.js')
const router = express.Router();

router.get('/getAllTableContents', (req, res) => {
    console.log("ROUTING TO GET ALL TABLE CONTENTS.......")
    databaseConnector.getTableData(req.query.tableName).then(outcome=>{
        console.log("CHECKING OUTCOME: ",outcome)
        res.send(outcome);
    }).catch(err=>{
        console.log("Error in get all table contents: ")
    })
});

router.get('/getProjectDocumentation',(req,res)=>{
    console.log('ROUTING TO GET PROJECT DOCUMENTATION......') 
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
        res.send({status: "error in inputs"});
    }
})

router.get('/getMarkDownDocumentation',(req,res)=>{
    const project_id = req.query.project_id;
    // res.send({status: true,project_id: project_id});
    databaseConnector.getTableDataBasedOnCondition('documentation',`project_id = ${project_id}`).then(data=>{
            res.send({documentation: data[0].documentation});
    })
})

module.exports = router;
