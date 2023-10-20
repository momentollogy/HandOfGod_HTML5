let loadedBeats =[]
const chooseFileButton = document.getElementById('loadJson');

function loadBeatTimes() 
{
    console.log("load pressed");
    const file = chooseFileButton.files[0];
    if (!file) {
        alert('Please select a JSON file to load.');
        return;
    }
    const reader = new FileReader();
    reader.onload = function(event) {
        const jsonData = JSON.parse(event.target.result);
        if (jsonData && jsonData.beatTimes) {
            loadedBeats = jsonData.beatTimes;
            //populateBeatCircles();
            console.log("Loaded beats:", loadedBeats);
        } else {
            alert('Invalid JSON format.');
        }
    };
    reader.readAsText(file);
}