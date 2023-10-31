import BeatCircle from './BeatCircle.js';
import DrawEngine from './DrawEngine.js';

export default class SweetSpotCircle {
    constructor(_audio, color='rgb(0, 255, 0)', position = {x:1000,y:200}, radius = 65, thickness = 2, is_growing = false, is_moving = false, growth_rate = 2)
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
        //this.randomizePosition();
        this.newCircleMade=false;
        this.beatCircles_Array = [];
        this.beatArray=[];
        this.dirArray=[];
        this.beatIndex = 0;
        this.velocity = 300;
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
    }

    setPlayMode(circleData){
        this.beatCircles_Array = [];

        if(this.beatArray.length > 0){
            this.beatArray = this.recordedTimesArr;
            this.dirArray = this.recordedDirectionsArr;
            //this.beatCircles_Array = this.recordedTimesArr;
            for (let i=0 ; i< this.recordedTimesArr.length ; i++){
                let data = {time:this.beatArray[i],dir:this.dirArray[i]};
                this.beatCircles_Array.push(new BeatCircle(data,  this.position) )
            }
        }else{
            for (let i=0 ; i< circleData.length ; i++)
            {
                this.beatArray.push(circleData[i].time);
                this.dirArray.push(circleData[i].dir)
                this.beatCircles_Array.push(new BeatCircle(circleData[i],  this.position) )
            }
        }
    }

    setRecordMode(){
        this.beatCircles_Array = [];
        this.beatArray = this.recordedTimesArr;
        this.dirArray = this.recordedDirectionsArr;
        console.log(this.recordedMomentsArr);
        //{time:this.audio.currentTime*1000, dir:vector }
    }


    updateAndDrawBeatCircles()
    {
        for( let i = 0 ; i < this.beatCircles_Array.length ; i++)
        {
            let cir = this.beatCircles_Array[i];

            cir.update(this.audio.currentTime, this.velocity, this.beatCirclePathDirectionAngle)
            cir.draw();
        }
    }
    
    updateAndDraw(deltaTime){
        this.update();
        //this.drawLine();
        this.draw();
        this.updateAndDrawBeatCircles(deltaTime)
        //this.drawEngine.setInfoText(Math.round(this.beatCircles_Array[0].y));
    }

   draw() 
    {
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.arc(this.position.x,this.position.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.strokeStyle = this.color;
        this.ctx.shadowColor = this.color;;
        this.ctx.shadowBlur = this.puffy ? 5 : 40;
        this.ctx.lineWidth = this.puffy ? this.thickness*2 : this.thickness;
        this.ctx.stroke();
        this.ctx.closePath();

        this.ctx.globalAlpha = .25;
        this.ctx.beginPath();
        this.ctx.arc(this.position.x,this.position.y, this.baseRadius-10, 0, Math.PI * 2, false);
        this.ctx.strokeStyle = this.color
        this.ctx.lineWidth = 9;
        this.ctx.stroke();
        this.ctx.closePath();
        this.ctx.globalAlpha = 1.0;
        this.ctx.restore();
        //this.ctx.font = "20px Arial";
        //this.ctx.strokeText(Math.trunc(this.radius), -this.position.x-11, this.position.y+5);
        //this.ctx.strokeText(Math.trunc(this.radius),this.position.x-9, this.position.y+5);
        //this.ctx.restore();
    }

    drawLine(){
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


    randomizeColor(bright = false) {
        const colArr = ['rgb(0, 0, 255)', 'rgb(0, 255, 0)', 'rgb(255, 0, 0)', 'rgb(255, 255, 0)', 'rgb(255, 0, 255)', 'rgb(0, 255, 255)'];
        if (bright) {
            this.color = colArr[Math.floor(Math.random() * colArr.length)];
        } else {
            this.color = `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255})`;
        }
    }

    randomize(bright = false) {
        this.randomizeColor(bright);
        this.randomizePosition();
    }

    grow() {
        if (this.radius < this.maxRadius) {
            this.radius += this.growth_rate;
        } else {
            this.isGrowing = false;
        }
    }

    shrink() {
        if (this.radius > this.baseRadius) {
            this.radius -= this.growth_rate;
        }
    }

    move(xx, yy) 
    {
        this.position = {x: xx, y: yy};
    }

    randomizePosition() 
    {
        var randomXposition=Math.random() * this.canvas.width;
        var randomYposition=Math.random() * this.canvas.height;
        this.position = {x: randomXposition, y: randomYposition};
        console.log(this.canvas.width,this.canvas.length,"=CHECKING DIMENSIONS from INSIDE CIrCLE")
    }

    pulse() {
        this.radius = this.baseRadius + 30;
        //console.log(this, this.beatCircles_Array[0]);
    }

    isCloseToBeat(){
        return Math.abs(this.beatArray[this.beatIndex] - (this.audio.currentTime * 1000)) < this.drawEngine.deltaTime + (this.drawEngine.deltaTime / 3);
    }
    


    update() {
        if(this.radius > this.baseRadius){this.radius-=3}
        
        // pulse on the beats
        if(this.isCloseToBeat()){
            if(this.pulseOnBeats){this.pulse();}
            this.beatIndex++;
        }
    }

    reset()
    {
        this.beatIndex = this.findNextBeatIndex();
        this.pulse();
    }

    findNextBeatIndex() {
        for (let i = 0; i < this.beatArray.length; i++) {
            if (this.beatArray[i] > this.audio.currentTime) {
            return i;
            }
        }
        // If no beat is found, return a value that indicates all beats are in the past
        return -1;
    }

    recordedMoment(vector){
        this.recordedMomentsArr.push( {time:this.audio.currentTime*1000, dir:vector }); 
        this.recordedTimesArr.push(this.audio.currentTime*1000);
        this.recordedDirectionsArr.push(vector);
    }

}
