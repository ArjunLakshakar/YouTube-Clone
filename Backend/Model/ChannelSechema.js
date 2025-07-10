import mongoose from "mongoose";

const ChannelSchema = new mongoose.Schema({
  channelId: { type: String },
  channelName: { type: String },
  handle: { type: String },
  owner: { type: String }, 
  description: { type: String },
  channelBanner: { type: String },
  profileImage: { type: String },
  subscribers: {
    type: [String],
    default: []
  },
  createdDate: { type: Date, default: Date.now },
  videos: [{ type: String }]
});

export default mongoose.model("Channel", ChannelSchema);
