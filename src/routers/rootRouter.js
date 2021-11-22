import express from "express";
import { rootGetJoin,rootPostJoin,rootGetLogin,rootPostLogin } from "../controllers/userController";
import { rootHotVideo,rootSearchVideo } from "../controllers/videoController";
import { preventReLoginMiddleware } from "../middleware";

const rootRouter=express.Router();

rootRouter
    .get("/",rootHotVideo);
rootRouter
    .get("/search",rootSearchVideo);

rootRouter
    .route("/join")
    .all(preventReLoginMiddleware)
    .get(rootGetJoin)
    .post(rootPostJoin); 
rootRouter
    .route("/login")
    .all(preventReLoginMiddleware)
    .get(rootGetLogin)
    .post(rootPostLogin);

export default rootRouter;
