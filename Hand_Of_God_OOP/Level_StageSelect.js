import MediaPipeTracker from './MediaPipeTracker.js';
import UIManager from './UIManager_Recorder.js';
import LeaderBoard_Box from './LeaderBoard_Box.js';
import PlayInfoBoxVisual from './PlayInfoBoxVisual.js';
import SongSelect_BoxSelectVisual from './SongSelect_Box.js';
import SongSelect_Box from './SongSelect_Box.js';


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
        this.leaderboardbox = new LeaderBoard_Box(detail.leaderBoardState);
        this.songselect_box = new SongSelect_Box(this.playInfoBoxVisual);
        
        if(this.detail){
            var fbName = "" //this.currentLevelData.fireBaseLevelLeaderBoard;
            var LB_state = detail.leaderBoardState;
            console.log(fbName, LB_state);
            //this.leaderboardbox.setState(this.currentLevelData.fireBaseLevelLeaderBoard,detail.leaderBoardState);
        }
        
        
       



        this.playInfoBoxVisual.songselect_box=this.songselect_box;
        this.playInfoBoxVisual.currentLevelData=this.songselect_box.levelArray;
        this.playInfoBoxVisual.updateCurrentLevel(this.songselect_box.levelArray[0]);
        


        setTimeout(() => 
        {
            if (this.songselect_box.levelArray && this.songselect_box.levelArray.length > 0) {
                const initialLeaderboardId = this.songselect_box.levelArray[0].fireBaseLevelLeaderBoard;
                this.leaderboardbox.populateAndDraw(initialLeaderboardId);
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
       this.leaderboardbox.draw(); 
       this.songselect_box.draw();  
      this.playInfoBoxVisual.draw(); 

    }


    dispose()
    {
        this.canvas.removeEventListener('click', () => this.handleCanvasClick());
        this.leaderboardbox = null;
        this.mediaPipe = null;
        this.canvas =  null;
        this.ctx = null;
        this.playInfoBoxVisual.dispose();
        this.songselect_box.dispose();
    }
}

   

   