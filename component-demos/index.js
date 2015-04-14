const Audio = (window.AudioContext || window.webkitAudioContext);
const context = new Audio();
let osc;

function startOsc() {
  osc = context.createOscillator();
  osc.connect(context.destination);
  osc.start();
}

function updateOsc() {
  if (!osc) {
    startOsc();
  }

  osc.frequency.value = parseInt(document.querySelector('input[type="range"]').value, 10);
}

function stopOsc() {
  osc.disconnect(context.destination);
  osc = null;
}

module.exports = {
  stopOsc: stopOsc,
  updateOsc: updateOsc
};
