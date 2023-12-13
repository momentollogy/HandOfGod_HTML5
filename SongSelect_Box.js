
// Assuming the BoxUI class has been imported correctly
import BoxUI from './BoxUI.js';

export default class SongSelect_Box 
{
 
    constructor(playInfoBoxVisual) 
    {
        this.playInfoBoxVisual = playInfoBoxVisual;

    
        
        this.canvas = document.getElementById("output_canvas");
        this.ctx = this.canvas.getContext("2d");


        
        //FOr Scroll Bar
        this.itemsToShow = 10; // Display 10 items at a time
        this.scrollPosition = 0; // Start at the beginning of the list

        this.initialMouseY = 0;
        this.initialThumbPosition = 0;

        //for scrollbar mouse clicking
        this.isDraggingScrollbar = false;
        this.lastMouseY = 0;

        this.scrollbarHover = false;

        this.songHoverIndex = null;


        // Define the box properties, ensuring they can be modified dynamically
        this.RESIZE_FACTOR = 0.8;
        this.POSITION_OFFSET_X = 90;
        this.POSITION_OFFSET_Y = 0;
        this.LEADERBOARD_WIDTH = 800 * this.RESIZE_FACTOR;
        this.LEADERBOARD_HEIGHT = 800;
        this.LEADERBOARD_X = ((1920 - this.LEADERBOARD_WIDTH) / 2) + this.POSITION_OFFSET_X;
        this.LEADERBOARD_Y = ((1080 - this.LEADERBOARD_HEIGHT) / 2) + this.POSITION_OFFSET_Y;
        this.LEADERBOARD_RADIUS = 100;

        // Create an instance of BoxUI for the leaderboard
        this.box = new BoxUI(this.ctx,
                    this.LEADERBOARD_X,
                    this.LEADERBOARD_Y,
                    this.LEADERBOARD_WIDTH,
                    this.LEADERBOARD_HEIGHT,
                    this.LEADERBOARD_RADIUS);

        // Header and score styling variables
        this.HEADER_HEIGHT = 113;
        this.HEADER_FONT_SIZE = 50;
        this.SCORE_FONT_SIZE = 35;
        this.SCORE_LINE_HEIGHT = 50;
        this.SCORE_MARGIN_LEFT = 90;
        this.SCORE_MARGIN_TOP = 90; // You may want to adjust this as needed
        this.SCORE_MARGIN_RIGHT = 50;
        this.TEXT_ALIGN_LEFT = 90; // Margin from the left of the box to start text
        this.TEXT_ALIGN_TOP = this.HEADER_HEIGHT + this.SCORE_MARGIN_TOP; // Margin from the top of the box to start text
        this.TEXT_CENTER_X = this.LEADERBOARD_X + (this.LEADERBOARD_WIDTH / 2);

        // Initialize the level array and selected index here
        this.levelArray = [

                       
                        {
                            fileName: "Level_BasicSwipe",
                            levelDisplayName: "'GimmeGimme' ABBA",
                            fireBaseLevelLeaderBoard: "GimmeGimme_LB",
                            duration: "1:05",
                            mp3Path: "Level_Mp3AndJson/GimmeGimme/GimmeGimme.mp3",
                            jsonPaths: {
                            Easy: "Level_Mp3AndJson/GimmeGimme/GimmeGimmeEasy.json",
                            Medium: "Level_Mp3AndJson/GimmeGimme/GimmeGimmeMedium.json",
                            Hard: "Level_Mp3AndJson/GimmeGimme/GimmeGimmeHard.json",
                            Expert: "Level_Mp3AndJson/GimmeGimme/GimmeGimmeExpert.json"
                            }
                        },
                        {
                            fileName: "Level_BasicSwipe", 
                            levelDisplayName: "'Havana'  Camila Cabello", 
                            fireBaseLevelLeaderBoard: "Havana_LB",
                            duration: "1:07",
                            mp3Path:"Level_Mp3AndJson/Havana/Havana.mp3",
                            jsonPaths: {
                                Easy: "Level_Mp3AndJson/Havana/HavanaEasy.json",
                                Medium: "Level_Mp3AndJson/Havana/HavanaMedium.json",
                                Hard: "Level_Mp3AndJson/Havana/HavanaHard.json",
                                Expert: "Level_Mp3AndJson/Havana/HavanaExpert.json"
                                }
                            
                        },
                        {   
                            fileName: "Level_BasicSwipe", 
                            levelDisplayName: "'Houdini'  Dua Lipa", 
                            fireBaseLevelLeaderBoard: "Houdini_LB", 
                            duration: ":56",
                            mp3Path:"Level_Mp3AndJson/Houdini/Houdini.mp3", 
                            jsonPaths: {
                                Easy: "Level_Mp3AndJson/Houdini/HoudiniEasy.json",
                                Medium: "Level_Mp3AndJson/Houdini/HoudiniMedium.json",
                                Hard: "Level_Mp3AndJson/Houdini/HoudiniHard.json",
                                Expert: "Level_Mp3AndJson/Houdini/HoudiniExpert.json"
                                }
                        },
                       
                        {   
                            fileName: "Level_BasicSwipe", 
                            levelDisplayName: "'Dance The Night'  Dua Lipa", 
                            fireBaseLevelLeaderBoard: "DanceTheNight_LeaderBoard", 
                            duration: "1:05",
                            mp3Path:"Level_Mp3AndJson/DanceTheNight/DanceTheNight.mp3", 
                            jsonPaths: {
                                Easy: "Level_Mp3AndJson/DanceTheNight/DanceTheNightEasy.json",
                                Medium: "Level_Mp3AndJson/DanceTheNight/DanceTheNightMedium.json",
                                Hard: "Level_Mp3AndJson/DanceTheNight/DanceTheNightHard.json",
                                Expert: "Level_Mp3AndJson/DanceTheNight/DanceTheNightExpert.json"
                                }
                        },
                        {
                            fileName: "Level_BasicSwipe", 
                            levelDisplayName: "'BlankSpace'  Taylor Swift", 
                            fireBaseLevelLeaderBoard: "BlankSpace_LB",
                            duration: "1:07",
                            mp3Path:"Level_Mp3AndJson/BlankSpace/BlankSpace.mp3",
                            jsonPaths: {
                                Easy: "Level_Mp3AndJson//BlankSpace/BlankSpaceEasy.json",
                                Medium: "Level_Mp3AndJson/BlankSpace/BlankSpaceMedium.json",
                                Hard: "Level_Mp3AndJson/BlankSpace/BlankSpaceHard.json",
                                Expert: "Level_Mp3AndJson//BlankSpace/BlankSpaceExpert.json"
                                }
                        },
                        {
                            fileName: "Level_BasicSwipe", 
                            levelDisplayName: "'Rush'  Troye Sivan", 
                            fireBaseLevelLeaderBoard: "Rush_LB",
                            duration: "1:07",
                            mp3Path:"Level_Mp3AndJson/Rush/Rush.mp3",
                            jsonPaths: {
                                Easy: "Level_Mp3AndJson/Rush/RushEasy.json",
                                Medium: "Level_Mp3AndJson/Rush/RushMedium.json",
                                Hard: "Level_Mp3AndJson/Rush/RushHard.json",
                                Expert: "Level_Mp3AndJson/Rush/RushExpert.json"
                                }
                        }, 
                     
                        {
                            fileName: "Level_BasicSwipe", 
                            levelDisplayName: "'Rhythm is a Dancer'  SNAP", 
                            fireBaseLevelLeaderBoard: "RhythmIsADancer_LB",
                            duration: ":48",
                            mp3Path:"Level_Mp3AndJson/RhythmIsADancer/RhythmIsADancer.mp3",
                            jsonPaths: {
                                Easy: "Level_Mp3AndJson/RhythmIsADancer/RhythmIsADancerEasy.json",
                                Medium: "Level_Mp3AndJson/RhythmIsADancer/RhythmIsADancerMedium.json",
                                Hard: "Level_Mp3AndJson/RhythmIsADancer/RhythmIsADancerHard.json",
                                Expert: "Level_Mp3AndJson/RhythmIsADancer/RhythmIsADancerExpert.json"
                                }
                        },
                  
                        {
                            fileName: "Level_BasicSwipe", 
                            levelDisplayName: "'Back On 74'  Jungle", 
                            fireBaseLevelLeaderBoard: "BackOn74_LB",
                            duration: "1:07",
                            mp3Path:"Level_Mp3AndJson/BackOn74/BackOn74.mp3",
                            jsonPaths: {
                                Easy: "Level_Mp3AndJson/BackOn74/BackOn74Easy.json",
                                Medium: "Level_Mp3AndJson/BackOn74/BackOn74Medium.json",
                                Hard: "Level_Mp3AndJson/BackOn74/BackOn74Hard.json",
                                Expert: "Level_Mp3AndJson/BackOn74/BackOn74Expert.json"
                                }
                        },
                        {
                            fileName: "Level_BasicSwipe", 
                            levelDisplayName: "'Lovely Day'  Bill Winters", 
                            fireBaseLevelLeaderBoard: "LovelyDay_LB",
                            duration: "1:07",
                            mp3Path:"Level_Mp3AndJson/LovelyDay/LovelyDay.mp3",
                            jsonPaths: {
                                Easy: "Level_Mp3AndJson/LovelyDay/LovelyDayEasy.json",
                                Medium: "Level_Mp3AndJson/LovelyDay/LovelyDayMedium.json",
                                Hard: "Level_Mp3AndJson/LovelyDay/LovelyDay.json",
                                Expert: "Level_Mp3AndJson/LovelyDay/LovelyDayExpert.json"
                                }
                        },
                        {
                            fileName: "Level_BasicSwipe", 
                            levelDisplayName: "'Just Dance'  Lady Gaga", 
                            fireBaseLevelLeaderBoard: "JustDance_easy_LeaderBoard",
                            duration: "1:07",
                            mp3Path:"Level_Mp3AndJson/JustDance/JustDance.mp3",
                            jsonPaths: {
                                Easy: "Level_Mp3AndJson/JustDance/JustDanceEasy.json",
                                Medium: "Level_Mp3AndJson/JustDance/JustDanceMedium.json",
                                Hard: "Level_Mp3AndJson/JustDance/JustDanceHard.json",
                                Expert: "Level_Mp3AndJson/JustDance/JustDanceExpert.json"
                                }
                            
                            
                        },          
                        {   
                            fileName: "Level_BasicSwipe", 
                            levelDisplayName: "'Pneuma'  Tool", 
                            fireBaseLevelLeaderBoard: "Pneuma_easy_LeaderBoard", 
                            duration: ":56",
                            mp3Path:"Level_Mp3AndJson/Tool/tool_short.mp3", 
                            jsonPaths: {
                                Easy: "Level_Mp3AndJson/Tool/ToolEasy.json",
                                Medium: "Level_Mp3AndJson/Tool/ToolEasyMedium.json",
                                Hard: "Level_Mp3AndJson/Tool/ToolEasyHard.json",
                                Expert: "Level_Mp3AndJson/Tool/ToolEasyExpert.json"
                                }
                        },                   
                        {   
                            fileName: "Level_BasicSwipe", 
                            levelDisplayName: "'WonderBoy'  Tenacious D", 
                            fireBaseLevelLeaderBoard: "WonderBoy_LeaderBoard", 
                            duration: ":57",
                            mp3Path:"Level_Mp3AndJson/WonderBoy/WonderBoy.mp3", 
                            jsonPaths: {
                                Easy: "Level_Mp3AndJson/WonderBoy/WonderBoyEasy.json",
                                Medium: "Level_Mp3AndJson/WonderBoy/WonderBoyMedium.json",
                                Hard: "Level_Mp3AndJson/WonderBoy/WonderBoyHard.json",
                                Expert: "Level_Mp3AndJson/WonderBoy/WonderBoyExpert.json"
                                }
                        },
                        {   
                            fileName: "Level_BasicSwipe", 
                            levelDisplayName: "'Chandelier'  Sia", 
                            fireBaseLevelLeaderBoard: "Chandelier_LB", 
                            duration: "1:09",
                            mp3Path:"Level_Mp3AndJson/Chandelier/Chandelier.mp3", 
                            jsonPaths: {
                                Easy: "Level_Mp3AndJson/Chandelier/ChandelierEasy.json",
                                Medium: "Level_Mp3AndJson/Chandelier/ChandelierMedium.json",
                                Hard: "Level_Mp3AndJson/Chandelier/ChandelierHard.json",
                                Expert: "Level_Mp3AndJson/Chandelier/ChandelierExpert.json"
                                }
                        },
                        {   
                            fileName: "Level_BasicSwipe", 
                            levelDisplayName: "'Elastic Heart'  Sia", 
                            fireBaseLevelLeaderBoard: "ElasticHeart_LB", 
                            duration: "1:24",
                            mp3Path:"Level_Mp3AndJson/ElasticHeart/ElasticHeart.wav", 
                            jsonPaths: {
                                Easy: "Level_Mp3AndJson/ElasticHeart/ElasticHeartEasy.json",
                                Medium: "Level_Mp3AndJson/ElasticHeart/ElasticHeartMedium.json",
                                Hard: "Level_Mp3AndJson/ElasticHeart/ElasticHeartHard.json",
                                Expert: "Level_Mp3AndJson/ElasticHeart/ElasticHeartExpert.json"
                                }
                        },
                        {   
                            fileName: "Level_BasicSwipe", 
                            levelDisplayName: "'Apache'  Sugar Hill Gang", 
                            fireBaseLevelLeaderBoard: "Apache_LB", 
                            duration: "1:24",
                            mp3Path:"Level_Mp3AndJson/Apache/Apache.mp3", 
                            jsonPaths: {
                                Easy: "Level_Mp3AndJson/Apache/ApacheEasy.json",
                                Medium: "Level_Mp3AndJson/Apache/ApacheMedium.json",
                                Hard: "Level_Mp3AndJson/Apache/ApacheHard.json",
                                Expert: "Level_Mp3AndJson/Apache/ApacheExpert.json"
                                }
                        },
                     
                        {   
                            fileName: "Level_BasicSwipe", 
                            levelDisplayName: "'Magical Mystery Tour'  Beatles", 
                            fireBaseLevelLeaderBoard: "MagicalMysteryTour_LB", 
                            duration: ":56",
                            mp3Path:"Level_Mp3AndJson/MagicalMysteryTour/MagicalMysteryTour.mp3", 
                            jsonPaths: {
                                Easy: "Level_Mp3AndJson/MagicalMysteryTour/MagicalMysteryTourEasy.json",
                                Medium: "Level_Mp3AndJson/MagicalMysteryTour/MagicalMysteryTourMedium.json",
                                Hard: "Level_Mp3AndJson/MagicalMysteryTour/MagicalMysteryTourHard.json",
                                Expert: "Level_Mp3AndJson/MagicalMysteryTour/MagicalMysteryTourExpert.json"
                                }
                        },
                
                        {   
                            fileName: "Level_BasicSwipe", 
                            levelDisplayName: "3_Note_Test", 
                            fireBaseLevelLeaderBoard: "Level_3NoteTest_LB", 
                            duration: ":07",
                            mp3Path:"Level_Mp3AndJson/LevelRecorder/7secTest.mp3", 
                            jsonPaths: {
                                Easy: "Level_Mp3AndJson/LevelRecorder/7secTest.json",
                                Medium: "Level_Mp3AndJson/RhythmIsADancer/RhythmIsADancerMedium.json",
                                Hard: "Level_Mp3AndJson/RhythmIsADancer/RhythmIsADancerHard.json",
                                Expert: "Level_Mp3AndJson/RhythmIsADancer/RhythmIsADancerExpert.json"
                                }
                        },
                        {   
                            fileName: "Level_05_Recorder", 
                            levelDisplayName: "RECORDER", 
                            fireBaseLevelLeaderBoard: "Houdini_LB", 
                            duration: "",
                            mp3Path:"Level_Mp3AndJson/LevelRecorder/JustDance7secTest.mp3", 
                            jsonPath:"Level_Mp3AndJson/LevelRecorder/JustDance7secTest.json"
                        }
                     
                       
                       
                        


        ];
        
        this.totalLevels = this.levelArray.length; // Total number of levels available

        this.currentSelectedLevelIndex = this.getCurrentLevelIndex();
        this.getCurrentLevelIndex();
        this.playInfoBoxVisual.updateCurrentLevel(this.levelArray[0]);


        // Call the initial drawing function
        //this.draw();

         // Bind event handlers to the instance
         this.handleKeyDown = this.handleKeyDown.bind(this);
         this.handleMouseClick = this.handleMouseClick.bind(this);
 
         // Call the function to set up event listeners
         this.bindEvents();

         this.dispatchSongSelectedEvent()
    }


