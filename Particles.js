// Particles.js
class Particle {
    constructor(x, y, directionX, directionY, color, swipeSpeed) {
        console.log("PARTICLE CLASS Creating particle:", { x, y, directionX, directionY, color, swipeSpeed });

        
        this.x = x;
        this.y = y;
        this.size = Math.random() * 3 + 1;


        
        // Modulate the speed with the swipe speed
        let speedModifier = this.calculateSpeedModifier(swipeSpeed);
        this.speedX = directionX * speedModifier;
        this.speedY = directionY * speedModifier;
        this.noise = this.calculateNoise(swipeSpeed); // Dynamic noise based on speed

        this.color = this.adjustColorForSpeed(color, swipeSpeed);
        this.originalColor = this.color; // Store original color for fade-out effect
        
       // this.color = color;
        this.life = 0;
        this.maxLife = 60;
        this.damping = 0.95;
        this.noise = Math.random() * 0.5 - 0.25;

        console.log("Creating particle:", { x, y, directionX, directionY, color, swipeSpeed, speedModifier });

 }

 // Additional method to calculate speed modifier
 calculateSpeedModifier(swipeSpeed) {
    // Ensure swipeSpeed is within the expected range
    swipeSpeed = Math.max(200, Math.min(8000, swipeSpeed || 200));

    // Map the swipe speed (200-8000) to a much broader range of speed modifiers
    // Adjust the range and mapping formula as needed for more noticeable responsiveness
    const minModifier = 1; // Slowest speed factor
    const maxModifier = 30; // Fastest speed factor (increased for more responsiveness)
    const minSwipeSpeed = 200;
    const maxSwipeSpeed = 8000;

    // Use an exponential mapping for a more pronounced effect
    let normalizedSpeed = Math.pow((swipeSpeed - minSwipeSpeed) / (maxSwipeSpeed - minSwipeSpeed), 2);
    return minModifier + (maxModifier - minModifier) * normalizedSpeed;
}



adjustColorForSpeed(color, swipeSpeed) {
    if (Math.random() < 0.1) { // 10% chance to be a sparkle
        return 'rgba(255, 255, 255, 0.8)'; // White color for sparkle
    } else {
        // Slight yellowish tint for faster swipes
        let intensity = Math.min(swipeSpeed / 8000, 0.2); // Max intensity capped at 0.2
        return this.addYellowTint(color, intensity);
    }
}

addYellowTint(color, intensity) {
    // Extract RGB values from the original color
    let [r, g, b] = color.match(/\d+/g).map(Number);
    // Add yellow tint based on intensity
    r += 255 * intensity;
    g += 255 * intensity;
    return `rgb(${Math.min(r, 255)}, ${Math.min(g, 255)}, ${b})`;
}

calculateNoise(swipeSpeed) {
    // Normalize the swipe speed for noise calculation
    const maxSwipeSpeed = 8000;
    let normalizedSpeed = swipeSpeed / maxSwipeSpeed;
    
    // Increase the noise as the speed increases
    return Math.random() * normalizedSpeed - (normalizedSpeed / 2);
}

update() {
    this.x += this.speedX + this.noise;
    this.y += this.speedY + this.noise;
    this.speedX *= this.damping;
    this.speedY *= this.damping;

    if (this.size > 0.1) {
        this.size -= 0.05;
    }

    this.life++;

    // Fade-out color change
    if (this.life > this.maxLife / 2) {
        this.color = this.fadeOutColor(this.originalColor, this.life, this.maxLife);
    }
}

fadeOutColor(color, life, maxLife) {
    let fadeFactor = 1 - (life - maxLife / 2) / (maxLife / 2);
    let [r, g, b] = color.match(/\d+/g).map(Number);

    // Gradually reduce the brightness
    r *= fadeFactor;
    g *= fadeFactor;
    b *= fadeFactor;

    return `rgb(${Math.floor(r)}, ${Math.floor(g)}, ${Math.floor(b)})`;
}


draw(ctx) {
    // Save the current state without shadow
    ctx.save();

    // Set the particle's properties
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
    
    // Set the glow effect
    ctx.shadowBlur = 10;
    ctx.shadowColor = this.color;

    // Draw the particle with the glow
    ctx.fill();

    // Restore the original state (without shadow)
    ctx.restore();
}


}

export default class Particles {
 constructor(ctx) {
     this.ctx = ctx;
     this.particles = [];
     this.colors = ['rgb(57, 255, 20)', 'rgb(128, 255, 0)', 'rgb(0, 255, 128)']; // Different shades of neon green



    }

 
emit(startPosition, swipeAngleDegrees, swipeSpeed, radius = 70) {
    
    console.log("zzzzzzEmitting particles:", { startPosition, swipeAngleDegrees, swipeSpeed, radius });
    
    let particleCount = 50;
    let angleInRadians = (swipeAngleDegrees + 180) % 360 * (Math.PI / 180);

    for (let i = 0; i < particleCount; i++) {
        let angleIncrement = (Math.PI * 2) / particleCount;
        let startAngle = angleIncrement * i;

        let x = startPosition.x + radius * Math.cos(startAngle);
        let y = startPosition.y + radius * Math.sin(startAngle);

        let directionX = Math.cos(angleInRadians);
        let directionY = Math.sin(angleInRadians);

        let color = this.colors[Math.floor(Math.random() * this.colors.length)];

        // Pass the swipe speed to the Particle constructor
        this.particles.push(new Particle(x, y, directionX, directionY, color, swipeSpeed));
    }
}


normalizeSpeed(swipeSpeed) {
    // Ensure that swipeSpeed has a valid value
    swipeSpeed = Math.max(200, Math.min(8000, swipeSpeed || 200));

    const minSpeed = 1; // Slowest speed factor
    const maxSpeed = 5; // Fastest speed factor
    const minSwipeSpeed = 200;
    const maxSwipeSpeed = 8000;
    return minSpeed + (maxSpeed - minSpeed) * ((swipeSpeed - minSwipeSpeed) / (maxSwipeSpeed - minSwipeSpeed));
}

 updateAndDraw() {
  //  console.log("Updating and drawing particles, count:", this.particles.length);

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





/*
 //working way
emit(startPosition, swipeAngleDegrees, radius = 70) {  // Radius to match the circle
 let particleCount = 50;

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
*/
