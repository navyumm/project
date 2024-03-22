import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,

}))

// for data receving
app.use(express.json({limit: "10kb"}))           // form 
app.use(express.urlencoded({extended: true, limit: "10kb"}))     // url
app.use(express.static('public'))               // public folder

app.use(cookieParser())


export { app }