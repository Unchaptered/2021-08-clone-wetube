console.log("commentSection.js on");

const videoContainer=document.getElementById("vid__container");

const form=document.getElementById("commentForm");

const handleSubmit=(event)=>{
    event.preventDefault();
    const textarea=form.querySelector("textarea");
    const btn=form.querySelector("button");


    const text=textarea.value;
    const video=videoContainer.dataset.videoID;
};

if(form){
    form.addEventListener("click",handleSubmit);
}