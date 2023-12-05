import MediaPipeTracker from './MediaPipeTracker.js';
import JsonManager from './JsonManager.js';
import AudioManager from './AudioManager.js'; // Import AudioManager
import KeyboardManager from './KeyboardManager.js'; // Adjust the path as necessary


export default class Level_BasicSoundTest 
{
    constructor(_levelArrayDataObject) 
    {
        this.mediaPipe = MediaPipeTracker.getInstance();
        this.canvas = document.getElementById("output_canvas");
        this.ctx = this.canvas.getContext("2d");
        this.jsonManager = new JsonManager();
        this.jsonPath = _levelArrayDataObject.jsonPath;
       // this.keyboardManager = new KeyboardManager(this);
        this.keyboardManager = new KeyboardManager(this, this.audioManager);



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
       // document.addEventListener('keydown', this.handleKeyPress.bind(this));
        


    }

    togglePlayPause() {
        this.audioManager.togglePlayPause();
    }

    resetLevel() {
        this.audioManager.restartAudio();
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


