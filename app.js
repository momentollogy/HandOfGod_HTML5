import MediaPipeTracker from './MediaPipeTracker.js';
import VanillaCanvasDrawEngine from './VanillaCanvasDrawEngine.js';
import GameManager from './GameManager.js';
import MediaUtility from './Utility.js';


// reference all the things on the HTML 
const enableWebcamButton = document.getElementById("webcamButton");;
const video = document.getElementById("webcam");
//const mediaUtility = new MediaUtility(video); 

const canvasElement = document.getElementById("output_canvas");

// Instatiate the MediaPipe / CVProcessor Class  and send it the video tag in it's constructor
let mediaPipe = new MediaPipeTracker(video);

let gm = new GameManager(canvasElement,mediaPipe)

// instantiate the vanilla Draw engine
let de = new VanillaCanvasDrawEngine(canvasElement,mediaPipe, video, gm)


// Define a function to handle stream changes // New Line
function handleStreamChange(stream) {
    mediaPipe.updateStream(stream);  // New Line
}

const mediaUtility = new MediaUtility(video, handleStreamChange); //new?


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
async function enableCam(event) {
    await mediaUtility.initCameraSelection();  // Add this line
    mediaUtility.createFullscreenButton();  // Add this line
    video.srcObject = mediaUtility.videoElement.srcObject;
    video.addEventListener("User_Webcam_Change",()=> {
        console.log('Event triggered');
        onCamStartup();
    })


    video.addEventListener("loadeddata", async () => {  // Make this function async
        onCamStartup(event);
       
    });
   
}



//  what to do when the camera has finally started up
function onCamStartup(event)
{
    // set the canvas width/height to match the video width/height
    canvasElement.width = video.videoWidth;
    canvasElement.height = video.videoHeight; 
    // start the loop
    de.loop();
}