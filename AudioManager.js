export default class AudioManager 
{
    constructor(audioContext) 
    {
        this.audioContext = audioContext || new (window.AudioContext || window.webkitAudioContext)();
        this.isPlaying = false;
        this.soundSource = null;
        this.audioBuffer = null;
        this.onAudioEnd = null; // Callback for when audio ends
    }



    async loadSound(url) 
    {
        const response = await fetch(url);
        const arrayBuffer = await response.arrayBuffer();
        this.audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
    }



    togglePlayPause() 
    {
        if (this.isPlaying) {
            this.audioContext.suspend();
            this.isPlaying = false;
        } else {
            if (!this.soundSource) {
                this.startAudio();
            } else {
                this.audioContext.resume();
            }
            this.isPlaying = true;
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
            this.isPlaying = false;
            if (this.onAudioEnd) this.onAudioEnd();
        };
    }
    



    restartAudio() {
        if (this.soundSource) {
            this.soundSource.stop();
            this.startAudio();
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

}
