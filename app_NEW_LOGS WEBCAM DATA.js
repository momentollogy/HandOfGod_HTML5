document.addEventListener('DOMContentLoaded', () => {
    const startGameButton = document.getElementById('startGameButton');
    const video = document.getElementById('webcam');
    const canvas = document.getElementById('canvas');
    const container = document.getElementById('container');

    startGameButton.addEventListener('click', () => {
      navigator.mediaDevices.getUserMedia({ 
    video: { 
        width: 1280, 
        height: 720 
    } 
})
        
            .then((stream) => {
                video.srcObject = stream;
                video.onloadedmetadata = () => {
                    video.play();
                    container.style.display = 'block';
                    console.log("PreAssignment=", 'Canvas dimensions:', canvas.width, 'x', canvas.height);
                    console.log("PreAssignment=",'Container Element:', container);

                    // Set canvas dimensions to match video
                    canvas.width = video.videoWidth;
                    canvas.height = video.videoHeight;

                    // Log required information
                    console.log('Web Camera dimensions:', video.videoWidth, 'x', video.videoHeight);
                    console.log('Canvas dimensions:', canvas.width, 'x', canvas.height);
                    console.log('Container Element:', container);
                };
            })
            .catch((error) => {
                console.error('Error accessing the webcam:', error);
            });
    });
});
