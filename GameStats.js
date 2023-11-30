export class GameStats
{
    constructor(bufferLimit = 5) { // Set the maximum buffer limit aka how many misses player can have here 
        this.maxBufferLimit = bufferLimit;
        this.buffer = this.maxBufferLimit; 

        // Initialize other properties
        this.score = 0;
        this.combo = 0;
        console.log("GameStats initialized. Buffer limit:", this.maxBufferLimit, "Current buffer:", this.buffer);

        this.comboMultiplier = 1;
    }

    increaseCombo() {
        this.combo++;
        this.updateComboMultiplier();
    }

    resetCombo() {
        this.combo = 0;
        this.comboMultiplier = 1;
    }

    addMiss() {

        if (this.buffer > 0) {
            this.buffer--;
        }
        console.log("addMiss called. Current buffer:", this.buffer);

    }

    removeMiss() {
        if (this.buffer < this.maxBufferLimit) { //maxBuggerLimit in this case the default above which is "5"
            this.buffer++;
        }
    }

    addScore(percentAccuracy) {
        this.score += percentAccuracy * this.comboMultiplier;
    }

    updateComboMultiplier() {
        if (this.combo >= 14) {
            this.comboMultiplier = 8;
        } else if (this.combo >= 6) {
            this.comboMultiplier = 4;
        } else if (this.combo >= 2) {
            this.comboMultiplier = 2;
        } else {
            this.comboMultiplier = 1;
        }
    }


    reset() 
    {
        this.score = 0;
        this.combo = 0;
       // this.buffer = this.bufferLimit; // Reset buffer to the initial limit
        this.buffer = this.maxBufferLimit; // Correctly reset buffer to the initial limit

        this.comboMultiplier = 1;
    }

    dispose() 
    {
        console.log("disposing GameStats...")
        this.reset();
    }

}

