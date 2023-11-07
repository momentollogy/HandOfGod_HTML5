import MediaPipeTracker from './MediaPipeTracker.js';
import UIManager from './UIManager_Recorder.js';
import LeaderBoardVisual from './LeaderBoardVisual.js';
import PlayInfoBoxVisual from './PlayInfoBoxVisual.js';
import LevelSelectVisual from './LevelSelectVisual.js';


export default class Level_StageSelect
{
    constructor()
    {
        this.mediaPipe = MediaPipeTracker.getInstance();
        this.canvas = document.getElementById("output_canvas");
        this.ctx = this.canvas.getContext("2d");
    
        this.playInfoBoxVisual = new PlayInfoBoxVisual();
        this.levelselectvisual = new LevelSelectVisual(this.playInfoBoxVisual);
        this.leadboardvisual = new LeaderBoardVisual();
        this.playInfoBoxVisual.levelselectvisual=this.levelselectvisual;
        this.playInfoBoxVisual.currentLevelData=this.levelselectvisual.levelArray;
        this.playInfoBoxVisual.updateCurrentLevel(this.levelselectvisual.levelArray[0]);


    }


/*
    handleCanvasClick() {
        console.log("mouse clicked");
        document.dispatchEvent(new CustomEvent('levelChange', { detail: { levelName: 'Level_05' } }));
      }
*/


    level_loop() 
    {
        // mediapipe stuff
        let results = this.mediaPipe.results;
        if (results == undefined) { return; }
       // console.log("select level")
       this.leadboardvisual.draw(); 
       this.levelselectvisual.draw();  
      this.playInfoBoxVisual.draw(); 

    }


    dispose()
    {
   // console.log("dispose ran!!!!")
    this.canvas.removeEventListener('click', () => this.handleCanvasClick());
    this.leadboardvisual = null;
    this.mediaPipe = null;
    this.canvas =  null;
    this.ctx = null;
    this.playInfoBoxVisual.dispose();
    this.levelselectvisual.dispose();
    }
}

   

