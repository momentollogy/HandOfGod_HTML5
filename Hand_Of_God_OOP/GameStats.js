export class GameStats
{
    constructor(bufferLimit = 14) 
    { // Default buffer limit
        this.bufferLimit = bufferLimit;
        this.score = 0;
        this.combo = 0;
        this.buffer = this.bufferLimit; // Initialize buffer with bufferLimit
        console.log("GameStats initialized. Buffer limit:", this.bufferLimit, "Current buffer:", this.buffer);

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

        if (this.buffer < 14) { // Ensure the buffer does not exceed the initial limit
            this.buffer++;
            console.log("removeMiss called. Current buffer:", this.buffer);

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
        this.buffer = this.bufferLimit; // Reset buffer to the initial limit
        console.log("Gamestats reset called. Current buffer:", this.buffer);

        this.comboMultiplier = 1;
    }

    dispose() 
    {
        console.log("disposing GameStats...")
        this.reset();
    }

}

