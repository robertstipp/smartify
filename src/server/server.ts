import express from 'express';
import {router} from './routes';
import dotenv from 'dotenv'
import cors from 'cors';
import cookieParser from 'cookie-parser';
import path from 'path';

dotenv.config();
const PORT = process.env.PORT;
const app = express();

app.use(express.json())
app.use(cookieParser())
app.use(cors(), function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
})


app.use('/',router)

app.use('/homepage', (req,res)=>{
  res.sendFile(path.join(__dirname, '../../index.html'))
})




app.listen(PORT, () => {
  console.log(`Server listening on Port ${PORT} 🌴`)
})