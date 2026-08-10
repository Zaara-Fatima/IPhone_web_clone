import { app } from "./app.js";
import connectDB from "./config/db.js";
import dotenv from 'dotenv'

dotenv.config()

app.get('/',(req, res)=>{
    res.send("hello world")
})

connectDB()

app.listen(3000,
    console.log("Server is running on port 3000")
)