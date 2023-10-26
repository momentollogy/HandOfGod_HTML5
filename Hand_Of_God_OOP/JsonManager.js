export default class JsonManager 
{
    constructor()
    {
        this.loadedBeats= [];
       // this.chooseFileButton = document.getElementById('chooseFileButtonId');
       this.hiddenFileInput = document.getElementById('hiddenFileInput');


    }


    promptForFile() {
        // Programmatically "click" the hidden file input
        this.hiddenFileInput.click();
    }

    loadBeatTimes() {
        console.log("load pressed");
        const file = this.hiddenFileInput.files[0];
        if (!file) {
            alert('Please select a JSON file to load.');
            return;
        }

        const reader = new FileReader();
        reader.onload = (event) => {  // Using arrow function to keep the context
            const jsonData = JSON.parse(event.target.result);
            if (jsonData && jsonData.beatTimes) {
                this.loadedBeats = jsonData.beatTimes;
                // populateBeatCircles();
                // console.log("Loaded beats:", this.loadedBeats);
            } else {
                alert('Invalid JSON format.');
            }
        };
        reader.readAsText(file);
        return this.loadedBeats;
    }
}