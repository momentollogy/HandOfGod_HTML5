//SplashScreens.js
import BoxUI from './BoxUI.js'; // Ensure BoxUI.js is in the same directory

export default class SplashScreens {
  constructor(ctx) {
    // Store the canvas rendering context
    this.ctx = ctx;

    // Define properties for the splash screen
    this.resizeFactor = 1; // Can be adjusted to scale the splash screen
    this.offsetX = 0; // Can be adjusted to move the splash screen on the x-axis
    this.offsetY = 0; // Can be adjusted to move the splash screen on the y-axis
    this.width = 800; // Width of the splash screen box
    this.height = 400; // Height of the splash screen box
    this.radius = 50; // Radius for rounded corners of the box
    this.boxColor = 'rgba(0, 0, 0, 0.7)'; // Background color of the box

    // Define properties for the text
    this.levelClearedFontSize = 48; // Font size for 'Level Cleared' text
    this.scoreFontSize = 72; // Font size for the score
    this.newHighScoreFontSize = 30; // Font size for 'New High Score' text
    this.rankFontSize = 150; // Font size for the rank letter
    this.textColor = 'white'; // Color of the text

    // Create the BoxUI instance
    this.box = new BoxUI(
      this.ctx,
      this.offsetX,
      this.offsetY,
      this.width * this.resizeFactor,
      this.height * this.resizeFactor,
      this.radius
    );

    // Variables to hold the score and rank data
    this.score = 0;
    this.rank = 'C';
    this.isNewHighScore = false; // This could be set based on game logic
  }

  draw() {
    // Draw the box
    this.ctx.fillStyle = this.boxColor;
    this.box.draw();

    // Set the text styles
    this.ctx.fillStyle = this.textColor;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';

    // Draw the 'Level Cleared' text
    this.ctx.font = `${this.levelClearedFontSize}px Arial`;
    this.ctx.fillText('Level Cleared', this.offsetX + this.width / 2, this.offsetY + 100);

    // Draw the score
    this.ctx.font = `${this.scoreFontSize}px Arial`;
    this.ctx.fillText(this.score, this.offsetX + this.width / 2, this.offsetY + 200);

    // Optionally, draw 'New High Score' text
    if (this.isNewHighScore) {
      this.ctx.font = `${this.newHighScoreFontSize}px Arial`;
      this.ctx.fillText('New High Score!', this.offsetX + this.width / 2, this.offsetY + 300);
    }

    // Draw the rank
    this.ctx.font = `${this.rankFontSize}px Arial`;
    this.ctx.fillText(this.rank, this.offsetX + this.width / 2, this.offsetY + this.height - 100);
  }

  // Method to update the score and rank
  updateScoreAndRank(newScore, newRank) {
    this.score = newScore;
    this.rank = newRank;
  }

  // Method to resize and reposition the splash screen
  resizeAndReposition(factor, offsetX, offsetY) {
    this.resizeFactor = factor;
    this.offsetX = offsetX;
    this.offsetY = offsetY;
    this.box.width = this.width * this.resizeFactor;
    this.box.height = this.height * this.resizeFactor;
    this.box.x = offsetX;
    this.box.y = offsetY;
  }
}
