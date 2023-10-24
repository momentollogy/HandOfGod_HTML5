import MediaPipeTracker from './MediaPipeTracker.js';
import VanillaCanvasDrawEngine from './VanillaCanvasDrawEngine.js';
import GameManager from './GameManager.js';

// reference all the things on the browser page
const enableWebcamButton = document.getElementById("webcamButton");;
const fullButton = document.getElementById("fullButton");;
//const trackingButton = document.getElementById("trackerButton");;
//const loopButton = document.getElementById("loopButton");;
const video = document.getElementById("webcam");
const mpCanvasElement = document.getElementById("mediaPipe_canvas");
const canvasElement = document.getElementById("output_canvas");
const container = document.getElementById("container");

// Instatiate the MediaPipe / CVProcessor Class  and send it the video tag in it's constructor
let mediaPipe = new MediaPipeTracker(video);
mpCanvasElement.width=1920;
mpCanvasElement.height=1080;
canvasElement.width=1920;
canvasElement.height=1080;

let gm = new GameManager(canvasElement,mediaPipe)

// instantiate the vanilla Draw engine
let de = new VanillaCanvasDrawEngine(mpCanvasElement, canvasElement,mediaPipe, video, gm)

gm.setDrawEngine(de); // tell the game manager about the draw engine

// Check if webcam access is supported.  If not: disable the button and change it's text 
const hasGetUserMedia = () => { var _a; return !!((_a = navigator.mediaDevices) === null || _a === void 0 ? void 0 : _a.getUserMedia); };
if (hasGetUserMedia()) {
    enableWebcamButton.addEventListener("click", onEnableCamButtonClicked);
}
else {
    enableWebcamButton.removeEventListener("click", onEnableCamButtonClicked);
    enableWebcamButton.innerText = "Camera Not Fuond";
}

// Enable the live webcam view and start detection.
function onEnableCamButtonClicked(event) {
    // If the webcam stream is NOT running then activate the webcam stream. This asks the user for permission to use the camera, if Granted the browser returns a MEDIASTREAM object
    if(!video.srcObject)
    {
        const videoConstraints = { width: 1920, height: 1080 };

        navigator.mediaDevices.getUserMedia( {video:videoConstraints} ).then( (stream) => {
            video.srcObject = stream;
            video.addEventListener("loadeddata", onCamStartup); // this event starts the loop
        });
    }else{  // this else statement toggles the video source's display once the stream has been created
        if(video.style.display =="none"){video.style.display ="block"}
        else{video.style.display ="none"}
    }
}

// when the camera finally starts up
function onCamStartup(event)
{
    container.style.width = "100%";
    video.style.width = "100%";
    mpCanvasElement.width = video.videoWidth;
    mpCanvasElement.height = video.videoHeight;
    canvasElement.width = video.videoWidth;
    canvasElement.height = video.videoHeight;
    canvasElement.style.width = "100%";
    mpCanvasElement.style.width = "100%";
    fullButton.style.display="inline";

    // when the fullScreenButon is pressed..  it tells the container div to go full screen, then runs the setMirroring() function
    fullButton.addEventListener('click', () => {
        container.requestFullscreen().then(setMirroring);
    });

    setMirroring();
    de.loop();
}

// sets the video & canvas to be in "mirror mode"
function setMirroring()
{
    mpCanvasElement.style.transform = 'scaleX(-1)';
    video.style.transform = 'scaleX(-1)';
}

