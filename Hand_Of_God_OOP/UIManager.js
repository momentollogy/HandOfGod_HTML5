class UIManager {
    constructor(levelInstance) {
        this.level = levelInstance;
        this.startStopButton = this.createStartStopButton();
        this.resetButton = this.createResetButton();
    }

    showUI() {
        this.startStopButton.style.display = "block";
        this.resetButton.style.display = "block";
    }

    hideUI() {
        this.startStopButton.style.display = "none";
        this.resetButton.style.display = "none";
    }

    createStartStopButton() {
        const button = document.createElement('button');
        button.innerText = "Start";
        button.style.position = "absolute";
        button.style.bottom = '10px';
        button.style.left = '10px';
        button.style.display = "none";  // Initially hidden
        document.getElementById("container").appendChild(button);

        button.addEventListener('click', () => {
            if (button.innerText === "Start") {
                button.innerText = "Stop";
                this.level.startSong();
            } else {
                button.innerText = "Start";
                this.level.stopSong();
            }
        });

        return button;
    }

    createResetButton() {
        const button = document.createElement('button');
        button.innerText = "Reset";
        button.style.position = "absolute";
        button.style.bottom = '10px';
        button.style.right = '10px';
        button.style.display = "none";  // Initially hidden
        document.getElementById("container").appendChild(button);

        button.addEventListener('click', () => {
            this.level.resetSession();
        });

        return button;
    }
}
