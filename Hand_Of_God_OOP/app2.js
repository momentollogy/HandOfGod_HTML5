// Import necessary modules
//import MediaPipeTracker from './MediaPipeTracker.js';
import DrawEngine from './DrawEngine.js';
import GameManager from './GameManager.js';

// Reference DOM elements
const enableWebcamButton = document.getElementById("webcamButton");
const fullButton = document.getElementById("fullButton");
const video = document.getElementById("webcam");
const mpcanvas = document.getElementById("mediaPipe_canvas");
const canvas = document.getElementById("output_canvas");
const container = document.getElementById("container");
const webcamList = document.getElementById("webcamList");

// Initialize selected camera ID
let selectedCameraId = null;

// Set canvas dimensions
mpcanvas.width = 1920;
mpcanvas.height = 1080;
canvas.width = 1920;
canvas.height = 1080;

// Create a GameManager instance
let gm = new GameManager();

// Create a MediaPipeTracker instance and configure it
//let mp = MediaPipeTracker.getInstance();
//mp.setVid(video);
//mp.createLandmarks();

// Create a DrawEngine instance and set the GameManager
let de = DrawEngine.getInstance();
de.setGameManager(gm);

// Check if webcam access is supported and handle the button accordingly
if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
  enableWebcamButton.addEventListener("click", onEnableCamButtonClicked);
} else {
  enableWebcamButton.removeEventListener("click", onEnableCamButtonClicked);
  enableWebcamButton.innerText = "Camera Not Found";
}

// Enable the live webcam view and start detection
function onEnableCamButtonClicked(event) {
  if (!video.srcObject) {
    const videoConstraints = {
      deviceId: selectedCameraId,
      width: 1920,
      height: 1080,
    };

    navigator.mediaDevices.getUserMedia({ video: videoConstraints }).then((stream) => {
      video.srcObject = stream;
      video.addEventListener("loadeddata", onCamStartup);
    });
  } else {
    toggleVideoDisplay();
  }
}

// Initialize the webcam and elements when the camera starts up
function onCamStartup(event) {
  container.style.width = "75%";
  video.style.width = "100%";
  mpcanvas.width = video.videoWidth;
  mpcanvas.height = video.videoHeight;
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  canvas.style.width = "100%";
  mpcanvas.style.width = "100%";
  fullButton.style.display = "inline";

  // Handle full-screen button click
  fullButton.addEventListener('click', () => {
    container.requestFullscreen().then(setMirroring);
  });

  setMirroring();
  de.loop();
}

// Request camera permission and populate the webcam list
function requestCameraPermission() {
  return navigator.mediaDevices.getUserMedia({ video: true })
    .then((stream) => {
      stream.getTracks().forEach(track => track.stop());
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

// Request camera permission and populate the webcam list
requestCameraPermission()
  .then(getAvailableWebcams)
  .catch(error => {
    console.error("Camera permissions not granted:", error);
  });

// Change event listener for webcam selection dropdown
webcamList.addEventListener('change', (event) => {
  selectedCameraId = event.target.value;
});

// Apply a mirroring effect to the video and canvas
function setMirroring() {
  mpcanvas.style.transform = 'scaleX(-1)';
  video.style.transform = 'scaleX(-1)';
}

// Toggle video display (show/hide)
function toggleVideoDisplay() {
  video.style.display = (video.style.display === "none") ? "block" : "none";
}
