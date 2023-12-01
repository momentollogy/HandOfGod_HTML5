import { HandLandmarker, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.6";

export default class MediaPipeTracker 
{
    constructor() 
    {
        this.video;
        this.handLandmarker;
        this.results;
        this.canvas = document.getElementById("output_canvas");
        this.diagnostics = true;

        this.LEFT = "Left";
        this.RIGHT= "Right";
        this.BOTH = "Both";
    }

    async createHandLandmarker(){
        const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.6/wasm");
        this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
                delegate: "GPU"
            },
            runningMode: "VIDEO",
            numHands: 2,
            staticImageMode: false, // Set static image mode to false
            modelComplexity: 0, // Lower the model complexity
            minDetectionConfidence: 0.4, // Adjust this value as needed
            minTrackingConfidence: 0.4 // Adjust this value as needed
        });
    }

    setVid(_vid){
        this.video = _vid;
    }


    createLandmarks() {
        return this.createHandLandmarker(); // Now returns a Promise
    }
    static getInstance() {
        if (!MediaPipeTracker.instance) {
            MediaPipeTracker.instance = new MediaPipeTracker();
        }
        return MediaPipeTracker.instance;
    }

    detectVideoResults() {
        if(this.handLandmarker)
        {
            this.results = this.handLandmarker.detectForVideo(this.video, performance.now());
            return this.results;
        }
    }

    getResults() {
        return this.results;
    }

    getPointOfIndex(hand, index)
    {
        if (this.results.handednesses && this.results.landmarks) 
        {
            for (let h = 0; h < this.results.handednesses.length; h++)
            {
                if(this.results.landmarks[h] && this.results.handednesses[h][0].displayName == hand)
                {
                    const coords = {
                        x: this.canvas.width - (this.results.landmarks[h][index].x * this.canvas.width),
                        y: this.results.landmarks[h][index].y * this.canvas.height,
                        z: this.results.landmarks[h][index].z * 1000,
                    }
                    return coords;
                }
            }
        }
    }

    checkForTouchWithShape(touchableShape, handToCheck, ...landMarkIndexes)
    {
        if (!touchableShape){return null;}
        let pointsInside_returnArray = [];
        if (this.results.handednesses && this.results.landmarks) 
        {
            for (let h = 0; h < this.results.handednesses.length; h++)
            {
                const handHandedness = this.results.handednesses[h][0].displayName; 
                const landmarks = this.results.landmarks[h];
                if ((handToCheck === "Both") || (handToCheck === handHandedness))
                {
                    for(let i=0 ; i<landMarkIndexes.length; i++)
                    {
                        const landmarkPosition = {
                            x: this.canvas.width - (landmarks[landMarkIndexes[i]].x * this.canvas.width),
                            y: landmarks[landMarkIndexes[i]].y * this.canvas.height
                        };

                        if(this.diagnostics)
                        {
                            let ctx = this.canvas.getContext("2d");
                            ctx.save()
                            ctx.strokeStyle = "yellow";
                            ctx.beginPath();
                            ctx.lineWidth=2;
                            ctx.arc(landmarkPosition.x, landmarkPosition.y, 25, 0, 2 * Math.PI);
                            ctx.fillStyle = "rgb(0,255,0)"
                            ctx.fillText(handHandedness, landmarkPosition.x, landmarkPosition.y );
                            ctx.stroke();
                            ctx.closePath();
                            ctx.restore();
                        }

                        if (touchableShape.isPointInside(landmarkPosition)) 
                        {
                            pointsInside_returnArray.push({
                                                            hand:handHandedness, 
                                                            x:landmarkPosition.x, 
                                                            y:landmarkPosition.y 
                                                         });
                        }
                    }
                }
            }
        }
        return pointsInside_returnArray; 
    }

}

