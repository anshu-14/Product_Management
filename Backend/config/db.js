
import mysql from 'mysql2/promise';
import dotenv from "dotenv";
dotenv.config();


const pool = mysql.createPool({
    host: process.env.DATABASE_HOST,     
    port: process.env.DATABASE_PORT,           
    database: process.env.DATABASE_NAME,     
    user: process.env.DATABASE_USER,          
    password: process.env.DATABASE_PASSWORD,
    waitForConnections: true,
    connectionLimit:10,
    queueLimit:0
});


export const connectDB =async () => {
     try {
        const connection = await pool.getConnection();
        console.log("✅ MySQL connected successfully");
        connection.release();
    } catch (err) {
        console.error("❌ MySQL connection failed:", err);
        process.exit(1);
    }
};
export default pool;