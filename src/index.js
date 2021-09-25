import express from "express";
import morgan from "morgan";
import session from "express-session";
import MongoStore from "connect-mongo";

import apiRouter from "./routers/apiRouter";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import { localsMiddleware } from "./middleware";

// console.log(process.cwd());
const app=express();
const logger=morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd()+"/src/views");
app.use(logger);
// Make your express(Application) understand [form]
app.use(express.urlencoded({extended:true}));

// MiddlewareSession
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
// MiddlewareLocals
app.use(localsMiddleware);
// Management your URL systemactically
app.use("/",rootRouter);
app.use("/users",userRouter);
app.use("/videos", videoRouter);
// Static Files (Open File (Everyone can see))
app.use("/uploads", express.static("uploads"));
app.use("/design", express.static("assets"));
app.use("/api", apiRouter);

export default app;
