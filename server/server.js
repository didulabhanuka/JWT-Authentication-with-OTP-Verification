import express from 'express'
import cors from 'cors'
import { connectDB } from './config/database.js';
import dotenv from 'dotenv'
dotenv.config()

//app config
const app = express();
const port = 4000;

//middleware
app.use(express.json())
app.use(cors())

//db connection
connectDB();

//routes
import authRoutes from './routes/authRoutes.js';

//route middlewares
app.use(`/auth`, authRoutes)


app.get("/",(req, res) =>{
    res.send("API Is Working")
})

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
})



