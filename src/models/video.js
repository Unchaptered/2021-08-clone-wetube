// 생성자 패턴이네 !!
// Explain what our video looks like to our DB
import mongoose from "mongoose";

const videoSchema = new mongoose.Schema({
  title: { type: String, required: true, uppercase: true, trim: true, maxLength: 40 },
  description: { type: String, required: true, trim: true, minLength: 20, maxLength: 140, },
  fileUrl: { type: String, required: true },
  thumbUrl: { type: String },
  creationAt: { type: Date, required: true, default: Date.now },
  hashtags: [{ type: String, trim: true }],
  meta: {
    views: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
  },
  owner: { type: mongoose.Schema.Types.ObjectId, requried: true, ref: `User` },
  ownerName: { type: String },
  childComments: [{ type: mongoose.Schema.Types.ObjectId, ref: `Comment` }],
});
// formatHashtags 가 이름이다... 저장할 때 별도로 호출해줘야한다. formatHashtags(hastags)...
videoSchema.static(`formatHashtags`, (hashtags)=>{
  return hashtags
    .split(",")
    .map((word) => word.replace(/\s/g, ``))
    .map((word) => (word.startsWith(`#`) ? word : `#${word}`));
});
videoSchema.static(`formatUrlChanges`, (url)=>{
  return url.replace(/\\/g, "/");
})

const videoConstructor = mongoose.model("Video", videoSchema);

export default videoConstructor;

// import mongoose from "mongoose";

// import mongoose from "mongoose";

// const videoSchema = new mongoose.Schema({
//   title: { type: String, required: true, trim: true, maxLength: 80 },
//   description: { type: String, required: true, trim: true, minLength: 20 },
//   createdAt: { type: Date, required: true, default: Date.now },
//   hashtags: [{ type: String, trim: true }],
//   meta: {
//     views: { type: Number, default: 0, required: true },
//     rating: { type: Number, default: 0, required: true },
//   },
// });
// const Video = mongoose.model("Video", videoSchema);
// export default Video;
