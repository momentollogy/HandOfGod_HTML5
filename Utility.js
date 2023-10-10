export default class MediaUtility {
    constructor(videoElement, onStreamChange) {
        this.videoElement = videoElement;
        this.selectElement = null;
        this.fullscreenButton = null;
        this.onStreamChange = onStreamChange;  // Callback function for when the stream changes
    }

    // Method to initialize camera selection
    async initCameraSelection() {
        const cameras = await this.getCameras();
        this.createCameraSelect(cameras);
    }

    // Method to get available cameras
    async getCameras() {
        const devices = await navigator.mediaDevices.enumerateDevices();
        return devices.filter(device => device.kind === 'videoinput');
    }

    // Method to change camera based on selection
    async changeCamera() {
        const constraints = {
            video: {
                deviceId: { exact: this.selectElement.value }
            }
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        this.videoElement.srcObject = stream;
        
        if (this.onStreamChange) {
            this.onStreamChange(stream);  // Notify of stream change
        }
        this.cameraChangeEvent();``
    }

    // Method to create camera selection dropdown
    createCameraSelect(cameras) {
        this.selectElement = document.createElement('select');
        cameras.forEach(camera => {
            const option = document.createElement('option');
            option.value = camera.deviceId;
            option.textContent = camera.label || `Camera ${cameras.indexOf(camera) + 1}`;
            this.selectElement.appendChild(option);
        });
        document.body.appendChild(this.selectElement);
        
        // Fixed incorrect method name from switchCamera to changeCamera
        this.selectElement.addEventListener('change', () => this.changeCamera());
    }

    // Method to create fullscreen toggle button
    createFullscreenButton() {
        this.fullscreenButton = document.createElement('button');
        this.fullscreenButton.textContent = 'Fullscreen';
        this.fullscreenButton.style.position = 'absolute';
        this.fullscreenButton.style.top = '10px';
        this.fullscreenButton.style.right = '10px';
        document.body.appendChild(this.fullscreenButton);
        
        this.fullscreenButton.addEventListener('click', () => {
            this.toggleFullscreen();
        });
    }

    // Method to toggle fullscreen mode
    toggleFullscreen() {
        if (document.fullscreenElement) {
            document.exitFullscreen();
            this.applyTransforms();
        } else {
            this.videoElement.requestFullscreen();
            this.removeTransforms();
        }
        this.cameraChangeEvent();
    }
    
    applyTransforms() {
        this.videoElement.style.transform = 'rotateY(180deg)';
        document.querySelector('.output_canvas').style.transform = 'rotateY(180deg)';
    }
    
    removeTransforms() {
        this.videoElement.style.transform = 'none';
        document.querySelector('.output_canvas').style.transform = 'none';
    }
    

    cameraChangeEvent() {
        this.videoElement.dispatchEvent(new Event('User_Webcam_Change'));
    }
}
