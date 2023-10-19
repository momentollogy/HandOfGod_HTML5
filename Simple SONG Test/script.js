const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const chooseFileButton = document.getElementById('loadJson');


const velocity = 85; // in pixels per second // circle drop speed
let songStartTime = 0;
let songElapsedTime = 0;
let songOffset = 0;
let recordedMoments = [];
let circleRadius = 50;
let lastPulseTime = 0;
let pulseDuration = 200; // duration for which the circle will stay enlarged after a pulse
let pulseFactor = 1.5; // how much bigger the circle will become during a pulse
let loadedBeats = [];
let beatCircles = [];
let beatCircleY = 0; // Start at the top
const beatCircleRadius = 20; // Fixed size for our beatCircle for now
const bpm = 120; // Default BPM
let beatCircleSpeed = bpm / 60 * 2; // Pixels per second, adjust multiplier as needed
let distance; // Assuming the distance from the top to sweet spot is 500 units, adjust as necessary
const SWEET_SPOT_Y = 300;
const BEAT_CIRCLE_THRESHOLD_MS = 75;
let audioContext = new (window.AudioContext || window.webkitAudioContext)();
let audioSource = null;
let songBuffer = null;
let songPlaying = false;
let nextBeatIndex = 0;
let lastTimeOfCurrentLoop;
let elapsedTime;









///////////////////////////////////////
///////////////////////////////////////
// Beat Circle Class
///////////////////////////////////////
///////////////////////////////////////


class BeatCircle {
    constructor(timestamp) {
        this.timestamp = timestamp;
        this.y = this.calculateStartingPosition(timestamp); // Y position
        this.x = 400;
        this.speed = beatCircleSpeed; // Set the speed based on the initialized beatCircleSpeed
        this.color = "green"; // Default color
        this.radius = beatCircleRadius;
        this.lastTimeOfCurrentLoop;
        this.alpha = 1.0;
    }

    isNearSweetSpot(currentTimeMs) {
        const difference = Math.abs(this.timestamp - currentTimeMs);
        //console.log(difference);
        return difference <= BEAT_CIRCLE_THRESHOLD_MS;
    }

    updatePosition(timeOfCurrentLoop){
        if(!this.lastTimeOfCurrentLoop){this.lastTimeOfCurrentLoop = timeOfCurrentLoop;}
        elapsedTime = timeOfCurrentLoop - this.lastTimeOfCurrentLoop;
        distance = (velocity/1000) * elapsedTime;  //  find the pixels per millisecond, then multiply that by the number of milliseconds to find how far it should move this loop!!
        this.y += distance;
        this.lastTimeOfCurrentLoop = timeOfCurrentLoop;
    }

    draw(ctx){
            // set the alpha of circle
        if (this.y > SWEET_SPOT_Y + 5) {this.alpha -=.02}; if(this.alpha<0){this.alpha=0};
        ctx.globalAlpha = this.alpha;
        
            // Determine the color based on the position
        if (this.isNearSweetSpot(songElapsedTime * 1000)) {
            this.color = "red";
        } else {
            this.color = "green";
        }

            // Draw the BeatCircle
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.fillText(this.timestamp, this.x + 40, this.y);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    }

    killSelf(){
        beatCircles.splice(beatCircles.indexOf(this),1);
    }

    checkForRemoval(){
        // Remove BeatCircle if it's too far past the sweet spot
        if (songElapsedTime * 1000 > this.timestamp){
            //this.x += 2;
            if (this.y > SWEET_SPOT_Y + BEAT_CIRCLE_THRESHOLD_MS) {
                this.killSelf()
            }
        }
    }
    
    calculateStartingPosition(timestamp) {
        var totalDist = (velocity/1000) * timestamp;
        var offset = -totalDist + 300;
        //console.log(this.timestamp, offset);
        return offset;
    }
}














///////////////////////////////////////
///////////////////////////////////////
// Circle utilities
///////////////////////////////////////
///////////////////////////////////////


function populateBeatCircles(){
    //console.log("in beat circles", loadedBeats.length );
    beatCircles = []
    for(var timemarker of loadedBeats){
        beatCircles.push( new BeatCircle(timemarker) )
    }
}
















///////////////////////////////////////
///////////////////////////////////////
// Loop
///////////////////////////////////////
///////////////////////////////////////


function render(timeOfCurrentLoop) {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // clears the canvas so the current frame can be drawn
    updateBeatCircles(timeOfCurrentLoop) // Update and Draw all BeatCircles
    drawUI(); // draws the UI stuff on the canvas
    
    requestAnimationFrame(render);
}

