import videoConstructor from "../models/Video";
import userConstructor from "../models/User";

export const rootHotVideo=async(req,res)=>{
    const videoConstructors=await videoConstructor
    .find({})
    .sort({ creationAt: `desc`})
    .populate(`owner`);
    return res.render(`home`, { pageTitle: `Home`, videoConstructors}); 
}
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
}

export const seeVideo=async(req,res)=>{
    const { id } = req.params;
    const videoNow=await videoConstructor.findById(id).populate(`owner`);
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
}
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
}
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
}
// Delete 삭제
export const deleteVideo=async(req,res)=>{
    const {
        params: { id },
        session: { user: { _id }},
    }=req;

    // const videoNow=await videoConstructor.findByIdAndDelete(id);

    const videoNow=await videoConstructor.findById(id);
    if (!videoNow) {
        return res.status(404).render(`404`, {
            pageTitle: `Video not found.`, videoNow
        });
    } else if (String(videoNow.owner) !== _id) {
        return res.status(403).redirect(`/`);
    } else {
        await videoConstructor.findByIdAndDelete(id);
        return res.redirect(`/`);
    }

    return res.redirect(`/`);
}
// Uplaod 업로드
export const getUploadVideo=(req,res)=>{
    return res.render(`getuploadvideo`, { pageTitle: 'Upload Video'});
}
export const postUploadVideo=async(req,res)=>{
    // video[0].path 의 http 주소가 \\ 로 작성되어 있어서 videoSchema.pre 에서 \\ 를 /로 바꾸는 함수를 실행하고
    const {
        files: { video, thumbnail:thumb },
        session: { user: { _id } },
        body: { title, description, hashtags },
    }=req;
    try {
        if((video[0].mimetype.split("/")[0]!="video") && (thumb[0].mimetype.split("/")[0]!="image")){
            res.status(400).render(`getuploadvideo`, {
                pageTitle:'Upload Video',
                errorMessage:"Please check the file extension.",
            });
        }

        const uploadVideo=await videoConstructor.create({
            title,
            description,
            fileUrl:videoConstructor.formatUrlChanges(video[0].path,),
            thumbUrl:videoConstructor.formatUrlChanges(thumb[0].path),
            owner: _id,
            hashtags:videoConstructor.formatHashtags(hashtags),
        });
        const userDB = await userConstructor.findById(_id);
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
}

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
}