let currentPulseFactor = 1;
let circleRadius = 50;
let lastPulseTime = 0;
let pulseDuration = 200; // duration for which the circle will stay enlarged after a pulse
let pulseFactor = 1.5; // how much bigger the circle will become during a pulse
let drawingRadius = circleRadius * currentPulseFactor;
let songStartTime = 0;
let songElapsedTime = 0;
let songOffset = 0;
let recordedMoments = [];


let loadedBeats = [];

class BeatManager {
    constructor() {
        this.beats = [];  // Active beats on the screen
        this.spawnedBeats = 0;  // Counter to keep track of spawned beats
        this.sweetSpotTolerance = 500;  // In milliseconds. Tolerance for early or late hits.
    }

    // Generate beats based on loadedBeats and current song time
    spawnBeats(songTime) {
        while (this.spawnedBeats < loadedBeats.length && loadedBeats[this.spawnedBeats] - this.sweetSpotTolerance <= songTime) {
            let newYPosition = 0;  // Spawn at the top of the canvas
            let newSpeed = 5;  // Pixels per frame, adjust as needed
            this.beats.push(new Beat(newYPosition, newSpeed));
            this.spawnedBeats++;
        }
    }

    // Update the beats' positions and check for hits
    moveBeats(songTime) {
        for (let i = 0; i < this.beats.length; i++) {
            let beat = this.beats[i];
            beat.move();

            // Change color based on proximity to the target time (sweet spot)
           // if (Math.abs(loadedBeats[this.spawnedBeats - this.beats.length + i] - songTime) <= this.sweetSpotTolerance) {
           //     beat.hit = true;
           // } else {
          //      beat.hit = false;
          //  }

            // Remove the beat if it's too far past the target area
            if (loadedBeats[this.spawnedBeats - this.beats.length + i] + this.sweetSpotTolerance < songElapsedTime * 1000) {
                this.beats.splice(i, 1);
                i--;
            }
        }
    }

    // Draw the beats
    drawBeats(ctx) {
        for (let beat of this.beats) {
            beat.draw(ctx);
        }
    }

    checkHitBeats(arg)
    {
        return true;
    }

    setBeatTimesFromJson(beatTimes) {
        loadedBeats = beatTimes;
    }
}

let beatManager = new BeatManager();



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
 
    beatManager.spawnBeats(songElapsedTime * 1000);
    beatManager.moveBeats();
    beatManager.drawBeats(ctx, songElapsedTime * 1000); 
    

    let elapsedTimeSincePulse = audioContext.currentTime - lastPulseTime;
    if (elapsedTimeSincePulse <= pulseDuration / 1000) {
        let progress = elapsedTimeSincePulse / (pulseDuration / 1000);
        currentPulseFactor = 1 + (pulseFactor - 1) * (1 - progress); // This will interpolate the pulse factor over time
    }
    
    ctx.strokeStyle = currentPulseFactor > 1 ? "blue" : "green"; // Change color on pulse
    

    
    drawingRadius = circleRadius * currentPulseFactor;
    ctx.beginPath();
    ctx.arc(960, 540, drawingRadius, 0, 2 * Math.PI); // Adjusted to canvas center
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

    if (beatManager.checkHitBeats(songElapsedTime * 1000)) {
        currentPulseFactor = pulseFactor;
        lastPulseTime = audioContext.currentTime;
    }


    if (x >= 350 && x <= 450 && y >= 400 && y <= 450) {
        if (!songPlaying) {
            playSong();
        }
    } else if (x >= 350 && x <= 450 && y >= 460 && y <= 510 && songPlaying) {
        stopSong();
    } else if (x >= 350 && x <= 450 && y >= 520 && y <= 570) {
        restartSong();
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

function restartSong() {
    if (audioSource) {
        audioSource.stop();
        audioSource.disconnect();
    }
    songOffset = 0; // Reset song offset to 0
    songElapsedTime = 0; // Reset elapsed time to 0
    songPlaying = false;
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
            beatManager.setBeatTimesFromJson(jsonData.beatTimes);
            beatManager.spawnBeats(7)

        } else {
            alert('Invalid JSON format.');
        }
    };
    reader.readAsText(file);
}



class Beat {
    constructor(y, speed) {
        this.x = canvas.width / 2;  // Middle of the canvas
        this.y = y;  // Starting y-position (typically 0 for top)
        this.radius = 20;  // Size of the circle
        this.speed = speed;  // Pixels per frame
        this.hit = false;  // If the player has successfully hit the beat
    }

    // Move the beat downwards
    move() {
        this.y += this.speed;
    }

    // Draw the beat
    draw(ctx, currentTime) {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
        ctx.closePath();
        
        // Determine color based on proximity to sweet spot
        const distanceFromSweetSpot = Math.abs(this.y - currentTime);
        if (distanceFromSweetSpot <= this.radius * 2) { // Adjust the multiplier as needed for wider sweet spot
            ctx.fillStyle = 'red';
        } else {
            ctx.fillStyle = this.hit ? 'green' : 'white';
        }
        
        ctx.fill();
    }
    

    // Check if beat is in 'sweet spot'
    checkHit(targetY) {
        const distance = Math.abs(this.y - targetY);
        if (distance <= this.radius) {
            this.hit = true;
            return true;
        }
        return false;
    }
}







