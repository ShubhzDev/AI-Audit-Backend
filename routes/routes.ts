import express from "express"
import getRawSmartContract from "../controllers/SmartContractController"

const router = express.Router();

router.get("/api/audit",getRawSmartContract)

 