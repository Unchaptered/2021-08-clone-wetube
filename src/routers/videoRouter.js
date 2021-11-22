import express from "express";
import { getUploadVideo, postUploadVideo, seeVideoFile, getEditVideo, postEditVideo, deleteVideo } from "../controllers/videoController";
import { preventURLMiddleware,uploadVideoMiddleware } from "../middleware";

const videoRouter=express.Router();

videoRouter
    .route("/upload")
    .all(preventURLMiddleware)
    .get(getUploadVideo)
    .post(uploadVideoMiddleware.fields([
        { name:"video",maxCount:1 },
        { name:"thumbnail",maxCount:1 }
    ]),postUploadVideo);

videoRouter
    .route("/:id([0-9a-f]{24})")
    .get(seeVideoFile);

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

