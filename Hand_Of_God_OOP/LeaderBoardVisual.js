
// LeaderBoardVisual.js
// Class for visualizing the leaderboard, including text and interactions with Firebase.

import BoxUI from './BoxUI.js';
import { getTopScores, getLatestScore, getPlayerTopScores } from './Leaderboard.js'; // Adjust the path if necessary


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

                const defaultLeaderboardId = "JustDance_easy_LeaderBoard";


        // Immediately attempt to populate and draw the leaderboard
         this.populateAndDraw(defaultLeaderboardId, 'topScores');

        
    }

    draw() {
        this.ctx.save();
        // Set the style for the box
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        this.leaderboardBox.draw();
    
        // Draw the HIGHSCORES header
        this.ctx.font = `${this.HEADER_FONT_SIZE}px Verdana`;
        this.ctx.fillStyle = "white";
        this.ctx.textAlign = "center";
        this.ctx.fillText(
            "HIGHSCORES", 
            this.LEADERBOARD_X + (this.LEADERBOARD_WIDTH / 2), 
            this.LEADERBOARD_Y + this.HEADER_HEIGHT / 2 + 37
        );
    
        // Start of new code for drawing the scores
        let startY = this.LEADERBOARD_Y + this.HEADER_HEIGHT + this.SCORE_LINE_HEIGHT;
    
        if (this.scores && this.scores.length > 0) {
            // Check if the scores include a 'rank' property
            let includesRank = 'rank' in this.scores[0];
    
            for (let i = 0; i < this.scores.length && i < 10; i++) {
                let scoreItem = this.scores[i];
    
                // Draw the rank or index
                this.ctx.font = `${this.SCORE_FONT_SIZE}px Verdana`;
                this.ctx.fillStyle = "white";
    
                if (includesRank) {
                    this.ctx.textAlign = "left";
                    this.ctx.fillText(
                        scoreItem.rank.toString(), 
                        this.LEADERBOARD_X + this.SCORE_MARGIN_LEFT, 
                        startY + (i * this.SCORE_LINE_HEIGHT)
                    );
                } else {
                    this.ctx.textAlign = "left";
                    this.ctx.fillText(
                        (i + 1).toString(), 
                        this.LEADERBOARD_X + this.SCORE_MARGIN_LEFT, 
                        startY + (i * this.SCORE_LINE_HEIGHT)
                    );
                }
    
                // Draw player name
                this.ctx.textAlign = "center";
                this.ctx.fillText(
                    scoreItem.playerName, 
                    this.LEADERBOARD_X + (this.LEADERBOARD_WIDTH / 2), 
                    startY + (i * this.SCORE_LINE_HEIGHT)
                );
    
                // Draw score
                this.ctx.textAlign = "right";
                this.ctx.fillText(
                    scoreItem.score.toString(), 
                    this.LEADERBOARD_X + this.LEADERBOARD_WIDTH - this.SCORE_MARGIN_RIGHT, 
                    startY + (i * this.SCORE_LINE_HEIGHT)
                );
            }
        }
    
        this.ctx.restore();
    }



    

    // Handle the levelSelected event
    levelSelected(event) 
    {
        const selectedLevelLeaderboard = event.detail.fireBaseLevelLeaderBoard;
        this.populateAndDraw(selectedLevelLeaderboard, 'topScores');
    }
    //topScores   latestScores



    async populateAndDraw(fireBaseLevelLeaderBoard, dataType) {
        let transformedScores;
    
        switch (dataType) {
            case 'topScores': {
                let topScores = await getTopScores(fireBaseLevelLeaderBoard); 
                transformedScores = topScores.map(score => ({
                    playerName: score.name,
                    score: score.score
                }));
                break;
            }
    
            case 'latestScores': {
                let latestScoreData = await getLatestScore(fireBaseLevelLeaderBoard);
                transformedScores = latestScoreData.surroundingScores.map((score, index) => {
                    let rankAdjustment = index - latestScoreData.surroundingScores.indexOf(latestScoreData.recentScoreData);
                    let rank = latestScoreData.rank + rankAdjustment;
                    return {
                        rank: rank,
                        playerName: score.name,
                        score: score.score
                    };
                });
                break;
            }
    
            case 'PlayerTopScores': {
                let playerTopScores = await getPlayerTopScores(fireBaseLevelLeaderBoard);
                transformedScores = playerTopScores.map(score => ({
                    playerName: score.name,
                    score: score.score
                }));
                break;
            }
        }
    
        this.update(transformedScores);
        this.draw();
    }
    

/*
    async populateAndDraw(fireBaseLevelLeaderBoard, dataType) 
    {
        switch (dataType) 
        {
    
            case 'topScores': 
            {
                let topScores = await getTopScores(fireBaseLevelLeaderBoard); 
                let transformedTopScores = topScores.map(score => ({
                    playerName: score.name,
                    score: score.score
                }));
                console.log("Top 10 Scores:", transformedTopScores);
                this.update(transformedTopScores); // Update the leaderboard with top scores
                this.draw(); // Draw the updated leaderboard
                break;
            }
    


            case 'latestScores': 
            {
                let latestScoreData = await getLatestScore(fireBaseLevelLeaderBoard);
                let recentRank = latestScoreData.rank;
    
                let transformedLatestScores = latestScoreData.surroundingScores.map((score, index) => {
                    let rankAdjustment = index - latestScoreData.surroundingScores.indexOf(latestScoreData.recentScoreData);
                    let rank = recentRank + rankAdjustment;
                    return {
                        rank: rank,
                        playerName: score.name,
                        score: score.score
                    };
                });
                console.log("Latest Scores:", transformedLatestScores);
                this.update(transformedTopScores); // Update the leaderboard with top scores
                this.draw(); // Draw the updated leaderboard
                break;
            }


            case 'PlayerTopScores':
            {
                let playerTopScores = await getPlayerTopScores(fireBaseLevelLeaderBoard);
                let transformedPlayerTopScores = playerTopScores.map(score => ({
                    playerName: score.name,
                    score: score.score
                }));
                console.log("Player Top Scores:", transformedPlayerTopScores);
                this.update(transformedTopScores); // Update the leaderboard with top scores
                this.draw(); // Draw the updated leaderboard
                break;
            }
        }
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


