const {Client} = require('pg')
require('dotenv').config()
const inputValidation = require('../inputValidation/inputValidation.js')
const dataConversion = require('../dataConversion/dataConversion.js')
const generateData = require('../generateData/generateData.js')
const dataFormatting = require('../dataFormat/dataFormatting.js')
// const {record} = require('./recordExecution/record.js')

class client{
    
    constructor(loginDetails){
        inputValidation.validateObject(loginDetails,['database','user','password','host','port'])
        this.client = new Client(loginDetails)
        this.client.connect()
    }
    
    async getTableData(tableName){
        console.log("database.js: GET TABLE DATA")                                  // This is showing
        try{
            const data = await this.client.query(`select * from ${tableName}`)          
            // console.log('Check data retrieved: ',data.rows)                         // THis is not showing
            return data.rows
        }
        catch (error) {
            console.log(error)
        }
    }
    
    /**
     * This function inserts values into a specified table in a database using SQL syntax.
     * @param tableName - The name of the table where the values will be inserted.
     * @param columns - An array of column names for the table where the values will be inserted. For
     * example, ["name", "age", "email"].
     * @param values - The values parameter is an array of objects, where each object represents a row
     * to be inserted into the table. The keys of each object correspond to the column names, and the
     * values correspond to the values to be inserted into those columns for that row.
     * @returns a promise that resolves to a boolean value of `true` if the query is successful, and
     * throws an error with a message if the query fails.
     */
    async insertValuesIntoTable(tableName, columns, values){
        // e.g. insert into bob (something) values (10),(20);

        // production: (something)
        const columnString = "("+columns.join(',')+")";
        
        // production: (10),(20)
        let allValues = '';
        values.forEach(row=>{
            allValues+='('+dataConversion.objectValuesToString(row,',')+'),';
        })
        allValues = allValues.slice(0,-1);
        
        const final = `insert into ${tableName} ${columnString} values ${allValues};`
        
        // Send query to database
            return await this.client.query(final).then(res=>{
                return true
            })
            .catch(err=>{
                throw new Error("insertValuesIntoTable function: "+final);
            })
        
    }

    async createTable(tableName,columns){
        const columnCharacteristics = columns.join(`,`);
        await this.client.query(`create table ${tableName} (${columnCharacteristics})`).then(res=>{
            console.log("Table created...");
        })
        .catch(err=>{
            throw new Error(`Create table error: ${err.message}`);
        })
    }

    async deleteData(tableName){
        await this.client.query(`delete from ${tableName};`).then(res=>{
        })
        .catch(res=>{
            console.log(res)
        })
    }
    
    async getColumnCharacteristics(tableName,columns){
        const displayColumns = columns.join(',');
        return await this.client.query(`select ${displayColumns} from information_schema.columns where table_name = '${tableName}';`).then(res=>{
            return res.rows;
        })
    }
    
    async populateWithDummyData(tableName,numberOfRows){
        const dataCharacteristics = await this.getColumnCharacteristics(tableName,['column_name','data_type']);
        // create column array 
        const columnArray = []
        dataCharacteristics.forEach(characteristic=>{
            columnArray.push(characteristic.column_name)
        })
        //
        const data = []
        for (let index = 0; index < numberOfRows; index++) {
            const pieceOfData = {}
            dataCharacteristics.forEach(characteristic=>{
                if(characteristic.data_type === 'text'){
                    pieceOfData[characteristic.column_name] = generateData.generateRandomString()
                }
            })
            data.push(pieceOfData)
        }
        return await this.insertValuesIntoTable(tableName,columnArray,data).then(res=>{
            return res
        })
    }
    
    async getMultipleTableData(project_id){
        if (project_id){
            const query = `select section.id, section.title as section_title, section.order_num as section_order_num, images.image_link, sub_section.title as sub_section_title, sub_section.order_num as sub_section_order_num, sub_section.content
            from section left join images on section.id = images.section_id left join sub_section on section.id = sub_section.section_id where section.project_id = ${project_id};`
            return this.client.query(query).then(res=>{
                return dataFormatting.dataFormat(res.rows)
                return res.rows;
            })
            .catch(err=>{
                throw new Error(err.message)
            })
        }else{
            return new Promise((resolve, reject) => {
                reject("getMultipleTableData function: ",`project_id of ${project_id} is invalid....`)
            })
        }
    }

    async getTableDataBasedOnCondition(tableName, condition){
        return this.client.query(`select * from ${tableName} where ${condition}`)
        .then(res=>{
            return res.rows
        })
        .catch(err=>{
            return `Error in retrieving data.`
        })
    }
}   

// const obj = {
//     database: 'portfolio_website',
//     user: 'postgres',
//     password: "marcus8351",
//     host: 'localhost',
//     port: '5432',
//   };

const obj = {
    database: 'portfolio_website',
    user: 'marcus',
    password: 'Dy5xhgrhDO3BLhMhBCwCjy9DqcDJ8gzO',
    host: 'dpg-cj6seddjeehc73br1390-a',
    port: '5432',
    connectionString: 'postgres://marcus:Dy5xhgrhDO3BLhMhBCwCjy9DqcDJ8gzO@dpg-cj6seddjeehc73br1390-a.singapore-postgres.render.com/portfolio_website',
    ssl: {
        rejectUnauthorized: false
    }
}

console.log(obj)

const databaseConnector = new client(obj)

// databaseConnector.getMultipleTableData(1).then(res=>{
//     console.log(res)
// })


module.exports = {client,databaseConnector}

