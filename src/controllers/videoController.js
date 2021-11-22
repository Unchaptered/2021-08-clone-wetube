import videoConstructor from "../models/Video";
import userConstructor from "../models/User";
import commentContructor from "../models/Comment";

export const rootHotVideo=async(req,res)=>{
    const videoConstructors=await videoConstructor
    .find({})
    .sort({ creationAt: `desc`})
    .populate(`owner`);
    return res.render(`home`, { pageTitle: `Home`, videoConstructors}); 
};
export const rootSearchVideo=async(req,res)=>{
    const { keyword }=req.query;
    let videoSearch=[];
    if(keyword){
        videoSearch=await videoConstructor
        .find({
            title: {
                $regex: new RegExp(`${keyword}$`, `i`),
                // i means 대소문자 구분안함
            }})
        .populate(`owner`);
    }
    return res.render(`search`, { pageTitle: 'Search Video', videoSearch });
};

export const seeVideo=async(req,res)=>{
    const { id } = req.params;
    const videoNow=await videoConstructor.findById(id).populate(`owner`).populate("childComments");
    if (!videoNow){
        return res.render(`404`, {
            pageTitle: `Video not found.`,
            videoNow
        });
    } else {
        return res.render(`seevideo`, {
            pageTitle: `👀 ${videoNow.title}`,
            videoNow,
        });
    }
};
// Edit 편집
export const getEditVideo=async(req,res)=>{
    const {
        params: { id },
        session: { user: { _id }},
    }=req;

    const videoNow=await videoConstructor.findById(id);
    if (!videoNow) {
        return res.status(404).render(`404`, {
            pageTitle: `Video not found.`, videoNow
        });
    } else if (String(videoNow.owner) !== _id) {
        return res.status(403).redirect(`/`);
    } else {
        return res.render(`geteditvideo`, {
            pageTitle: `Editing: ${videoNow.title}`, videoNow
        });
    }
};
export const postEditVideo=async(req,res)=>{
    const { id } = req.params;
    const { title, description, hashtags }=req.body;
    const videoNow=await videoConstructor.exists({_id:id});
    // video object 를 받는 것이 아니라 true or false 만 받는 것.
    if (!videoNow) {
        return res.status(404).render(`404`, { pageTitle: `Video not found.`, videoNow});
    } else {
        await videoConstructor.findByIdAndUpdate(id, {
            title,
            description,
            hashtags: videoConstructor.formatHashtags(hashtags),
        });
        return res.redirect(`/`);
    }
};
// Delete 삭제
export const deleteVideo=async(req,res)=>{
    const {
        params: { id },
        session: { user: { _id }},
    }=req;
    
    const videoNow=await videoConstructor.findById(id);
    if (!videoNow) {
        return res.status(404).render(`404`, {
            pageTitle: `Video not found.`, videoNow
        });
    } else if (String(videoNow.owner) !== _id) {
        return res.status(403).redirect(`/`);
    } else {
        await videoConstructor.findByIdAndDelete(id);
        videoNow.childComments.forEach(async(commentID)=>{
            await commentContructor.findByIdAndRemove(commentID);
        });
        return res.redirect(`/`);
    }
};
// Uplaod 업로드
export const getUploadVideo=(req,res)=>{
    return res.render(`getuploadvideo`, { pageTitle: 'Upload Video'});
};
export const postUploadVideo=async(req,res)=>{
    // video[0].path 의 http 주소가 \\ 로 작성되어 있어서 videoSchema.pre 에서 \\ 를 /로 바꾸는 함수를 실행하고
    const {
        files: { video, thumbnail:thumb },
        session: { user: { _id } },
        body: { title, description, hashtags },
    }=req;
    try {
        if(thumb===undefined){
            if(video[0].mimetype.split("/")[0]!="video")
                res.status(400).render("getuploadvideo", {
                    pageTitle:"Upload Video",
                    errorMessage:"Please check the file extension.",
                });
        } else {
            if((video[0].mimetype.split("/")[0]!="video") && (thumb[0].mimetype.split("/")[0]!="image"))
                res.status(400).render("getuploadvideo", {
                    pageTitle:"Upload Video",
                    errorMessage:"Please check the file extension.",
                });
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
        return res.redirect(`/`);
    } catch (error) {
        // console.log(`videoController.js : ${error}`);
        res.status(400).render(`getuploadvideo`, {
            pageTitle:'Upload Video',
            errorMessage:error,
        });
    }
};

// to apiRouters
export const registerView=async(req,res)=>{
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
    console.log(videoDB);
    return res.sendStatus(200);
};