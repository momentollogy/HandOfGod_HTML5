
// LeaderBoardVisual.js
// Class for visualizing the leaderboard, including text and interactions with Firebase.

import BoxUI from './BoxUI.js';
//import { getTopScores } from './Leaderboard.js'; // Update the path if necessary
<<<<<<< HEAD
import { getTopScores, getLatestScore, getPlayerTopScores } from './Leaderboard.js';
=======
import { getTopScores, getLatestScore, getPlayerTopScores } from './Leaderboard.js'; // Adjust the path if necessary
>>>>>>> HeadDeleteSoon


export default class LeaderBoardVisual {
    constructor() {
        this.scores = []; // Placeholder for scores
        this.canvas = document.getElementById("output_canvas");
        this.ctx = this.canvas.getContext("2d");


        this.boundLevelSelected = this.levelSelected.bind(this);
        window.addEventListener('levelSelected', this.boundLevelSelected);

        // Box properties
        this.RESIZE_FACTOR = 0.8;
        this.POSITION_OFFSET_X = -610;
        this.POSITION_OFFSET_Y = 0;
        this.LEADERBOARD_WIDTH = 700 * this.RESIZE_FACTOR;
        this.LEADERBOARD_HEIGHT = 800;
        this.LEADERBOARD_X = ((1920 - this.LEADERBOARD_WIDTH) / 2) + this.POSITION_OFFSET_X;
        this.LEADERBOARD_Y = ((1080 - this.LEADERBOARD_HEIGHT) / 2) + this.POSITION_OFFSET_Y;
        this.LEADERBOARD_RADIUS = 100;
        
        // Header and score styling variables
        this.HEADER_HEIGHT = 155;
        this.HEADER_FONT_SIZE = 50;
        this.SCORE_FONT_SIZE = 30;
        this.SCORE_LINE_HEIGHT = 50;
        this.SCORE_MARGIN_LEFT = 50;
        this.SCORE_MARGIN_RIGHT = 50;

        // Create BoxUI instance
        this.leaderboardBox = new BoxUI(
            this.ctx,
            this.LEADERBOARD_X,
            this.LEADERBOARD_Y,
            this.LEADERBOARD_WIDTH,
            this.LEADERBOARD_HEIGHT,
            this.LEADERBOARD_RADIUS
            // No resize factor or offsets here, as they are already calculated in width and X, Y positions.
        );

        // Immediately attempt to populate and draw the leaderboard
        this.populateAndDraw();
        
    }

    draw() {
        this.ctx.save();
        // Set the style for the box
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        
        // Draw the box with rounded edges
        this.leaderboardBox.draw();

        // Draw the HIGHSCORES header, centered within the leaderboard
        this.ctx.font = `${this.HEADER_FONT_SIZE}px Verdana`;
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText(
            "HIGHSCORES", 
            this.LEADERBOARD_X + (this.LEADERBOARD_WIDTH / 2), 
            this.LEADERBOARD_Y + this.HEADER_HEIGHT / 2 + 37
        );

        // Draw the scores
        this.ctx.font = `${this.SCORE_FONT_SIZE}px Verdana`;
        let startY = this.LEADERBOARD_Y + this.HEADER_HEIGHT + this.SCORE_LINE_HEIGHT;
        for (let i = 0; i < this.scores.length && i < 10; i++) {
            this.ctx.textAlign = "left";
            this.ctx.fillText(
                (i + 1).toString(), 
                this.LEADERBOARD_X + this.SCORE_MARGIN_LEFT, 
                startY + (i * this.SCORE_LINE_HEIGHT)
            );

            this.ctx.textAlign = "center";
            this.ctx.fillText(
                this.scores[i].playerName, 
                this.LEADERBOARD_X + (this.LEADERBOARD_WIDTH / 2), 
                startY + (i * this.SCORE_LINE_HEIGHT)
            );

            this.ctx.textAlign = "right";
            this.ctx.fillText(
                this.scores[i].score.toString(), 
                this.LEADERBOARD_X + this.LEADERBOARD_WIDTH - this.SCORE_MARGIN_RIGHT, 
                startY + (i * this.SCORE_LINE_HEIGHT)
            );
        }
        this.ctx.restore();
    }

