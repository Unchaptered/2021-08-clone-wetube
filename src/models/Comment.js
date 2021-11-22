import mongoose from "mongoose";

const commentSchema = new mongoose.Schema({
  text: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, requried: true, ref: `User` },
  ownerName: { type: String },
  video: { type: mongoose.Schema.Types.ObjectId, requried: true, ref: `Video` },
  creationAt: { type: Date, required: true, default: Date.now },
});

const commentContructor = mongoose.model("Comment", commentSchema);

export default commentContructor;
