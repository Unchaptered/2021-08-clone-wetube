import express from "express";
import {editUser,logoutUser,deleteUser,seeUser} from "../controllers/userController";

const userRouter=express.Router();
userRouter.get("/edit",editUser);
userRouter.get("/logout",logoutUser);
userRouter.get("/delete",deleteUser);
userRouter.get(":userID",seeUser);

export default userRouter;