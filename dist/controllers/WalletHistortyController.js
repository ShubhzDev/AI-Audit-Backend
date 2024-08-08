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
const UserAuditHistory_1 = __importDefault(require("../models/UserAuditHistory"));
const walletAuditHistory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("audit");
    const walletAddress = req.params.walletAddress;
    if (walletAddress) {
        const walletEntry = yield UserAuditHistory_1.default.findOne({ walletAddress: walletAddress });
        //   const audit : IAudit | null = await AuditModel.findById(_id:walletEntry.listOfAddress.)
        if (walletEntry) {
            //when wallet exists
            return res.status(200).send(walletEntry.listOfAddress);
        }
        else {
            //wallet doesn't exist
            return res.status(404).send({ message: "No Data!" });
        }
    }
});
exports.default = walletAuditHistory;
