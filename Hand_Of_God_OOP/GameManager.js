import Level_01 from './Level_01.js'
import Level_02 from './Level_02.js'
import Level_03 from './Level_03.js'
import Level_04 from './Level_04.js'
import Level_05 from './Level_05.js'



export default class GameManager {
    constructor(_canvas, _mediaPipe) {
        this.canvasElement = _canvas;
        this.canvasCtx = this.canvasElement.getContext("2d");
        this.mediaPipe = _mediaPipe;
        
        // set the current level to level_01
        //this.de.setLabel("Bubble Game");
        this.currentLevel = new Level_05(this.mediaPipe.getResults(), this.canvasElement, this.canvasCtx)
    }

    setDrawEngine(_drawEngine){
        this.de = _drawEngine;
    }

    nextLevel()
    {
        let audio = new Audio('sound2/pop.mp3');
        audio.play();
        this.de.setLabel("Level 03 - line draw ( no win condition )  :)");
        this.currentLevel = new Level_03(this.mediaPipe.getResults(), this.canvasElement, this.canvasCtx)
    }
}