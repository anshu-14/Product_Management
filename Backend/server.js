import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import {connectDB} from "./config/db.js";
import routes from './routes/index.js';
//configure env variables
dotenv.config();

// Initialize Express app
const app = express();

app.use(express.json());
app.use(cors());

//connect to database
connectDB();

// Routes
app.use('/api',routes);





// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));