import MediaPipeTracker from './MediaPipeTracker.js';
import UIManager from './UIManager_Recorder.js';
import LeaderBoardVisual from './LeaderBoardVisual.js';
import PlayInfoBoxVisual from './PlayInfoBoxVisual.js';
import LevelSelectVisual from './LevelSelectVisual.js';


export default class Level_StageSelect
{
    constructor(detail)
    {
        this.mediaPipe = MediaPipeTracker.getInstance();
        this.canvas = document.getElementById("output_canvas");
        this.ctx = this.canvas.getContext("2d");

        //Recivcing data from Game Manger which got it from the button.
        this.detail=detail;



        //BACKGOUND IMAGE
        this.backgroundImage = new Image();
        this.backgroundImage.onload = () => 
         // Draw the image onto the canvas once it's loaded
        {
            this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);
        };
        this.backgroundImage.src = 'images/bg_imageda66opacity.jpeg'; 
    


    
        this.playInfoBoxVisual = new PlayInfoBoxVisual();
        this.levelselectvisual = new LevelSelectVisual(this.playInfoBoxVisual);
        this.leaderboardvisual = new LeaderBoardVisual(detail.leaderBoardState);

        this.leaderboardvisual.setState(detail.leaderBoardState)
       



        this.playInfoBoxVisual.levelselectvisual=this.levelselectvisual;
        this.playInfoBoxVisual.currentLevelData=this.levelselectvisual.levelArray;
        this.playInfoBoxVisual.updateCurrentLevel(this.levelselectvisual.levelArray[0]);
        


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



    level_loop() 
    {
        //added this for bg image.
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw the background image
        this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);

        // mediapipe stuff
        let results = this.mediaPipe.results;
        if (results == undefined) { return; }
       this.leaderboardvisual.draw(); 
       this.levelselectvisual.draw();  
      this.playInfoBoxVisual.draw(); 

    }


    dispose()
    {
    this.canvas.removeEventListener('click', () => this.handleCanvasClick());
    this.leaderboardvisual = null;
    this.mediaPipe = null;
    this.canvas =  null;
    this.ctx = null;
    this.playInfoBoxVisual.dispose();
    this.levelselectvisual.dispose();
    }
}

   

   