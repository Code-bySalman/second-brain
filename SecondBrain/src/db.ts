import mongoose, {model, Schema} from "mongoose";

mongoose.connect("mongodb://localhost:27017/salman")

const UserSchema = new Schema({
    username: {type: String, unique: true},
    password: String // You should hash this in a real application
})

export const UserModel = model("User", UserSchema);

const ContentSchema = new Schema({
    title: String,
    link: String,
    tags: [{ type: mongoose.Types.ObjectId, ref: 'Tag' }],
    type: String,
    userId: { type: mongoose.Types.ObjectId, ref: 'User', required: true },
}, { timestamps: true });

const LinkSchema = new Schema({
    hash: String,
    userId: {type: mongoose.Types.ObjectId, ref: 'User', required: true, unique: true },
})

export const LinkModel = model("Links", LinkSchema);
export const ContentModel = model("Content", ContentSchema);