"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const connection_1 = __importDefault(require("./db/connection"));
const routes_1 = __importDefault(require("./routes/routes"));
const cors_1 = __importDefault(require("cors"));
const corsOptions = {
    origin: 'https://ai-auditing-stagging.vercel.app/', // Your frontend URL
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'], // Allowed methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
};
const app = (0, express_1.default)();
// app.options('*', cors())
app.use((0, cors_1.default)(corsOptions));
app.use(body_parser_1.default.json());
(0, connection_1.default)();
app.use("/api", routes_1.default);
const PORT = process.env.PORT || 9000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
