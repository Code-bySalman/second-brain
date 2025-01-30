import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { random } from "./utils";
import { ContentModel, LinkModel, UserModel } from "./db";
import { JWTPASS } from "./config";
import { userMiddleware } from "./middlewares";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

const SALT_ROUNDS = 10;

//@ts-ignore
app.post("/api/v1/signup", async (req, res) => {
  const { username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);
    await UserModel.create({ username, password: hashedPassword });
    res.status(200).json({ message: "User signed up" });
  } catch (e:any) {
    if (e.code === 11000) {
      return res.status(409).json({ message: "User already exists" });
    }
    console.error("Error during signup:", e);
    res.status(500).json({ message: "Failed to sign up" });
  }
});
//@ts-ignore
app.post('/api/v1/signin', async (req, res) => {
    const { username, password } = req.body;
    console.log(username, password);
  
    try {
      // 1. Find the user in the database
      const user = await UserModel.findOne({ username }); 
      if (!user) {
        return res.status(401).json({ message: 'Invalid credentials' });
      }
  
      //@ts-ignore
      const isMatch = await bcrypt.compare(password, user.password); 
      if (!isMatch) {
        return res.status(401).json({ message: 'Invalid credentials' });
        
      }
  
      // 3. Generate a JWT token
      const token = jwt.sign({ userId: user._id }, JWTPASS);
  
      res.json({ token }); 
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Server error' });
    }
  });

app.post("/api/v1/content", userMiddleware, async (req, res) => {
  const { link, type, title } = req.body;

  try {
    await ContentModel.create({
      link,
      type,
      title,
      userId: req.userId,
      tags: []
    });

    res.json({ message: "Content added" });
  } catch (error) {
    console.error("Error adding content:", error);
    res.status(500).json({ message: "Failed to add content" });
  }
});

//@ts-ignore
app.get("/api/v1/content", userMiddleware, async (req, res) => {
  console.log("Received request to get content");

  try {
    const content = await ContentModel.find({ userId: req.userId }).populate("userId", "username");
    res.json({ content });
  } catch (error) {
    console.error("Failed to get content:", error);
    res.status(500).json({ message: "Failed to get content" });
  }
});

//@ts-ignore
app.delete("/api/v1/content", userMiddleware, async (req, res) => {
  const { contentId } = req.body;

  try {
    await ContentModel.deleteOne({ _id: contentId, userId: req.userId });
    res.json({ message: "Deleted" });
  } catch (error) {
    console.error("Error deleting content:", error);
    res.status(500).json({ message: "Failed to delete content" });
  }
});

//@ts-ignore
app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
  const { share } = req.body;

  try {
    if (share) {
      const existingLink = await LinkModel.findOne({ userId: req.userId });

      if (existingLink) {
        return res.json({ hash: existingLink.hash });
      }

      const hash = random(10);
      await LinkModel.create({ userId: req.userId, hash });
      res.json({ hash });
    } else {
      await LinkModel.deleteOne({ userId: req.userId });
      res.json({ message: "Removed link" });
    }
  } catch (error) {
    console.error("Error sharing link:", error);
    res.status(500).json({ message: "Failed to share link" });
  }
});
//@ts-ignore
app.get("/api/v1/brain/:shareLink", async (req, res) => {
  const { shareLink } = req.params;

  try {
    const link = await LinkModel.findOne({ hash: shareLink });
    if (!link) {
      return res.status(404).json({ message: "Sorry, incorrect input" });
    }

    const content = await ContentModel.find({ userId: link.userId });
    const user = await UserModel.findOne({ _id: link.userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({ username: user.username, content });
  } catch (error) {
    console.error("Error fetching shared content:", error);
    res.status(500).json({ message: "Failed to fetch shared content" });
  }
});

app.listen(4000, () => {
  console.log("Server is running on port 3000");
});
