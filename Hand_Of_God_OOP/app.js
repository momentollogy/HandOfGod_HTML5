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

//const selectCamButton = document.getElementById("selectCamButton");
const webcamList = document.getElementById("webcamList");

let selectedCameraId = null;


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
/*
function onCameraSelectionChanged(event) {
    selectedCameraId = webcamList.value;  // Store the selected camera ID
}
*/
// Enable the live webcam view and start detection.
function onEnableCamButtonClicked(event) {
    // If the webcam stream is NOT running then activate the webcam stream.
    if(!video.srcObject) {
        const videoConstraints = {
            deviceId: selectedCameraId,  // use the selected camera
            width: 1920, 
            height: 1080 
        };

        navigator.mediaDevices.getUserMedia({video: videoConstraints}).then((stream) => {
            video.srcObject = stream;
            video.addEventListener("loadeddata", onCamStartup);  // this event starts the loop
        });
    } else { 
        // this else statement toggles the video source's display once the stream has been created
        if(video.style.display == "none") {video.style.display = "block"}
        else {video.style.display = "none"}
    }
}

// when the camera finally starts up
function onCamStartup(event)
{
    console.log("camera starting up!!");
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



function requestCameraPermission() {
    return navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        // Once we get the stream, we can close it. We only needed the permissions.
        let tracks = stream.getTracks();
        tracks.forEach(track => track.stop());
    });
}

function getAvailableWebcams() {
    webcamList.innerHTML = '';

    navigator.mediaDevices.enumerateDevices().then(devices => {
        devices.forEach(device => {
            if (device.kind === 'videoinput') {
                const option = document.createElement('option');
                option.value = device.deviceId;
                option.text = device.label || `Camera ${webcamList.length + 1}`;
                webcamList.appendChild(option);
            }
        });

        if (webcamList.options.length > 0) {
            selectedCameraId = webcamList.options[0].value;
        }
    });
}


requestCameraPermission()
    .then(() => {
        getAvailableWebcams();
    })
    .catch(error => {
        console.error("Camera permissions not granted:", error);
    });



// Change event listener for dropdown to switch webcams.
webcamList.addEventListener('change', (event) => {
    selectedCameraId = event.target.value;  // Store the selected camera ID
});



// sets the video & canvas to be in "mirror mode"
function setMirroring()
{
    mpcanvas.style.transform = 'scaleX(-1)';
    video.style.transform = 'scaleX(-1)';
}

