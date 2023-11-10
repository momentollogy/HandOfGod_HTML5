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
            itTouches = this.circleLineToucheyMath( {x:this.sweetSpotCircle.position.x, y:this.sweetSpotCircle.position.y},    this.sweetSpotCircle.baseRadius,    [this.tip_L.x, this.tip_L.y],  [this.tip_R.x, this.tip_R.y] );
            //console.log(itTouches); // true
        }
        if(itTouches){this.sweetSpotCircle.puffy=true}else{this.sweetSpotCircle.puffy=false}
    }

    circleLineToucheyMath(circleCenter, circleRadius, linePoint1, linePoint2) {
        // Extracting coordinates
        const { x: cx, y: cy } = circleCenter;
        const r = circleRadius;
        const [x1, y1] = linePoint1;
        const [x2, y2] = linePoint2;
    
        // Function to calculate the distance between two points
        function distance(x1, y1, x2, y2) {
            return Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        }
    
        // Check if both points are inside the circle
        const distance1 = distance(cx, cy, x1, y1);
        const distance2 = distance(cx, cy, x2, y2);
        if (distance1 < r && distance2 < r) {
            // Both points are within the circle, so the line segment is inside the circle
            return [linePoint1, linePoint2];
        }
    
        // Continue with the rest of the function to check for intersection points
        // Check for vertical line to avoid division by zero
        if (x1 === x2) {
            // The line is vertical
            const y_diff_square = r * r - (x1 - cx) * (x1 - cx);
            if (y_diff_square < 0) {
                return null; // The line is outside the circle
            }
            const y_diff = Math.sqrt(y_diff_square);
            const y_int1 = cy + y_diff;
            const y_int2 = cy - y_diff;
            // Check if y coordinates are within the segment
            if (y1 <= y_int1 && y_int1 <= y2 || y1 <= y_int2 && y_int2 <= y2) {
                return [[x1, y_int1], [x1, y_int2]].filter(point => distance(cx, cy, point[0], point[1]) <= r);
            } else {
                return null;
            }
        }
    
        // Calculate slope and intercept of the line
        const m = (y2 - y1) / (x2 - x1);
        const b = y1 - m * x1;
    
        // Coefficients for the quadratic equation ax^2 + bx + c = 0
        const a = 1 + m * m;
        const b_quad = 2 * (m * b - m * cy - cx);
        const c_quad = cx * cx + cy * cy - r * r + b * b - 2 * b * cy;
    
        // Calculate discriminant
        const discriminant = b_quad * b_quad - 4 * a * c_quad;
    
        if (discriminant < 0) {
            return null; // No intersection
        }
    
        // Calculate x values for the intersection points
        const x_int1 = (-b_quad + Math.sqrt(discriminant)) / (2 * a);
        const x_int2 = (-b_quad - Math.sqrt(discriminant)) / (2 * a);
    
        // Calculate y values for the intersection points
        const y_int1 = m * x_int1 + b;
        const y_int2 = m * x_int2 + b;
    
        // Function to check if a point is within the line segment
        function isBetween(value, start, end) {
            return Math.min(start, end) <= value && value <= Math.max(start, end);
        }
    
        // Filter points that are not within the line segment
        const points = [[x_int1, y_int1], [x_int2, y_int2]].filter(point => {
            return isBetween(point[0], x1, x2) && isBetween(point[1], y1, y2);
        });
    
        return points.length > 0 ? points : null;
    }
        
    
}
    