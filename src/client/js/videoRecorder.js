console.log("vidoeRecorder.js on");

const startBtn=document.getElementById("startBtn");
const video=document.getElementById("preview");

let stream;
let recorder;
let recordVideo;

const downRecord=()=>{
    const a=document.createElement("a");
    a.href=recordVideo;
    a.download="MyRecording.webm";
    document.body.appendChild(a); 
    a.click();

    console.log("다운로드!");
};
const stopRecord=()=>{
    startBtn.innerText="Download Recording";
    startBtn.removeEventListener("click", stopRecord);
    startBtn.addEventListener("click", downRecord);

    recorder.stop();
};
const startRecord=()=>{
    startBtn.innerText="Stop Recording";
    startBtn.removeEventListener("click", startRecord);
    startBtn.addEventListener("click", stopRecord);

    recorder=new MediaRecorder(stream, { mimeType: "video/webm" });
    recorder.ondataavailable=(event)=>{
        recordVideo=URL.createObjectURL(event.data);
        video.srcObject=null;
        video.src=recordVideo;
        video.loop=true;
        video.play();
        /*  craeteObjectURL 은 브라우제서 메모리에서만 접근 가능한 URL 을 생성
            실제로는 존재하지 않음
        */
    };
    recorder.start();
};

startBtn.addEventListener("click", startRecord);

const preview=async()=>{
    /* [ERROR]regenratorRuntime
        If you want to use async+await in frontend,
        You must launch regeneratorRuntime.
        /* [SOLUTION] Laucn regeneratorRuntime
            npm i regenerator-runtime
        /
    */

    stream = await navigator.mediaDevices.getUserMedia({
        audio: false,
        video: true,
    });
    video.srcObject=stream;
    video.play();
};

preview();