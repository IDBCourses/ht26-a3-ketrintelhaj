/*
 * IDB Programming: A3 — a musical instrument
 *
 * All of the code for your instrument goes in this file. It's split into sections:
 *   settings — the "fixed" parts of your program
 *   state    — the parts of your program that change over time
 *   sound    — the Tone.js instruments and effects
 *   update   — updates the state every 100ms, if necessary
 *   use      — uses the state to make sound and shapes every 100ms, if necessary
 *   controls — what happens when the player uses the pointer
 *   setup    — starts everything
 *
 * The pointer events change the state. update() and use() each run every
 * 100ms, in a loop:
 *   1. update: change the state, e.g. based on time or on the pointer's movement
 *   2. use:    make sound and move shapes, based on the state
 *
 * Shapes come from shape.js: createShape() makes one, and its methods
 * (setPosition, setSize, setColour ...) change it.
 *
 * Tone.js documentation: https://tonejs.github.io/docs/15.1.22/
 */

import { createShape } from "./shape.js";

// ---------- Settings ----------
// Settings variables should contain all of the "fixed" parts of your programs
// For example: which notes you can play, how fast things move, the tempo.
// the note played when the pointer goes down
const noteLeft = "C4";
const noteRight = "E4";
// Volume range in decibels
const minVolume = -36;
const maxVolume = -12;
// pointers peed needed to reach maximun volume
const speedForMaxVolume = 1;

// ---------- State ----------
// State variables are the parts of your program that change over time.
// For example: where the pointer is, how fast it's moving, or whether a drone is on.
let leftCircle;
let rightCircle;

let square1;
let square2;

let rotation1 = 0;
let rotation2 = 0;

let lastX1 = 0;
let lastY1 = 0;
let lastTime1 = 0;

let lastX2 = 0;
let lastY2 = 0;
let lastTime2 = 0;

let speed1 = 0;
let speed2 = 0;

const leftSpeeds = [];
const rightSpeeds = [];

// ---------- Sound ----------
// Make the instruments and plug them into the speakers.
const leftsynth = new Tone.AMSynth().toDestination(); // can play several notes at once
const rightsynth = new Tone.AMSynth().toDestination();
// start both synth at the minimun volume
leftsynth.volume.value = minVolume;
rightsynth.volume.value = minVolume;

function leftEnter() {
  Tone.start();
  leftsynth.triggerAttack("C4");
}

function leftLeave() {
  leftsynth.triggerRelease();
}

function rightEnter() {
  Tone.start();
  rightsynth.triggerAttack("E4");
}

function rightLeave() {
  rightsynth.triggerRelease();
}

// ---------- Update ----------
// Update the state. This is called every 100ms.
function update() {
  // every update stores 80% of the stored speedvaribuls
  speed1 = speed1 * 0.95;
  speed2 = speed2 * 0.95;

  setTimeout(update, 100); // call update() again in 100 milliseconds
}

// ---------- Use ----------
// Use the state to make sound and move shapes. This is called every 100ms.
// will make so the pointer movment affects the sound of the note, so it it moves slower
// it will be low sonud and if it moves fast it will create a higher sound
function use() {
  let leftLevel = speed1 / speedForMaxVolume;
  let rightLevel = speed2 / speedForMaxVolume;

  //keep each level at a maximum of 1
  if (leftLevel > 1) {
    leftLevel = 1;
  }

  if (rightLevel > 1) {
    rightLevel = 1;
  }

  //calculate the difference between the volum limits
  let volumeRange = maxVolume - minVolume;

  // calculate the volume for each side
  let leftVolume = minVolume + leftLevel * volumeRange;
  let rightVolume = minVolume + rightLevel * volumeRange;

  leftsynth.volume.rampTo(leftVolume, 0.1);
  rightsynth.volume.rampTo(rightVolume, 0.1);
  console.log("Speed:", speed1, "Volume:", leftsynth.volume.value);

  setTimeout(use, 100); // call use() again in 100 milliseconds
}

// ---------- Controls (Event Handlers) ----------
// Runs every time the pointer goes down: a click, a tap or a pen touch.
function pointerDown(event) {
  Tone.start(); // browsers only allow sound after the player has pressed something

  synth.triggerAttackRelease(note, "8n"); // play the note for an eighth note
}

function leftMove(event) {
  let distance = Math.abs(event.movementX) + Math.abs(event.movementY);

  rotation1 = rotation1 + distance * 0.5;
  square1.setRotation(rotation1);

  let normX = event.clientX / window.innerWidth;
  leftsynth.detune.value = -1200 + normX * 2400;

  let normY = event.clientY / window.innerHeight;
  let now = Date.now();
  if (lastTime1 > 0) {
    let seconds = (now - lastTime1) / 1000;
    let pointerDistance = Math.hypot(normX - lastX1, normY - lastY1);
    if (seconds > 0) {
      speed1 = pointerDistance / seconds;
      console.log("left speed:", speed1);
    }
  }
  lastX1 = normX;
  lastY1 = normY;
  lastTime1 = now;
}

function rightMove(event) {
  let distance = Math.abs(event.movementX) + Math.abs(event.movementY);

  rotation2 = rotation2 + distance * 0.5;
  square2.setRotation(rotation2);

  let normX = event.clientX / window.innerWidth;
  rightsynth.detune.value = -1200 + normX * 2400;

  let normY = event.clientY / window.innerHeight;
  let now = Date.now();

  if (lastTime2 > 0) {
    let seconds = (now - lastTime2) / 1000;
    let pointerDistance = Math.hypot(normX - lastX2, normY - lastY2);
    if (seconds > 0) {
      speed2 = pointerDistance / seconds;
      console.log("Right speed:", speed2);
    }
  }
  lastX2 = normX;
  lastY2 = normY;
  lastTime2 = now;
}

// ---------- Setup ----------
// Setup is run once, at the start of the program. It sets everything up for us!
function setup() {
  update(); // start the update loop
  use(); // start the use loop

  // Example: a shape near the middle of the window. Replace it with your own.
  const rightCircle = createShape("right-circle");
  const leftCircle = createShape("left-circle");

  square1 = createShape("square1");
  square2 = createShape("square2");

  square1.className = "square1";
  square2.className = "square2";

  leftCircle.element.appendChild(square1.element);
  rightCircle.element.appendChild(square2.element);

  leftCircle.setPosition(0.1, 0.22);
  rightCircle.setPosition(0.55, 0.22);

  // store both circles in an array
  const circles = [leftCircle, rightCircle];

  // Give both circles  the same size and colour
  for (let i = 0; i < circles.length; i++) {
    circles[i].setSize(500);
    circles[i].setColour(330, 80, 85);
  }

  square1.setPositionPixels(210, 210);
  square1.setSize(80);
  square1.setRoundedness(0);

  square2.setPositionPixels(210, 210);
  square2.setSize(80);
  square2.setRoundedness(0);

  // Put your event listener code here
  leftCircle.element.addEventListener("pointerenter", leftEnter);
  leftCircle.element.addEventListener("pointerleave", leftLeave);
  leftCircle.element.addEventListener("pointermove", leftMove);

  rightCircle.element.addEventListener("pointerenter", rightEnter);
  rightCircle.element.addEventListener("pointerleave", rightLeave);
  rightCircle.element.addEventListener("pointermove", rightMove);
}

setup(); // Always remember to call setup()!
