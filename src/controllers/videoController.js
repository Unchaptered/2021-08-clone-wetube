import videoConstructor from "../models/Video";
import userConstructor from "../models/User";
import commentContructor from "../models/Comment";

export const rootHotVideo=async(req,res)=>{
    const videoDB=await videoConstructor
        .find({})
        .sort({ creationAt: "desc"})
        .populate("owner");
    return res.render("home", { pageTitle: "Home", videoDB}); 
};
export const rootSearchVideo=async(req,res)=>{
    const { keyword }=req.query;

    // new RegExp 안의 파라미터 "i" 의 뜻은 대소문자 구분을 하지 않는 다는 뜻이다.
    let videoDB=keyword ? await videoConstructor.find({ title:{ $regex: new RegExp(`${keyword}`, "i"), } }).populate("owner") : [];
    return videoDB ?
        res.render("video/search", { pageTitle: "Search Videos", videoDB }) :
        res.status(404).render("video/search", { pageTitle: "Search Videos", videoDB }) ;
};

export const seeVideoFile=async(req,res)=>{ 
    const { id } = req.params;

    const videoDB=await videoConstructor.findById(id).populate("owner").populate("childComments");
    return videoDB ?
        res.render("video/see-video", { pageTitle: `👀 ${videoDB.title}`, videoDB }) :
        res.status(404).render("404", { pageTitle: "Video is not founded.", videoDB });
};
export const getEditVideo=async(req,res)=>{
    const {
        params: { id },
        session: { user: { _id }},
    }=req;

    const videoDB=await videoConstructor.findById(id);
    
    return !videoDB ?
        res.status(404).render("404", { pageTitle: "Video not found."}) :
            String(videoDB.owner)!==_id ?
                res.status(403).redirect("/") :
                res.render("video/edit-meta", { pageTitle: `Editing: ${videoDB.title}`, videoDB });
};
export const postEditVideo=async(req,res)=>{
    const {
        params: { id },
        body: { title, description, hashtags }
    }=req;

    const videoDB=await videoConstructor.exists({_id:id});

    if (!videoDB) {
        return res.status(404).render("404", { pageTitle: "Video not found."});
    } else {
        await videoConstructor.findByIdAndUpdate(id, { title, description, hashtags:videoConstructor.formatHashtags(hashtags) });
        return res.redirect("/");
    }
};
export const deleteVideo=async(req,res)=>{
    const {
        params: { id },
        session: { user: { _id }},
    }=req;

    const videoNow=await videoConstructor.findById(id);
    if (!videoNow) {
        return res.status(404).render("404", { pageTitle: "Video not found." });
    } else if (String(videoNow.owner) !== _id) {
        return res.status(403).redirect("/");
    } else {
        await videoConstructor.findByIdAndDelete(id);
        videoNow.childComments.forEach(async(commentID)=>{
            await commentContructor.findByIdAndRemove(commentID);
        });
        return res.redirect("/");
    }
};
export const getUploadVideo=(req,res)=>{
    return res.render("video/upload", { pageTitle: "Upload Video" });
};
export const postUploadVideo=async(req,res)=>{
    // video[0].path 의 http 주소가 \\ 로 작성되어 있어서 videoSchema.pre 에서 \\ 를 /로 바꾸는 함수를 실행 중이다. 스키마 참고
    const {
        files: { video, thumbnail:thumb },
        session: { user: { _id } },
        body: { title, description, hashtags },
    }=req;
    try {
        if(thumb===undefined){
            if(video[0].mimetype.split("/")[0]!="video")
                return res.status(400).render("video/upload", { pageTitle:"Upload Video", errorMessage:"Please check the file extension.", });
        } else {
            if((video[0].mimetype.split("/")[0]!="video") && (thumb[0].mimetype.split("/")[0]!="image"))
                return res.status(400).render("video/upload", { pageTitle:"Upload Video",errorMessage:"Please check the file extension.", });
        }
        const userDB = await userConstructor.findById(_id);

        const uploadVideo=await videoConstructor.create({
            title,
            description,
            fileUrl:videoConstructor.formatUrlChanges(video[0].path),
            thumbUrl:thumb===undefined ? null : videoConstructor.formatUrlChanges(thumb[0].path),
            owner: _id,
            ownerName: userDB.username,
            hashtags:videoConstructor.formatHashtags(hashtags),
        });
        userDB.childVideo.push(uploadVideo._id);
        userDB.save();
        return res.redirect("/");
    } catch (error) {
        return res.status(400).render("video/upload", { pageTitle:"Upload Video", errorMessage:error });
    }
};

// about apiRouter
export const modifyVideo=async(req,res)=>{
    const { id }=req.params;

    const videoDB=await videoConstructor.findById(id);
    
    if(!videoDB) {
        return res.sendStatus(404);
    } else {
        videoDB.meta.views=videoDB.meta.views+1;
        await videoDB.save();

        return res.sendStatus(200);
    }
};
export const createComment=async(req,res)=>{
    const {
        params:{ id },
        body:{ comment:text },
        session:{ user },
    }=req;

    const videoDB=await videoConstructor.findById(id);
    if(!videoDB){
        return res.sendStatus(404);
    }

    const commentDB=await commentContructor.create({
        text,
        owner:user._id,
        ownerName:user.username,
        video:id
    });

    videoDB.childComments.push(commentDB._id);
    videoDB.save();

    return res.sendStatus(201);
    // res.end();
};
export const deleteComment=async(req,res)=>{
    const {
        session: { user: { _id:userID } },
        body: {commentID, ownerID, videoID}
    }=req;
    if( userID!==ownerID )
        return res.sendStatus(401);
        
    const videoDB=await videoConstructor.findById(videoID);
    videoDB.childComments.pop(commentID);
    videoDB.save();
    const commentDB=await commentContructor.findByIdAndDelete(commentID);
    return res.sendStatus(200);
};