const {Client} = require('pg')
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
const client = new Client(obj);
client.connect()
client.query('select * from projects',(err,res)=>{
    console.log(res)
})