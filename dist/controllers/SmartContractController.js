"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const etherscanapi_1 = require("../services/etherscanapi");
const nims_1 = require("../services/nims");
const Audit_1 = __importDefault(require("../models/Audit"));
const audit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("audit");
    // try {
    const contractAddress = req.body.contractAddress;
    const walletAddress = req.params.walletAddress;
    if (!contractAddress) {
        res.status(500).json({ message: "contract address is missing" });
    }
    const rawContract = yield (0, etherscanapi_1.getRawSmartContract)(contractAddress);
    if (!rawContract) {
        res.status(500).json({ message: "Invalid Contract Address" });
    }
    const auditResponse = yield (0, nims_1.getAuditResponse)(rawContract);
    if (!auditResponse) {
        res.status(500).json({ message: "Invalid Contract Address" });
    }
    const auditEntry = yield Audit_1.default.findOne({
        contractAddress: contractAddress,
    });
    console.log("contractAddress", contractAddress);
    console.log("auditData", auditResponse);
    if (!auditEntry) {
        const newAuditEntry = new Audit_1.default({
            contractAddress: contractAddress,
            auditData: auditResponse
        });
        const auditEntryId = yield newAuditEntry.save();
        console.log("auditEntryId", auditEntryId);
        // if (walletAddress) {
        //   const walletEntry: IUserAuditHistory | null =
        //     await userAuditHistoryModel.findOne({ walletAddress: walletAddress });
        //   if (walletEntry) {
        //     //when wallet exists
        //     walletEntry.listOfAddress.push(auditEntryId._id);
        //     await walletEntry.save();
        //   } else {
        //     //wallet doesn't exist
        //     const walletDoc = new userAuditHistoryModel({
        //       walletAddress: walletAddress,
        //       listOfAddress: auditResponse,
        //     });
        //     await walletDoc.save();
        //   }
        // }
    }
    res.status(200).json(auditResponse);
    // } catch (error) {
    //   console.error("Server Error!!");
    // }
});
exports.default = audit;
