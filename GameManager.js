

import Level_05 from './Level_05_Recorder.js'
//import JustDance from './Level_JustDance.js'
import Level_StageSelect from './Level_StageSelect.js'

export default class GameManager {
    constructor() 
    {
    this.currentLevel = new Level_StageSelect()
      // this.currentLevel = new Level_05()
       //this.currentLevel = new JustDance()
     //  document.addEventListener('levelChange', this.handleLevelChange.bind(this));
        document.addEventListener('levelChange', async (event) => {
        const levelName = event.detail.levelName; // This would be a string like 'JustDance'
        try {
          const module = await import(`./${levelName}.js`);
          const LevelClass = module.default; // Assumes the class is the default export
          const levelInstance = new LevelClass();
          console.log(this.currentLevel);

          this.currentLevel.dispose();
          this.currentLevel = null;
          this.currentLevel=levelInstance;

          // Now use levelInstance as needed
        } catch (error) {
          console.error('Failed to load level module:', error);
        }
      });

    }    
}
