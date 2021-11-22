console.log("commentSection.js on");

const videoContainer=document.getElementById("vid__container");
const form=document.getElementById("commentForm");

const deleteCommentBtn=document.querySelector(".deleteBtn");

const addComemntELement=(comment,videoID)=>{
    // videoComments > tagList > tagIcon, tagDiv > tagSpanComment, tagSpanMetaData
    const vidoeComments=document.querySelector(".video__comments ul");
    const { username }=vidoeComments.dataset;
    const tagList=document.createElement("li");
    const tagIcon=document.createElement("i");
    const tagDeleteIcon=document.createElement("i");
    const tagDiv=document.createElement("div");
    const tagSpanComment=document.createElement("span");
    const tagSpanMetaData=document.createElement("span");

    tagIcon.className="fas fa-comment";
    tagDeleteIcon.className="deleteBtn fas fa-trash";
    tagDeleteIcon.dataset.videoID=videoID;
    tagSpanComment.innerText=comment;
    tagSpanMetaData.innerText=`${username} / 지금`

    tagDiv.appendChild(tagSpanComment);
    tagDiv.appendChild(tagSpanMetaData);
    
    tagList.appendChild(tagIcon);
    tagList.appendChild(tagDiv);
    tagList.appendChild(tagDeleteIcon);

    vidoeComments.appendChild(tagList);
};
const createComment=async(event)=>{
    event.preventDefault();
    const textarea=form.querySelector("textarea");
    const comment=textarea.value;
    const videoID=videoContainer.dataset.videoID;

    if(comment==="") return;
    
    // fetch 를 통해 req 를 보내고 우리는 response 를 받았다.
    // 구조분해할당에 따라서 response 안의 status 를 변수 선언하였다.
    const { status }=await fetch(`/api/videos/${videoID}/comment`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({ comment })
    });
    if(status===201){
        addComemntELement(comment,videoID);
    }

    textarea.value="";
    // window.location.reload();
};
const deleteComment=async(event)=>{
    event.preventDefault();
    const { commentID, ownerID, videoID }=event.target.dataset;
    await fetch(`/api/videos/${videoID}/comment/delete`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({ commentID, ownerID, videoID })
    });
    window.location.reload();
};
if(form){
    form.addEventListener("submit",createComment);
}
deleteCommentBtn.addEventListener("click",deleteComment);