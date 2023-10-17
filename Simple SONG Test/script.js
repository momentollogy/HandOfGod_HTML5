let songStartTime = 0;
let songElapsedTime = 0;
let songOffset = 0;
let recordedMoments = [];
let circleRadius = 50;
let lastPulseTime = 0;
let pulseDuration = 200; // duration for which the circle will stay enlarged after a pulse
let pulseFactor = 1.5; // how much bigger the circle will become during a pulse
let loadedBeats = [];

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioSource = null;
let songBuffer = null;
let songPlaying = false;

loadSong("Plateau.mp3");

function loadSong(path) {
    fetch(path)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(buffer => {
            songBuffer = buffer;
        });
}

function render() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    let shouldPulse = false;
    if (loadedBeats.length > 0 && songPlaying) {
        for (let beat of loadedBeats) {
            if (Math.abs(beat - songElapsedTime * 1000) <= 50) {  // Near a beat time
                shouldPulse = true;
                lastPulseTime = audioContext.currentTime;
                break;
            }
        }
    }

    let elapsedTimeSincePulse = audioContext.currentTime - lastPulseTime;
    if (elapsedTimeSincePulse <= pulseDuration / 1000) {
        let progress = elapsedTimeSincePulse / (pulseDuration / 1000);
        currentPulseFactor = 1 + (pulseFactor - 1) * (1 - progress); // This will interpolate the pulse factor over time
    }
    
    ctx.strokeStyle = currentPulseFactor > 1 ? "blue" : "green"; // Change color on pulse
    

    

    let drawingRadius = circleRadius * currentPulseFactor;
    ctx.beginPath();
    ctx.arc(400, 300, drawingRadius, 0, 2 * Math.PI);
    ctx.strokeStyle = "green";
    ctx.stroke();
    
    // Draw the "Start Track" button
    ctx.fillStyle = "#eee";
    ctx.fillRect(350, 400, 100, 50);
    ctx.strokeRect(350, 400, 100, 50);
    ctx.fillStyle = "black";
    ctx.fillText("Start Track", 355, 430);

    // Draw the "Stop" button
    ctx.fillStyle = "#eee";
    ctx.fillRect(350, 460, 100, 50);
    ctx.strokeRect(350, 460, 100, 50);
    ctx.fillStyle = "black";
    ctx.fillText("Stop", 375, 490);

    // Draw the "Restart" button
    ctx.fillStyle = "#eee";
    ctx.fillRect(350, 520, 100, 50);
    ctx.strokeRect(350, 520, 100, 50);
    ctx.fillStyle = "black";
    ctx.fillText("Restart", 360, 550);

    // Display song elapsed time in milliseconds
    if (songPlaying) {
        songElapsedTime = audioContext.currentTime - songStartTime + songOffset / 1000;
    } else {
        songElapsedTime = songOffset / 1000;
    }
    const displayTime = songElapsedTime * 1000; // Convert to milliseconds
    ctx.fillText(Math.floor(displayTime) + " ms", 375, 370); // Adjusted y-coordinate
    requestAnimationFrame(render);
}
render();

canvas.addEventListener("click", function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const distToCenter = Math.sqrt(Math.pow(400 - x, 2) + Math.pow(300 - y, 2));
    if (distToCenter <= circleRadius && songPlaying) {
        recordedMoments.push(Math.floor(songElapsedTime * 1000));
        circleRadius = 60;
        setTimeout(() => circleRadius = 50, 100);
    }

    if (x >= 350 && x <= 450 && y >= 400 && y <= 450) {
        if (!songPlaying) {
            playSong();
        }
    } else if (x >= 350 && x <= 450 && y >= 460 && y <= 510 && songPlaying) {
        stopSong();
    } else if (x >= 350 && x <= 450 && y >= 520 && y <= 570) {
        //console.log("THIS WOKS!")
        stopSong();
        audioContext.currentTime=0
        songElapsedTime = 0; // Reset elapsed time to 0

    }
});

function playSong() {
    if (audioSource) {
        audioSource.disconnect();
    }
    audioSource = audioContext.createBufferSource();
    audioSource.buffer = songBuffer;
    audioSource.connect(audioContext.destination);
    audioSource.start(0, songOffset / 1000);
    songStartTime = audioContext.currentTime;
    songPlaying = true;
    recordedMoments = [];
}

function stopSong() {
    if (audioSource) {
        songOffset += (audioContext.currentTime - songStartTime) * 1000; // Convert to ms
        audioSource.stop();
        audioSource.disconnect();
        songPlaying = false;
    }
}

function exportMoments() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({beatTimes: recordedMoments}));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "recordedMoments.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}

function loadBeatTimes() {
    const fileInput = document.getElementById('loadJson');
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a JSON file to load.');
        return;
    }

    const reader = new FileReader();
    reader.onload = function(event) {
        const jsonData = JSON.parse(event.target.result);
        if (jsonData && jsonData.beatTimes) {
            loadedBeats = jsonData.beatTimes;
        } else {
            alert('Invalid JSON format.');
        }
    };
    reader.readAsText(file);
}

