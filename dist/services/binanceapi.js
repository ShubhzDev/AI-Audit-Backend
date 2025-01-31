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
exports.getRawSmartContractFromBNB = void 0;
const axios_1 = __importDefault(require("axios"));
const getRawSmartContractFromBNB = (contractAddress) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const etherScanUrl = `https://api.bscscan.com/api?module=contract&action=getsourcecode&address=${contractAddress}&apikey=${process.env.Binance_Scan_Api}`;
        const response = yield axios_1.default.get(etherScanUrl);
        const data = response.data;
        // console.log(data);
        if (data.status === "1") {
            if (data.result[0].ABI === "Contract source code not verified") {
                return "Contract source code not verified";
            }
            else if (data.result[0].SourceCode.trim() != "") {
                return data.result[0].SourceCode;
            }
            else {
                return null;
            }
        }
        else {
            return null;
        }
    }
    catch (error) {
        console.log("bnb");
        console.error("Error caught : " + error);
        return null;
    }
});
exports.getRawSmartContractFromBNB = getRawSmartContractFromBNB;
