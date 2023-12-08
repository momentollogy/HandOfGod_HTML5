export default class AudioManager 
{
    constructor(audioContext) 
    {
        this.audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();

        // Create and connect gain nodes for hit sounds
        this.hitSound0Gain = this.audioContext.createGain();
        this.hitSound0Gain.connect(this.audioContext.destination);
        this.hitSound1Gain = this.audioContext.createGain();
        this.hitSound1Gain.connect(this.audioContext.destination);

        // Gain node for the main music
        this.mainMusicGain = this.audioContext.createGain();
        this.mainMusicGain.connect(this.audioContext.destination);

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
    async loadSound(url) {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    }
    

    // Load hit sounds similarly to how you load the main sound
    async loadHitSound0(url) 
    {
        console.log('Loading hit sound 0');

        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        this.hitSound0Buffer = await this.audioContext.decodeAudioData(arrayBuffer);
        console.log('Hit sound 0 loaded');

    }


    async loadHitSound1(url) 
    {
        console.log('Loading hit sound 1');

        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        this.hitSound1Buffer = await this.audioContext.decodeAudioData(arrayBuffer);
        console.log('Hit sound 1 loaded');

    }

    // Method to set volume for main music
    setMainMusicVolume(volume) {
        this.mainMusicGain.gain.value = Math.max(0, Math.min(volume, 1)); // Clamp between 0 and 1
    }

    //Volume for main music
    increaseMainVolume() {
        let currentVolume = this.mainMusicGain.gain.value;
        this.mainMusicGain.gain.value = Math.min(currentVolume + 0.05, 1); // Increase MUSIC Volume by 0.05, max 1.0
    }
    
    decreaseMainVolume() {
        let currentVolume = this.mainMusicGain.gain.value;
        this.mainMusicGain.gain.value = Math.max(currentVolume - 0.05, 0); // Decrease MUSIC by 0.05, min 0
    }
    


    // Volume for hits
    setVolumeForHitSound0(volume) 
    {
        this.hitSound0Gain.gain.value = Math.max(0, Math.min(volume, 1)); // Clamp between 0 and 1
    }

    setVolumeForHitSound1(volume) 
    {
        this.hitSound1Gain.gain.value = Math.max(0, Math.min(volume, 1)); // Clamp between 0 and 1
    }


    // Increase volume for both hit sounds
    increaseHitSoundsVolume() {
    let currentVolume0 = this.hitSound0Gain.gain.value;
    let newVolume0 = Math.min(currentVolume0 + 0.05, 1); // Increase by 5%
    this.hitSound0Gain.gain.value = newVolume0;

    let currentVolume1 = this.hitSound1Gain.gain.value;
    let newVolume1 = Math.min(currentVolume1 + 0.05, 1); // Increase by 5%
    this.hitSound1Gain.gain.value = newVolume1;
    }

    // Decrease volume for both hit sounds
    decreaseHitSoundsVolume() {
    let currentVolume0 = this.hitSound0Gain.gain.value;
    let newVolume0 = Math.max(currentVolume0 - 0.05, 0); // Decrease by 5%
    this.hitSound0Gain.gain.value = newVolume0;

    let currentVolume1 = this.hitSound1Gain.gain.value;
    let newVolume1 = Math.max(currentVolume1 - 0.05, 0); // Decrease by 5%
    this.hitSound1Gain.gain.value = newVolume1;
    }


   
    startAudio() 
    {
        if (!this.audioBuffer) return;
    
        // When the audio starts, capture the current time of the audio context
        this.startTime = this.audioContext.currentTime;
    
        this.soundSource = this.audioContext.createBufferSource();
        this.soundSource.buffer = this.audioBuffer;
        this.soundSource.connect(this.mainMusicGain); // Connect to the main music gain node
        this.soundSource.start(0); // Start at the beginning of the buffer
        this.isPlaying = true;
    
        this.soundSource.onended = () => {
            if (!this.isResettingForGame) {
                this.isPlaying = false;
                if (this.onAudioEnd) this.onAudioEnd();
            }
        };
    }


    // Method to set audio source and play immediately
     setAudioSourceAndPlay(url) 
    {
        this.loadSound(url)
            .then(() => this.startAudio())
            .catch(error => console.error("Error setting audio source:", error));
    }


     
    getCurrentTime() 
    {
    if (!this.isPlaying) {
        return 0;
    }
    return this.audioContext.currentTime - this.startTime;
    }


    setAudioEndCallback(callback) 
    {
        this.onAudioEnd = callback;
    }

    //////////////////
    //methods below for keybaord short cuts: "pause/upause" "restart"//
    /////////////////
 
    togglePlayPause() {
        if (!this.audioContext || !this.soundSource) return; // Check both audioContext and soundSource
    
        if (this.isPlaying) {
            this.audioContext.suspend().then(() => {
                this.isPlaying = false;
            });
        } else {
            this.audioContext.resume().then(() => {
                this.isPlaying = true;
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



restartAudioFromBeginning() {
    if (!this.audioBuffer || !this.audioContext) return; // Check if audioBuffer and audioContext exist

    // If playing, stop and disconnect the current soundSource
    if (this.isPlaying && this.soundSource) {
        this.soundSource.stop();
        this.soundSource.disconnect();
    }

    // Create a new soundSource
    this.soundSource = this.audioContext.createBufferSource();
    this.soundSource.buffer = this.audioBuffer;
    this.soundSource.connect(this.audioContext.destination);

    // Restart the audio
    this.soundSource.start(0);
    this.startTime = this.audioContext.currentTime;
    this.isPlaying = true;

    // Handle onended callback
    this.soundSource.onended = () => {
        if (!this.isResettingForGame) {
            this.isPlaying = false;
            if (this.onAudioEnd) this.onAudioEnd();
        }
    };
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
