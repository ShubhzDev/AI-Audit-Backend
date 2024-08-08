import express from "express"
import audit from "../controllers/SmartContractController"
import walletAuditHistory from "../controllers/WalletHistortyController"

const router = express.Router();

router.post("/audit/:contractAddress",audit)
router.get("/auditHistory/:walletAddress",walletAuditHistory)

export default router;