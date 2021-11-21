console.log("commentSection.js on");

const videoContainer=document.getElementById("vid__container");

const form=document.getElementById("commentForm");

const handleSubmit=(event)=>{
    event.preventDefault();
    const textarea=form.querySelector("textarea");
    const comment=textarea.value;
    const videoID=videoContainer.dataset.videoID;

    if(comment==="") return;
    
    fetch(`/api/videos/${videoID}/comment`,{
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body:JSON.stringify({ comment })
    });

    textarea.value="";
};

if(form){
    form.addEventListener("submit",handleSubmit);
}