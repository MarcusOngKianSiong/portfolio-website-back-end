require('dotenv').config()
const {databaseConnector} = require('../tools/database/database.js')

test('testing dotenv file',()=>{
    expect(process.env.TESTING).toBe('10');
    expect(process.env.DATABASE).toBe('portfolio_website');
    expect(process.env.USERNAME).toBe('marcus');
    expect(process.env.PASSWORD).toBe('');
    expect(process.env.HOSTNAME).toBe('localhost');
    expect(process.env.PORT).toBe('5432');
})

// test('Can database be accessed?',async ()=>{
//     const obj = {
//         database: process.env.DATABASE,
//         username: process.env.USERNAME,
//         password: process.env.PASSWORD,
//         hostname: process.env.HOSTNAME,
//         port: process.env.PORT,
//       };
    
//     const outcome = await databaseConnector.getTableData('projects')
//     console.log(outcome)
//     expect(outcome).toEqual([{
//         id: 1,
//         name: 'portfolio website',
//         path: null,
//     },{
//         id: 2,
//         name: 'display table data',
//         path: null,
//     }])
// })

// test(`Can I fetch data from getAllTableContents?`,()=>{
//     fetch('http://localhost:3001/retrieveData/getAllTableContents?tableName=projects').then(res=>{
//         return res.json()
//     }).then(res=>{
//         expect(res).toEqual([{
//             id: 1,
//             name: 'portfolio website',
//             path: null,
//         },{
//             id: 2,
//             name: 'display table data',
//             path: null,
//         }])
//     })
// })

test('Can I get documentation data from API?',async ()=>{
    
    await fetch(`http://localhost:3001/retrieveData/getProjectDocumentation?project_id=1`)
    .then(res=>{
        return res.json()
    })
    .then(res=>{
        expect(res).toEqual([
            {
              id: 1,
              section_title: 'codebase overview',
              section_order_num: 1,
              image_link: 'https://www.researchgate.net/publication/8662258/figure/fig1/AS:601600745816067@1520444203750/Network-interaction-map-Connections-leading-to-node-i-of-the-network-correspond-to.png',
              sub_section_title: 'sub section 2',
              sub_section_order_num: 2,
              content: 'This is sub section 2 for code base overview'
            },
            {
              id: 1,
              section_title: 'codebase overview',
              section_order_num: 1,
              image_link: 'https://www.researchgate.net/publication/8662258/figure/fig1/AS:601600745816067@1520444203750/Network-interaction-map-Connections-leading-to-node-i-of-the-network-correspond-to.png',
              sub_section_title: 'sub section 1',
              sub_section_order_num: 1,
              content: 'This is sub section 1 for code base overview'
            },
            {
              id: 2,
              section_title: 'Code Structure',
              section_order_num: 2,
              image_link: null,
              sub_section_title: 'sub section 2',
              sub_section_order_num: 2,
              content: 'This is sub section 2 for code structure'
            },
            {
              id: 2,
              section_title: 'Code Structure',
              section_order_num: 2,
              image_link: null,
              sub_section_title: 'sub section 1',
              sub_section_order_num: 1,
              content: 'This is sub section 1 for code structure'
            }
          ])
    })
    
})