    //END OF CONSTRUCTOR//


    drawScrollbar() {
        const scrollbarWidth = 10;
        const scrollbarX = this.LEADERBOARD_X + this.LEADERBOARD_WIDTH - scrollbarWidth - 30;
        const scrollbarHeight = this.LEADERBOARD_HEIGHT - 290;
        const scrollbarYOffset = 180;
        const scrollbarY = this.LEADERBOARD_Y + scrollbarYOffset;
        const thumbHeight = (this.itemsToShow / this.levelArray.length) * scrollbarHeight;
        const thumbY = scrollbarY + (this.scrollPosition / (this.levelArray.length - this.itemsToShow)) * (scrollbarHeight - thumbHeight);
    
        // Draw the scrollbar track
        this.ctx.fillStyle = '#333';
        this.ctx.fillRect(scrollbarX, scrollbarY, scrollbarWidth, scrollbarHeight);
    
        // Change color of scrollbar thumb based on hover and click state
        this.ctx.fillStyle = this.isDraggingScrollbar ? '#666' : (this.scrollbarHover ? '#AAA' : '#AAA'); // Adjust colors as needed
        this.ctx.fillRect(scrollbarX, thumbY, scrollbarWidth, thumbHeight);
    }
    
    
    


    handleScroll(event) {
        event.preventDefault();
    
    
        // Increased sensitivity for testing
        const sensitivity = 0.2;
        const potentialNewPosition = this.scrollPosition + (event.deltaY * sensitivity);
    
    
        // Constrain within bounds without floor rounding
       // this.scrollPosition = Math.max(0, Math.min(potentialNewPosition, this.levelArray.length - this.itemsToShow));
        this.scrollPosition = Math.round(Math.max(0, Math.min(potentialNewPosition, this.levelArray.length - this.itemsToShow)));

    
        this.draw();
    }
    
    
    
