export default class AudioManager 
{
    constructor(audioContext) 
    {
        this.audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
        this.isPlaying = false;
        this.soundSource = null;
        this.audioBuffer = null;
        this.onAudioEnd = null; // Callback for when audio ends
        this.isResettingForGame = false; // Flag to indicate intentional reset


                // Additional buffers for hit sounds
        this.hitSound0Buffer = null;
        this.hitSound1Buffer = null;

    }


    //loads Level Song per level.
    async loadSound(url) 
    {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    }

    

    // Load hit sounds similarly to how you load the main sound
    async loadHitSound0(url) {
        console.log('Loading hit sound 0');

        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        this.hitSound0Buffer = await this.audioContext.decodeAudioData(arrayBuffer);
        console.log('Hit sound 0 loaded');

    }

    async loadHitSound1(url) {
        console.log('Loading hit sound 1');

        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        this.hitSound1Buffer = await this.audioContext.decodeAudioData(arrayBuffer);
        console.log('Hit sound 1 loaded');

    }





    togglePlayPause() {
        if (this.isPlaying) {
            // Suspend the audio context to pause
            this.audioContext.suspend().then(() => {
                this.isPlaying = false;
            });
        } else {
            // Resume the audio context to play
            this.audioContext.resume().then(() => {
                this.isPlaying = true;
                if (!this.soundSource) {
                    // If the sound source isn't there, start the audio
                    this.startAudio();
                }
            });
        }
    }

    pauseAudio() {
        if (this.isPlaying) {
            this.audioContext.suspend().then(() => {
                this.isPlaying = false;
            });
        }
    }

    startAudio() {
        if (!this.audioBuffer) return;
    
        // When the audio starts, capture the current time of the audio context
        this.startTime = this.audioContext.currentTime;
    
        this.soundSource = this.audioContext.createBufferSource();
        this.soundSource.buffer = this.audioBuffer;
        this.soundSource.connect(this.audioContext.destination);
        this.soundSource.start(0); // Start at the beginning of the buffer
        this.isPlaying = true;
    
        this.soundSource.onended = () => {
            if (!this.isResettingForGame) {
                this.isPlaying = false;
                if (this.onAudioEnd) this.onAudioEnd();
            }
        };
    }
    



    restartAudioFromBeginning() {
        // Store the current playing state
        const wasPlaying = this.isPlaying;

        // Disconnect the current sound source
        if (this.soundSource) {
            this.soundSource.disconnect();
        }

        // Restart the audio from the beginning
        this.startAudio();

        // If the audio was paused, suspend the audio context
        if (!wasPlaying) {
            this.audioContext.suspend().then(() => {
                this.isPlaying = false;
            });
        }
    }


    setAudioEndCallback(callback) 
    {
        this.onAudioEnd = callback;
    }



    // Add this method
    getCurrentTime() 
    {
    if (!this.isPlaying) {
        return 0;
    }
    return this.audioContext.currentTime - this.startTime;
    }

    

    // Method to set audio source and play immediately
     setAudioSourceAndPlay(url) {
        this.loadSound(url)
            .then(() => this.startAudio())
            .catch(error => console.error("Error setting audio source:", error));
    }



    // Method to set volume
    setVolume(volumeLevel) {
        // Ensure volume is between 0.0 and 1.0
        const clampedVolume = Math.max(0, Math.min(volumeLevel, 1));
        if (this.gainNode) {
            this.gainNode.gain.value = clampedVolume;
        }
    }


    // Method to get current volume
    getVolume() {
        return this.gainNode ? this.gainNode.gain.value : 1; // Default to max volume if not set
    }


    dispose() {
        if (this.soundSource) {
            this.soundSource.disconnect();
            this.soundSource = null;
        }
        if (this.audioContext) {
            this.audioContext.close(); // Close the audio context
            this.audioContext = null;
        }
        this.audioBuffer = null;
        this.onAudioEnd = null;
    }

}
