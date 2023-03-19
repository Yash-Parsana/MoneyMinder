const Pool = require('pg').Pool

const pool = new Pool({
    database:process.env.DATABASE,
    user: process.env.USER,
    host: process.env.HOST,
    password:process.env.PASSWORD
})

module.exports=pool