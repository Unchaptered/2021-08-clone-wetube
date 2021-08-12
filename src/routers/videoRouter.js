import express from "express";
import {getUploadVideo,postUploadVideo,seeVideo,getEditVideo,postEditVideo,deleteVideo} from "../controllers/videoController";

const videoRouter=express.Router();
// videoRouter.get("/upload",getUploadVideo);
videoRouter.route("/upload").get(getUploadVideo).post(postUploadVideo);

videoRouter.get("/:id([0-9a-f]{24})",seeVideo);
videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEditVideo).post(postEditVideo);
videoRouter.route("/:id([0-9a-f]{24})/delete").get(deleteVideo);

export default videoRouter;

