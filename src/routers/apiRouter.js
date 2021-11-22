import express  from "express";
import { modifyVideo, createComment, deleteComment } from "../controllers/videoController";

const apiRouter=express.Router();

// localhost:4000/api/videos/:id/view

apiRouter
    .route("/videos/:id([0-9a-f]{24})/view")
    .post(modifyVideo);

apiRouter
    .route("/videos/:id([0-9a-f]{24})/comment")
    .post(createComment);

apiRouter
    .route("/videos/:id([0-9a-f]{24})/comment/delete")
    .post(deleteComment);

export default apiRouter;

/*  form 의 데이터를 받을 수 있는 것은
    app.use(express.urlencoded({extended:true})); 라는 미들웨어 덕분이다.
    따라서 form 을 이용하지 않고 데이터를 받으려면 무언가가 필요하다.
    프론트 앤드에 있는 데이터는 JSON 이고 이를 서버나 Node.js 에서는
    객체가 아닌 String 으로 받아들이게 된다.
*/