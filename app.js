
import { HandLandmarker, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0";

let runningMode = "VIDEO";
let enableWebcamButton;
let trackingButton;
let tracking = true;


// Before we can use HandLandmarker class we must wait for it to finish loading. Machine Learning models can be large and take a moment to get everything needed to run.
let handLandmarker = undefined;
const createHandLandmarker = async () => {
    const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm");
    handLandmarker = await HandLandmarker.createFromOptions(vision, {
        baseOptions: {
            modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
            delegate: "GPU"
        },
        runningMode: runningMode,
        numHands: 2
    });

};
createHandLandmarker();





// Make the tracking button work
trackingButton = document.getElementById("trackerButton");
trackingButton.addEventListener("click",toggletracking)
function toggletracking(event){ tracking = !tracking; predictWebcam(); }





const video = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");

enableWebcamButton = document.getElementById("webcamButton");

// Check if webcam access is supported.  If not: disable the button and change it's text 
const hasGetUserMedia = () => { var _a; return !!((_a = navigator.mediaDevices) === null || _a === void 0 ? void 0 : _a.getUserMedia); };
if (hasGetUserMedia()) {
    enableWebcamButton.addEventListener("click", enableCam);
}
else {
    enableWebcamButton.removeEventListener("click", enableCam);
    enableWebcamButton.innerText = "Camera Not Fuond";
}





// Enable the live webcam view and start detection.
function enableCam(event) {
    
    if (!handLandmarker) {
        console.log("Wait! objectDetector not loaded yet.");
        return;
    }

    // Activate the webcam stream. This asks the user for permission to use the camera, if Granted the browser returns a MEDIASTREAM object
    navigator.mediaDevices.getUserMedia( {video:true} ).then( (stream) => {
        video.srcObject = stream;
        video.addEventListener("loadeddata", predictWebcam);
    });
    enableWebcamButton.removeEventListener("click", enableCam);
    //console.log(video.srcObject);
}





let lastVideoTime = -1;
let results = undefined;
//console.log(video);
async function predictWebcam() 
{
    //console.log("predictiWebcam() happening!!!")
    canvasElement.style.width = video.videoWidth;
    canvasElement.style.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvasElement.height = video.videoHeight;

    let startTimeMs = performance.now();
    if (lastVideoTime !== video.currentTime) {
        lastVideoTime = video.currentTime;
        results = handLandmarker.detectForVideo(video, startTimeMs);
    }
    canvasCtx.save();
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    if (results.landmarks) {
        for (const landmarks of results.landmarks) {
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
                color: "#00FF00",
                lineWidth: 1
            });
            drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: .1 });
        }
    }
    canvasCtx.restore();
    // Call this function again to keep predicting when the browser is ready.
    if (tracking) {
        window.requestAnimationFrame(predictWebcam);
    }else{
        canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
    }
}