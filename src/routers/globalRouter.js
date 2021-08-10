import express from "express";
import { globalJoinUser,globalLoginUser } from "../controllers/userController";
import { globalHotVideo,globalSearchVideo } from "../controllers/videoController";

const globalRouter=express.Router();
globalRouter.get("/",globalHotVideo); // 추천 동영상
globalRouter.get("/search",globalSearchVideo); // 동영상 검색
globalRouter.get("/join",globalJoinUser);  // 회원가입
globalRouter.get("/login",globalLoginUser);  // 로그인

export default globalRouter;