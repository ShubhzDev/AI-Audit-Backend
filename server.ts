import express from "express";
import bodyParser from "body-parser"
import connectDB from "./db/connection";
import router from "./routes/routes";
import cors from "cors";

const corsOptions = {
    origin: 'https://ai-auditing-stagging.vercel.app/', // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};

const app = express();
// app.options('*', cors())

app.use(cors(corsOptions));
app.use(bodyParser.json());

connectDB();

app.use("/api",router);

const PORT = process.env.PORT || 9000;

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})