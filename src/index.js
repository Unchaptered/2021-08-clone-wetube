import express from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";

import apiRouter from "./routers/apiRouter";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middleware";

const app = express();
const logger = morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");
app.use(logger);

// express 가 req.body 등을 이해하기 위한 설정
// 23번 줄은 기본 셋팅, 24번 줄은 api 요청 받았을 때를 위한 기능.
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(
  session({
    secret: process.env.COOKIE_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      // 1ms 단위
      maxAge: 7 * 24 * 3600 * 1000,
    },
    store: MongoStore.create({ mongoUrl: process.env.DB_URL }),
  })
);

app.use(flash());

app.use(localsMiddleware);

app.use("/uploads", express.static("uploads"));
app.use("/design", express.static("assets"));
app.use("/convert", express.static("node_modules/@ffmpeg/core/dist"));
/* videoRcorder.js 의 레코딩 기능을 사용하려면 보안 Policy 차단이 나오는데,
  이를 무시하기 위한 선언부이다. (예 : MediaRecorder, mediaDevices)
*/
app.use((req, res, next) => {
  res.header("Cross-Origin-Embedder-Policy", "require-corp");
  res.header("Cross-Origin-Opener-Policy", "same-origin");
  next();
});

app.use("/", rootRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);
// fetch 를 연습하기 위해서 api 라우터를 따로 만들었을 뿐이다.
app.use("/api", apiRouter);

export default app;
