import express from "express";
import multer from "multer";
import { auth } from "./auth.js";
import {
  addUser,
  getUser
} from "../Controller/UserController.js";
import {
  createChannel,
  getChannel,
  getChannelById,
  subscribeToChannel,
  updateChannel
} from "../Controller/ChannelController.js";
import {
  addChannelVideo,
  addComment,
  deleteComment,
  deleteVideo,
  dislikeVideo,
  editComment,
  editVideo,
  getAllVideos,
  getChannelVideos,
  getComments,
  getVideo,
  likeVideo,
  searchVideosByTitle
} from "../Controller/VideoController.js";


export function routes(app, upload) {
  const router = express.Router();
  // User routes
  router.post("/register", addUser);
  router.post("/login", getUser);

  // Channel routes
  router.post("/createChannel", auth, createChannel);
  router.put("/updateChannel", auth, updateChannel);
  router.get("/getChannel", auth, getChannel);
  router.get("/getChannelById/:channelId", getChannelById);
  router.put('/subscribe/:channelId', auth, subscribeToChannel);

// Video routes
  router.post("/addChannelVideo",upload.fields([
    { name: "video", maxCount: 1 },
    { name: "thumbnail", maxCount: 1 },
  ]),auth ,addChannelVideo);
  router.get("/getChannelVideos", auth, getChannelVideos);
  router.get("/getAllVideos", getAllVideos);
  router.get("/getVideo/:videoId", getVideo);
  router.post("/addComment/:videoId", auth, addComment);
  router.get("/getComments/:videoId", getComments);
  router.put("/editComment/:videoId/:commentId", auth, editComment);
  router.delete("/deleteComment/:videoId/:commentId", auth, deleteComment);

  router.put('/like/:videoId', auth, likeVideo);
  router.put('/dislike/:videoId', auth, dislikeVideo);
  router.put('/editVideo/:videoId', auth , editVideo);
  router.delete('/deleteVideo/:videoId', auth , deleteVideo);
  router.get('/searchVideos', searchVideosByTitle);

  app.use(router);
}