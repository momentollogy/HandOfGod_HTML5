import MediaPipeTracker from './MediaPipeTracker.js';
import UIManager, { Button } from './UIManager.js';
import LeaderBoardVisual from './LeaderBoardVisual.js';


export default class Level_StageSelect
{
    constructor()
    {
        this.leadboardvisual=new LeaderBoardVisual();
        this.mediaPipe = MediaPipeTracker.getInstance()
        this.canvas = document.getElementById("output_canvas");;
        this.ctx = this.canvas.getContext("2d");
    }



    level_loop() 
    {
        // mediapipe stuff
        let results = this.mediaPipe.results;
        if (results == undefined) { return; }
        this.leadboardvisual.draw();
        
    }
}



    


