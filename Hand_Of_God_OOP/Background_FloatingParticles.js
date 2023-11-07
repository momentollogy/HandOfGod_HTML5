export default class Background_FloatingParticles 
{
    constructor() {
        this.canvas = document.getElementById('output_canvas');
        this.ctx = this.canvas.getContext('2d');

        // Particle colors
        this.colors = [
        '128, 255, 255',
        '200, 30, 150',
        '255, 255, 0',
        ];
        this.blurry = true;
        this.border = false;
        this.minRadius = 300;
        this.maxRadius = 400;
        this.minOpacity = 0.005;
        this.maxOpacity = 0.5;
        this.minSpeed = 0.05;
        this.maxSpeed = 0.5;
        this.fps = 60;
        this.numParticles = 75;
        this.particle = [];
        this.growthSpeed = 5.5;
        this.createCircle();
        this.maxGrowthPercent = 15;
    }
  
    pulse(){
        //console.log("pulseBKG");
        for (let i = 0; i < this.numParticles; i++) {
            this.particle[i].growing = true;
            //this.particle[i].radius = this.particle[i].baseRadius + this.particle[i].radius/13;
        }
    }

    _rand(min, max) {
      return Math.random() * (max - min) + min;
    }

    drawBackground(){
        this.ctx.beginPath();
        this.ctx.fillStyle = "black";
        this.ctx.rect(0,0,this.canvas.width, this.canvas.height);
        this.ctx.fill();

        if(false){
            let num = 36;
            let sheer = -480;
            for (let i=0 ; i<num+(20); i++){
                this.ctx.beginPath();
                this.ctx.lineWidth = num * 1.35 ;
                this.ctx.strokeStyle = "rgba(16,16,16,95)"
                this.ctx.moveTo(i * (this.canvas.width/num),-num);
                this.ctx.lineTo(i * (this.canvas.width/num)+sheer, this.canvas.height + num);
                this.ctx.stroke();
                this.ctx.closePath();
            }
        }
    }

    createCircle() {
        for (let i = 0; i < this.numParticles; i++) {
            const color = this.colors[~~(this._rand(0, this.colors.length))];
            let rad = this._rand(this.minRadius, this.maxRadius);

            this.particle[i] = {
                radius: rad,
                baseRadius: rad,
                growing:false,
                xPos: this._rand(0, this.canvas.width),
                yPos: this._rand(0, this.canvas.height),
                xVelocity: this._rand(this.minSpeed, this.maxSpeed),
                yVelocity: this._rand(this.minSpeed, this.maxSpeed),
                color: `rgba(${color},${this._rand(this.minOpacity, this.maxOpacity)})`,
            };
            //this.draw(this.particle, i);
        }
        //this.animate(this.particle);
    }
  
    draw() {
        //this.drawBackground();
        this.animate();

        for (let i = 0; i < this.numParticles; i++) {
            if (this.blurry) {
                const grd = this.ctx.createRadialGradient(
                this.particle[i].xPos, this.particle[i].yPos, this.particle[i].radius,
                this.particle[i].xPos, this.particle[i].yPos, this.particle[i].radius / 1.2
                );

                grd.addColorStop(1.000, this.particle[i].color);
                grd.addColorStop(0.000, 'rgba(34, 34, 34, 0)');
                this.ctx.fillStyle = grd;
            } else {
                this.ctx.fillStyle = this.particle[i].color;
            }

            if (this.border) {
                this.ctx.strokeStyle = '#fff';
                this.ctx.stroke();
            }
            this.ctx.globalAlpha = .2;
            this.ctx.beginPath();
            this.ctx.arc(this.particle[i].xPos, this.particle[i].yPos, this.particle[i].radius, 0, 2 * Math.PI, false);
            this.ctx.fill();
            this.ctx.globalAlpha = 1;
        }
    }
  
    animate() {
        for (let i = 0; i < this.numParticles; i++) {
            this.particle[i].xPos += this.particle[i].xVelocity;
            this.particle[i].yPos -= this.particle[i].yVelocity;
            
            // particle pulse size
            let p = this.particle[i]
            let s = this.growthSpeed;
            let m = this.maxGrowthPercent;
            if(p.growing && p.radius < p.baseRadius + p.radius/m){p.radius += s}
            else if (p.radius > p.baseRadius) {p.growing=false;p.radius -= s}

            //if(this.particle[i].radius > this.particle[i].baseRadius){this.particle[i].radius -= 4;}
            
            if (this.particle[i].xPos > this.canvas.width + this.particle[i].radius || this.particle[i].yPos > this.canvas.height + this.particle[i].radius) {
                this.resetParticle(this.particle[i]);
            }
        }
    }
  
    resetParticle(p) {
        const random = this._rand(0, 1);
        if (random > 0.5) {
            p.xPos = -p.radius;
            p.yPos = this._rand(0, this.canvas.height);
        } else {
            p.xPos = this._rand(0, this.canvas.width);
            p.yPos = this.canvas.height + p.radius;
        }
    }
  
  }
  