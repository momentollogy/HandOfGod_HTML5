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
        this.playInfoBoxVisual.levelselectvisual=this.levelselectvisual;
        this.playInfoBoxVisual.currentLevelData=this.levelselectvisual.levelArray;
        this.playInfoBoxVisual.updateCurrentLevel(this.levelselectvisual.levelArray[0]);
        this.leaderboardvisual = new LeaderBoardVisual();
       // this.leaderboardvisual = new LeaderBoardVisual();


        setTimeout(() => 
        {
            if (this.levelselectvisual.levelArray && this.levelselectvisual.levelArray.length > 0) {
                const initialLeaderboardId = this.levelselectvisual.levelArray[0].fireBaseLevelLeaderBoard;
                this.leaderboardvisual.populateAndDraw(initialLeaderboardId);
            } else {
                console.error('Level array is not initialized.');
            }
        }, 0); // A timeout of 0 ms means execute as soon as the stack is clear

       

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
       this.leaderboardvisual.draw(); 
       this.levelselectvisual.draw();  
      this.playInfoBoxVisual.draw(); 

    }


    dispose()
    {
   // console.log("dispose ran!!!!")
    this.canvas.removeEventListener('click', () => this.handleCanvasClick());
    this.leaderboardvisual = null;
    this.mediaPipe = null;
    this.canvas =  null;
    this.ctx = null;
    this.playInfoBoxVisual.dispose();
    this.levelselectvisual.dispose();
    }
}

   

