import BeatCircle from './BeatCircle.js';
import DrawEngine from './DrawEngine.js';

export default class SweetSpotCircle {
    constructor(_audio, color='rgb(0,0,255)', position = {x:1000,y:200}, radius = 80, thickness = 2, is_growing = false, is_moving = false, growth_rate = 2)
     {
        this.audio = _audio;
        this.canvas = document.getElementById("output_canvas");
        this.ctx = this.canvas.getContext("2d");
        this.drawEngine=DrawEngine.getInstance();
        this.position = position;
        this.radius = radius;
        this.color = color;
        this.thickness = thickness;
        this.baseRadius = radius;
        this.growth_rate = growth_rate;
        this.handInside = false;
        this.newCircleMade=false;
        this.beatCircles_Array = [];
        this.dirArray=[];
        this.beatIndex = 0;
        this.velocity = 400;
        this.beatCirclePathDirectionAngle = -90;
        this.pulseOnBeats = true;
        this.puffy = false;
        this.slash;
        this.swipeDirectionPos_arr = [];
        this.recordMode = false;
        this.recordedMomentsArr = [];
        this.recordedTimesArr = [];
        this.recordedDirectionsArr = [];
        this.touched=false;
        this.checkedForMiss = false;
        this.beatPassed = false;
        this.beatBufferTime = 300; //how many ms before and after to define length of beatrange
        this.beatsMissed = 0;
        this.touchable = false;
        //this.loadedCircleData;
        this.recordModeTouched=false;
        this.name="";
    }
    
    getBeatCircleData(){
        let returnArray = [];
        for (let i=0 ; i< this.beatCircles_Array.length ; i++)
        {
            returnArray.push({time:this.beatCircles_Array[i].beatTime,  dir:this.beatCircles_Array[i].direction});
        } 
        console.log(returnArray);
        return returnArray;
    }

    receiveAndProcessCircleData(circleData){

        // sort the incoming data to ensure the beat times line up with the time indexes
        circleData.sort((a, b) => a.time - b.time);

        this.beatCircles_Array = [];
        for (let i=0 ; i< circleData.length ; i++)
        {
            this.beatCircles_Array.push(new BeatCircle(circleData[i],  this.position) )
        }        
    }

    setRecordMode(recordMode){

        // ENTER Record Mode
        if(recordMode){
            this.recordMode = true;
            this.beatCircles_Array = [];
            this.recordedMomentsArr = [];
        }
        
        // EXIT Record Mode
        else{
            this.recordMode = false;
            this.receiveAndProcessCircleData(this.recordedMomentsArr);
            this.recordedMomentsArr = [];
            //this.audio.currentTime = 0;
            //this.beatIndex = 0;
        }
    }

    touchingInRecordModeSTART(){
        if(!this.recordModeTouched){
            //console.log("record touch at:",Math.round(this.audio.currentTime*1000));
            this.pulse();
            this.recordModeTouched = true;
            this.recordMoment(0);
            this.receiveAndProcessCircleData(this.recordedMomentsArr);
        }
    }

    touchingInRecordModeEND(){
        this.recordModeTouched = false;
    }

    recordMoment(vector){
        this.recordedMomentsArr.push( {time:Math.round(this.audio.currentTime*1000), dir:vector }); 
    }

    updateAndDrawBeatCircles()
    {
        for( let i = 0 ; i < this.beatCircles_Array.length ; i++)
        {
            this.beatCircles_Array[i].update(this.audio.currentTime, this.velocity, this.beatCirclePathDirectionAngle);
            this.beatCircles_Array[i].draw();
        }
    }
    
    updateAndDraw(){
        // return radius to it's base size if it's larger ( this is basically restoring a pulse to it's normal size )
        if(this.radius > this.baseRadius){this.radius-=3}

        if(!this.recordMode && this.beatCircles_Array.length > 0){
            this.updateForPlay();
           // this.drawBeatRanges();
        }else{
            this.updateForRecording();
        }

      //  this.drawMotionIndicatorLine();        
        this.draw();
        this.updateAndDrawBeatCircles()
    }

    updateForRecording(){
        
    }

    updateForPlay(){        
        // pulse on the beats
        if(this.isCurrentTimeOnBeat() && !this.beatPassed){
            if(this.pulseOnBeats){this.pulse();}
            this.beatPassed = true;
        }

        // advance to the next beatRange
        if(this.isCurrentTimeOnBeatRangeEnd()){
            if(this.beatIndex < this.beatCircles_Array.length -1 ){
                this.beatIndex++;
                this.beatPassed = false;
                if (!this.touched) {
                    this.beatsMissed++;
                    document.dispatchEvent(new Event("BeatMissed"));
                }
                this.touched=false;
                this.touchable = false;
            }else{
                //////////////////////////////////////////////////////////////////////////
                this.pulse(); // console.log("No more beats on this circle!", this.color);
                //////////////////////////////////////////////////////////////////////////
            }
        }

        // do this at the start of a range
        if(this.isCurrentTimeOnBeatRangeStart()){
            this.touchable = true
        }
    }

    // this is where touches from the level are received during play mode
    touch(){
        let percentAccuracy = null;
        if(this.touchable){
            if(!this.touched){
                let touchTimeDiff = Math.abs(this.beatCircles_Array[this.beatIndex].beatTime - this.audio.currentTime*1000 )
                percentAccuracy = (100 - Math.round(touchTimeDiff/this.beatBufferTime*100));
            }
            this.touched=true;
        }
        return percentAccuracy;
    }

