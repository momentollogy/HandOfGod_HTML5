
export default class BeatCircle 
{
    constructor(_timestamp, ss_pos) {
        this.canvas = document.getElementById("output_canvas");;
        this.ctx = this.canvas.getContext("2d");
        this.timestamp = _timestamp;
        this.x = ss_pos.x;
        
        this.sweetSpotPos = ss_pos;
        this.color = "green";
        this.radius = 50;
        this.alpha = 1.0;
        this.y = 100;
        this.angle = -90;
        this.distanceToSweetSpot = 0;
    }

        // time * velocity = distance
    update(audioCurrentTime, velocity, _angle){
        this.angle = _angle;
        this.distanceToSweetSpot = (velocity/1000) * (this.timestamp - audioCurrentTime*1000)
        let radian = (this.angle * Math.PI) / 180;

        this.y = this.sweetSpotPos.y + this.distanceToSweetSpot * Math.sin(radian);
        this.x = this.sweetSpotPos.x + this.distanceToSweetSpot * Math.cos(radian);

        this.checkForRemoval()
    }

    draw(){
        // Draw the BeatCircle
        this.ctx.fillStyle = this.color;
        this.ctx.globalAlpha = this.alpha;
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        this.ctx.fill();
        this.ctx.font = "20px Arial";
        this.ctx.fillText(this.timestamp, this.x + 100, this.y);
        this.ctx.globalAlpha = 1.0;
    }

    checkForRemoval()
    {
        if(this.distanceToSweetSpot <0)
        {
            this.color = "rgb(220,95,0)";

            this.alpha = 1+this.distanceToSweetSpot/180;
            if (this.alpha < 0 ){this.alpha = 0;}
        }
        else{this.alpha = 1;this.color = "green";}
    }

}

