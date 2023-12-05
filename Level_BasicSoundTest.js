import MediaPipeTracker from './MediaPipeTracker.js';
import JsonManager from './JsonManager.js';
import AudioManager from './AudioManager.js'; // Import AudioManager

export default class Level_BasicSoundTest 
{
    constructor(_levelArrayDataObject) 
    {
        this.mediaPipe = MediaPipeTracker.getInstance();
        this.canvas = document.getElementById("output_canvas");
        this.ctx = this.canvas.getContext("2d");

        this.jsonManager = new JsonManager();
        this.jsonPath = _levelArrayDataObject.jsonPath;

        // Initialize AudioManager
        this.audioManager = new AudioManager();
        this.audioManager.loadSound(_levelArrayDataObject.mp3Path)
            .then(() => {
                // Optionally start playing audio here or wait for user interaction
                this.audioManager.startAudio();
            })
            .catch(error => console.error("Error in audio playback:", error));
    
        //keeping track of audio ended. 
        this.audioManager.setAudioEndCallback(this.audioEnded.bind(this));


        // Keyboard shortcut for play/pause and restart
        document.addEventListener('keydown', this.handleKeyPress.bind(this));


    }

    handleKeyPress(event) {
        if (event.key === 'p' || event.key === 'P') {
            this.audioManager.togglePlayPause();
        } else if (event.key === 'r' || event.key === 'R') {
            this.audioManager.restartAudio();
        }
    }

    audioEnded() {
        console.log("Level Complete!", this.audioEnded);
        // Implement what happens when audio ends
    }

    level_loop() {
        let results = this.mediaPipe.results;
        if (results === undefined) return;
        // Implement loop logic
    }
}