    // This method is added to your class
    bindEvents() 
    {
        window.addEventListener('keydown', this.handleKeyDown);
        this.canvas.addEventListener('click', this.handleMouseClick);
        this.canvas.addEventListener('wheel', this.handleScroll.bind(this), { passive: false });

        //for scroll bar 
        this.canvas.addEventListener('mousedown', this.handleMouseDown.bind(this));
        this.canvas.addEventListener('mousemove', this.handleMouseMove.bind(this));
        window.addEventListener('mouseup', this.handleMouseUp.bind(this)); // Use window to handle cases where mouse is released outside the canvas
    }

   

    handleKeyDown(event) {
        const maxVisibleIndex = this.scrollPosition + this.itemsToShow - 1;
        
        if (event.key === 'ArrowUp' && this.currentSelectedLevelIndex > 0) {
            this.currentSelectedLevelIndex -= 1;
            if (this.currentSelectedLevelIndex < this.scrollPosition) {
                this.scrollPosition = this.currentSelectedLevelIndex;
            }
        } else if (event.key === 'ArrowDown' && this.currentSelectedLevelIndex < this.levelArray.length - 1) {
            this.currentSelectedLevelIndex += 1;
            if (this.currentSelectedLevelIndex > maxVisibleIndex) {
                this.scrollPosition = this.currentSelectedLevelIndex - this.itemsToShow + 1;
            }
        }
        
        this.playInfoBoxVisual.updateCurrentLevel(this.levelArray[this.currentSelectedLevelIndex]);
        this.dispatchSongSelectedEvent();
        this.draw();
    }
    
