import mongoose from "mongoose";

const CommentSchema = new mongoose.Schema({
  commentId: { type: String, required: true },
  userId: { type: String, required: true },
  // username: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

const VideoSchema = new mongoose.Schema({
  videoId: { type: String, },
  videoFile: { type: String, }, 
  title: { type: String, },
  thumbnail: { type: String, required: true }, 
  description: { type: String, },
  category: { type: String, },
  channelId: { type: String, },
  uploader: { type: String, },
  views: { type: Number, default: 0 },
  uploadDate: { type: Date, default: Date.now },
  isForKids: { type: String, enum: ["yes", "no"], default: "no" },
  likes: { type: [String], default: [] },
  dislikes: { type: [String], default: [] },
  comments: [CommentSchema]
});

export default mongoose.model("Video", VideoSchema);
