export default class Background_RainbowRain
{
    constructor() {
        this.canvas = document.getElementById("output_canvas");;
        this.ctx = this.canvas.getContext("2d");
        this.w = this.canvas.width;
        this.h = this.canvas.clientHeight;
        this.scaler = 5;
        this.total = this.w;
        this.accelleration = .05;

        this.size = this.w/this.total;
        this.occupation =this.w/this.total;
        this.repaintColor = 'rgba(0, 0, 0, .04)';
        this.colors = [];
        this.dots = [];
        this.dotsVel = [];

        this.portion = 360/this.total;
        for(var i = 0; i < this.total; ++i){
            this.colors[i] = this.portion * i;
            this.dots[i] = this.h;
            this.dotsVel[i] = 10;
        }
    }
    draw(){
        this.ctx.fillStyle = this.repaintColor;
        this.ctx.fillRect(0, 0, this.w, this.h);

        for(var i = 0; i < this.total; ++i){
          this.currentY = this.dots[i] - 1;
          this.dots[i] += this.dotsVel[i] += this.accelleration;
          
          this.ctx.globalAlpha = .5;
          this.ctx.fillStyle = 'hsl('+ this.colors[i] + ', 80%, 50%)';
          this.ctx.fillRect(this.occupation * i, this.currentY, this.size, (this.dotsVel[i] + 1)* this.scaler);
          this.ctx.globalAlpha = 1;
          if(this.dots[i] > this.h && Math.random() < .01){
            this.dots[i] = this.dotsVel[i] = 0;
          }
        }
      }
}
 










