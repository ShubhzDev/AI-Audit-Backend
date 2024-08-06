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
var __asyncValues = (this && this.__asyncValues) || function (o) {
    if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
    var m = o[Symbol.asyncIterator], i;
    return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
    function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
    function settle(resolve, reject, d, v) { Promise.resolve(v).then(function(v) { resolve({ value: v, done: d }); }, reject); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAuditResponse = void 0;
const openai_1 = __importDefault(require("openai"));
const openai = new openai_1.default({
    apiKey: process.env.nndia_api, // Ensure your API key is set in the environment variables
    baseURL: "https://integrate.api.nvidia.com/v1",
});
const prompt = `Give audit score out of 10 and give potential issue on basis of severity in list.You are an AI that provides audit responses in below pure json format.Please return the data in the following structure only without any newline character:
{
  "score": "",
  "severity": [
    {
      "level": "",
      "description": "",
      "recomendation": ""
    }
  ]
}

`;
const getAuditResponse = (contract) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, e_1, _b, _c;
    var _d, _e;
    try {
        if (!contract) {
            return null;
        }
        const completion = yield openai.chat.completions.create({
            model: "meta/llama-3.1-8b-instruct",
            messages: [{ role: "user", content: prompt + contract }],
            temperature: 0.2,
            top_p: 0.7,
            max_tokens: 1024,
            stream: true,
        });
        let responseContent = "";
        try {
            for (var _f = true, completion_1 = __asyncValues(completion), completion_1_1; completion_1_1 = yield completion_1.next(), _a = completion_1_1.done, !_a; _f = true) {
                _c = completion_1_1.value;
                _f = false;
                const chunk = _c;
                responseContent += ((_e = (_d = chunk.choices[0]) === null || _d === void 0 ? void 0 : _d.delta) === null || _e === void 0 ? void 0 : _e.content) || "";
            }
        }
        catch (e_1_1) { e_1 = { error: e_1_1 }; }
        finally {
            try {
                if (!_f && !_a && (_b = completion_1.return)) yield _b.call(completion_1);
            }
            finally { if (e_1) throw e_1.error; }
        }
        const auditResponse = JSON.parse(responseContent);
        // console.log("AuditResponse Response : ", auditResponse);
        return auditResponse;
    }
    catch (error) {
        console.error("Error fetching completion:", error);
        return null;
    }
});
exports.getAuditResponse = getAuditResponse;
