
import { HandLandmarker, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.6";




// reference all the things on the browser page
const enableWebcamButton = document.getElementById("webcamButton");;
const trackingButton = document.getElementById("trackerButton");;
const video = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas");
const canvasCtx = canvasElement.getContext("2d");

// define variables
let tracking = true;
let runningMode = "VIDEO";
let handLandmarker = undefined;
let lastVideoTime = -1;
let results = undefined;
let xVal = 0;




// Before we can use HandLandmarker class we must wait for it to finish loading. Machine Learning models can be large and take a moment to get everything needed to run.
const createHandLandmarker = async () => {
    const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.6/wasm");
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
trackingButton.addEventListener("click",toggletracking)
function toggletracking(event){ tracking = !tracking; loop(); }






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

    // If the webcam stream is NOT running then activate the webcam stream. This asks the user for permission to use the camera, if Granted the browser returns a MEDIASTREAM object
    if(!video.srcObject)
    {
        navigator.mediaDevices.getUserMedia( {video:true} ).then( (stream) => {
            video.srcObject = stream;
            video.addEventListener("loadeddata", initCam); // this event starts the loop
        });
    }
}

//  what to do when the camera has finally started up
function initCam(event)
{
    // set the canvas width/height to match the video width/height
    canvasElement.width = video.videoWidth;
    canvasElement.height = video.videoHeight;
    
    // start the loop
    loop();
}



// clears the canvas of all visual elements
function clearCanvas()
{
    canvasCtx.clearRect(0, 0, canvasElement.width, canvasElement.height);
}


// asks the HandLandmarker to detect the current frame and uses mediapipes drawConnectors and drawLandmarks methods to draw the hands
function drawHands()
{
    // if the results are NOT empty ( ie.. hands off screen ) this draws the landmarks using mediapipes methods: drawConnectors and drawLandmarks
    if (results.landmarks) {
        for (const landmarks of results.landmarks) {
            drawConnectors(canvasCtx, landmarks, HAND_CONNECTIONS, {
                color: "#00FF00",
                lineWidth: 1
            });
            drawLandmarks(canvasCtx, landmarks, { color: "#FF0000", lineWidth: .1 });   
        }
    }
}


function getResultsOfHandLandmarkTracker()
{
    // check if the video frame has updated, and if so: generate a new set of landmark results
    let framesSinceStart = performance.now(); // Get the current Broswer frame number since the app started
    if (lastVideoTime !== video.currentTime) { //If brower refresh rate is faster than video rate dont draw past past that rate ie 30fps
        lastVideoTime = video.currentTime;
        results = handLandmarker.detectForVideo(video, framesSinceStart); //*CALULATE HAND DETECTION the results of the current (in memory)
    }
}


// just drawing a circle for now, just to prove the concept
function drawUI()
{
    //xVal += 1; if (xVal > canvasElement.width){xVal = -128;}
    //canvasCtx.font = "30px Arial";
    //canvasCtx.strokeText("Bubble Menu",30,30)
    const bub = document.getElementById("bubblePic");
    canvasCtx.drawImage(bub, xVal, 50, 128, 128 );
}


// import and use the current level.   This will eventually need to be moved to a LevelManager or the GameManager etc..
import Level_01 from './Level_01.js'
let currentLevel = new Level_01(results, canvasElement, canvasCtx)


// the browser loop
async function loop() 
{
    getResultsOfHandLandmarkTracker() // this captures hand lanmarks in the "results" variable
    
    clearCanvas()
    drawHands()
    currentLevel.level_loop(results,canvasElement,canvasCtx);
    drawUI()

    if (tracking) {
        window.requestAnimationFrame(loop);
    }else{
        clearCanvas()
    }
}