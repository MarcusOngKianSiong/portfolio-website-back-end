// New
const dropbox = require('dropbox')
const bodyParser = require('body-parser')
const fetch = require('node-fetch')

// Old
const express = require('express')
const upload = require('express-fileupload')
const fs = require('fs')
const router = express.Router()
const {databaseConnector} = require('../../../tools/database/database.js')
const {uploadFile, getShareableLink} = require('../../../tools/googleServices/googleAPIOperations.js')
const dataConversion = require('../../../tools/dataConversion/dataConversion.js')

const client_id = '1iwljun28uur86h'
const client_secret = 'f62j4k0zq8r2g4s'
let access_token = null
let refresh_token = null

// This is used to access files sent through http using req.files
// router.use(upload()) 

// Ensures request body data format aligns with the specified type. Raw refers to buffer object, which are in binary format.
router.use(bodyParser.raw({type: '*/*'}))


/**
 * @Note Meant to generate sharable links to be used as image displays for markdown documentation
 * @SpecificUtilityFunction 
 *      - authoriztionTokenCredentials
 *      - replaceLastFourCharacters
 * @Active_routes
 *      - /check access token
 *      - /uploadFile
 *      - /generatingAccessToken
 * 
 * @Phasing_out
 *      - /savesnapshotandgetsharablelink
 */
function authorizationTokenCredentials(){
    return {
        status: 'No access token nor refresh token',
        priority: 'Get authorization code',
        query: `client_id=${client_id}&response_type=code&redirect_uri=http://localhost:3000/web-app-portfolio/snapshottosharablelink&token_access_type=offline`
    }
}
function replaceLastFourCharacters(inputString, replacement) {
    if (inputString.length < 4) {
      // If the input string has less than four characters, return the original string
      return inputString;
    } else {
      // Create a new string by removing the last four characters and adding the replacement
      const modifiedString = inputString.slice(0, -4) + replacement;
      return modifiedString;
    }
  }
