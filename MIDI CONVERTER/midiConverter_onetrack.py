import pretty_midi
import json

# Define MIDI note numbers for left and right hand
LEFT_HAND_NOTE_NUMBER = 60  # C2
RIGHT_HAND_NOTE_NUMBER = 62 # D2

# Load the MIDI file
midi_data = pretty_midi.PrettyMIDI('PrinceMIDI.mid')

# Initialize JSON data structure
json_data = {
    "beatTimes": [],
    "leftCircleData": [],
    "rightCircleData": [],
    "bkgPulses": [500, 1000, 1500, 2000],
    "mp3FileName": "",
    "bmp": 195,  # Set the beats per minute here
    "settings": {}
}

# Convert MIDI beats to timestamps
for beat in midi_data.get_beats():
    json_data['beatTimes'].append(round(beat * 1000, 3))  # convert seconds to milliseconds

# Assuming the first track in the MIDI file is the one with the drum notes
for note in midi_data.instruments[0].notes:
    timestamp = round(note.start * 1000, 3)  # Convert to milliseconds
    note_data = {"time": timestamp, "dir": 0}
    if note.pitch == LEFT_HAND_NOTE_NUMBER:
        json_data['leftCircleData'].append(note_data)
    elif note.pitch == RIGHT_HAND_NOTE_NUMBER:
        json_data['rightCircleData'].append(note_data)

# Save to JSON file
with open('output.json', 'w') as outfile:
    json.dump(json_data, outfile, indent=4)

print("Conversion complete. The JSON data is saved in 'output.json'.")
