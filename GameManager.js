
// Assuming you have a Level_TitlePage class similar to Level_StageSelect
import TitlePage from './TitlePage.js';
import Level_StageSelect from './Level_StageSelect.js'
import Level_ResultsStage from './Level_ResultsStage.js'; // Make sure the path is correct
import Level_BasicSwipe from './Level_BasicSwipe.js';





export default class GameManager 
{
    constructor() 
    {
            this.currentLevel = new TitlePage(); // Start the game with the title page
            //this.currentLevel = new Level_BasicSwipe(); // Start the game with the title page

            // this.currentLevel = new Level_ResultsStage();

            this.currentLevelData = null; // To keep track of level-specific data
            this.levelSelectPath = 'Level_StageSelect'; // The path to the level select screen
            document.addEventListener('levelChange', this.handleLevelChange.bind(this));


        
    }





    // Method to handle level changes
    async handleLevelChange(event) {
      console.log("Handling level change. Event received:", event);

      const levelName = event.detail.levelName;
      console.log("Requested level:", levelName);

      try {
        console.log("Loading new level:", levelName);

        const module = await import(`./${levelName}.js`);
        const LevelClass = module.default;
    
        // Instantiate the new level with the provided details
        const levelInstance = new LevelClass(event.detail);
    
        // Dispose of the current level, if it exists
        if (this.currentLevel && this.currentLevel.dispose) {
          this.currentLevel.dispose();
        }
    
        // Assign the new level instance to this.currentLevel
        this.currentLevel = levelInstance;
        console.log("New level loaded:", this.currentLevel);

      } catch (error) {
        console.error('Failed to load level module:', error);
      }
    }
    
    

    // Method to go to the title page
    goToTitlePage() 
    {
        this.handleLevelChange({ detail: { levelName: 'Level_TitlePage' } });
    }


      // Method to go to the level select screen
    goToLevelSelect() 
    {
      // Check if the current level is TitlePage and if it has a dispose method
      if (this.currentLevel instanceof TitlePage && typeof this.currentLevel.dispose === 'function') {
          // Call the dispose method of TitlePage
          this.currentLevel.dispose();
      }

      // After disposing of TitlePage, handle changing to the new level
      this.handleLevelChange({ detail: { levelName: this.levelSelectPath } });
    }
}
