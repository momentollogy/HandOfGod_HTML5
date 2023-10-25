export default class Circle {
    constructor(canvas, ctx, color='rgb(0, 255, 0)', position = {x:800,y:200}, radius = 80, thickness = 2, is_growing = false, is_moving = false, growth_rate = 2)
     {
        this.canvas = canvas;
        this.ctx = ctx;
        this.position = position;
        this.radius = radius;
        this.color = color;
        this.thickness = thickness;
        this.baseRadius = radius;
        this.growth_rate = growth_rate;
        this.handInside = false;
        this.randomizePosition();
        this.newCircleMade=false;
     
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

    draw() {
        // draw the arc
        this.ctx.beginPath();
        this.ctx.arc(this.position.x,this.position.y, this.radius, 0, Math.PI * 2, false);
        this.ctx.strokeStyle = this.color;
        this.ctx.lineWidth = this.thickness;
        this.ctx.stroke();
        this.ctx.closePath();

        // draw radius at center
       // this.ctx.save();
       // this.ctx.scale(1, 1);
        this.ctx.font = "20px Arial";
        //this.ctx.strokeText(Math.trunc(this.radius), -this.position.x-11, this.position.y+5);
        this.ctx.strokeText(Math.trunc(this.radius),this.position.x-9, this.position.y+5);
      //  this.ctx.restore();
    }

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

    randomizePosition() 
    {
        var randomXposition=Math.random() * this.canvas.width;
        var randomYposition=Math.random() * this.canvas.height;
        this.position = {x: randomXposition, y: randomYposition};
        console.log(this.canvas.width,this.canvas.length,"=CHECKING DIMENSIONS from INSIDE CIrCLE")
    }



    startPulsing() {
        this.isGrowing = true;  // Start growing the circle
        this.maxRadius = this.radius + 20;  // Set the max radius for this pulse
    }

    update() {
        if (this.isGrowing) {
            this.grow();
        } else {
            //this.shrink();
            this.radius=this.baseRadius;
        }
    }

}
