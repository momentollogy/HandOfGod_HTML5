import MediaPipeTracker from './MediaPipeTracker.js';
import UIManager from './UIManager.js';
import SweetSpotCircle from './SweetSpotCircle.js';
import JsonManager from './JsonManager.js';
import DrawEngine from './DrawEngine.js';
//import BackgroundManager from './BackgroundManager.js'

export default class Level_05
{
    constructor(_mp3Path,_jsonPath)
    {
        this.mediaPipe = MediaPipeTracker.getInstance()
        this.canvas = document.getElementById("output_canvas");;
        this.ctx = this.canvas.getContext("2d");
        this.drawEngine = DrawEngine.getInstance();
        this.fileInput = document.getElementById('fileInput');
        
        this.audio = new Audio();
        this.audio.volume = 0.03; 
        
        this.jsonManager = new JsonManager();
        this.mp3Path=_mp3Path;
        this.jsonPath=_jsonPath;
        console.log(this.mp3Path,this.jsonPath)


        this.uIButtons = []
       this.uiManager = new UIManager(this.audio,this.uIButtons)
       // this.initUI();

       // this.bkg = new BackgroundManager(this.audio);

        this.SweetSpotCircleArray=[];
        this.SweetSpotCircleArray[0] = new SweetSpotCircle(this.audio,  'rgb(0, 255, 0)',     { x: 820, y: this.canvas.height/2}  );
        this.SweetSpotCircleArray[1] = new SweetSpotCircle(this.audio,  'rgb(0, 255, 200)',   { x: 1080, y: this.canvas.height/2} );
        this.SweetSpotCircleArray[0].beatCirclePathDirectionAngle = -90;
        this.SweetSpotCircleArray[1].beatCirclePathDirectionAngle = -90;
        this.SweetSpotCircleArray[0].name="LeftSSCir";
        this.SweetSpotCircleArray[1].name="RightSSCir";

        this.beatArray=[];
        this.beatCircles_Array = [];
        this.lastfingerposition;
        this.prevHandPositions=[];
        this.handInsidePreviously = false;
        this.swipePositions = [];
        this.swipeDirectionPos_arr = [];
        this.swipeHand = "";
        this.currentHandedness = null;
        this.recordedMoments_Array=[];
        this.previousPositions_L_arr=[];
        this.previousPositions_R_arr=[];
        this.displayBkg = false;
        this.recordMode = false;
        this.beatsMissed=0;
        this.beatsMissedPrevious=0;
        this.hasBeatBeenMissed=false;
        this.scoreNumber = 0;
        this.comboNumber = 0;


        document.addEventListener('beatTimeDataReady', event => {
            console.log('beatTimeDataReady ready ready ready ready ready :', event.detail);
                //parseJsonData();
                this.SweetSpotCircleArray[0].receiveAndProcessCircleData(this.jsonManager.leftCircleData);
                this.SweetSpotCircleArray[1].receiveAndProcessCircleData(this.jsonManager.rightCircleData);
            });
    

        
        this.setInitialSongAndJson();
        document.addEventListener("BeatMissed", (data) => {
            console.log("a miss has been detected!");
            this.beatMissed();
        });
    }

    initUI(){
        this.canvas.addEventListener('click', this.uiManager.handleClick.bind(this.uiManager));
        this.canvas.addEventListener('mousemove', this.uiManager.handleMouseMove.bind(this.uiManager));
        this.canvas.addEventListener('mousedown', this.uiManager.handleMouseDown.bind(this.uiManager));
        this.canvas.addEventListener('mouseup', this.uiManager.handleMouseUp.bind(this.uiManager));
        
        // responds to when the JSON loaded and beat data is available on the JSON Manager
      
        document.addEventListener('StartStop', (data) => {
            //console.log("Play button!!");
            if(this.audio.paused){this.audio.play();
            }else{this.audio.pause();}
            
        });
        
        document.addEventListener('Reset', (data) => {
            this.audio.currentTime = 0;
            this.uiManager.scoreNumber = 0;
            this.uiManager.comboNumber = 0;
            this.SweetSpotCircleArray[0].reset();
            this.SweetSpotCircleArray[1].reset();
            this.uiManager.draw();
            this.resetVariables();
        });

        document.addEventListener('ExportBeats', (data) => {
            //console.log("export");
            this.exportRecordedMoments_Array();
        });

        document.addEventListener('LoadBeats', (data) => {
            //console.log("load beats");
            this.jsonManager.promptForFile(); 
        });

        document.addEventListener('LoadSong', () => {
            //console.log("load Song pressed");
            
            // if there is no file input node on the HTML, then create one
            if(!this.songInput){
                this.songInput = document.createElement('input');
                this.songInput.type = 'file';
                this.songInput.accept = '.mp3,.wav';
                this.songInput.style.display = 'none';
                document.body.appendChild(this.songInput);
                // when the file is loaded use it as the new src for the audio object
                this.songInput.addEventListener('change', () => {
                    const selectedFile = this.songInput.files[0];
                    if (selectedFile) {
                        this.audio.src = URL.createObjectURL(selectedFile)
                        //this.audio.load();
                    }
                });
            }
            this.songInput.click();
        });

        document.addEventListener('Record', (data) => {
            this.setRecordMode();
        });

    }

