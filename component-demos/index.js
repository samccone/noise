const Audio = (window.AudioContext || window.webkitAudioContext);
const context = new Audio();
let osc;
let rawAudio = [];
let prevText = '';
let processor;

function startOsc() {
  osc = context.createOscillator();
  processor = context.createScriptProcessor(256, 1, 1);
  osc.connect(processor);
  osc.connect(context.destination);
  processor.connect(context.destination);
  processor.onaudioprocess = handleAudio;
  osc.start();
}

function handleAudio(e) {
  let processData = e.inputBuffer.getChannelData(0);
  rawAudio = rawAudio.concat(Array.prototype.slice.call(processData, 0));
}

function plotWave() {
  let canvas = document.querySelector('canvas');
  let ctx = canvas.getContext('2d');
  let height = canvas.height;
  let width = canvas.width;

  ctx.clearRect(0,0, width, height);
  ctx.beginPath();
  ctx.strokeStyle ="rgba(0,0,0,0.2)";
  rawAudio.forEach(function(v, i, arr) {
    ctx.lineTo(i/(arr.length) * width, (v+1)/2 * height);
  });
  ctx.stroke();
}

function updateOsc() {
  if (!osc) {
    startOsc();
  }

  osc.frequency.value = parseInt(document.querySelector('input[type="range"]').value, 10);
}

function stopOsc() {
  osc && osc.disconnect(context.destination);
  osc = null;
}

function encodeString(string, outputContainer) {
  outputContainer.innerHTML = require('string-to-binary')(string);
}

function pulseOsc(binary) {
  binary.split('').forEach(function(v, i) {
    // 0.022 roughly 45.45 baud
    osc.frequency.setValueAtTime(v == '1' ? 4000 : 1000, i * 0.022 + context.currentTime);
  });
  osc.frequency.setValueAtTime(0, (binary.length+1) * 0.022 + context.currentTime);
  setTimeout(function() {
    requestAnimationFrame(plotWave);
  }, (binary.length+3) * 0.022 + context.currentTime);
}

function onStringChangeToWave(string, outputContainer) {
  if (prevText === '') {
    stopOsc();
    startOsc();
  }

  let newText = string.slice(prevText.length);
  pulseOsc(require('string-to-binary')(newText));
  encodeString.apply(this, arguments);
  prevText = string;
}

module.exports = {
  stopOsc: stopOsc,
  onStringChange: encodeString,
  onStringChangeToWave: onStringChangeToWave,
  updateOsc: updateOsc
};
