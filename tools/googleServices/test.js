const { json } = require('express')
const fetch = require('node-fetch')
const fsp = require('fs').promises
const endpoint = 'https://www.googleapis.com'


const jwt_header = {"alg":"RS256","typ":"JWT"}

fsp.readFile('./images-for-documentation-ccd075ac2787.json').then(res=>{
    const x = JSON.parse(res)
    console.log(x)
    // I never want to deal with anything low tech or does not deal with resource allocation
})

/* What does google service account JWT request contain?
    1. Header:
        - signing algorithm
        - Format of the assertion
    2. Payload/claim set:
        - Permissions being requested (scopes)
        - Target of the token: What API endpoint is the token used for?
        - Issuer: 
        - Time token was issued
        - Lifetime of token
*/ 
// NOTE: Using two legged Oauth
// After I read the file, I need to get access token from the authentication server


// fetch('https://www.googleapis.com'+'/drive/v2/about').then(res=>{
//     return res.json()
// }).then(res=>{
//     console.log(res)
// })
