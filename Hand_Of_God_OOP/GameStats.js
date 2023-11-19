export class GameStats 
{
   constructor(missLimit = 20) {
       this.score = 0;
       this.combo = 0;
       this.misses = 0;
       this.comboMultiplier = 1;
       this.missLimit = missLimit;
   }

   increaseCombo() {
       this.combo++;
       this.updateComboMultiplier();
   }

   resetCombo() {
       this.combo = 0;
       this.comboMultiplier = 1;
   }

   addMiss() {
       this.misses++;
   }

   removeMiss() {
       if (this.misses > 0) {
           this.misses--;
       }
   }

   addScore(percentAccuracy) {
       this.score += percentAccuracy * this.comboMultiplier;
   }

   updateComboMultiplier() {
       if (this.combo >= 14) {
           this.comboMultiplier = 8;
       } else if (this.combo >= 6) {
           this.comboMultiplier = 4;
       } else if (this.combo >= 2) {
           this.comboMultiplier = 2;
       } else {
           this.comboMultiplier = 1;
       }
   }

   dispose() 
   {
    // Reset all properties to their initial values
    this.score = 0;
    this.combo = 0;
    this.misses = 0;
    this.comboMultiplier = 1;

    // If there are additional resources or references, clean them up here
    }

}
