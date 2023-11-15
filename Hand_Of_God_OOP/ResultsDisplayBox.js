import BoxUI from './BoxUI.js'; // Ensure BoxUI.js is in the same directory
import BlueButton from './BlueButton.js'; // Import the BlueButton class


export default class ResultsDisplayBox 
{
  constructor(_resultsData)
  {
    //this.ctx = ctx;
    this.canvas = document.getElementById("output_canvas");;
    this.ctx = this.canvas.getContext("2d");
    this.resizeFactor = 1;
    this.offsetX = 0;
    this.offsetY = 0;
    this.width = 800;
    this.height = 400;
    this.radius = 50;
    this.boxColor = 'rgba(0, 0, 0, 0.7)';
    this.textColor = 'white';
    this.levelArrayDataObject = _resultsData.levelData;
    console.log(this.levelArrayDataObject);

    // Define properties for the text for different states
    this.fontSize = 48; // Base font size, can be scaled for different texts

    this.box = new BoxUI(
      this.ctx,
      this.offsetX,
      this.offsetY,
      this.width * this.resizeFactor,
      this.height * this.resizeFactor,
      this.radius
    );

    // Variables to hold the state and data
    this.state = 'levelComplete'; // Default state
    this.score = 0;
    this.rank = 'C';
    this.isNewHighScore = false;

    //this.levelArrayDataObject = _levelArrayDataObject; //important, has all mp3,json etc..


  // Button positions (You may need to adjust these positions to fit your layout)
    const leftButtonX = 200; // for example, 100 pixels from the left
    const rightButtonX = this.canvas.width - 500; // for example, 300 pixels from the right edge
    const buttonY = this.canvas.height / 2 + 400; // vertical center for demonstration
    const buttonWidth = 150;
    const buttonHeight = 50;
    const buttonRadius = 10;



    // 'Level Select' button specific code
    this.levelSelectButton = new BlueButton
    (
      //  this.ctx,
        leftButtonX,
        buttonY,
        buttonWidth,
        buttonHeight,
        buttonRadius,
        "#00008B",
        "#0000CD",
        "Level Select",
        "rgba(0, 0, 0, 0.5)",
        { levelName: "Level_StageSelect",leaderBoardState: "latestScores"},
        (actionData) => {
            // Dispatching event for a different level selection
           // actionData.leaderBoardState = "latestScores";
            document.dispatchEvent(new CustomEvent('levelChange', { detail: actionData }));
            console.log("Level Select Button clicked, dispatching levelChange event with details:", actionData);
        }
    );


      
        // 'Restart' button specific code
        this.restartButton = new BlueButton
        (
           // this.ctx,
            rightButtonX,
            buttonY,
            buttonWidth,
            buttonHeight,
            buttonRadius,
            "#8B0000",
            "#CD5C5C",
            "Restart",
            "rgba(0, 0, 0, 0.5)",
            this.levelArrayDataObject,
            (actionData) => 
            {
                this.levelArrayDataObject.levelName = "Level_BasicTouch";
                // Dispatching event to restart the game or level
                document.dispatchEvent(new CustomEvent('levelChange', { detail: actionData }));
                console.log("Restart Button clicked, dispatching levelChange event with details:", actionData);
            }
        );


      }







  draw() 
  {
    this.ctx.fillStyle = this.boxColor;
    this.box.draw();

    this.ctx.fillStyle = this.textColor;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    // Switch case to handle different states
    switch (this.state) 
    {

      case 'levelComplete':
        // Draw 'Level Complete' text and other details
        this.ctx.font = `${this.fontSize}px Arial`;
        this.ctx.fillText('Level Complete', this.offsetX + this.width / 2, this.offsetY + 100);
        this.ctx.font = `${this.fontSize * 1.5}px Arial`; // Larger font for score
        this.ctx.fillText(this.score, this.offsetX + this.width / 2, this.offsetY + 200);
        if (this.isNewHighScore) {
          this.ctx.font = `${this.fontSize}px Arial`;
          this.ctx.fillText('New High Score!', this.offsetX + this.width / 2, this.offsetY + 300);
        }
        this.ctx.font = `${this.fontSize * 3}px Arial`; // Even larger font for rank
        this.ctx.fillText(this.rank, this.offsetX + this.width / 2, this.offsetY + this.height - 100);

        this.levelSelectButton.draw();
        this.restartButton.draw();
        break;




      case 'levelFailed':
        // Draw 'Level Failed' text
        this.ctx.font = `${this.fontSize}px Arial`;
        this.ctx.fillText('Level Failed', this.offsetX + this.width / 2, this.offsetY + this.height / 2);
        break;




        
      case 'levelCompleteCampaign':
        // For now, this will be the same as 'levelComplete'
        // Future code for buttons and additional information will go here
        break;
    }
  }

  setState(newState, score, rank, isNewHighScore) 
  {
    this.state = newState;
    this.score = score || 0;
    this.rank = rank || 'C';
    this.isNewHighScore = isNewHighScore || false;
  }

  resizeAndReposition(factor, offsetX, offsetY) 
  {
    this.resizeFactor = factor;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.box.width = this.width * this.resizeFactor;
    this.box.height = this.height * this.resizeFactor;
    this.box.x = offsetX;
    this.box.y = offsetY;
  }




  dispose() 
  {

    this.box.dispose();
    this.box = null;

    /*this.canvas = null;
    this.ctx = null;
    this.resizeFactor = null;
    this.offsetX =null;
    this.offsetY = null;
    this.width = null;
    this.height = null;
    this.radius = null;
    this.boxColor = null;
    this.textColor = null;
    this.levelArrayDataObject = null;
    this.fontSize = null;

    this.state = null;
    this.score = null;
    this.rank = null;
    this.isNewHighScore = null;

    const leftButtonX = null;
    const rightButtonX = null;
    const buttonY =null;
    const buttonWidth =null;
    const buttonHeight =null;
    const buttonRadius =null;

    this.levelSelectButton.dispose();
    this.levelSelectButton = null;

    // null varialbes  ( maybe better to set to undefined )
    // dispose objects ( aka classs )
    // null objects ( after disposal )
    // removeEvnetListeners*/
  }

  
}