router.get('/checkAccessToken',async (req,respond)=>{
    console.log('---Route: initialization---')
    /**
     * @Note Access token and refresh token comes together because of the parameter token_access_type=offline 
     *       when obtaining authorization Token.
     * @Paths
     *  1. There is no access_tokens nor refresh_tokens
     *          1.1 Pass query string to front-end to get the authorization code
     *  2. There is an access_token and refresh_token
     *          2.1. Access_token works
     *              Success
     *          2.2. Access_token does not work
     *              Use refresh token
     */
    // If it is the first time initializing the app -> Means access token and refresh token is empty
    // PATH 1.: There is no access_tokens nor refresh_tokens
    if(access_token === null && refresh_token === null){
        console.log('Status: No access token nor refresh token')
        respond.send(authorizationTokenCredentials());
    }else{
        // If it is more than one time initializing the app -> Means access token and refresh token exist
        // PATH 2. Check if the access token works
        await fetch('https://api.dropboxapi.com/2/file_requests/count',{
            method: 'post',
            headers: {
                'Authorization': `Bearer ${access_token}`
            }
        }).then(res=>{
            // PATH 2.1.: If access token works
            respond.send({status: "success"});
        }).catch(err=>{
            // PATH 2.2.: If access token does not work (Chances are it expired)
            // Refresh access token with refresh token
            const link = 'https://api.dropboxapi.com/oauth2/token?'
            const query = `grant_type=refresh_token&client_id=${client_id}&client_secret=${client_secret}&refresh_token=${refresh_token}`
            return fetch(link+query,{method: 'post'}).then(res=>{
                return res.json();
            })
            .then(res=>{
                access_token = res.access_token;
                respond.send({status: "success"});
            }).catch(err=>{
                return false 
            })
        })
    }
})
router.post('/uploadFile',async (req,respond)=>{
    
    const fileBuffer = req.body;
    const fileName = req.query.name
    console.log(fileBuffer)
    console.log(access_token)
    if(fileBuffer){
        await fetch('https://content.dropboxapi.com/2/files/upload',{
            method: 'post',
            headers: {
                'Authorization': `Bearer ${access_token}`,
                'Content-Type': 'application/octet-stream',
                'Dropbox-API-Arg': JSON.stringify({
                    "autorename": true,
                    "mode": "add",
                    "path": `/${fileName}`,
                })
            },
            body: fileBuffer
        }).then(res=>{
            return res.json()
        }).then(result=>{
            // Once upload is successful, get sharable link
            const link = 'https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings'
            return fetch(link,{
                method: 'post',
                headers: {
                    'Authorization': `Bearer ${access_token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({path: result.path_lower})
            })
        })
        .then(res=>{
            return res.json();
        }).then(res=>{
            console.log(res)
            respond.send({sharableLink: replaceLastFourCharacters(res.url,'raw=1')})
            // console.log(res.error.shared_link_already_exists.metadata.url);
            return res;
        }).catch(err=>{
            respond.send({status: false,cause: err.message})
        })
    }else{
        respond.send(false)
    }
    
})
router.get('/generatingAccessToken',async (req,respond)=>{
    // THIS PATH IS ONLY for when there is no access token nor refresh token
    console.log("---Route: Generating access token---");
    const authToken = req.query.authorizationToken;
    const link = 'https://api.dropbox.com/oauth2/token?';
    const query = `code=${authToken}&grant_type=authorization_code&client_id=${client_id}&client_secret=${client_secret}&redirect_uri=http://localhost:3000/web-app-portfolio/snapshottosharablelink`;
        await fetch(link+query,{
            method: 'post'
        }).then(res=>{
            return res.json();
        }).then(res=>{
            console.log("Status: ",res)
            console.log("Outcome: Successful in obtaining access and refresh token using authorization token");
            console.log("access token: ",res.access_token);
            if(res.access_token === undefined){
                // If authorization cannot produce an access token, then redo the authorization token allow again
                respond.send(authorizationTokenCredentials());
            }else{
                access_token = res.access_token;
                refresh_token = res.refresh_token;
                respond.send(true);
            }
        }).catch(err=>{
            console.log("Outcome: Failed to obtain access and refresh token using authorization token")
            respond.send(false)
        })    
})

// router.post('/savesnapshotandgetsharablelink',async (req,res)=>{

//     console.log("\nRUNNING SAVE SNAP SHOT....")
//     // This require express-fileupload
//     const snapshot = req.files.image; 
//     console.log("AM I GETTING THE IMAGE? -> ",snapshot)
    
//     // Upload the file
//     const outcome = await uploadFile(snapshot.name,snapshot)
//     console.log("CHecking outcome: ",outcome)
//     const sharableLink = await getShareableLink(outcome.id);
//     console.log("Checking sharable Link: ",sharableLink);
//     const parts = sharableLink.split('/');
//     // Find the index of 'd' in the array
//     const dIndex = parts.findIndex(part => part === 'd');
//     // Extract the value between 'd' and 'view'
//     const fileId = parts[dIndex + 1];
//     const newLink = `https://drive.google.com/uc?id=${fileId}`;
//     console.log("New link: ",newLink)
//     return res.send({status: true, link: newLink});
    
//     // snapshot.mv('./image.png', (err) => {
//     //     if (err) {
//     //       // Handle error during file saving
//     //       console.error(err);
//     //       return res.status(500).send('Error saving file.');
//     //     }
    
//     //     // File saved successfully
//     //     return res.send('File uploaded and saved.');
//     //   });
    
    
// })

router.post('/storeDocumentation',(req,res)=>{
        const query = req.query.document;
        databaseConnector.insertValuesIntoTable('',[],[]).then(res=>{
            databaseConnector.getTableData('').then(res=>{
                return res.rows;
            })
            .then(res=>{
                for(let i = 0; i<res.length; i++){
                    const currentRow = res[i].document;
                    if(currentRow === query){
                        res.send({status: true,data: currentRow});
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