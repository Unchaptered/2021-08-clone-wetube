import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";

const recordBtn=document.getElementById("recordBtn");
const video=document.getElementById("videoPreview");

let stream;
let recorder;
let webmFile;

/*  ffmpeg 를 web assembly module 을 통해서 브라우저에서 사용 중이다.
    ffmpeg 관련 메서드의 키워드들은 관련 문서를 확인하자.
    관련 프로세스는 해당 줄에 대한 주석과 동시에 최하단에 달아두었다.
    
    Blob 은 배열 속의 배열을 담는 객체이며, FS는 가상 컴퓨터의 개념이다.
    이에 대해서 개념적 설명은 Unchaptered 블로그 포스트를 참고하자.
    Blob 관련 링크 : https://velog.io/@unchapterd/JS-Blob
    ffmepg 관련 링크 : https://velog.io/@unchapterd/ffmepg
*/

const files={
    input: "recording.webm",
    output: "output.mp4",
    thumb: "thumbnail.jpg",
};
const recordDownload=(fileUrl,fileName)=>{
    const a=document.createElement("a");
    a.href=fileUrl;
    a.download=fileName;
    document.body.appendChild(a);
    a.click();
};
const recordFfmpeg=async()=>{
    recordBtn.removeEventListener("click",recordFfmpeg);
    recordBtn.innerText="Transcoding...";
    recordBtn.disabled=true;

    const ffmpeg=createFFmpeg({corePath:"/convert/ffmpeg-core.js",log:true});
    await ffmpeg.load();

    ffmpeg.FS("writeFile",files.input,await fetchFile(webmFile));

    await ffmpeg.run("-i",files.input, "-r", "60", files.output);
    await ffmpeg.run("-i",files.input, "-ss", "00:00:01", "-frames:v", "1", files.thumb);

    const mp4File=ffmpeg.FS("readFile", files.output);
    const mp4Blob=new Blob([mp4File.buffer],{ type:"video/mp4" });
    const mp4Url=URL.createObjectURL(mp4Blob);
    
    const thumbFile=ffmpeg.FS("readFile", files.thumb);
    const thumbBlob=new Blob([thumbFile.buffer], { tpye:"image/jpg" });
    const thumbUrl=URL.createObjectURL(thumbBlob);

    // recordDownload(mp4Url,"MyRecording.mp4");
    // recordDownload(thumbUrl,"MyThumbnail.jpg");

    const mp4A=document.createElement("a");
    mp4A.href=mp4Url;
    mp4A.download="MyRecording.mp4";
    document.body.appendChild(mp4A); 
    mp4A.click();

    const thumbA=document.createElement("a");
    thumbA.href=thumbUrl;
    thumbA.download="MyThumbnail.jpg";
    document.body.appendChild(thumbA); 
    thumbA.click();

    ffmpeg.FS("unlink", files.output);
    ffmpeg.FS("unlink", files.thumb);
    ffmpeg.FS("unlink", files.input);
    URL.revokeObjectURL(mp4Url);
    URL.revokeObjectURL(thumbUrl);
    URL.revokeObjectURL(webmFile);

    recordBtn.addEventListener("click",recordFfmpeg);
    recordBtn.innerText="Download Recording";
    recordBtn.disabled=false;

};
const recordStop=()=>{
    recordBtn.innerText="Download Recording";
    recordBtn.removeEventListener("click", recordStop);
    recordBtn.addEventListener("click", recordFfmpeg);

    recorder.stop();
};
const recordStart=()=>{
    recordBtn.disabled=true;
    setInterval(()=>{recordBtn.disabled=false},3000);
    
    recordBtn.innerText="Stop Recording";
    recordBtn.removeEventListener("click", recordStart);
    recordBtn.addEventListener("click", recordStop);

    recorder=new MediaRecorder(stream, { mimeType: "video/webm" });
    recorder.ondataavailable=(event)=>{
        webmFile=URL.createObjectURL(event.data);
        video.srcObject=null;
        video.src=webmFile;
        video.loop=true;
        video.play();
        /*  craeteObjectURL 은 브라우제서 메모리에서만 접근 가능한 URL 을 생성
            실제로는 존재하지 않음
        */
    };
    recorder.start();
};
const recordPreview=async()=>{
    stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true
    });
    video.srcObject=stream;
    video.volume=0;
    video.play();
};
recordPreview();

recordBtn.addEventListener("click", recordStart);