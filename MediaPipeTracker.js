import { HandLandmarker, FilesetResolver } from "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.6";

export default class MediaPipeTracker
{
    constructor(_handLandmarker){
        this.handLandmarker = _handLandmarker
        // Before we can use HandLandmarker class we must wait for it to finish loading. Machine Learning models can be large and take a moment to get everything needed to run.
        const createHandLandmarker = async () => {
            const vision = await FilesetResolver.forVisionTasks("https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.6/wasm");
            this.handLandmarker = await HandLandmarker.createFromOptions(vision, {
                baseOptions: {
                    modelAssetPath: `https://storage.googleapis.com/mediapipe-models/hand_landmarker/hand_landmarker/float16/1/hand_landmarker.task`,
                    delegate: "GPU"
                },
                runningMode: "VIDEO",
                numHands: 2
            });
        };
        createHandLandmarker();
    }

    getHandLandmarker()
    {
        //console.log("in the getter landmark 24", this.handLandmarker)
        return this.handLandmarker;
    }

}