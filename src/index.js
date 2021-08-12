
import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

// console.log(process.cwd());
const app=express();
const logger=morgan("dev");

app.set("view engine", "pug");
app.set("views", process.cwd()+"/src/views");
app.use(logger);
// Make your express(Application) understand [form]
app.use(express.urlencoded({extended:true}));
// Management your URL systemactically
app.use("/",globalRouter);
app.use("/users",userRouter);
app.use("/videos", videoRouter);

export default app;
