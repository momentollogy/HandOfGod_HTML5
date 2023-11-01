import MediaPipeTracker from './MediaPipeTracker.js';
import UIManager, { Button } from './UIManager.js';
import SweetSpotCircle from './SweetSpotCircle.js';
import JsonManager from './JsonManager.js';
import DrawEngine from './DrawEngine.js';
import BackgroundManager from './BackgroundManager.js'

export default class Level_05
{
    constructor()
    {
        this.mediaPipe = MediaPipeTracker.getInstance()
        this.canvas = document.getElementById("output_canvas");;
        this.ctx = this.canvas.getContext("2d");
        this.drawEngine = DrawEngine.getInstance();
        this.fileInput = document.getElementById('fileInput');
        
        this.audio = new Audio();
        this.audio.volume = 0.03; 
        
        this.jsonManager = new JsonManager();

        this.uIButtons = ["StartStop","Reset","ExportBeats","LoadBeats","LoadSong","Record"];
        this.uiManager = new UIManager(this.audio,this.uIButtons)
        this.initUI();

        this.bkg = new BackgroundManager(this.audio);

        this.SweetSpotCircleArray=[];
        this.SweetSpotCircleArray[0] = new SweetSpotCircle(this.audio,  'rgb(0, 255, 0)',     { x: 820, y: this.canvas.height/2}  );
        this.SweetSpotCircleArray[1] = new SweetSpotCircle(this.audio,  'rgb(0, 255, 200)',   { x: 1080, y: this.canvas.height/2} );
        this.SweetSpotCircleArray[0].beatCirclePathDirectionAngle = -90;
        this.SweetSpotCircleArray[1].beatCirclePathDirectionAngle = -90;

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
        this.hasBeatBeenMissed=false;
        
        this.currentBeatIndex = 0;
        this.beatBufferTime = 1000;  // set by user
        this.accuracy = 0.05;  // adjustable accuracy for scoring

        
        ////////Loading a song and beats on startup for testing purposes /////////////
        
        this.audio.src = "sound2/tool_short.mp3";          
        this.jsonManager.loadJsonFileByPath('sound2/6beatstest.json');
    }

    initUI(){
        this.canvas.addEventListener('click', this.uiManager.handleClick.bind(this.uiManager));
        this.canvas.addEventListener('mousemove', this.uiManager.handleMouseMove.bind(this.uiManager));
        this.canvas.addEventListener('mousedown', this.uiManager.handleMouseDown.bind(this.uiManager));
        this.canvas.addEventListener('mouseup', this.uiManager.handleMouseUp.bind(this.uiManager));
        
        // responds to when the JSON loaded and beat data is available on the JSON Manager
        document.addEventListener('beatTimeDataReady', event => {
            //console.log('beatTimeDataReady ready ready ready ready ready :', event.detail);
            //parseJsonData();
            this.SweetSpotCircleArray[0].setPlayMode(this.jsonManager.leftCircleData);
            this.SweetSpotCircleArray[1].setPlayMode(this.jsonManager.rightCircleData);
        });

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

    setRecordMode(){
        //console.log("Record Mode");
        this.uiManager.recordMode = !this.uiManager.recordMode;
        this.recordMode = this.uiManager.recordMode;

        if(this.recordMode)
        {   this.SweetSpotCircleArray[0].setRecordMode();
            this.SweetSpotCircleArray[1].setRecordMode();
        }else{
            this.SweetSpotCircleArray[0].setPlayMode(this.jsonManager.leftCircleData);
            this.SweetSpotCircleArray[1].setPlayMode(this.jsonManager.rightCircleData);
        }

    }

    exportRecordedMoments_Array() 
    {
        const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify
            ({
                beatTimes:          this.recordedMoments_Array,
                leftCircleData:     this.SweetSpotCircleArray[0].recordedMomentsArr,
                rightCircleData:    this.SweetSpotCircleArray[1].recordedMomentsArr,
                bkgPulses:          [500,1000,1500,2000],
                mp3FileName:        "",
                bmp:                60,
                settings:           {}
            }));
        const downloadAnchorNode = document.createElement('a');
        downloadAnchorNode.setAttribute("href", dataStr);
        downloadAnchorNode.setAttribute("download", "recordedMoments.json");
        document.body.appendChild(downloadAnchorNode);
        downloadAnchorNode.click();
        downloadAnchorNode.remove();
    }

    level_loop() {
        let results = this.mediaPipe.results;
        if (results == undefined) { return; }
    
        for(let sweetspotcircle of this.SweetSpotCircleArray) {
            sweetspotcircle.updateAndDraw(this.drawEngine.deltaTime);
        }
        this.glowCirclesOnFingerTouch();
        this.checkHandTouchSweetSpotCircles();
        this.checkMissedBeats();
        this.uiManager.draw();
    }
    







    calculateBeatRanges(beatTime) {
        const beatRangeStart = beatTime - this.beatBufferTime;
        const beatRangeEnd = beatTime + this.beatBufferTime;
        return { beatRangeStart, beatRangeEnd };
    }







    

    checkHandTouchSweetSpotCircles() {
        const currentTime = this.audio.currentTime * 1000;
        for (let sweetspotcircle of this.SweetSpotCircleArray) {
            const handCircleTouchObj = this.mediaPipe.checkForTouchWithShape(sweetspotcircle, this.mediaPipe.BOTH, 8);
            const touchDifference = this.closeToBeatDifference(sweetspotcircle);
            const touchTimeAccuracy = Math.abs(touchDifference);

            if (handCircleTouchObj.length > 0 && !sweetspotcircle.touched && touchTimeAccuracy <= this.beatBufferTime) {
                const tempScore = Math.round(Math.max(0, 100 * (this.beatBufferTime - touchTimeAccuracy) / this.beatBufferTime));
                this.uiManager.scoreNumber += tempScore;
                this.uiManager.comboNumber = tempScore;  // Assuming you want to keep the combo number logic

                sweetspotcircle.touched = true;
                sweetspotcircle.checkedForMiss = false;
                console.log("Hit detected:", tempScore, "points awarded");
            } else if (handCircleTouchObj.length > 0 && !sweetspotcircle.touched && touchTimeAccuracy > this.beatBufferTime) {
               // console.log("Miss");
            } else if (handCircleTouchObj.length == 0) {
                sweetspotcircle.touched = false;
            }
        }
    }
    


