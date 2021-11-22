import multer from "multer";

export const localsMiddleware = (req, res, next) => {
  res.locals.siteName = `Wetube`;
  res.locals.loggedIn = Boolean(req.session.loggedIn);
  res.locals.loggedInUser = req.session.user || {};
  next();
};

// 미 로그인 유저가 인증이 필요한 URL에 접근할 때 차단
export const preventURLMiddleware = (req, res, next) => {
  if (req.session.loggedIn) {
    next();
  } else {
    req.flash("error", "Not authorized");
    return res.status(404).redirect(`/login`);
  }
};

// 로그인 유저가 다시 로그인 하는 등의 URL에 접근할 때 차단
export const preventReLoginMiddleware = (req, res, next) => {
  if (!req.session.loggedIn) {
    return next();
  } else {
    req.flash("error", "Not authorized");
    return res.status(403).render(`/`);
  }
};

// 모듈 multer 를 사용하기 위한 설정, 사전에 index.js 에서 static 경로 설정 필요
export const uploadAvatarMiddleware = multer({
  dest: "uploads/avatars/",
  limits: { fileSize: 3000000 },
});
export const uploadVideoMiddleware = multer({
  dest: "uploads/videos/",
  limits: { fileSize: 12000000 },
});
