

const video = document.getElementById("webcam");
const enableWebcamButton = document.getElementById("webcamButton");

enableWebcamButton.addEventListener("click", enableCam);

function enableCam(event) {
    navigator.mediaDevices.getUserMedia( {video:true} ).then( (stream) => {
        video.srcObject = stream;
    });
}

