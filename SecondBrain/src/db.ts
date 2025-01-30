import mongoose, {model, Schema} from "mongoose";

mongoose.connect("mongodb://localhost:27017/salman")

const UserSchema = new Schema({
    username: {type: String, unique: true},
    password: String 
})

export const UserModel = model("User", UserSchema);
const TaskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    taskDate: { type: Date, required: true },
    deadline: { type: Date, required: true },
    isCompleted: { type: Boolean, default: false },
    priority: { type: String, enum: ["low", "medium", "high"], default: "medium" },
    tags: [{ type: mongoose.Types.ObjectId, ref: 'Tag' }],
    type: String,
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const LinkSchema = new Schema({
    hash: String,
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true },
})

export const LinkModel = model("Links", LinkSchema);
export const ContentModel = model("Content", TaskSchema);