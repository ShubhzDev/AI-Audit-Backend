import express from "express";
import bodyParser from "body-parser"
import connectDB from "./db/connection";
import router from "./routes/routes";

const app = express();
app.use(bodyParser.json());

connectDB();

app.use("/api",router);

const PORT = process.env.PORT || 9000;

app.listen(PORT,()=>{
    console.log(`Server is running on http://localhost:${PORT}`);
})