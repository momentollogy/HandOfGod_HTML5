// Particles.js
class Particle {
 constructor(x, y, directionX, directionY, color) {
     this.x = x;
     this.y = y;
     this.size = Math.random() * 3 + 1;  // Larger size range for more variability
     this.speedX = directionX * (4 + Math.random() * 2);  // Variable speed for organic feel
     this.speedY = directionY * (4 + Math.random() * 2);  // Variable speed for organic feel
     this.color = color;
     this.life = 0;
     this.maxLife = 5;
     this.damping = 0.95;
     this.noise = Math.random() * 0.5 - 0.25;
 }

 update() {
     this.x += this.speedX + this.noise;
     this.y += this.speedY + this.noise; 
     this.speedX *= this.damping;
     this.speedY *= this.damping;
     if (this.size > 0.1) this.size -= 0.05;
     this.life++;
 }

 draw(ctx) {
     ctx.fillStyle = this.color;
     ctx.beginPath();
     ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
     ctx.fill();
     ctx.shadowBlur = 10;
     ctx.shadowColor = this.color;
  
 }
}

export default class Particles {
 constructor(ctx) {
     this.ctx = ctx;
     this.particles = [];
     this.colors = ['rgb(57, 255, 20)', 'rgb(128, 255, 0)', 'rgb(0, 255, 128)']; // Different shades of neon green



    }


    /*
 emit(startPosition, radius = 50) {  // Adjusted radius
     let particleCount = 50;
     let angleIncrement = (Math.PI * 2) / particleCount;
     for (let i = 0; i < particleCount; i++) {

         let x = startPosition.x + radius * Math.cos(angleIncrement * i);
         let y = startPosition.y + radius * Math.sin(angleIncrement * i);

         
         const angleInDegrees = 120;  // Hard-coded angle in degrees
         const angleInRadians = angleInDegrees * (Math.PI / 180);  // Convert to radians
         
         // Use the angle to set the direction
         let directionX = Math.cos(angleInRadians);
         let directionY = Math.sin(angleInRadians);
         
         let color = this.colors[Math.floor(Math.random() * this.colors.length)];
         this.particles.push(new Particle(x, y, directionX, directionY, color));
     }
 }
*/
 

/*
twirly effect 
emit(startPosition, swipeAngleDegrees, radius = 30) {
 let particleCount = 50;
 const centralSwipeAngleRadians = swipeAngleDegrees * (Math.PI / 180); // Central direction based on swipe

 // Range for the burst to start from the circle's perimeter
 const burstStartRange = Math.PI * 2; // Full circle

 for (let i = 0; i < particleCount; i++) {
     // Start angle for each particle around the circle's perimeter
     let startAngle = burstStartRange * (i / particleCount);

     // Adjusted angle for slight veer towards swipe direction
     let adjustedAngle = startAngle + centralSwipeAngleRadians * 1.7; // 10% influence of swipe direction

     let directionX = Math.cos(adjustedAngle);
     let directionY = Math.sin(adjustedAngle);

     let x = startPosition.x + radius * Math.cos(startAngle);
     let y = startPosition.y + radius * Math.sin(startAngle);

     let color = this.colors[Math.floor(Math.random() * this.colors.length)];
     this.particles.push(new Particle(x, y, directionX, directionY, color));
 }
}
*/
emit(startPosition, swipeAngleDegrees, radius = 70) {  // Radius to match the circle
 let particleCount = 70;

 // Convert the swipe angle to a direction vector
 // Adjust the angle for coordinate system differences
 let angleInRadians = (swipeAngleDegrees + 180) % 360 * (Math.PI / 180);

 for (let i = 0; i < particleCount; i++) {
     // Emit from the circle's circumference
     let angleIncrement = (Math.PI * 2) / particleCount;
     let startAngle = angleIncrement * i;

     let x = startPosition.x + radius * Math.cos(startAngle);
     let y = startPosition.y + radius * Math.sin(startAngle);

     // Use the angle to set the direction, adjusted for coordinate system
     let directionX = Math.cos(angleInRadians);
     let directionY = Math.sin(angleInRadians);

     let color = this.colors[Math.floor(Math.random() * this.colors.length)];
     this.particles.push(new Particle(x, y, directionX, directionY, color));
 }
}




 updateAndDraw() {
     for (let i = 0; i < this.particles.length; i++) {
         this.particles[i].update();
         if (this.particles[i].life < this.particles[i].maxLife) {
             this.particles[i].draw(this.ctx);
         } else {
             this.particles.splice(i, 1);
             i--;
         }
     }
 }
}