function drawUI()
{
    let shouldPulse = false;
    if (loadedBeats.length > 0 && songPlaying) {
        for (let beatTime of loadedBeats) {
            if (Math.abs(beatTime - songElapsedTime * 1000) <= 50) {  // Near a beat time
                shouldPulse = true;
                lastPulseTime = audioContext.currentTime;
                break;
            }
        }
    }

    let elapsedTimeSincePulse = audioContext.currentTime - lastPulseTime;
    let currentPulseFactor = 1; // Initialize with default size factor
    if (elapsedTimeSincePulse <= pulseDuration / 1000) {
        let progress = elapsedTimeSincePulse / (pulseDuration / 1000);
        currentPulseFactor = 1 + (pulseFactor - 1) * (1 - progress); // This will interpolate the pulse factor over time
    }
    
    ctx.strokeStyle = currentPulseFactor > 1 ? "blue" : "green"; 
    let drawingRadius = circleRadius * currentPulseFactor;
    ctx.beginPath();
    ctx.arc(400, 300, drawingRadius, 0, 2 * Math.PI);
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
    ctx.fillText("Reset", 360, 550);

    // Display song elapsed time in milliseconds
    if (songPlaying) {
        songElapsedTime = audioContext.currentTime - songStartTime + songOffset / 1000;
    } else {
        songElapsedTime = songOffset / 1000;
    }
    const displayTime = songElapsedTime * 1000; // Convert to milliseconds
    ctx.fillText(Math.floor(displayTime) + " ms", 375, 370); // Adjusted y-coordinate

    // find a way to display the next beat here using the nextBeatIndex
    //ctx.fillText(loadedBeats[nextBeatIndex] + " ms   Next Beat", 500, 370); // Adjusted y-coordinate
}

function updateBeatCircles(timeOfCurrentLoop)
{
    for( let i = 0 ; i < beatCircles.length ; i++)
    {
        let cir = beatCircles[i];
        if(songPlaying){cir.updatePosition(timeOfCurrentLoop)}
        cir.draw(ctx);
        cir.checkForRemoval();
    }
}




























///////////////////////////////////////
///////////////////////////////////////
// Buttons and file stuff
///////////////////////////////////////
///////////////////////////////////////

    // these are the canvas buttons
canvas.addEventListener("click", function(event) {
    const rect = canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

        // checks if the click is in the circle.. if it is, it pushes a rounded-down time-stamp into the recordedMoments array, and it "pulses the circle"
    const distToCenter = Math.sqrt(Math.pow(400 - x, 2) + Math.pow(300 - y, 2));
    if (distToCenter <= circleRadius && songPlaying) {
        recordedMoments.push(Math.floor(songElapsedTime * 1000));
        circleRadius = 60;
        setTimeout(() => {circleRadius = 50}, 100);
    }
        // the button handlers
    if (x >= 350 && x <= 450 && y >= 400 && y <= 450) {
        if (!songPlaying) { playSong(); }
    } else if (x >= 350 && x <= 450 && y >= 460 && y <= 510 && songPlaying) {
        stopSong();
    } else if (x >= 350 && x <= 450 && y >= 520 && y <= 570) {
        resetSession();
    }
});

    // this function not only starts the song but it resets the recordedMoments array  ( it makes it empty )
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
    // just stops the song and disconnects the audioSource. nothing fancy
function stopSong() {
    if (audioSource) {
        songOffset += (audioContext.currentTime - songStartTime) * 1000; // Convert to ms
        audioSource.stop();
        audioSource.disconnect();
        songPlaying = false;
    }
}
    // this ends the current session, and "recording of moments"
function resetSession() {
    if (audioSource) {
        stopSong()
    }
    songOffset = 0; // Reset song offset to 0
    songElapsedTime = 0; // Reset elapsed time to 0
    populateBeatCircles();
}
    // button Handler
    // saves the json file
function exportMoments() {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify({beatTimes: recordedMoments}));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "recordedMoments.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
}
    // button Handler
    //  basically just populates the  loadedBeats  array from the json file
function loadBeatTimes() {
    console.log("load pressed");
    const file = chooseFileButton.files[0];
    if (!file) {
        alert('Please select a JSON file to load.');
        return;
    }
    const reader = new FileReader();
    reader.onload = function(event) {
        const jsonData = JSON.parse(event.target.result);
        if (jsonData && jsonData.beatTimes) {
            loadedBeats = jsonData.beatTimes;
            populateBeatCircles();
            //console.log("Loaded beats:", loadedBeats);
        } else {
            alert('Invalid JSON format.');
        }
    };
    reader.readAsText(file);
}

function loadSong(path) {
    fetch(path)
        .then(response => response.arrayBuffer())
        .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer))
        .then(buffer => {
            songBuffer = buffer;
        });
}

















///////////////////////////////////////
///////////////////////////////////////
// Startup code  ( kinda like init() )
///////////////////////////////////////
///////////////////////////////////////
loadSong("Plateau.mp3");
render();