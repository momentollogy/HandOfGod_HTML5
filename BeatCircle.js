
export default class BeatCircle 
{
    constructor(level,circleData, ss_pos) {
        this.level = level;
        this.canvas = document.getElementById("output_canvas");;
        this.ctx = this.canvas.getContext("2d");
        this.beatTime = circleData.time;
        this.direction = circleData.dir;
        this.x = ss_pos.x;
        this.sweetSpotPos = ss_pos;


        this.postBeatColor = "rgb(0,255,0)";
        this.preBeatColor = "rgb(0,235,0)";

       // this.postBeatColor = "rgb(220,95,0)";
       // this.preBeatColor = "rgb(255,255,0)";

        this.directionIndicatorColor = "rgb(128,0,255)";
        this.color;// = "Gray";
        this.lineWidth = 3;
        this.radius = 65;
        this.alpha = 1.0;
        this.y = 0;
        this.angle = -90;
        this.distanceToSweetSpot = 0;
        this.fadeOut = true

        this.direction = circleData.dir;

    }






//new api update.
update(audioCurrentTime, velocity, _angle) {
   // console.log('BeatCircle update called');

    this.angle = _angle;

    // Calculate the distance to the sweet spot
    this.distanceToSweetSpot = (velocity / 1000) * (this.beatTime - audioCurrentTime * 1000);
    let radian = (this.angle * Math.PI) / 180;

    this.y = this.sweetSpotPos.y + this.distanceToSweetSpot * Math.sin(radian);
    this.x = this.sweetSpotPos.x + this.distanceToSweetSpot * Math.cos(radian);

    if (this.fadeOut) {
        this.checkForRemoval();
    } else {
        this.alpha = 1;
        this.color = this.preBeatColor;
    }
}


    
draw() {
    this.ctx.save();

    // Convert degrees to radians for rotation
    var rotationDegrees =this.direction;//  = 90; Change this value dynicmally to rotate by a different angle based on each beat in the json 
   
   var rotationRadians = rotationDegrees * Math.PI / 180;

    // Move the context's origin to the center of the circle, then rotate
    this.ctx.translate(this.x, this.y);
    this.ctx.rotate(rotationRadians);
    this.ctx.translate(-this.x, -this.y);

    this.ctx.globalAlpha = this.alpha;
    
    var WedgeAngle = .785; 
    const startAngle = WedgeAngle * 1.1;
    const endAngle = WedgeAngle * 2.9;

    const flatTopX1 = this.x + this.radius * Math.cos(startAngle);
    const flatTopY1 = this.y + this.radius * Math.sin(startAngle);
    const flatTopX2 = this.x + this.radius * Math.cos(endAngle);
    const flatTopY2 = this.y + this.radius * Math.sin(endAngle);
    this.ctx.beginPath();
    this.ctx.moveTo(flatTopX1, flatTopY1);
    this.ctx.lineTo(this.x, this.y + this.radius / 3);
    this.ctx.lineTo(flatTopX2, flatTopY2);
    this.ctx.arc(this.x, this.y, this.radius, startAngle, endAngle);
    this.ctx.fillStyle = this.directionIndicatorColor;
    this.ctx.lineWidth = 4;
    this.ctx.fill();

    this.ctx.fillStyle = this.color;
        this.ctx.globalAlpha = this.alpha;
        
        // outer stroke
        this.ctx.beginPath();
        this.ctx.strokeStyle = this.color;
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.ctx.lineWidth = this.lineWidth;
        this.ctx.stroke();
        
        // inner stroke
        this.ctx.beginPath();
        this.ctx.globalAlpha = Math.min(Math.max(this.alpha-.5, 0), 1);
        this.ctx.strokeStyle = this.color;
        this.ctx.arc(this.x, this.y, this.radius-this.lineWidth*2, 0, 2 * Math.PI);
        this.ctx.lineWidth = this.lineWidth * 2 - 2;
        this.ctx.stroke();
        
        // inner fill
        this.ctx.globalAlpha = Math.min(Math.max(this.alpha-.85, 0), 1);;
        //this.ctx.fillStyle = "rgb(180,0,255)";
        this.ctx.fill();
        this.ctx.font = "20px Arial";
        //this.ctx.fillText(this.swipeData, this.x + 100, this.y);
        this.ctx.globalAlpha = 1.0;

        this.ctx.restore();
    }




    checkForRemoval(){
        if(this.distanceToSweetSpot <0){
            this.color = this.postBeatColor

            this.alpha = 0+this.distanceToSweetSpot/180;
            if (this.alpha < 0 ){this.alpha = 0;}
        }
        else{
            this.alpha = 1;this.color = this.preBeatColor;
        }
    }


    dispose() 
    {
      //  console.log("Disposing BeatCircle...")
        // Clear any ongoing animations or timeouts if present
        // ...

        // Nullify the canvas and context references
        this.canvas = null;
        this.ctx = null;

        // Reset or nullify other properties if necessary
        this.beatTime = null;
        this.direction = null;
        this.x = null;
        this.y = null;
        this.sweetSpotPos = null;
        this.color = null;
      
    }
}




