"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const SmartContractController_1 = __importDefault(require("../controllers/SmartContractController"));
const WalletHistortyController_1 = __importDefault(require("../controllers/WalletHistortyController"));
const router = express_1.default.Router();
router.get("/audit/:contractAddress", SmartContractController_1.default);
router.get("/auditHistory/:walletAddress", WalletHistortyController_1.default);
exports.default = router;
