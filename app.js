import MediaPipeTracker from './MediaPipeTracker.js';
import VanillaCanvasDrawEngine from './VanillaCanvasDrawEngine.js';
import GameManager from './GameManager.js';

// reference all the things on the browser page
const enableWebcamButton = document.getElementById("webcamButton");;
const trackingButton = document.getElementById("trackerButton");;
const loopButton = document.getElementById("loopButton");;
const video = document.getElementById("webcam");
const canvasElement = document.getElementById("output_canvas");

// Instatiate the MediaPipe / CVProcessor Class  and send it the video tag in it's constructor
let mediaPipe = new MediaPipeTracker(video);

let gm = new GameManager(canvasElement,mediaPipe)

// instantiate the vanilla Draw engine
let de = new VanillaCanvasDrawEngine(canvasElement,mediaPipe, video, gm)



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
            video.addEventListener("loadeddata", onCamStartup); // this event starts the loop
        });
    }
}

// the toggle loop button event handler ( should be just a boolean toggle )
function toggleLooping(event){ de.toggleLoop() }
function toggletracking(event){ de.toggleTracking() }

//  what to do when the camera has finally started up
function onCamStartup(event)
{
    // set the canvas width/height to match the video width/height
    canvasElement.width = video.videoWidth;
    canvasElement.height = video.videoHeight;
    // enable the toggle buttons
    trackingButton.addEventListener("click",toggletracking)
    loopButton.addEventListener("click",toggleLooping)
    // start the loop
    de.loop();
}