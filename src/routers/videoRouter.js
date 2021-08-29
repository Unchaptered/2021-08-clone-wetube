import express from "express";
import {getUploadVideo,postUploadVideo,seeVideo,getEditVideo,postEditVideo,deleteVideo} from "../controllers/videoController";
import { preventURLMiddleware,uploadVideoMiddleware } from "../middleware";

const videoRouter=express.Router();
// videoRouter.get("/upload",getUploadVideo);
videoRouter
    .route("/upload")
    .all(preventURLMiddleware)
    .get(getUploadVideo)
    .post(uploadVideoMiddleware.single(`video`),postUploadVideo);

videoRouter
    .route("/:id([0-9a-f]{24})")
    .get(seeVideo);
videoRouter
    .route("/:id([0-9a-f]{24})/edit")
    .all(preventURLMiddleware)
    .get(getEditVideo)
    .post(postEditVideo);
videoRouter
    .route("/:id([0-9a-f]{24})/delete")
    .all(preventURLMiddleware)
    .get(deleteVideo);

export default videoRouter;

