alert("Hi");

const up__recording=document.getElementById("up__recording");

const func_recording=async()=>{
    /* [ERROR]regenratorRuntime
        If you want to use async+await in frontend,
        You must launch regeneratorRuntime.
        /* [SOLUTION] Laucn regeneratorRuntime
            npm i regenerator-runtime
        /
    */

    const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: true,
    });
    // console.log(stream);
};


up__recording.addEventListener("click", func_recording);