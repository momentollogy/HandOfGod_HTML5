export default class Circle {
    constructor(color = 'rgb(0, 255, 0)',position = {x: Math.random() * window.innerWidth, y: Math.random() * window.innerHeight},
    radius = 50, thickness = 2, is_growing = false, is_moving = false, growth_rate = 1)
     {
        this.canvas = canvas;
        this.ctx = ctx;
        this.position = position;
        this.radius = radius;
        this.color = color;
        this.thickness = thickness;
     //   this.is_growing = is_growing;
      //  this.is_moving = is_moving;
      //  this.growth_rate = growth_rate;
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

    grow() {
        this.radius += this.growth_rate;
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
    }

    is_hand_inside(hand_position) {
        if (hand_position) {
            const dist = Math.sqrt((this.position.x - hand_position.x) ** 2 + (this.position.y - hand_position.y) ** 2);
            return dist <= this.radius;
        }
        return false;
    }
}
