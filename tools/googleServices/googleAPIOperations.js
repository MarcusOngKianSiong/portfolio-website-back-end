const fsp = require('fs').promises
const fs = require('fs')
const path = require('path');
const process = require('process');
const { authenticate } = require('@google-cloud/local-auth');
const { google } = require('googleapis');
const { Readable } = require('stream');

function bufferToReadableStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null); // Mark the end of the stream
  return stream;
}

/**
 * file Dependencies: client_secret.json, token.json
 * Steps:
 *  1. Gain authorization
 *  2. Run the operation
 */

class GoogleDriveAPI {

  constructor() {
    this.SCOPES = ['https://www.googleapis.com/auth/drive.metadata.readonly','https://www.googleapis.com/auth/drive.file'];
    this.TOKEN_PATH = path.join(process.cwd(), 'token.json');
    this.CREDENTIALS_PATH = '/Users/marcus/Desktop/experiment/backend/gettingLink/client_secret.json'
    // path.join(process.cwd(), 'client_secret.json');
    this.authClient = null;
  }

  async loadSavedCredentialsIfExist() {
    try {
      const content = await fsp.readFile(this.TOKEN_PATH);
      const credentials = JSON.parse(content);
      return google.auth.fromJSON(credentials);
    } catch (err) {
      return null;
    }
  }

  async saveCredentials(client) {
    const content = await fsp.readFile(this.CREDENTIALS_PATH);
    const keys = JSON.parse(content);
    const key = keys.installed || keys.web;
    const payload = JSON.stringify({
      type: 'authorized_user',
      client_id: key.client_id,
      client_secret: key.client_secret,
      refresh_token: client.credentials.refresh_token,
    });
    await fsp.writeFile(this.TOKEN_PATH, payload);
  }
  
  async authorize() {
    this.authClient = await this.loadSavedCredentialsIfExist();
    if (this.authClient) {
      return this.authClient;
    }
    console.log("THIS: ",this.CREDENTIALS_PATH)
    this.authClient = await authenticate({
      scopes: this.SCOPES,
      keyfilePath: this.CREDENTIALS_PATH,
    });
    if (this.authClient.credentials) {
      await this.saveCredentials(this.authClient);
    }
    return this.authClient;
  }

  async listFiles() {
    const drive = google.drive({ version: 'v3', auth: this.authClient });
    const folderId = '1lyJ9n_v14OlEv4IQZ1TKT0DCeA06xWie';
    const res = await drive.files.list({
      q: `'${folderId}' in parents`,
      pageSize: 10,
      fields: 'nextPageToken, files(id, name, webViewLink)', // Include webViewLink field to retrieve file shareable link
    });
    this.files = res.data.files;
    if (this.files.length === 0) {
      console.log('No files found.');
      return;
    }
    console.log('Files:');
    for(let i = 0; i<this.files.length;i++){
        const data = this.files[i]
        
        if(data.id === '1D0pB2Qqc2p9B4GYuhom3IiXe0y4B0E9W'){
            console.log(data)
            return data;
        }
    }
    // this.files.map((file) => {
    //   console.log(`${file.name} (${file.id})`);
    //   if (file.id === '1D0pB2Qqc2p9B4GYuhom3IiXe0y4B0E9W') {
    //     console.log(file);
    //   }
    // });
  }

  async upload(fileName,file){
    console.log("UPLOADING...")
    console.log("Have I received the file? -> ",file)
    try {
      const drive = google.drive({ version: 'v3', auth: this.authClient });
      // const filePath = path.join(__dirname,'tesla roadster.jpeg');
    

      // create readable stream
      const readStream = new Readable()
      readStream.push(file.data)
      readStream.push(null)
      // Buffer.from(file.data, 'binary')

      // Send readable stream over to google drive
        const response = await drive.files.create({
          requestBody: {
            name: fileName,
            mimeType: 'image/jpeg',
            parents: ['1lyJ9n_v14OlEv4IQZ1TKT0DCeA06xWie']
          },
          media: {
            mimeType: 'image/jpeg',
            body: readStream
          }
        })  
        console.log("Is it successful in storing the file on google drive? -> ",response.data)
        return response.data
    } catch (error) {
        console.log("ERROR CAPTURED: ",error.message)
    }
  }

  // Function to extract the file shareable link by ID
  getFileShareableLink(fileId) {
    const file = this.files.find((f) => f.id === fileId);
    if (file) {
      return file.webViewLink;
    } else {
      return null;
    }
  }
  
}

async function getShareableLink(id) {
    
  const driveAPI = new GoogleDriveAPI();
    await driveAPI.authorize();    
    await driveAPI.listFiles();
  
    const shareableLink = driveAPI.getFileShareableLink(id);
    return shareableLink
    if (shareableLink) {
      console.log(`Shareable Link for File ${fileId}: ${shareableLink}`);
    } else {
      console.log(`File ${fileId} not found.`);
    }
  }

async function uploadFile(fileName,file){
    const driveAPI = new GoogleDriveAPI();
    await driveAPI.authorize();    
    return driveAPI.upload(fileName,file)
}

  module.exports = {getShareableLink,uploadFile}

  // getShareableLink().then(res=>{
  //   console.log(res)
  // });

// const something = async () => {
//   const file = await fs.createReadStream('./tesla roadster.jpeg');
//   await uploadFile('tesla roadster.jpeg',file).then(res=>{
//       console.log(res)
//   })
// }



// something()
  