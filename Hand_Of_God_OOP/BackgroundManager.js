import Background_RainbowRain from './Background_RainbowRain.js'
import Background_FloatingParticles from './Background_FloatingParticles.js'

export default class BakcgroundManager
{
    constructor(_audio) {
      this.audio = _audio;
      this.pulseTriggered = false;
      this.bkg = new Background_FloatingParticles();
    }
    draw(){
      if((this.audio.currentTime % 1).toFixed(2) > .9 && !this.pulseTriggered){
        this.bkg.pulse();
        this.pulseTriggered = true
      }else if ( (this.audio.currentTime % 1).toFixed(2) < .1 ){this.pulseTriggered = false}
     
      //console.log(this.audio.currentTime.toFixed(2), (this.audio.currentTime % 1).toFixed(2) );  
      this.bkg.draw();
    }

}
 








