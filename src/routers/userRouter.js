import express from "express";
import { getEditPassword,postEditPassword,getEditUser,postEditUser,logoutUser,startGitHubLogin,finishGitHubLogin,deleteUser,seeUser } from "../controllers/userController";
import { preventURLMiddleware, preventReLoginMiddleware,uploadAvatarMiddleware } from "../middleware";

const userRouter=express.Router();
userRouter.route(`/logout`).all(preventURLMiddleware).get(logoutUser);
userRouter.route(`/edit`).all(preventURLMiddleware).get(getEditUser).post(uploadAvatarMiddleware.single(`avartar`),postEditUser);
userRouter.route(`/edit-password`).all(preventURLMiddleware).get(getEditPassword).post(postEditPassword);
userRouter.route(`/delete`).all(preventURLMiddleware).get(deleteUser);
userRouter.route(`/github/start`).all(preventReLoginMiddleware).get(startGitHubLogin);
userRouter.route(`/github/callback`).all(preventReLoginMiddleware).get(finishGitHubLogin);
userRouter.get(`/:userID`,seeUser);

export default userRouter;


