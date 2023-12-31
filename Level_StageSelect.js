
import MediaPipeTracker from './MediaPipeTracker.js';
import UIManager from './UIManager_Recorder.js';
import LeaderBoard_Box from './LeaderBoard_Box.js';
import PlayInfoBoxVisual from './PlayInfoBoxVisual.js';
import SongSelect_BoxSelectVisual from './SongSelect_Box.js';
import SongSelect_Box from './SongSelect_Box.js';
import BlueButton from './BlueButton.js';



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





        // Button positions (You may need to adjust these positions to fit your layout)
        const leftButtonX = 100; // for example, 100 pixels from the left
        const rightButtonX = this.canvas.width - 300; // for example, 300 pixels from the right edge
        const buttonY = this.canvas.height / 2 + 400; // vertical center for demonstration
        const buttonWidth = 150;
        const buttonHeight = 50;
        const buttonRadius = 10;

         // 'Level Select' button specific code
         this.titlePage = new BlueButton
         (
             leftButtonX,
             buttonY,
             buttonWidth,
             buttonHeight,
             buttonRadius,
             "#00008B",
             "#0000CD",
             "Tite Page",
             "rgba(0, 0, 0, 0.5)",
             { levelName: "TitlePage"},
             (actionData) => 
             {
                 // Dispatching event for a different level selections
                // actionData.leaderBoardState = "latestScores";
                console.log("Level_BasicTouch Select Button clicked, dispatching levelChange event with details:", actionData);
                 document.dispatchEvent(new CustomEvent('levelChange', { detail: actionData }));
 
             }
         );
 
    }


    level_loop() 
    {
        //Added this for bg image.
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw the background image
        this.ctx.drawImage(this.backgroundImage, 0, 0, this.canvas.width, this.canvas.height);

        // mediapipe stuff
        let results = this.mediaPipe.results;
        if (results == undefined) { return; }

       this.leaderboardbox.draw(); 
       this.songselect_box.draw();  
       this.playInfoBoxVisual.draw(); 

       this.titlePage .draw();


    }


    dispose() 
    {
        console.log("Disposing LevelSelect_Stage...")
        // Remove any global event listeners related to this level
        window.removeEventListener('songSelected', this.boundUpdateCurrentLevel);

        // Dispose of components that have their own dispose methods
        if (this.playInfoBoxVisual && typeof this.playInfoBoxVisual.dispose === 'function') {
            this.playInfoBoxVisual.dispose();
        }
        if (this.songselect_box && typeof this.songselect_box.dispose === 'function') {
            this.songselect_box.dispose();
        }
        if (this.leaderboardbox && typeof this.leaderboardbox.dispose === 'function') {
            this.leaderboardbox.dispose();
        }


        // Dispose of buttons if they have a dispose method
        if (this.titlePage  && typeof this.titlePage .dispose === 'function') {
        this.titlePage .dispose();
        }
    

        // Nullify references to DOM elements and external objects
        this.canvas = null;
        this.ctx = null;
        this.backgroundImage = null; // Ensure backgroundImage is also nullified

        // Nullify references to internal objects and components
        this.playInfoBoxVisual = null;
        this.songselect_box = null;
        this.leaderboardbox = null;
        this.mediaPipe = null;
    }
}



   