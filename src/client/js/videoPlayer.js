console.log("videoPlayer.js on");

const container=document.getElementById("vid__container");
const controller=document.getElementById("vid__controller");

const vid=container.querySelector("video");
const playBtn=document.getElementById("vid__play");
const muteBtn=document.getElementById("vid__mute");
const volumeInput=document.getElementById("vid__volume");
const currentTimeInput=document.getElementById("vid__currentTime");
const totalTimeInput=document.getElementById("vid__totalTime");
const timelineInput=document.getElementById("vid__timelime");
const fullscreenBtn=document.getElementById("vid__fullscreen");

const playBtnIcon=playBtn.querySelector("i");
const muteBtnIcon=muteBtn.querySelector("i");
const fullscreenBtnIcon=fullscreenBtn.querySelector("i");

let vidVolumneTmp=0.5;
vid.volume=vidVolumneTmp;

const setTimeformat=(seconds)=>{
    return new Date(seconds*1000).toISOString().substr(11,8);
}
const setPlayMode=()=>{
    vid.paused ? vid.play() : vid.pause();

    playBtnIcon.className= vid.paused ? "fas fa-play" : "fas fa-pause";
};
const setMuteMode=()=>{
    vid.muted ? vid.muted=false : vid.muted=true;

    muteBtnIcon.className=vid.muted ? "fas fa-volume-mute" : "fas fa-volume-up";

    volumeInput.value= vid.muted ? 0 : vidVolumneTmp;
};
const setVolumeChange=(event)=>{
    const { value }=event.target;

    if(vid.muted){
        vid.muted=false;
        muteBtnIcon.className="fas fa-volume-up";
    }
    
    vidVolumneTmp=value;
    vid.volume=value;
};
const setTimelineChange=(event)=>{
    const { value }=event.target;

    vid.currentTime=value;
}
const setFullscreenChange=()=>{
    if(document.fullscreenElement){
        document.exitFullscreen();
        fullscreenBtnIcon.className="fas fa-expand";
    } else {
        container.requestFullscreen();
        fullscreenBtnIcon.className="fas fa-compress";
    }
}

const videoMetaDataUpadte=()=>{
    currentTimeInput.innerText=setTimeformat(Math.floor(vid.currentTime)); // Current
    timelineInput.value=Math.floor(vid.currentTime);
}
const videoMetaData=()=>{
    totalTimeInput.innerText=setTimeformat(Math.floor(vid.duration)); // Total
    timelineInput.max=Math.floor(vid.duration);
}
const videoEnded=()=>{
    const { videoID }=container.dataset;
    fetch(`/api/videos/${videoID}/view`, {
        method: "POST",
    });
}

let controllerOnTimeout=null;
let controllerLeaveTimeout=null;
const hideController=()=>controller.classList.remove("showing");
const mouseOver=()=>{
    if(controllerOnTimeout){
        clearTimeout(controllerOnTimeout);
        controllerOnTimeout=null;
    }

    if(controllerLeaveTimeout){
        clearTimeout(controllerLeaveTimeout);
        controllerLeaveTimeout=null;
    }

    controller.classList.add("showing");
    controllerLeaveTimeout=setTimeout(hideController, 1000);
};
const mouseLeave=()=>{
    controllerOnTimeout=setTimeout(hideController, 1000);
};
const shortcutKey=(event)=>{
    const { key }=event;

    switch(key){
        case " ": // 일시정지
            setPlayMode();
            break;
        case "Enter": // 전체화면
            setFullscreenChange();
            break;
        case "Escape": // 전체화면 해제
            if(document.fullscreenElement){
                document.exitFullscreen();
                fullscreenBtnIcon.className="fas fa-expand";
            }
            break;
    };
};

playBtn.addEventListener("click", setPlayMode);
muteBtn.addEventListener("click", setMuteMode);
volumeInput.addEventListener("input",setVolumeChange);
timelineInput.addEventListener("input",setTimelineChange);
fullscreenBtn.addEventListener("click",setFullscreenChange);

vid.addEventListener("click", setPlayMode);
vid.addEventListener("timeupdate", videoMetaDataUpadte); // Current Time
vid.addEventListener("loadedmetadata", videoMetaData); // Total Time
vid.addEventListener("ended", videoEnded);

container.addEventListener("mousemove",mouseOver);
container.addEventListener("mouseleave",mouseLeave);

document.addEventListener("keydown", shortcutKey);