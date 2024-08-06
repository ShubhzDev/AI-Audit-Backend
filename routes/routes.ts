import express from "express"
import audit from "../controllers/SmartContractController"

const router = express.Router();

router.get("/audit",audit)

export default router;