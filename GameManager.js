import Level_01 from './Level_01.js'
import Level_02 from './Level_02.js'


export default class GameManager {
    constructor(_canvas, _mediaPipe) {
        this.canvasElement = _canvas;
        this.canvasCtx = this.canvasElement.getContext("2d");
        this.mediaPipe = _mediaPipe;
        
        // set the current level to level_01
        this.currentLevel = new Level_01(this.mediaPipe.getResults(), this.canvasElement, this.canvasCtx)
    }

    setDrawEngine(_drawEngine){
        this.de = _drawEngine;
    }

    nextLevel()
    {
        //var audio = new Audio('audio_file.mp3');
        //audio.play();
        this.de.setLabel("Level 02 - Finger bubbles!  :)");
        this.currentLevel = new Level_02(this.mediaPipe.getResults(), this.canvasElement, this.canvasCtx)
    }
}