    checkMissedBeats() {
        const currentTime = this.audio.currentTime * 1000;
        for (let sweetspotcircle of this.SweetSpotCircleArray) {
            const b = sweetspotcircle.beatIndex;
            const beatTime = sweetspotcircle.beatArray[b];
          //  console.log('beatTime:', beatTime);  // Add this line
            const beatRangeEnd = this.calculateBeatRanges(beatTime).beatRangeEnd;

            if (!this.audio.paused)
            {
                console.log("SSC", sweetspotcircle.color,"current time", currentTime, "b", b, "BEATime",beatTime,"beatRangeEnd", beatRangeEnd);  // You already have this line
            }

            if (currentTime > beatTime) //&&s !sweetspotcircle.touched) 
            {
                //console.log('beatIndex:', sweetspotcircle.beatIndex, 'beatArray length:', sweetspotcircle.beatArray.length);  // Add this line
                console.log("Beat missed");
                this.beatsMissed++;
               // sweetspotcircle.beatIndex++;
            }
        }

        if (this.beatsMissed > 6) {
            console.log("GAME OVER");
        }
    }


    
    closeToBeatDifference(sweetspotcircle) {
        let b = sweetspotcircle.beatIndex;
        let difference = sweetspotcircle.beatArray[b] - (this.audio.currentTime * 1000);
        return difference;
    }


    

    glowCirclesOnFingerTouch()
    {
        for(let sweetspotcircle of this.SweetSpotCircleArray)
        {
            let handCircleTouchObj = this.mediaPipe.checkForTouchWithShape(sweetspotcircle, this.mediaPipe.BOTH,  8)
            if (handCircleTouchObj.length>0){
             
                sweetspotcircle.puffy = true;
            }else{sweetspotcircle.puffy = false;}
        }
    }

    drawFingerSwipe(hand){
        let handArr = hand == "Left" ? this.previousPositions_L_arr : this.previousPositions_R_arr;
        let color = hand == "Left" ? 'rgb(0, 255, 200)' : 'rgb(255, 255, 128)';
        if(this.mediaPipe.getPointOfIndex(hand, 8))
        {
            let coords=this.mediaPipe.getPointOfIndex(hand, 8);
            handArr.push(coords)

            if(handArr.length > 8 ){handArr.shift();}
            this.ctx.save()
            let strokeWidth = 1.5;
            this.ctx.lineJoin = 'round';
            this.ctx.lineCap = 'round';
        
            for(let i=1; i<handArr.length; i++){
                if( i < Math.round(handArr.length / 2)+3 ){ strokeWidth += 1.25 }else{ strokeWidth -= 1.75 }
                
                this.ctx.strokeStyle = color;
                this.ctx.shadowColor = color;
                this.ctx.shadowBlur = 12;
                this.ctx.lineWidth = strokeWidth;

                this.ctx.beginPath();
                this.ctx.moveTo(handArr[i-1].x, handArr[i-1].y);
                this.ctx.lineTo(handArr[i].x , handArr[i].y);
                this.ctx.stroke();
            }
            this.ctx.restore();
        }
    }


    

    calculateNormalizedVector2(startX, startY, endX, endY) {
        const directionX = endX - startX;
        const directionY = endY - startY;

        // Calculate the magnitude (length) of the direction vector
        const magnitude = Math.sqrt(directionX * directionX + directionY * directionY);

        // Normalize the direction vector
        const normalizedX = directionX / magnitude;
        const normalizedY = directionY / magnitude;

        return { x: normalizedX, y: normalizedY };
    }

    drawSlashOnSweetSpotCircle(sweetspotcircle){
        if(sweetspotcircle.slash){
            // define begining and end points
            let fromX = sweetspotcircle.slash.start.x;
            let fromY = sweetspotcircle.slash.start.y;
            let toX = sweetspotcircle.slash.end.x
            let toY = sweetspotcircle.slash.end.y
            let arrowSize = 16;

            this.ctx.save();
            this.ctx.beginPath();
            this.ctx.shadowColor = 'rgba(0, 0, 0, 0)';
            this.ctx.shadowBlur = 0;
            this.ctx.strokeStyle = sweetspotcircle.slash.hand == "Left" ? 'rgb(0, 255, 255)' : 'rgb(255, 255, 0)';
            this.ctx.lineWidth = 5;
            this.ctx.moveTo( fromX, fromY );
            this.ctx.lineTo( toX, toY );
            this.ctx.stroke();

            // draw arrow head
            const angle = Math.atan2(toY - fromY, toX - fromX);
            const x1 = toX - arrowSize * Math.cos(angle - Math.PI / 6);
            const y1 = toY - arrowSize * Math.sin(angle - Math.PI / 6);
            const x2 = toX - arrowSize * Math.cos(angle + Math.PI / 6);
            const y2 = toY - arrowSize * Math.sin(angle + Math.PI / 6);

            this.ctx.beginPath();
            this.ctx.moveTo(toX, toY);
            this.ctx.lineTo(x1, y1);
            this.ctx.lineTo(x2, y2);
            this.ctx.closePath();
            this.ctx.stroke();
            this.ctx.restore();
        }
    }
}