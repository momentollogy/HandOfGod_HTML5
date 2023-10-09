// MediaPipeTracker.js
import { HandLandmarker, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.6";

export default class MediaPipeTracker {
    constructor(vid) {
        this.video = vid;
        this.createHandLandmarker().then(() => {
            console.log("Hand Landmark model loaded!");
        });
    }

    async createHandLandmarker() {
        const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.6/wasm");
        this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
            baseOptions: {
                modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
                delegate: "GPU"
            },
            runningMode: "VIDEO",
            numHands: 2
        });
    }
//THIS IS where we pull the detection data xzy
    getResults() {
        if(this.handLandmarker)
        {
            return this.handLandmarker.detectForVideo(this.video, performance.now());
        }
    }
}