    // Handle the levelSelected event
    levelSelected(event) 
    {
        const selectedLevelLeaderboard = event.detail.fireBaseLevelLeaderBoard;
        this.populateAndDraw(selectedLevelLeaderboard);
    }
  

<<<<<<< HEAD
    // LeaderBoardVisual.js

async populateAndDraw(fireBaseLevelLeaderBoard) 
{

        // Existing logic to fetch the top 10 scores
        let topScores = await getTopScores(fireBaseLevelLeaderBoard);
        let transformedTopScores = topScores.map(score => ({
=======
    
    async populateAndDraw(fireBaseLevelLeaderBoard) {
        // Fetch the top scores
        let topScores = await getTopScores(fireBaseLevelLeaderBoard); 
        let transformedTopScores = topScores.map(score => ({
            playerName: score.name,
            score: score.score
        }));
    
        // Fetch the most recent score and surrounding scores
        let latestScoreData = await getLatestScore(fireBaseLevelLeaderBoard);
        let recentRank = latestScoreData.rank;
    
        // Calculate the rank for each surrounding score
        let transformedLatestScores = latestScoreData.surroundingScores.map((score, index) => {
            let rankAdjustment = index - latestScoreData.surroundingScores.indexOf(latestScoreData.recentScoreData);
            let rank = recentRank + rankAdjustment;
            return {
                rank: rank,
                playerName: score.name,
                score: score.score
            };
        });


          // Fetch the top 10 scores of the current player
          let playerTopScores = await getPlayerTopScores(fireBaseLevelLeaderBoard);
          let transformedPlayerTopScores = playerTopScores.map(score => ({
              playerName: score.name,
              score: score.score
          }));
  
    
        // Log the scores for debugging
        console.log("Top 10 Scores:", transformedTopScores);
        console.log("Most Recent Score and Surrounding Scores:", transformedLatestScores);
        console.log("Top 10 Scores of the Current Player:", transformedPlayerTopScores);

    
        // Additional code for handling player's top scores
        // ...
    }
    



/* Might pull playname if needed

    async populateAndDraw(fireBaseLevelLeaderBoard) 
    {
    
            // Existing logic to fetch the top 10 scores
            let topScores = await getTopScores(fireBaseLevelLeaderBoard);
            let transformedTopScores = topScores.map(score => ({
                playerName: score.name,
                score: score.score
            }));
    
    
    
         // Fetch the most recent score and surrounding scores
            let latestScoreData = await getLatestScore(fireBaseLevelLeaderBoard);
            let recentRank = latestScoreData.rank;
    
            let transformedLatestScores = latestScoreData.surroundingScores.map((score, index) => {
                let rank = recentRank - latestScoreData.surroundingScores.length + index + 1;
                return {
                    rank: rank,
                    playerName: score.name,
                    score: score.score
                };
            });
    
    
            // Fetch the top 10 scores of the current player
            let playerTopScores = await getPlayerTopScores(fireBaseLevelLeaderBoard);
            let transformedPlayerTopScores = playerTopScores.map(score => ({
                playerName: score.name,
                score: score.score
            }));
    
        // Log the 10 scores for the three different states
        console.log("Top 10 Scores:", transformedTopScores);
        console.log("Most Recent Score and Surrounding Scores:", transformedLatestScores);
        console.log("Top 10 Scores of the Current Player:", transformedPlayerTopScores);
    }
    

*/





    update(newScores) {
        this.scores = newScores;
    }

    dispose() {
        window.removeEventListener('levelSelected', this.boundLevelSelected);
        // ... other cleanup code ...
      }
}




/* old working function for recieve and populate only top 10

async populateAndDraw(fireBaseLevelLeaderBoard) {
        // Fetch the top scores
        let topScores = await getTopScores(fireBaseLevelLeaderBoard); // Adjust getTopScores to accept an id
        
        // Transform the scores to match what the draw function expects
       let transformedScores = topScores.map(score => ({
>>>>>>> HeadDeleteSoon
            playerName: score.name,
            score: score.score
        }));



     // Fetch the most recent score and surrounding scores
        let latestScoreData = await getLatestScore(fireBaseLevelLeaderBoard);
        let recentRank = latestScoreData.rank;

        let transformedLatestScores = latestScoreData.surroundingScores.map((score, index) => {
            let rank = recentRank - latestScoreData.surroundingScores.length + index + 1;
            return {
                rank: rank,
                playerName: score.name,
                score: score.score
            };
        });

   



        // Fetch the top 10 scores of the current player
        let playerTopScores = await getPlayerTopScores(fireBaseLevelLeaderBoard);
        let transformedPlayerTopScores = playerTopScores.map(score => ({
            playerName: score.name,
            score: score.score
        }));

    // Log the 10 scores for the three different states
    console.log("Top 10 Scores:", transformedTopScores);
    console.log("Most Recent Score and Surrounding Scores:", transformedLatestScores);
    console.log("Top 10 Scores of the Current Player:", transformedPlayerTopScores);

    // Update the leaderboard scores based on the currently selected state
    // this.update(transformedScores); // Uncomment and modify this line as per the current state
    // this.draw(); // Display the updated leaderboard scores
}


    */