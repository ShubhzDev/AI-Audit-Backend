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
const binanceapi_1 = require("../services/binanceapi");
const openaiApi_1 = require("../services/openaiApi");
const Audit_1 = __importDefault(require("../models/Audit"));
const UserAuditHistory_1 = __importDefault(require("../models/UserAuditHistory"));
const audit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("audit");
    // try {
    const contractAddress = req.params.contractAddress;
    const walletAddress = req.body.walletAddress;
    const network = req.body.network;
    if (!contractAddress || contractAddress.trim() === "") {
        return res.status(500).send({ message: "contract address is missing" });
    }
    let rawContract = null;
    if (network === "ETH") {
        rawContract = yield (0, etherscanapi_1.getRawSmartContractFromEtH)(contractAddress);
    }
    else if (network === "BNB") {
        rawContract = yield (0, binanceapi_1.getRawSmartContractFromBNB)(contractAddress);
    }
    else {
        return res.status(500).send({ message: "Invalid Network!" });
    }
    if (!rawContract || rawContract.trim() === "") {
        console.log("rawContract null ");
        return res.status(500).send({ message: "Invalid Contract Address!" });
    }
    console.log("came here ");
    const auditResponse = yield (0, openaiApi_1.getAuditResponse)(rawContract);
    if (auditResponse === null) {
        return res.status(500).send({ message: "Invalid Contract Address!" });
    }
    const auditEntry = yield Audit_1.default.findOne({
        contractAddress: contractAddress,
    });
    // console.log("contractAddress", contractAddress);
    // console.log("auditData", auditResponse);
    if (!auditEntry) {
        const newAuditEntry = new Audit_1.default({
            contractAddress: contractAddress,
            auditData: auditResponse,
            network: network,
        });
        const auditEntryId = yield newAuditEntry.save();
        // console.log("auditEntryId", auditEntryId);
        if (walletAddress) {
            const walletEntry = yield UserAuditHistory_1.default.findOne({ walletAddress: walletAddress });
            if (walletEntry) {
                if (!Array.isArray(walletEntry.listOfAddress)) {
                    walletEntry.listOfAddress = []; // Initialize as an empty array if it's not an array
                }
                if (!walletEntry.listOfAddress.includes(auditEntryId.id)) {
                    walletEntry.listOfAddress.push(auditEntryId.id); // Add id if it's not already present
                }
                yield walletEntry.save();
            }
            else {
                //wallet doesn't exist
                const walletDoc = new UserAuditHistory_1.default({
                    walletAddress: walletAddress,
                    listOfAddress: [auditEntryId._id],
                });
                yield walletDoc.save();
            }
        }
        return res.status(200).send(newAuditEntry);
    }
    else {
        if (walletAddress) {
            const walletEntry = yield UserAuditHistory_1.default.findOne({ walletAddress: walletAddress });
            if (walletEntry) {
                //when wallet exists
                if (!Array.isArray(walletEntry.listOfAddress)) {
                    walletEntry.listOfAddress = []; // Initialize as an empty array if it's not an array
                }
                if (!walletEntry.listOfAddress.includes(auditEntry.id)) {
                    walletEntry.listOfAddress.push(auditEntry.id); // Add id if it's not already present
                }
                // Push the new audit entry ID into the list
                yield walletEntry.save();
            }
            else {
                //wallet doesn't exist
                const walletDoc = new UserAuditHistory_1.default({
                    walletAddress: walletAddress,
                    listOfAddress: [auditEntry._id],
                });
                yield walletDoc.save();
            }
        }
        return res.status(200).send(auditEntry);
    }
    // } catch (error) {
    //   console.error("Server Error!!");
    // }
});
exports.default = audit;
