
import mysql from 'mysql2';

const connection = mysql.createConnection({
    host: 'localhost',     
    port: 3306,           
    database: 'productmanagement',     
    user: 'root',          
    password: 'WJ28@krhps'       
});


const connectDB = () => {
    connection.connect((err) => {
        if (err) {
            console.error("MySQL connection failed:", err);
        } else {
            console.log("MySQL connected successfully");
        }
    });
};
export default connectDB;