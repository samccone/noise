const _ = require('lodash-contrib');
const stringToBinary = require('string-to-binary');
const binaryToString = require('binary-to-string');

const Audio = (window.AudioContext || window.webkitAudioContext);
const context = new Audio();
const SAMPLE_RATE = context.sampleRate;
const bufferFrameSize = 256;
const low = 2125;
const high = 2295;
const SHIFT = 1000;
let lastTime = 0;

function getNumberOfPaddingBits(bitsPerSecond) {
  return Math.ceil(bitsPerSecond / 2) + 2;
}

function classifyBit(v, baud) {
  const BitThreshold = 65 - 0.18 * baud;
  return v.m > BitThreshold ? 1 : 0;
}

function decode(out, baud) {
  let unmap = out.map((v) => classifyBit(v, baud));
  let unpadded = unpadSignal(unmap, baud);
  let output = document.querySelector('#output');

  if (output) {
    output.innerHTML = binaryToString(unpadded.join(''));
  }
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

function paintOutput(out, baud) {
  const canvas = document.querySelector('canvas');

  if (!canvas) { return; }

  const ctx = canvas.getContext('2d');
  const width = canvas.width;
  const height = canvas.height;
  let normalized = out.map(v => v.m);
  const max = _.max(normalized);
  const min = _.min(normalized);

  ctx.clearRect(0, 0, width, height);

  normalized
  .map(v => (v - min) / (max - min))
  .forEach((v, i, arr) => {
    ctx.fillStyle = classifyBit(out[i], baud) ? 'red' : 'blue';
    ctx.fillRect(i * width / arr.length, v * height * 0.8, 2, 2);
  });
}

function createOscillators(count) {
  let oscillators = [];
  for (let i = 0; i < count; ++i) {
    oscillators.push(context.createOscillator());
  }

  return oscillators;
}

function run(b, message, paint, noisy, plexers) {
  const baud = b || 45.45;
  const binsPerBit = Math.ceil(SAMPLE_RATE / baud);

  let stringMessage = (message || document.querySelector('#input').value);
  let data = padSignal(
    stringToBinary(stringMessage + '  '),
    baud
  );
  let remainder = [];
  let length = 1 / baud;

  const oscillators = createOscillators(plexers || 6);
  const noiseOsc = context.createOscillator();
  const processor = context.createScriptProcessor(bufferFrameSize, 1, 1);

  let out = [];

  oscillators.forEach(() => out.push([]));

  if (noisy) {
    noiseOsc.connect(processor);
    noiseOsc.connect(context.destination);
  }

  oscillators.forEach((osc) => {
    osc.connect(processor);
    osc.connect(context.destination);
  });

  processor.connect(context.destination);

  processor.onaudioprocess = function(e) {
    let processData = e.inputBuffer.getChannelData(0);
    remainder = remainder.concat(Array.prototype.slice.call(processData, 0));

    out.forEach((v, i, arr) => {
      let k = 0.5 + (binsPerBit * (high + (i % oscillators.length) * SHIFT) / SAMPLE_RATE);
      if (i == arr.length - 1) {
        remainder = goertzel(k, binsPerBit, remainder, v);
      } else {
        goertzel(k, binsPerBit, remainder, v);
      }
    });
  };

  data.split('').forEach(function(v, i) {
    if (noisy) {
      noiseOsc.frequency.setValueAtTime(Math.random() * 1000 + 500, i * length + context.currentTime);
    }

    let startTime = (i - i % oscillators.length) * length / oscillators.length + context.currentTime;
    oscillators[i % oscillators.length]
    .frequency.setValueAtTime(v == '1' ?
                              high + i % oscillators.length * SHIFT :
                              low,
                              startTime);
  });

  if (noisy) {
    noiseOsc.start(context.currentTime);
  }

  oscillators.forEach((osc) => {
    osc.start(context.currentTime);
    osc.frequency.value = 0;
    osc.stop(data.length * length / oscillators.length + context.currentTime);
  });

  if (noisy) {
    noiseOsc.stop(data.length * length + context.currentTime);
  }

  lastTime = data.length * length;

  oscillators[0].onended = function() {
    oscillators.forEach((osc) => {
      osc.disconnect(processor);
      osc.disconnect(context.destination);
    });

    processor.disconnect(context.destination);
    paintOutput(_.weave(...out), baud);
    try {
      decode(_.weave(...out), baud);
    } catch (e) {
      console.log('error decoding');
    }
  };
}

module.exports = {
  run: run
};
