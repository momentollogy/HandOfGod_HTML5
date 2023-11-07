import MediaPipeTracker from './MediaPipeTracker.js';
import UIManager, { Button } from './UIManager.js';


export default class Level_StageSelect
{
    constructor()
    {
        this.mediaPipe = MediaPipeTracker.getInstance()
        this.canvas = document.getElementById("output_canvas");;
        this.ctx = this.canvas.getContext("2d");
    }


    


    level_loop() 
    {
        // mediapipe stuff
        let results = this.mediaPipe.results;
        if (results == undefined) { return; }
        
    }
}
    


