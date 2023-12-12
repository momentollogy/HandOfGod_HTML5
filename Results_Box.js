import BoxUI from './BoxUI.js'; // Ensure BoxUI.js is in the same directory
import BlueButton from './BlueButton.js'; // Import the BlueButton class


export default class Results_Box 
{
  constructor(_resultsData,rank)
  
  {


    this.canvas = document.getElementById("output_canvas");;
    this.ctx = this.canvas.getContext("2d");
    this.resizeFactor = 1;
    this.offsetX =  540
    this.offsetY = 300;
    this.width = 800;
    this.height = 400;
    this.radius = 50;
    this.boxColor = 'rgba(0, 0, 0, 0.4)';
    this.textColor = 'white';
    this.levelArrayDataObject = _resultsData.levelData;

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
    //this.state = 'levelComplete'; // Default state
    this.state = _resultsData.state;
    this.score = _resultsData.score;

    this.totalNotes = _resultsData.totalNotes; // Store total notes from results data
    
    this.grade = this.calculateGrade(this.score); 

    this.rank = _resultsData.rank;
    this.isNewHighScore = true;



  // Button positions (You may need to adjust these positions to fit your layout)
    const leftButtonX = 580; // LEVEL SELZ for example, 100 pixels from the left
    const rightButtonX = this.canvas.width - 770; // RESTART BUTTON, EX 500 pixels from the right edge
    const buttonY = this.canvas.height / 2 + 75; // vertical center for demonstration
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
        }
    );




        // 'Restart' button specific code
        this.restartButton = new BlueButton
        (
            rightButtonX,
            buttonY,
            buttonWidth,
            buttonHeight,
            buttonRadius,
            "#8B0000",
            "#CD5C5C",
            "Try Again",
            "rgba(0, 0, 0, 0.5)",
            this.levelArrayDataObject,
            (actionData) => 
            {
              this.dispose();

                // Dispatching event to restart the game or level
                document.dispatchEvent(new CustomEvent('levelChange', { detail: actionData }));
            }
        );

  }


      calculateMaxPossibleScore(totalNotes) {
        let scorePerNote = 100;
        let maxScore = 0;
        let comboMultiplier = 1;

      //  console.log("Calculating max score for total notes:", this.totalNotes);


        for (let i = 1; i <= this.totalNotes; i++) {
            if (i >= 14) {
                comboMultiplier = 8;
            } else if (i >= 6) {
                comboMultiplier = 4;
            } else if (i >= 2) {
                comboMultiplier = 2;
            }
            maxScore += scorePerNote * comboMultiplier;
          //  console.log(`Note ${i}: Combo Multiplier: ${comboMultiplier}, Max Score: ${maxScore}`);

        }

        return maxScore;
    }

    calculateGrade(score, totalNotes) {
    //  console.log("Total notes in calulate grade method:", this.totalNotes);

      let maxScore = this.calculateMaxPossibleScore(this.totalNotes);
      let scorePercentage = (score / maxScore) * 100;

     // console.log("Calculating grade - Score:", score, "Max Score:", maxScore, "Score Percentage:", scorePercentage);

  
      if (scorePercentage >= 100) {
          return 'SSS'; // Exactly 100% for SSS
      } else if (scorePercentage >= 90) {
          return 'SS'; // 90% to less than 100% for SS
      } else if (scorePercentage >= 80) {
          return 'S'; // 80% to less than 90% for S
      } else if (scorePercentage >= 65) {
          return 'A'; // 65% to less than 80% for A
      } else if (scorePercentage >= 50) {
          return 'B'; // 50% to less than 65% for B
      } else if (scorePercentage >= 35) {
          return 'C'; // 35% to less than 50% for C
      } else if (scorePercentage >= 20) {
          return 'D'; // 20% to less than 35% for D
      } else {
          return 'E'; // Below 20% for E
      }
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
        // Draw text 'Level Complete' 
        this.ctx.font = `${this.fontSize * 1.25}px Helvetica`;
        this.ctx.fillText('Level Complete', this.offsetX + this.width / 2, this.offsetY + 75);


        //Draw "Score" text
        this.ctx.font = `${this.fontSize / 2.5}px Arial`;
        this.ctx.fillText('SCORE', this.offsetX + this.width / 2, this.offsetY +140);

         //Draw "GRADE" text
         this.ctx.font = `${this.fontSize / 2.5}px Arial`;
         this.ctx.fillText('GRADE', this.offsetX + this.width / 2 +300, this.offsetY +140);


        //Draw "RANK" text
        this.ctx.font = `${this.fontSize / 2.5}px Arial`;
        this.ctx.fillText('RANK', this.offsetX + this.width / 2 -300, this.offsetY +140);
    
 
         
        // Draw the "high score" if high score true.
        if (this.isNewHighScore) 
        {
          this.ctx.font = `${this.fontSize / 2.5}px Arial`;
          this.ctx.fillText('NEW HIGH SCORE!', this.offsetX + this.width / 2, this.offsetY + 275);
        }

        //----Calculated below ALL data in YELLOW-----//
        this.ctx.fillStyle = 'yellow'; // Text color for everyhing below

        // Draw the calulated SCORE
        this.ctx.font = `${this.fontSize * 1.25}px Arial`; // Larger font for score
        this.ctx.fillText(this.score, this.offsetX + this.width / 2, this.offsetY + 200);

        // Draw Calulated Grade
        this.ctx.font = `${this.fontSize * 1.25}px Arial`; // Even larger font for grade
        this.ctx.fillText(this.grade, this.offsetX + this.width / 2 +300, this.offsetY +200);


        // Draw Calulated RANK
        this.ctx.font = `${this.fontSize * 1.25}px Arial`; // Even larger font for rank
        this.ctx.fillText(this.rank, this.offsetX + this.width / 2 -300, this.offsetY +200);

   



       

        this.levelSelectButton.draw();
        this.restartButton.draw();
        break;

      case 'levelFailed':
        // Draw 'LEVEL FAILED' text
        this.ctx.fillStyle = 'RED'; // Text color for everyhing below

        this.ctx.font = `${this.fontSize * 1.5}px Arial`;
        this.ctx.fillText('Level Failed', this.offsetX + this.width / 2, this.offsetY + this.height / 2);
        this.levelSelectButton.draw();
        this.restartButton.draw();
        break;



      case 'levelCompleteCampaign':
        // For now, this will be the same as 'levelComplete'
        // Future code for buttons and additional information will go here
        break;
    }
  }



  setState(newState, score, grade, isNewHighScore, rank) 
  {
    this.state = newState;
    this.score = score || 0;
    this.grade = grade || 'C';
    this.rank = rank || 'N/A'; 
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


  dispose() {
   // console.log("Disposing Results_Box...");

    if (this.box) {
        this.box.dispose();
    }

    if (this.levelSelectButton) {
        this.levelSelectButton.dispose();
    }

    if (this.restartButton) {
        this.restartButton.dispose();
    }
  }

  
}
