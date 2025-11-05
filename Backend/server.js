import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {connectDB} from "./config/db.js";
import routes from './routes/index.js';
//configure env variables
dotenv.config();

// Initialize Express app
const app = express();
const origins=process.env.CORS_ORIGIN?.split(',').map(o=>o.trim());
app.use(express.json());
app.use(cors({origin:origins}));

//connect to database
connectDB();

// Routes
app.use('/api',routes);





// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));