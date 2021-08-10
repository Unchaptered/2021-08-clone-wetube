import express from "express";
import {getUploadVideo,postUploadVideo,seeVideo,getEditVideo,postEditVideo,deleteVideo} from "../controllers/videoController";

const videoRouter=express.Router();
// videoRouter.get("/upload",getUploadVideo);
videoRouter.route("/upload").get(getUploadVideo).post(postUploadVideo);

videoRouter.get("/:id(\\d+)",seeVideo);
videoRouter.route("/:id(\\d+)/edit").get(getEditVideo).post(postEditVideo);
// videoRouter.get("/:id(\\d+)/delete",deleteVideo);

export default videoRouter;

