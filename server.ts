import express from "express";
import bodyParser from "body-parser"
import connectDB from "./db/connection";
import auditRoutes from "./routes/routes";

const app = express();
app.use(bodyParser.json());

connectDB();

app.use("/api",auditRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})