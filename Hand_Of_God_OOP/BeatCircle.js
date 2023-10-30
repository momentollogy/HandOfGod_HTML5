
export default class BeatCircle 
{
    constructor(_swipeData, ss_pos) {
        this.canvas = document.getElementById("output_canvas");;
        this.ctx = this.canvas.getContext("2d");
        this.beatTime = _swipeData.time;
        this.direction = _swipeData.dir;
        this.x = ss_pos.x;
        this.sweetSpotPos = ss_pos;
        this.preBeatColor = "rgb(220,95,0)";
        this.postBeatColor = "rgb(255,255,0)";
        this.directionIndicatorColor = "rgb(128,0,255)";
        this.color;// = "Gray";
        this.lineWidth = 3;
        this.radius = 75;
        this.alpha = 1.0;
        this.y = 100;
        this.angle = -90;
        this.distanceToSweetSpot = 0;
    }

        // time * velocity = distance
    update(audioCurrentTime, velocity, _angle){
        this.angle = _angle;
        
        this.distanceToSweetSpot = (velocity/1000) * (this.beatTime - audioCurrentTime*1000)
        let radian = (this.angle * Math.PI) / 180;

        this.y = this.sweetSpotPos.y + this.distanceToSweetSpot * Math.sin(radian);
        this.x = this.sweetSpotPos.x + this.distanceToSweetSpot * Math.cos(radian);

        this.checkForRemoval()
    }

    draw(){
        this.ctx.save();

        // direction indicator
        this.ctx.globalAlpha = Math.min(Math.max(this.alpha-.5, 0), 1);
        //this.ctx.lineWidth = 2;
        //this.ctx.strokeStyle = 'yellow';
        const startAngle = (2*Math.PI/8) * 1.1;
        const endAngle = (2*Math.PI/8) * 2.9;
        const flatTopX1 = this.x + this.radius * Math.cos(startAngle);
        const flatTopY1 = this.y + this.radius * Math.sin(startAngle);
        const flatTopX2 = this.x + this.radius * Math.cos(endAngle);
        const flatTopY2 = this.y + this.radius * Math.sin(endAngle);
        this.ctx.beginPath();
        this.ctx.moveTo(flatTopX1, flatTopY1);
        this.ctx.lineTo(this.x,this.y + this.radius/2 );
        this.ctx.lineTo(flatTopX2, flatTopY2 );
        this.ctx.arc(this.x, this.y, this.radius, startAngle, endAngle);
        this.ctx.fillStyle = this.directionIndicatorColor;
        this.ctx.lineWidth = 4;
        this.ctx.fill();
        //this.ctx.stroke();

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

    checkForRemoval()
    {
        if(this.distanceToSweetSpot <0)
        {
            this.color = this.preBeatColor

            this.alpha = 1+this.distanceToSweetSpot/180;
            if (this.alpha < 0 ){this.alpha = 0;}
        }
        else{this.alpha = 1;this.color = this.postBeatColor;}
    }

}

