
// Import necessary modules
import MediaPipeTracker from './MediaPipeTracker.js';
import DrawEngine from './DrawEngine.js';
import GameManager from './GameManager.js';


// Add this right after your imports
function debounce(func, wait) {
  let timeout;
  return function() {
      const context = this, args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(context, args), wait);
  };
}

let de;

// Reference DOM elements
const enableWebcamButton = document.getElementById("webcamButton");
const fullButton = document.getElementById("fullButton");
const video = document.getElementById("webcam");
const mpcanvas = document.getElementById("mediaPipe_canvas");
const canvas = document.getElementById("output_canvas");
const container = document.getElementById("container");
const webcamList = document.getElementById("webcamList");

canvas.style.display = 'none';
fullButton.style.display = 'none';

// Initialize selected camera ID - incorrect?
let selectedCameraId = null;

// Set the canvas dimensions dynamically
function setCanvasSize(callback) 
{
  const videoWidth = video.videoWidth || window.innerWidth;
  const videoHeight = video.videoHeight || window.innerHeight;

  mpcanvas.width = videoWidth;
  mpcanvas.height = videoHeight;
  canvas.width = videoWidth;
  canvas.height = videoHeight;

    // Update button positions - assuming you have this function
   // updateButtonPositions();

    // Execute the callback function if it's provided
    if (callback && typeof callback === 'function') {
      callback();
  }

  //if (levelTitlePageInstance) {
  //  levelTitlePageInstance.updateButtonPositions();
 // }
}

// Add this after the setCanvasSize function
window.addEventListener('resize', debounce(function() {
  setCanvasSize(initializeGameComponents);
}, 250)); // 250 milliseconds delay




function initializeGameComponents() {
  // Create a GameManager instance
  let gm = new GameManager();

  // Create a DrawEngine instance and set the GameManager
  de = DrawEngine.getInstance();
  de.setGameManager(gm);

  // Any additional initialization logic can go here
}



video.addEventListener('loadeddata', function handler() {
  setCanvasSize(initializeGameComponents);
  video.removeEventListener('loadeddata', handler); // Remove after first call
});



// Create a MediaPipeTracker instance and configure it
let mp = MediaPipeTracker.getInstance();
mp.setVid(video);

mp.createLandmarks().then(() => {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      enableWebcamButton.addEventListener("click", onEnableCamButtonClicked);
  } else {
      enableWebcamButton.removeEventListener("click", onEnableCamButtonClicked);
      enableWebcamButton.innerText = "Camera Not Found";
  }
});


window.addEventListener('resize', debounce(function() {
  setCanvasSize();
  // You can also add any additional logic here if needed
}, 250)); // 250 milliseconds is a reasonable delay









// Enable the live webcam view and start detection
function onEnableCamButtonClicked(event) {
  if (!video.srcObject) {
      // Calculate dynamic dimensions for 16:9 aspect ratio
      let width = window.innerWidth;
      let height = Math.round(width / (16 / 9));

      console.log(`Calculated video dimensions: ${width}x${height}`);


      // Constraints for video
      const videoConstraints = {
          deviceId: selectedCameraId ? { exact: selectedCameraId } : undefined,
          width: { ideal: width },
          height: { ideal: height }
      };

      navigator.mediaDevices.getUserMedia({ video: videoConstraints }).then((stream) => {
          video.srcObject = stream;
          video.addEventListener("loadeddata", onCamStartup);

          // Start playing the video stream but keep it hidden
          video.play();
          video.style.display = 'none';  // Make sure the video is not visible

          // Change button text to indicate that the webcam feed can be shown
          enableWebcamButton.innerText = 'SHOW WEBCAM';
          canvas.style.display = 'block'; // Show the canvas here
          fullButton.style.display = 'inline'; // Show the full screen button
      });
   
  } else {
      // If the webcam is already started, this will toggle the video display on or off
      toggleVideoDisplay();

      // Adjust the button text based on whether the video is displayed or not
      if (video.style.display === 'none') {
          enableWebcamButton.innerText = 'SHOW WEBCAM';
      } else {
          enableWebcamButton.innerText = 'HIDE WEBCAM';
      }
  }
}



function onCamStartup(event) {

  console.log("onCamStartup called");

  // Determine the initial size based on the window and video dimensions
  let maxWidth = Math.min(window.innerWidth * 0.75, video.videoWidth);
  let maxHeight = maxWidth * (9 / 16); // Maintain 16:9 aspect ratio

  // Set dimensions of the canvas elements
  mpcanvas.width = maxWidth;
  mpcanvas.height = maxHeight;
  canvas.width = maxWidth;
  canvas.height = maxHeight;

  // Adjust styles to match new sizes
  video.style.width = `${maxWidth}px`;
  video.style.height = `${maxHeight}px`;
  canvas.style.width = `${maxWidth}px`;
  canvas.style.height = `${maxHeight}px`;
  mpcanvas.style.width = `${maxWidth}px`;
  mpcanvas.style.height = `${maxHeight}px`;

  initializeGameComponents();

  console.log(`Canvas and video element size after onCamStartup: ${canvas.width}x${canvas.height}`);
  console.log(`Video element visibility after onCamStartup: ${video.style.display}`);

  
  // Set fullButton and video visibility
  fullButton.style.display = "inline";
  video.style.display = 'none'; // Keep video hidden

  // Apply mirroring and start the loop
  setMirroring();
  de.loop();

  if (!componentsInitialized) {
    console.log("Initializing game components");

    initializeGameComponents();
    componentsInitialized = true;
  }
  
}

// Add a flag to control initialization
let componentsInitialized = false;

// Full-screen button event listener
fullButton.addEventListener('click', () => {
  if (!document.fullscreenElement) {
      container.requestFullscreen().then(() => {
        console.log("Full screen button clicked");

          // Adjust canvas to full screen size
          mpcanvas.width = window.innerWidth;
          mpcanvas.height = window.innerHeight;
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;

          console.log(`Canvas size after full screen change: ${canvas.width}x${canvas.height}`);


          // Apply mirroring and re-adjust other elements if necessary
          setMirroring();
      });
  } else {
      if (document.exitFullscreen) {
          document.exitFullscreen();
      } else if (document.webkitExitFullscreen) { // Safari
          document.webkitExitFullscreen();
      }

      // Call onCamStartup to revert to initial settings
      onCamStartup();
  }
});


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
  video.style.display = (video.style.display === 'none') ? 'block' : 'none';
}





