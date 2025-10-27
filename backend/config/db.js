import mysql from 'mysql2'
import dotenv from 'dotenv'
dotenv.config();

export const db = mysql.createConnection({
    host : process.env.DB_HOST,
    database : process.env.DB_DATABASE,
    password : process.env.DB_PASS,
    user : process.env.DB_USER
});

db.connect((err)=>{
    if(err){
       console.error("database connection failed " , err);
    }
    else {
        console.log("Mysql connection success!!");
    }
})
    

