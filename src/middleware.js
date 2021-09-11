import multer from "multer";

export const localsMiddleware=(req,res,next)=>{
    res.locals.siteName=`Wetube`;
    res.locals.loggedIn=Boolean(req.session.loggedIn);
    res.locals.loggedInUser=req.session.user || {};
    // console.log(res.locals);
    // console.log(req.session.user);
    next();
};

// Unlogin User can't excess several URL. :: protectorMiddleware
export const preventURLMiddleware=(req,res,next)=>{
    if(req.session.loggedIn){
        next();
    } else {
        return res.redirect(`/login`);
    }
};
// Login user can't login twice. :: publicOnlyMiddleware
export const preventReLoginMiddleware=(req,res,next)=>{
    if(!req.session.loggedIn){
        return next();
    } else {
        return res.render(`/`);
    }
};
// Upload Form(multer) Middleware :: uploadFiles
export const uploadAvatarMiddleware=multer({
    dest: "uploads/avatars/",
    limits: { fileSize: 3000000,},
});
export const uploadVideoMiddleware=multer({
    dest: "uploads/videos/",
    limits: { fileSize: 12000000,},
});