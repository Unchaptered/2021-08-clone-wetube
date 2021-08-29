import express from "express";
import { rootGetJoinUser,rootPostJoinUser,rootGetLoginUser,rootPostLoginUser } from "../controllers/userController";
import { rootHotVideo,rootSearchVideo } from "../controllers/videoController";
import { preventReLoginMiddleware } from "../middleware";

const rootRouter=express.Router();
rootRouter.get("/",rootHotVideo); // 추천 동영상
rootRouter.get("/search",rootSearchVideo); // 동영상 검색

rootRouter.route("/join").all(preventReLoginMiddleware).get(rootGetJoinUser).post(rootPostJoinUser);  // 회원가입
rootRouter.route("/login").all(preventReLoginMiddleware).get(rootGetLoginUser).post(rootPostLoginUser);  // 로그인

export default rootRouter;
