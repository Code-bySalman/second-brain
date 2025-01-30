"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
//@ts-ignore
const userMiddleware = (req, res, next) => {
    var _a;
    const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWTPASS);
        //@ts-ignore
        req.userId = decoded.id;
        next();
    }
    catch (err) {
        console.error("JWT verification failed:", err);
        res.status(403).json({ message: "Forbidden" });
    }
};
exports.userMiddleware = userMiddleware;
