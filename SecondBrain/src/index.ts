import express from "express";
import { random } from "./utils";
import jwt from "jsonwebtoken";
import { ContentModel, LinkModel, UserModel } from "./db";
import { JWTPASS } from "./config";
import { userMiddleware } from "./middlewares";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());

app.post("/api/v1/signup", async (req, res) => {
    // TODO: zod validation , hash the password
    const username = req.body.username;
    const password = req.body.password;

    try {
        await UserModel.create({
            username: username,
            password: password
        }) 

        res.json({
            message: "User signed up"
        })
    } catch(e) {
        res.status(411).json({
            message: "User already exists"
        })
    }
})

app.post("/api/v1/signin", async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const existingUser = await UserModel.findOne({
        username,
        password
    })
    if (existingUser) {
        const token = jwt.sign({
            id: existingUser._id
        }, JWTPASS)

        res.json({
            token
        })
    } else {
        res.status(403).json({
            message: "Incorrrect credentials"
        })
    }
})

app.post("/api/v1/content", userMiddleware, async (req, res) => {
    console.log("Received request to add content"); // Log the request
  
    const link = req.body.link;
    const type = req.body.type;
  
    try {
      const newContent = await ContentModel.create({ 
        link,
        type,
        title: req.body.title,
        userId: req.userId,
        tags: []
      });
  
      console.log("Content added:", newContent); // Log the added content
      res.json({ message: "Content added" });
    } catch (error) {
      console.error("Failed to create content:", error);
      res.status(500).json({ message: "Failed to add content." });
    }
  });
  
  app.get("/api/v1/content", userMiddleware, async (req, res) => {
    console.log("Received request to get content"); // Log the request
  
    try {
      const userId = req.userId;
      const content = await ContentModel.find({ userId }).populate("userId", "username");
  
      console.log("Content retrieved:", content); // Log the retrieved content
      res.json({ content });
    } catch (error) {
      console.error("Failed to get content:", error);
      res.status(500).json({ message: "Failed to get content." });
    }
  });
app.delete("/api/v1/content", userMiddleware, async (req, res) => {
    const contentId = req.body.contentId;

   await ContentModel.deleteOne({
        contentId,
        //@ts-ignore
        userId: req.userId
    })

    res.json({
        message: "Deleted"
    })
})

app.post("/api/v1/brain/share", userMiddleware, async (req, res) => {
    const share = req.body.share;
    if (share) {
        const existingLink = await LinkModel.findOne({
            //@ts-ignore
            userId: req.userId
        });

        if (existingLink) {
            res.json({
                hash: existingLink.hash
            })
            return;
        }
        const hash = random(10);
        await LinkModel.create({
            //@ts-ignore
            userId: req.userId,
            hash: hash
        })

        res.json({
            hash
        })
    } else {
        await LinkModel.deleteOne({
            //@ts-ignore
            userId: req.userId
        });

        res.json({
            message: "Removed link"
        })
    }
})

app.get("/api/v1/brain/:shareLink", async (req, res) => {
    const hash = req.params.shareLink;

    const link = await LinkModel.findOne({
        hash
    });

    if (!link) {
        res.status(411).json({
            message: "Sorry incorrect input"
        })
        return;
    }
    // userId
    const content = await ContentModel.find({
        userId: link.userId
    })

    console.log(link);
    const user = await UserModel.findOne({
        _id: link.userId
    })

    if (!user) {
        res.status(411).json({
            message: "user not found, error should ideally not happen"
        })
        return;
    }

    res.json({
        username: user.username,
        content: content
    })

})

app.listen(3000);