    /*
    //old just in case but can prob delete soon!
    handleMouseClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width; // Scale for the X coordinate
        const scaleY = this.canvas.height / rect.height; // Scale for the Y coordinate
        const clickX = (event.clientX - rect.left) * scaleX;
        const clickY = (event.clientY - rect.top) * scaleY;
    
        // Constants for layout calculation
        const Y_OFFSET = this.SCORE_LINE_HEIGHT / 2; // Vertical offset for alignment
        const itemHeight = this.SCORE_LINE_HEIGHT; // Height of each item
    
        for (let i = 0; i < this.itemsToShow; i++) {
            let index = i + this.scrollPosition; // Index in the levelArray, adjusted for scroll position
    

              if (index < this.levelArray.length) {
            let level = this.levelArray[index];
            if (!level) {
                continue; // Skip this iteration if level is undefined
            }
    
                // Calculate the Y position for the top and bottom of each song item
                let levelTopY = this.LEADERBOARD_Y + this.HEADER_HEIGHT + this.SCORE_MARGIN_TOP + (i * itemHeight) - Y_OFFSET;
                let levelBottomY = levelTopY + itemHeight;
    
                // Calculate the width of the text for horizontal alignment
                let textWidth = this.ctx.measureText(level.levelDisplayName).width;
                let levelLeftX = this.TEXT_CENTER_X - (textWidth / 2) - 170;
                let levelRightX = this.TEXT_CENTER_X + (textWidth / 2) +100;
    
                // Check if the click coordinates are within the bounds of the song item
                if (clickX >= levelLeftX && clickX <= levelRightX && clickY >= levelTopY && clickY <= levelBottomY) {
                    this.setCurrentLevelIndex(index);
                    this.playInfoBoxVisual.updateCurrentLevel(this.levelArray[index]); // Update the current level based on the clicked song
                    this.draw(); // Redraw the component to reflect changes
                    this.dispatchSongSelectedEvent(); // Dispatch an event for the song selection
                    break; // Exit the loop as the click has been handled
                }
            }
        }
    }
    */

    handleMouseClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width; // Scale for the X coordinate
        const scaleY = this.canvas.height / rect.height; // Scale for the Y coordinate
        const clickX = (event.clientX - rect.left) * scaleX;
        const clickY = (event.clientY - rect.top) * scaleY;
    
        // Constants for layout calculation
        const Y_OFFSET = this.SCORE_LINE_HEIGHT / 2; // Vertical offset for alignment
        const itemHeight = this.SCORE_LINE_HEIGHT; // Height of each item
    
        for (let i = 0; i < this.itemsToShow; i++) {
            let index = i + this.scrollPosition; // Index in the levelArray, adjusted for scroll position
            if (index < this.levelArray.length) {
                let level = this.levelArray[index];
                if (!level) continue; // Skip this iteration if level is undefined
    
                // Calculate the Y position for the top and bottom of each song item
                let levelTopY = this.LEADERBOARD_Y + this.HEADER_HEIGHT + this.SCORE_MARGIN_TOP + (i * itemHeight) - Y_OFFSET;
                let levelBottomY = levelTopY + itemHeight;
    
                // Measure the text width dynamically
                this.ctx.font = `${this.SCORE_FONT_SIZE}px Arial`; // Use the same font size as in your draw function
                let textWidth = this.ctx.measureText(level.levelDisplayName).width;
                
                // Dynamically calculate the left and right boundaries of the text
                let levelLeftX = this.TEXT_CENTER_X - (textWidth / 2);
                let levelRightX = this.TEXT_CENTER_X + (textWidth / 2);
    
                // Check if the click coordinates are within the bounds of the song item text
                if (clickX >= levelLeftX && clickX <= levelRightX && clickY >= levelTopY && clickY <= levelBottomY) {
                    this.setCurrentLevelIndex(index);
                    this.playInfoBoxVisual.updateCurrentLevel(this.levelArray[index]); // Update the current level based on the clicked song
                    this.draw(); // Redraw the component to reflect changes
                    this.dispatchSongSelectedEvent(); // Dispatch an event for the song selection
                    break; // Exit the loop as the click has been handled
                }
            }
        }
    }
    
    
    
