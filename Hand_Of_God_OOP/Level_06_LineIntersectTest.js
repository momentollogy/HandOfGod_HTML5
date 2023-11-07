import MediaPipeTracker from './MediaPipeTracker.js';
import SweetSpotCircle from './SweetSpotCircle.js';
import DrawEngine from './DrawEngine.js';

export default class Level_06_LineIntersectTest
{
    constructor()
    {
        this.mediaPipe = MediaPipeTracker.getInstance()
        this.canvas = document.getElementById("output_canvas");;
        this.ctx = this.canvas.getContext("2d");
        this.drawEngine = DrawEngine.getInstance();
        this.drawEngine.displayTracking = false;
        this.audio = new Audio();

        this.sweetSpotCircle = new SweetSpotCircle(this.audio,  'rgb(0, 255, 0)',     { x: this.canvas.width / 2, y: this.canvas.height / 3}, 120);

        this.tip_L;
        this.tip_R;  
    }

    level_loop() {
        // mediapipe stuff
        let results = this.mediaPipe.results;
        if (results == undefined) { return; }

        this.makeLine();
        this.checkLineCircleTouch();

        this.sweetSpotCircle.updateAndDraw();
    }
    
    makeLine(){
        this.tip_L = this.mediaPipe.getPointOfIndex("Left", 8);
        this.tip_R = this.mediaPipe.getPointOfIndex("Right", 8);
        //console.log(tip_L,tip_R);

        if(this.tip_L && this.tip_R){
            this.ctx.strokeStyle  = "rgb(0,255,200)";
            this.ctx.lineWidth = 3;
            this.ctx.beginPath();
            this.ctx.moveTo(this.tip_L.x, this.tip_L.y);
            this.ctx.lineTo(this.tip_R.x, this.tip_R.y);
            this.ctx.stroke();
        }
    }

    checkLineCircleTouch(){
        //this.sweetSpotCircle.puffy=true;
        let itTouches = false;
        if(this.tip_L && this.tip_R){
            itTouches = this.circleLineToucheyMath(this.sweetSpotCircle.x, this.sweetSpotCircle.y, this.sweetSpotCircle.baseRadius, this.tip_L.x, this.tip_L.y, this.tip_R.x, this.tip_R.y);
            console.log(itTouches); // true
        }
        if(itTouches){this.sweetSpotCircle.puffy=true}else{this.sweetSpotCircle.puffy=false}
    }

    circleLineToucheyMath(cx, cy, r, x1, y1, x2, y2) {
        // Calculate the squared distance from the circle center to the line segment
        function pointToLineDistance(x, y, x1, y1, x2, y2) {
            let A = x - x1;
            let B = y - y1;
            let C = x2 - x1;
            let D = y2 - y1;
            let dot = A * C + B * D;
            let lenSq = C * C + D * D;
            let param = -1;
            if (lenSq !== 0) param = dot / lenSq;
            let closestX, closestY;

            if (param < 0) {
            closestX = x1;
            closestY = y1;
            } else if (param > 1) {
            closestX = x2;
            closestY = y2;
            } else {
            closestX = x1 + param * C;
            closestY = y1 + param * D;
            }

            let dx = x - closestX;
            let dy = y - closestY;
            return dx * dx + dy * dy;
        }

        // Calculate the squared distance from the circle center to the line segment
        let dist = pointToLineDistance(cx, cy, x1, y1, x2, y2);

        // Check if the squared distance is less than or equal to the circle radius squared
        return dist <= r * r;
    }
    
}
    