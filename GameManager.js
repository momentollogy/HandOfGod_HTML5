import Level_01 from './Level_01.js'

export default class GameManager {
    constructor(_canvas, _mediaPipe) {
        this.canvasElement = _canvas;
        this.canvasCtx = this.canvasElement.getContext("2d");
        this.mediaPipe = _mediaPipe;

        // set the current level to level_01
        this.currentLevel = new Level_01(this.mediaPipe.getResults(), this.canvasElement, this.canvasCtx)
    }
}