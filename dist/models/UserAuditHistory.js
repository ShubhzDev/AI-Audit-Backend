"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const userAuditHistorySchema = new mongoose_1.default.Schema({
    walletAddress: { type: String, required: true, unique: true },
    listOfAddress: { type: [mongoose_1.default.Schema.Types.ObjectId], ref: "Audit" },
});
const UserAuditHistoryModel = mongoose_1.default.model("UserAuditHistory", userAuditHistorySchema, "UserAuditHistory");
exports.default = UserAuditHistoryModel;
