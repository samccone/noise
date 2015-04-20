const _ = require('lodash');
const stringToBinary = require('string-to-binary');
const binaryToString = require('binary-to-string');

const Audio = (window.AudioContext || window.webkitAudioContext);
const context = new Audio();
const SAMPLE_RATE = context.sampleRate;
const bufferFrameSize = 2048;
const low = 2125;
const high = 2295;
let lastTime = 0;

function getNumberOfPaddingBits(bitsPerSecond) {
  return Math.ceil(bitsPerSecond / 2) + 2;
}

function decode(out, baud) {
  const BitThreshold = 65 - 0.18 * baud;

  let unmap = out.map(function(v) { return v.m > BitThreshold ? 1 : 0; });
  let unpadded = unpadSignal(unmap, baud);

  let output = document.querySelector('#output');

  output && (output.innerHTML = binaryToString(unpadded.join('')));
}

function unpadSignal(bits, bitsPerSecond) {
  bits = bits.slice(getNumberOfPaddingBits(bitsPerSecond));
  return bits.slice(0, -getNumberOfPaddingBits(bitsPerSecond));
}

function padSignal(bits, bitsPerSecond) {
  let padBits = '';

  for (let i = 0; i < getNumberOfPaddingBits(bitsPerSecond); ++i) {
    padBits += i < getNumberOfPaddingBits(bitsPerSecond) - 2 ? '1' : 0;
  }

  return padBits + bits + padBits;
}

function hamming(n, N) {
  return 0.54 - 0.47 * Math.cos(2 * Math.PI * n / N);
}

function goertzel(k, binsPerBit, raw, out) {
  const realW = 2 * Math.cos(2 * Math.PI * k / binsPerBit);
  const imagW = Math.sin(2 * Math.PI * k / binsPerBit);

  while (raw.length >= binsPerBit) {
    let chunk = raw.slice(0, binsPerBit);
    raw = raw.slice(binsPerBit);
    let d1 = 0.0;
    let d2 = 0.0;

    for (let i = 0; i < binsPerBit; ++i) {
      let x = chunk[i];
      x *= hamming(x, binsPerBit);
      let y = x + realW * d1 - d2;
      d2 = d1;
      d1 = y;
    }

    const r = 0.5 * realW * d1 - d2;
    const im = imagW * d1;

    out.push({
      real: r,
      imag: im * d1,
      m: 20 * Math.log(Math.sqrt(Math.pow(r, 2) + Math.pow(im, 2)))
    });
  }

  return raw;
}

function paintOutput(out) {
  const canvas = document.querySelector('canvas');

  if (!canvas) { return; }

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  let normalized = out.map((v) => {return v.m});
  const max = _.max(normalized);
  const min = _.min(normalized);

  ctx.clearRect(0, 0, width, height);

  normalized
  .map((v) => {
    return (v - min) / (max - min)
  })
  .forEach((v, i, arr) => {
    ctx.fillStyle = v > 0.5 ? 'red' : 'blue';
    ctx.fillRect(i * width/arr.length, v * height *.8, 2, 2);
  });

  return true;
}

function run(b, message, paint) {
  const baud = b || 45.45;
  const binsPerBit = Math.ceil(SAMPLE_RATE / baud);

  let out = [];
  let stringMessage = (message || document.querySelector('#input').value);
  let data = padSignal(
    stringToBinary(stringMessage + '  '),
    baud
  );
  let remainder = [];
  let k = 0.5 + (binsPerBit * (high) / SAMPLE_RATE);
  let length = 1 / baud;

  const osc = context.createOscillator();
  const processor = context.createScriptProcessor(bufferFrameSize, 1, 1);

  osc.connect(processor);
  osc.connect(context.destination);
  processor.connect(context.destination);

  processor.onaudioprocess = function(e) {
    let processData = e.inputBuffer.getChannelData(0);
    remainder = remainder.concat(Array.prototype.slice.call(processData, 0));
    remainder = goertzel(k, binsPerBit, remainder, out);
  };

  data.split('').forEach(function(v, i) {
    osc.frequency.setValueAtTime(v == '1' ? high : low, i * length + context.currentTime);
  });

  osc.start(context.currentTime);
  osc.frequency.value = 0;

  osc.stop(data.length * length + context.currentTime);
  lastTime = data.length * length;

  osc.onended = function() {
    osc.disconnect(processor);
    osc.disconnect(context.destination);
    processor.disconnect(context.destination);
    paintOutput(out) && decode(out, baud);
  };
}

module.exports = {
  run: run
};
