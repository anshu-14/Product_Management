import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from "./config/db.js";

dotenv.config();

// Initialize Express app
const app = express();

connectDB();
app.use(express.json());

// Routes



// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));