import pretty_midi
import json

# Replace 'your_midi_file.mid' with the path to your MIDI file
midi_data = pretty_midi.PrettyMIDI('/Users/kman/HandOfGod_HTML5/MIDI CONVERTER/APACHEMidi.mid')

# Create a dictionary to hold your JSON data
json_data = {
    "beatTimes":[],
    "leftCircleData": [],
    "rightCircleData": [],
    "bkgPulses": [500, 1000, 1500, 2000],
    "mp3FileName": "",
    "bpm": 116,  # You can set this to the correct value.
    "settings": {}
}

# Assuming that track 0 is for the left hand and track 1 is for the right hand
# Modify as necessary based on your MIDI file's track assignments
for note in midi_data.instruments[0].notes:
    json_data['leftCircleData'].append({"time": note.start * 1000, "dir": 0})

for note in midi_data.instruments[1].notes:
    json_data['rightCircleData'].append({"time": note.start * 1000, "dir": 0})

# Save the JSON data to a file
with open('output.json', 'w') as json_file:
    json.dump(json_data, json_file, indent=4)

print("JSON data has been written to 'output.json'")