    resetVariables(){
        console.log("resseting variables etc..");
        this.scoreNumber = 0;
        this.comboNumber = 0;
        this.beatsMissed = 0;
        this.beatsMissedPrevious=0;
        for(let sweetspotcircle of this.SweetSpotCircleArray)
        {
            sweetspotcircle.beatsMissed = 0;
        }
    }

    setRecordMode(){
        this.recordMode = !this.recordMode;
        this.uiManager.recordMode = this.recordMode;
        for (let sweetspotcircle of this.SweetSpotCircleArray){
            if(this.recordMode){
                sweetspotcircle.setRecordMode(true);
            }else{
                sweetspotcircle.setRecordMode(false);
            }
        }
    }

    exportRecordedMoments_Array() 
    {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify
            ({
               // beatTimes:          this.recordedMoments_Array,
                leftCircleData:     this.SweetSpotCircleArray[0].getBeatCircleData(),
                rightCircleData:    this.SweetSpotCircleArray[1].getBeatCircleData()
                //bkgPulses:          [500,1000,1500,2000],
                //mp3FileName:        "",
                //bmp:                60,
                //settings:           {}
            }));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "recordedMoments.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    level_loop() {
        // mediapipe stuff
        let results = this.mediaPipe.results;
        if (results == undefined) { return; }
        
        if(!this.recordMode){
            // game interaction and score stuff
            this.checkForFingerTouchCircles();
            //this.checkCirclesForMissesAndStuff();
        }else{
            this.sendTouchesForRecording();
        }

        // update display stuff and process classes stuff
        for(let sweetspotcircle of this.SweetSpotCircleArray) { sweetspotcircle.updateAndDraw(); }
        this.uiManager.draw();
    }
    
    checkForFingerTouchCircles(){
        for(let sweetspotcircle of this.SweetSpotCircleArray){
            if (this.mediaPipe.checkForTouchWithShape(sweetspotcircle, this.mediaPipe.BOTH,  8).length>0)
            {
                sweetspotcircle.puffy = true;  
                let percentAccuracyIfTouched = sweetspotcircle.touch(); // this method returns null if touch is invalid
                if(percentAccuracyIfTouched){
                    this.touchSuccesfulWithPercentage(percentAccuracyIfTouched, sweetspotcircle);
                }
            }else{
                sweetspotcircle.puffy = false;
            }
        }
    }

    increaseComboNumer(){
        this.comboNumber += 1;
        this.uiManager.comboNumber = this.comboNumber;
    }

    resetComboNumber(){
        this.comboNumber = 0;
        this.uiManager.comboNumber = this.comboNumber;
    }

    sendTouchesForRecording(){
        for(let sweetspotcircle of this.SweetSpotCircleArray){
            if (this.mediaPipe.checkForTouchWithShape(sweetspotcircle, this.mediaPipe.BOTH,  8).length>0)
            {
                sweetspotcircle.touchingInRecordModeSTART();
            }else{
                sweetspotcircle.touchingInRecordModeEND();
            }        
        }
    }

    checkCirclesForMissesAndStuff(){
        this.beatsMissed = 0;
        for(let sweetspotcircle of this.SweetSpotCircleArray)
        {   //console.log(sweetspotcircle.beatsMissed)
            if(!sweetspotcircle.touched){
                this.beatsMissed += sweetspotcircle.beatsMissed;
                if(this.beatsMissed > this.beatsMissedPrevious){
                    this.beatMissed();
                    this.beatsMissedPrevious = this.beatsMissed;
                }
            }
        }
        this.uiManager.missesNumber = this.beatsMissed;
    }

    removeMiss(){
        if(this.beatsMissed>0){this.beatsMissed -= 1;}
        this.uiManager.missesNumber = this.beatsMissed;
     
    }






    setInitialSongAndJson()
    {
        ////////////////////////////////////////////////////////////////////
        ///// Loading a song and beats on startup for testing purposes /////
        ////////////////////////////////////////////////////////////////////
        this.audio.src = this.mp3Path;          
        this.jsonManager.loadJsonFileByPath(this.jsonPath);
        this.audio.play();
    }

    touchSuccesfulWithPercentage(percentAccuracy, sweetspotcircle)
    {
        ////////////////////////////////////////////////////////////////////
        ////////////// Touch Succesful. Receive Percent ////////////////////
        //////////////////////////////////////////////////////////////////// 
        this.increaseComboNumer(); 
        this.scoreNumber += ( percentAccuracy + this.comboNumber );
        this.uiManager.scoreNumber = this.scoreNumber;
        this.removeMiss();
        console.log(percentAccuracy + "%  accuracy", sweetspotcircle.color, "score:", this.scoreNumber);
    }

    beatMissed()
    {
        ////////////////////////////////////////////////////////////////////
        ////////////// Beat Missed. Total Beats Tallied ////////////////////
        ////////////////////////////////////////////////////////////////////
        this.beatsMissed += 1;
        this.uiManager.missesNumber = this.beatsMissed;
        this.resetComboNumber();
        //console.log(this.beatsMissed + " Beats Missed total");
        if(this.beatsMissed > 20){
            console.log("you lose");
            this.audio.pause();
            // show something in the UI perhaps?
        }
    }


}

