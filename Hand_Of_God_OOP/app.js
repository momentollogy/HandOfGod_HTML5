import MediaPipeTracker from './MediaPipeTracker.js';
import DrawEngine from './DrawEngine.js';
import GameManager from './GameManager.js';

// reference all the things on the browser page
const enableWebcamButton = document.getElementById("webcamButton");;
const fullButton = document.getElementById("fullButton");;
const video = document.getElementById("webcam");
const mpcanvas = document.getElementById("mediaPipe_canvas");
const canvas = document.getElementById("output_canvas");
const container = document.getElementById("container");


mpcanvas.width=1920;
mpcanvas.height=1080;
canvas.width=1920;
canvas.height=1080;



let gm = new GameManager()

let mp = MediaPipeTracker.getInstance();
mp.setVid(video);
mp.createLandmarks();

let de = DrawEngine.getInstance();
de.setGameManager(gm);



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
    container.style.width = "75%";
    video.style.width = "100%";
    mpcanvas.width = video.videoWidth;
    mpcanvas.height = video.videoHeight;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    canvas.style.width = "100%";
    mpcanvas.style.width = "100%";
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
    mpcanvas.style.transform = 'scaleX(-1)';
    video.style.transform = 'scaleX(-1)';
}

