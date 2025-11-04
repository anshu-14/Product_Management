
import mysql from 'mysql2/promise';

const pool = mysql.createPool({
    host: 'localhost',     
    port: 3306,           
    database: 'productmanagement',     
    user: 'root',          
    password: 'WJ28@krhps',
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