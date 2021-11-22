console.log("videoPlayer.js on");

const vid__container=document.getElementById("vid__container");
const vid__controller=document.getElementById("vid__controller");

const vid=document.querySelector("video");
const vid__play=document.getElementById("vid__play");
const vid__mute=document.getElementById("vid__mute");
const vid__volume=document.getElementById("vid__volume");
const vid__currentTime=document.getElementById("vid__currentTime");
const vid__totalTime=document.getElementById("vid__totalTime");
const vid__timelime=document.getElementById("vid__timelime");
const vid__fullscreen=document.getElementById("vid__fullscreen");

const vid__play__icon=vid__play.querySelector("i");
const vid__mute__icon=vid__mute.querySelector("i");
const vid__fullscreen__icon=vid__fullscreen.querySelector("i");

let vid__volumeTMP=0.5;
vid.volume=vid__volumeTMP;

const func_formatTime=(seconds)=>{
    return new Date(seconds*1000).toISOString().substr(11,8);
}
const func_playClick=()=>{
    vid.paused ? vid.play() : vid.pause();

    vid__play__icon.className= vid.paused ? "fas fa-play" : "fas fa-pause";
};
const func_muteClick=()=>{
    vid.muted ? vid.muted=false : vid.muted=true;

    vid__mute__icon.className=vid.muted ? "fas fa-volume-mute" : "fas fa-volume-up";

    vid__volume.value= vid.muted ? 0 : vid__volumeTMP;
};
const func_volumeChange=(event)=>{
    const { value }=event.target;

    if(vid.muted){
        vid.muted=false;
        vid__mute__icon.className="fas fa-volume-up";
    }
    
    vid__volumeTMP=value;
    vid.volume=value;
};
const func_timelineChange=(event)=>{
    const { value }=event.target;

    vid.currentTime=value;
}
const func_fullscreen=()=>{
    if(document.fullscreenElement){
        document.exitFullscreen();
        vid__fullscreen__icon.className="fas fa-expand";
    } else {
        vid__container.requestFullscreen();
        vid__fullscreen__icon.className="fas fa-compress";
    }
}

const func_metaUpadte=()=>{
    vid__currentTime.innerText=func_formatTime(Math.floor(vid.currentTime)); // Current
    vid__timelime.value=Math.floor(vid.currentTime);
}
const func_metaData=()=>{
    vid__totalTime.innerText=func_formatTime(Math.floor(vid.duration)); // Total
    vid__timelime.max=Math.floor(vid.duration);
}
const func_videoEnded=()=>{
    const { videoID }=vid__container.dataset;
    fetch(`/api/videos/${videoID}/view`, {
        method: "POST",
    });
}
let vid__controllerTimeout=null; // Hover on vid
let vid__controllerMoveTimeout=null; // Move on vid
const func_hideController=()=>vid__controller.classList.remove("showing");
const func_mousemove=()=>{
    if(vid__controllerTimeout){
        clearTimeout(vid__controllerTimeout);
        vid__controllerTimeout=null;
    }

    if(vid__controllerMoveTimeout){
        clearTimeout(vid__controllerMoveTimeout);
        vid__controllerMoveTimeout=null;
    }

    vid__controller.classList.add("showing");
    vid__controllerMoveTimeout=setTimeout(func_hideController, 1000);
}
const func_mouseleave=()=>{
    vid__controllerTimeout=setTimeout(func_hideController, 1000);
}

const func_keydown=(event)=>{
    const { key }=event;

    switch(key){
        case " ": // 일시정지
            func_playClick();
            break;
        case "Enter": // 전체화면
            func_fullscreen();
            break;
        case "Escape": // 전체화면 해제
            if(document.fullscreenElement){
                document.exitFullscreen();
                vid__fullscreen__icon.className="fas fa-expand";
            }
            break;
    };
}

vid__play.addEventListener("click", func_playClick);
vid__mute.addEventListener("click", func_muteClick);
vid__volume.addEventListener("input",func_volumeChange);
vid__timelime.addEventListener("input",func_timelineChange);
vid__fullscreen.addEventListener("click",func_fullscreen);

vid.addEventListener("click", func_playClick);
vid.addEventListener("timeupdate", func_metaUpadte); // Current Time
vid.addEventListener("loadedmetadata", func_metaData); // Total Time
vid.addEventListener("ended", func_videoEnded);

vid__container.addEventListener("mousemove",func_mousemove);
vid__container.addEventListener("mouseleave",func_mouseleave);

document.addEventListener("keydown", func_keydown);