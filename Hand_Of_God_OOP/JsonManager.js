export default class JsonManager 
{
    constructor()
    {
        this.loadedBeats = [];
        this.selectedFile = null;
                
        this.hiddenFileInput = document.getElementById('hiddenFileInput');
        
        this.hiddenFileInput.addEventListener('change', (event) => {
            this.selectedFile = event.target.files[0];
            if (this.selectedFile) {
                this.loadAndParseJsonFile();
            }
        });
    }

    promptForFile() {
        this.hiddenFileInput.click();
    }

    loadJsonFileByPath(filePath){
        fetch(filePath)
            .then((response) => response.json())
            .then((jsonData) => {
                this.processJsonData(jsonData);
            })
            .catch((error) => {
                console.error('Error loading JSON file:', error);
            });
    }

    loadAndParseJsonFile() {
        const reader = new FileReader();
        reader.onload = (event) => {
          try {
            const jsonContent = event.target.result;
            const jsonData = JSON.parse(jsonContent);
            this.processJsonData(jsonData);
          } catch (error) {
            console.error('Error parsing JSON file:', error);
          }
        };
        reader.readAsText(this.selectedFile);
      }
    
      processJsonData(jsonData) {
        // Handle the parsed JSON data here
        this.loadedBeats = jsonData.beatTimes; // For example, assuming jsonData is an array
        console.log('Parsed JSON data:', this.loadedBeats);
        const customEvent = new CustomEvent('beatTimeDataReady', { detail: { message: 'Hello, world!' } });
        document.dispatchEvent(customEvent);
      }
}