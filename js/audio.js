import * as Tone from "https://cdn.skypack.dev/tone";
const makeSynths = (count) => {
  const synths = [];
  for (let i = 0; i < count; i++) {
    let synth = new Tone.Sampler({
      urls: {
        "C4": "sounds/c4.mp3",
        "D4": "sounds/d4.mp3",
        "E4": "sounds/e4.mp3",
        "F4": "sounds/f4.mp3", 
        "G4": "sounds/g4.mp3", 
        "A4": "sounds/a4.mp3",
        "B4": "sounds/b4.mp3", 
        "C3": "sounds/c3.mp3"
      },
      release: 1,
    }).toDestination();
      
   
    synths.push(synth);
  }

  return synths;
};

const makeGrid = (notes) => {
  const rows = [];

  for (const note of notes) {
    const row = [];
    for (let i = 0; i < 8; i++) {
      row.push({
        note: note,
        isActive: false
      });
    }
    rows.push(row);
  }
  return rows;
};

const synths = makeSynths(8);
const notes = ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C3"];
let grid = makeGrid(notes);
let beat = 0;
let started = false;
var toneButtons = document.getElementsByClassName('note');
let activeNote;
let previousNote;


const configLoop = () => {

  const repeat = (time) => {
    grid.forEach((row, index) => {
      let synth = synths[index];
      let note = row[beat];
      if (beat > 0){
        previousNote = beat - 1 + index*8;
      }
      else {previousNote = 7 + index*8}

      if (note.isActive) {
        activeNote = beat + index*8;
        synth.triggerAttackRelease(note.note, "8n", time);
        toneButtons[activeNote].classList.add("playing");
      }
      toneButtons[previousNote].classList.remove("playing");
    }
    );

    beat = (beat + 1) % 8;
  };

  Tone.Transport.bpm.value = 128;
  Tone.Transport.scheduleRepeat(repeat, "8n");
};

let i = 0;
let f = 0;

const makeSequencer = () => {
  const sequencer = document.getElementById("sequencer");
  grid.forEach((row, rowIndex) => {

    row.forEach((note, noteIndex) => {
      const button = document.createElement("button");
      ["C4", "D4", "E4", "F4", "G4", "A4", "B4", "C3"];
      if (note.note == "C4"){
        button.innerHTML = "SFX"
      }
      if (note.note == "D4"){
        button.innerHTML = "Stab"
      }
      if (note.note == "E4"){
        button.innerHTML = "Perc"
      }
      if (note.note == "F4"){
        button.innerHTML = "CHH"
      }
      if (note.note == "G4"){
        button.innerHTML = "OHH"
      }
      if (note.note == "A4"){
        button.innerHTML = "Clap"
      }
      if (note.note == "B4"){
        button.innerHTML = "Bass"
      }
      if (note.note == "C3"){
        button.innerHTML = "Kick"
      }

      button.className = "note"
      button.addEventListener("click", function(e) {
        handleNoteClick(rowIndex, noteIndex, e);
      });
      sequencer.appendChild(button);
      i++;

    });

  });
};

const handleNoteClick = (clickedRowIndex, clickedNoteIndex, e) => {
  grid.forEach((row, rowIndex) => {
    row.forEach((note, noteIndex) => {
      if (clickedRowIndex === rowIndex && clickedNoteIndex === noteIndex) {
        note.isActive = !note.isActive;
        if (note.isActive){
          e.target.classList.add("note-is-active");
        }
        else{
          e.target.classList.remove("note-is-active");
        }
      
      }
    });
  });
};


const configPlayButton = () => {
  document.body.addEventListener("click", (e) => {
    if (!started) {
      Tone.start();
      Tone.getDestination().volume.rampTo(-10, 0.001)
      configLoop();
      started = true;
      Tone.Transport.start();
    }
  });
};


window.addEventListener("DOMContentLoaded", () => {
  configPlayButton();
	makeSequencer();
});