    pulse() {
        this.radius = this.baseRadius + 30;
    }

    draw(){
        // draw thin opaque outter circle
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(this.position.x,this.position.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.strokeStyle = this.color;
        this.ctx.shadowColor = this.color;;
        this.ctx.shadowBlur = this.puffy ? 5 : 40;
        this.ctx.lineWidth = this.puffy ? this.thickness*2 : this.thickness;
        this.ctx.stroke();
        this.ctx.closePath();

        // draw thick transparent inner circle
        this.ctx.globalAlpha = .25;
        this.ctx.beginPath();
        this.ctx.arc(this.position.x,this.position.y, this.baseRadius-10, 0, Math.PI * 2, false);
        this.ctx.strokeStyle = this.color
        this.ctx.lineWidth = 9;
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.globalAlpha = 1.0;
        this.ctx.restore();
    }

    isCurrentTimeOnBeat(){
        return (this.audio.currentTime * 1000) >= this.beatCircles_Array[this.beatIndex].beatTime;
    }
    
    isCurrentTimeOnBeatRangeStart(){
        return this.audio.currentTime*1000 >= this.findBeatRangeStartForCurrentBeatRange();
    }

    isCurrentTimeOnBeatRangeEnd(){
        return this.audio.currentTime*1000 >= this.findBeatRangeEndForCurrentBeatRange();
    }

    findBeatRangeEndForCurrentBeatRange(){
        let beatTime = this.beatCircles_Array[this.beatIndex].beatTime;
        let beatRangeEnd = beatTime + this.beatBufferTime
        
        if(this.beatIndex < this.beatCircles_Array.length -1 ){ // if there are more beatIndexes ahead
            let nextStart = this.beatCircles_Array[ this.beatIndex +1 ].beatTime - this.beatBufferTime;
            if(nextStart < beatRangeEnd){
                beatRangeEnd = (nextStart + beatRangeEnd) / 2; // average them together to find the new value for beatRangeEnd
            }
        }
        return beatRangeEnd
    }

    findBeatRangeStartForCurrentBeatRange(){
        let beatTime = this.beatCircles_Array[this.beatIndex].beatTime;
        let beatRangeStart = beatTime - this.beatBufferTime;
        //let adjustment = 0;
        if(this.beatIndex>0){
            // check the previous beat to see if it's end needs averagaing with this start
            let previousEnd = this.beatCircles_Array[ this.beatIndex -1 ].beatTime + this.beatBufferTime;
            if(previousEnd > beatRangeStart){ 
                beatRangeStart = (previousEnd + beatRangeStart) / 2; // average the positions to find the new beatRangeStart
            }
        }
        return beatRangeStart
    }

    drawBeatRanges(){
        let radians = (this.beatCirclePathDirectionAngle * Math.PI) / 180;
        let lineStart = (this.velocity/1000) * (this.findBeatRangeStartForCurrentBeatRange() - this.audio.currentTime * 1000);
        let lineEnd   = (this.velocity/1000) * (this.findBeatRangeEndForCurrentBeatRange()   - this.audio.currentTime * 1000);

        const lineStartpointX = this.position.x + lineStart * Math.cos(radians);
        const lineStartpointY = this.position.y + lineStart * Math.sin(radians);
        const lineEndpointX = this.position.x + lineEnd * Math.cos(radians);
        const lineEndpointY = this.position.y + lineEnd * Math.sin(radians);

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(lineStartpointX, lineStartpointY);
        this.ctx.lineTo(lineEndpointX, lineEndpointY);
        this.ctx.strokeStyle = 'RGBA(0,0,255,.33)'; // Set the line color
        this.ctx.lineWidth = 70; // Set the line width
        this.ctx.stroke();
        this.ctx.restore();
    }

    drawMotionIndicatorLine(){
        let radians = (this.beatCirclePathDirectionAngle * Math.PI) / 180;
        const lineLength = Math.max(this.canvas.width, this.canvas.height); // Adjust for longer lines if needed
        const lineEndpointX = this.position.x + lineLength * Math.cos(radians);
        const lineEndpointY = this.position.y + lineLength * Math.sin(radians);

        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.moveTo(this.position.x, this.position.y);
        this.ctx.lineTo(lineEndpointX, lineEndpointY);
        this.ctx.strokeStyle = 'RGBA(0,255,0,.5)'; // Set the line color
        this.ctx.lineWidth = 1; // Set the line width
        this.ctx.stroke();
        this.ctx.restore();
    }
    
    isPointInside(hand_position){ return this.is_hand_inside(hand_position) }

    is_hand_inside(hand_position) 
    {
        if (hand_position) 
        {
            const dist = Math.sqrt((this.position.x - hand_position.x) ** 2 + (this.position.y - hand_position.y) ** 2);
            this.handInside = true;
            return dist <= this.radius;
        }
        this.handInside=false;
        return false;
    }
    
    // this is called from outside classes. Specifically: when the reset button is pressed
    reset()
    {
        // this assumes that reset will reset the audio to currentTime = 0 so it makes sense to set the beatIndex to 0 also
        this.beatIndex = 0;
        this.beatsMissed = 0;
        this.pulse();
    }


}
