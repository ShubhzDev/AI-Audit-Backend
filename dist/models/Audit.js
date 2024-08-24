"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const AutoIncrement = require('mongoose-sequence')(mongoose_1.default);
const severitySchema = new mongoose_1.Schema({
    level: { type: String, required: true },
    description: { type: String, required: true },
    recomendation: { type: String, required: true },
});
const auditResponseSchema = new mongoose_1.Schema({
    score: { type: String, required: true },
    high: { type: String, required: true },
    medium: { type: String, required: true },
    low: { type: String, required: true },
    severity: { type: [severitySchema], required: true },
});
const auditSchema = new mongoose_1.default.Schema({
    contractAddress: { type: String, required: true, unique: true },
    auditData: { type: auditResponseSchema, required: true },
    network: { type: String, required: true },
});
const AuditModel = mongoose_1.default.model("Audit", auditSchema, "Audit");
exports.default = AuditModel;
