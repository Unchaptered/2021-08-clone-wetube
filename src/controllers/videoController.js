import videoConstructor from "../models/Video";

export const globalHotVideo=async(req,res)=>{
    const videoConstructors=await videoConstructor.find({}).sort({ creationAt: "asc"});
    return res.render(`home`, { pageTitle: `Home`, videoConstructors}); 
}
export const globalSearchVideo=async(req,res)=>{
    const { keyword }=req.query;
    let videoSearch=[];
    if(keyword){
        videoSearch=await videoConstructor.find({
            title: {
                $regex: new RegExp(`${keyword}$`, `i`),
                // i means 대소문자 구분안함
            },
        });
    }
    return res.render(`search`, { pageTitle: 'Search Video', videoSearch });
}

export const seeVideo=async(req,res)=>{
    const { id } = req.params;
    const videoNow=await videoConstructor.findById(id);
    // console.log(videoNow);
    if (!videoNow){
        return res.render(`404`, { pageTitle: `Video not found.`, videoNow});
    } else {
        return res.render(`seevideo`, { pageTitle: `See: ${videoNow.title}`, videoNow});
    }
}
// Edit 편집
export const getEditVideo=async(req,res)=>{
    const { id } = req.params;
    const videoNow=await videoConstructor.findById(id);
    if (!videoNow) {
        return res.render(`404`, { pageTitle: `Video not found.`, videoNow});
    } else {
        return res.render(`geteditvideo`, { pageTitle: `Editing: ${videoNow.title}`, videoNow});
    }
}
export const postEditVideo=async(req,res)=>{
    const { id } = req.params;
    const { title, description, hashtags }=req.body;
    const videoNow=await videoConstructor.exists({_id:id});
    // video object 를 받는 것이 아니라 true or false 만 받는 것.
    if (!videoNow) {
        return res.render(`404`, { pageTitle: `Video not found.`, videoNow});
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
    const { id }=req.params;
    await videoConstructor.findByIdAndDelete(id);
    return res.redirect("/");
}
// Uplaod 업로드
export const getUploadVideo=(req,res)=>{
    return res.render(`getuploadvideo`, { pageTitle: 'Upload Video'});
}
export const postUploadVideo=async(req,res)=>{
    const { title, description, hashtags }=req.body;
    try {
        await videoConstructor.create({
            title,
            description,
            hashtags:videoConstructor.formatHashtags(hashtags),
        });
        // Here We will add a video to the videos array
        return res.redirect(`/`);
    } catch (error) {
        // console.log(`videoController.js : ${error}`);
        res.render(`getuploadvideo`, {
            pageTitle:'Upload Video',
            errorMessage:error,
        });
    }
}
