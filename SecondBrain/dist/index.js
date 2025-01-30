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
const express_1 = __importDefault(require("express"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const utils_1 = require("./utils");
const db_1 = require("./db");
const config_1 = require("./config");
const middlewares_1 = require("./middlewares");
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, cors_1.default)());
const SALT_ROUNDS = 10;
//@ts-ignore
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        const hashedPassword = yield bcrypt_1.default.hash(password, SALT_ROUNDS);
        yield db_1.UserModel.create({ username, password: hashedPassword });
        res.status(200).json({ message: "User signed up" });
    }
    catch (e) {
        if (e.code === 11000) {
            return res.status(409).json({ message: "User already exists" });
        }
        console.error("Error during signup:", e);
        res.status(500).json({ message: "Failed to sign up" });
    }
}));
//@ts-ignore
app.post('/api/v1/signin', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password } = req.body;
    try {
        // 1. Find the user in the database
        const user = yield db_1.UserModel.findOne({ username });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        //@ts-ignore
        const isMatch = yield bcrypt_1.default.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        // 3. Generate a JWT token
        const token = jsonwebtoken_1.default.sign({ userId: user._id }, config_1.JWTPASS);
        res.json({ token });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}));
app.post("/api/v1/content", middlewares_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { link, type, title } = req.body;
    try {
        yield db_1.ContentModel.create({
            link,
            type,
            title,
            userId: req.userId,
            tags: []
        });
        res.json({ message: "Content added" });
    }
    catch (error) {
        console.error("Error adding content:", error);
        res.status(500).json({ message: "Failed to add content" });
    }
}));
//@ts-ignore
app.get("/api/v1/content", middlewares_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Received request to get content");
    try {
        const content = yield db_1.ContentModel.find({ userId: req.userId }).populate("userId", "username");
        res.json({ content });
    }
    catch (error) {
        console.error("Failed to get content:", error);
        res.status(500).json({ message: "Failed to get content" });
    }
}));
//@ts-ignore
app.delete("/api/v1/content", middlewares_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { contentId } = req.body;
    try {
        yield db_1.ContentModel.deleteOne({ _id: contentId, userId: req.userId });
        res.json({ message: "Deleted" });
    }
    catch (error) {
        console.error("Error deleting content:", error);
        res.status(500).json({ message: "Failed to delete content" });
    }
}));
//@ts-ignore
app.post("/api/v1/brain/share", middlewares_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { share } = req.body;
    try {
        if (share) {
            const existingLink = yield db_1.LinkModel.findOne({ userId: req.userId });
            if (existingLink) {
                return res.json({ hash: existingLink.hash });
            }
            const hash = (0, utils_1.random)(10);
            yield db_1.LinkModel.create({ userId: req.userId, hash });
            res.json({ hash });
        }
        else {
            yield db_1.LinkModel.deleteOne({ userId: req.userId });
            res.json({ message: "Removed link" });
        }
    }
    catch (error) {
        console.error("Error sharing link:", error);
        res.status(500).json({ message: "Failed to share link" });
    }
}));
//@ts-ignore
app.get("/api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { shareLink } = req.params;
    try {
        const link = yield db_1.LinkModel.findOne({ hash: shareLink });
        if (!link) {
            return res.status(404).json({ message: "Sorry, incorrect input" });
        }
        const content = yield db_1.ContentModel.find({ userId: link.userId });
        const user = yield db_1.UserModel.findOne({ _id: link.userId });
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.json({ username: user.username, content });
    }
    catch (error) {
        console.error("Error fetching shared content:", error);
        res.status(500).json({ message: "Failed to fetch shared content" });
    }
}));
app.listen(4000, () => {
    console.log("Server is running on port 3000");
});
