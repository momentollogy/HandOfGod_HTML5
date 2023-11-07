const videoElement = document.getElementById('video');

const hands = new Hands({
  locateFile: (file) => {
    return `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`;
  }
});
hands.setOptions({
  maxNumHands: 2,
  minDetectionConfidence: 0.5,
});

hands.onResults(onResults);

const camera = new Camera(videoElement, {
  onFrame: async () => {
    await hands.send({ image: videoElement });
  },
  width: 1280,
  height: 720,
});

camera.start();

function onResults(results) {
  if (results.multiHandedness) {
    const handLabels = results.multiHandedness.map(handInfo => handInfo.label);
    console.log(`${handLabels.join(' and ')} hand${handLabels.length > 1 ? 's' : ''} present.`);
  }
}