//old working but yuk scroll
    handleMouseDown(event) {
        const rect = this.canvas.getBoundingClientRect();
        const mouseY = (event.clientY - rect.top) * (this.canvas.height / rect.height);
        const scrollbarThumbY = this.calculateThumbY();
    
        if (mouseY >= scrollbarThumbY && mouseY <= scrollbarThumbY + this.calculateThumbHeight()) {
            this.isDraggingScrollbar = true;
            this.lastMouseY = mouseY;
            this.initialMouseY = mouseY;
            this.initialThumbPosition = this.scrollPosition;
        }
    }
    

    
    handleMouseMove(event) {
        if (this.isDraggingScrollbar) {
            const rect = this.canvas.getBoundingClientRect();
            const mouseY = (event.clientY - rect.top) * (this.canvas.height / rect.height);
    
            // Calculate the difference in mouse position since mouse down
            const deltaY = mouseY - this.initialMouseY;
    
            // Calculate the proportional movement of the scrollbar
            // Adjust these calculations as per your specific UI dimensions and behavior
            const scrollRange = this.levelArray.length - this.itemsToShow;
            const thumbHeight = this.calculateThumbHeight();
            const scrollbarRange = this.LEADERBOARD_HEIGHT - thumbHeight;
            const scrollMovement = (deltaY / scrollbarRange) * scrollRange;
    
            // Calculate new scroll position
            const newScrollPosition = this.initialThumbPosition + scrollMovement;
            this.scrollPosition = Math.round(Math.max(0, Math.min(newScrollPosition, scrollRange)));
    
            this.draw();
        }
    }
    





    handleMouseUp(event) {
        this.isDraggingScrollbar = false;
    }


    

   
    //help methods for scroll bar mouse clicking.
    calculateThumbY() {
        const scrollbarYOffset = 180; // As defined in drawScrollbar
        const scrollbarY = this.LEADERBOARD_Y + scrollbarYOffset;
        const thumbHeight = this.calculateThumbHeight();
        return scrollbarY + (this.scrollPosition / (this.levelArray.length - this.itemsToShow)) * (this.LEADERBOARD_HEIGHT - 290 - thumbHeight);
    }

    calculateThumbHeight() {
        return (this.itemsToShow / this.levelArray.length) * (this.LEADERBOARD_HEIGHT - 290);
    }


    setCurrentLevelIndex(num)
    {
        window.myCurrentLevelIndex = num;
        this.currentSelectedLevelIndex = window.myCurrentLevelIndex
    }

    getCurrentLevelIndex()
    {
        
        if (!window.myCurrentLevelIndex)
        {
            window.myCurrentLevelIndex = 0;
        }
      
        this.currentSelectedLevelIndex = window.myCurrentLevelIndex
        return this.currentSelectedLevelIndex;
    }
    
    getCurrentSongData()
    {
        return this.levelArray[currentSelectedLevelIndex];
    }
 



    // This method is added to your class
    dispatchSongSelectedEvent() 
    {
        const selectedLevel = this.levelArray[this.currentSelectedLevelIndex];
        const event = new CustomEvent('songSelected', { detail: selectedLevel });
        window.dispatchEvent(event);
    }


    
    //OLD WOKING no hovers
    draw() {
        // Save the current canvas state
        this.ctx.save();
    
        // Set the fill style for the box and draw it
        this.ctx.fillStyle = "rgba(0, 0, 0, 0.7)";
        this.box.draw();
    
        // Draw the header for the level selection, centered
        this.ctx.textAlign = "center"; // Center-align text
        this.ctx.fillStyle = '#FFF'; // Text color
        this.ctx.font = `${this.HEADER_FONT_SIZE}px Verdana`;
        // Use the center of the box for X position
        this.ctx.fillText('SONG SELECT', this.TEXT_CENTER_X, this.LEADERBOARD_Y + this.HEADER_HEIGHT);
    
        // Calculate the subset of levels to display
        const startIndex = this.scrollPosition;
        const endIndex = Math.min(startIndex + this.itemsToShow, this.levelArray.length);
        const visibleLevels = this.levelArray.slice(startIndex, endIndex);
    
        // Draw the level names, centered
        this.ctx.font = `${this.SCORE_FONT_SIZE}px Arial`; // Set the font for the level names
        visibleLevels.forEach((level, index) => {
            this.ctx.fillStyle = (startIndex + index) === this.currentSelectedLevelIndex ? 'red' : '#FFF'; // Highlight selected level
            // Calculate the Y position for each level name
            let textY = this.LEADERBOARD_Y + this.TEXT_ALIGN_TOP + (index * this.SCORE_LINE_HEIGHT);
            // Draw each level name centered in the box
            this.ctx.fillText(level.levelDisplayName, this.TEXT_CENTER_X, textY);
        });
    

        this.levelArray.slice(this.scrollPosition, this.scrollPosition + this.itemsToShow).forEach((level, index) => {
            const textY = this.LEADERBOARD_Y + this.TEXT_ALIGN_TOP + (index * this.SCORE_LINE_HEIGHT);
            this.ctx.fillStyle = (this.currentSelectedLevelIndex === index + this.scrollPosition) ? 'red' : '#FFF';
            this.ctx.fillText(level.levelDisplayName, this.TEXT_CENTER_X, textY);
        });

        // Draw the scrollbar
        this.drawScrollbar();
    
        // Restore the canvas state
        this.ctx.restore();
    }
    






        // This method is added to your class
        dispose() 
        {
            // Remove event listeners to prevent memory leaks
            window.removeEventListener('keydown', this.handleKeyDown);
            this.canvas.removeEventListener('click', this.handleMouseClick);
            this.canvas.removeEventListener('mousedown', this.handleMouseDown);
            this.canvas.removeEventListener('mousemove', this.handleMouseMove);
            window.removeEventListener('mouseup', this.handleMouseUp);
    
            // If BoxUI has a dispose method, call it
            if (this.box && typeof this.box.dispose === 'function') {
                this.box.dispose();
            }
    
            // Clear any references to DOM elements or external objects
           // this.canvas = null;
            this.playInfoBoxVisual = null;
    
            // Optionally, reset internal states or variables
            this.currentSelectedLevelIndex = 0;
            this.levelArray = [];
        }
    
    

}
