export default class Cir {
    constructor(color = 'rgb(0, 255, 0)',position = {x: 360, y: 240},
    radius = 50, thickness = 2, is_growing = false, is_moving = false, growth_rate = 2)
     {
       // this.canvas = canvas;
       // this.ctx = ctx;
        this.position = position;
        this.radius = radius;
        this.color = color;
        this.thickness = thickness;
     //   this.is_growing = is_growing;
      //  this.is_moving = is_moving;
       this.growth_rate = growth_rate;
       // this.is_hand_inside_last_frame = false;
       // this.canvas = document.getElementById('canvas');
       // this.ctx = this.canvas.getContext('2d');
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

    grow(growth_Override=this.growth_rate) {
        this.radius += growth_Override;
    }

    move(xx, yy) {
        this.position = {x: xx, y: yy};
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2, false);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.thickness;
        ctx.stroke();
        ctx.closePath();
        ctx.font = '20px Arial';
        ctx.fillStyle = 'white';
        ctx.fillText(this.radius, this.position.x,this.position.y);
    }

    is_hand_inside(hand_position) {
        if (hand_position) {
            const dist = Math.sqrt((this.position.x - hand_position.x) ** 2 + (this.position.y - hand_position.y) ** 2);
            return dist <= this.radius;
        }
        return false;
    }
}
