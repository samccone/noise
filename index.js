var _ = require('lodash');
var bufferFrameSize = 2048;
var Audio = (window.AudioContext || window.webkitAudioContext);
var context = new Audio();
var SAMPLE_RATE = context.sampleRate;
var BitThreshold;
var data = '';

var lastTime = 0;
var out = [];
var ctx = document.querySelector('canvas').getContext('2d');
var processData = [];
var k;
var mic;
var stringToBinary = require('string-to-binary');
var binaryToString = require('binary-to-string');

function paintAll(out, data) {
  ctx.clearRect(0, 0, 6400, 800);
  var filtered = out.map(function(v) { return v.m; })
  .filter(function(v) { return v !== -Infinity && v !== null })

  var min = _.min(filtered);
  var max = _.max(filtered) - min;

  filtered = _.map(filtered, function(v) {
    return (v - min) / max
  });

  filtered.forEach(function(v, i) {
    ctx.fillStyle = data[i] == '0' ? 'rgba(0,0,255,0.2)' : 'rgba(255,0,0,0.2)';
    ctx.fillRect(i * 20, 0, 10, 800);
    ctx.fillStyle = v > 0.5 ? 'rgba(255,0,0,0.5)' : 'rgba(0,0,255, 0.5)';
    ctx.fillRect(i * 20, v * 400, 10, 10);

    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(i * 20 + 2.5, v * 400, 5, 5);
  });
}

function decode(out, baud) {
  var unmap = out.map(function(v) { return v.m > BitThreshold ? 1 : 0; });
  var unpadded = unpadSignal(unmap, baud);
  console.log(binaryToString(unpadded.join('')));
}

function hamming(n, N) {
  return 0.54 - 0.47 * Math.cos(2 * Math.PI * n / N);
}

function goertzel(k, binsPerBit, raw, out) {
  var realW = 2 * Math.cos(2 * Math.PI * k / binsPerBit);
  var imagW = Math.sin(2 * Math.PI * k / binsPerBit);
  while (raw.length >= binsPerBit) {
    var chunk = raw.slice(0, binsPerBit);
    raw = raw.slice(binsPerBit);
    var d1 = 0.0;
    var d2 = 0.0;

    for (var i = 0; i < binsPerBit; ++i) {
      var x = chunk[i];
      x *= hamming(x, binsPerBit);
      var y = x + realW * d1 - d2;
      d2 = d1;
      d1 = y;
    }

    var r = 0.5 * realW * d1 - d2;
    var im = imagW * d1;

    out.push({
      real: r,
      imag: im * d1,
      m: 20 * Math.log(Math.sqrt(Math.pow(r, 2) + Math.pow(im, 2)))
    });
  }

  return raw;
}

function getNumberOfPaddingBits(bitsPerSecond) {
  return Math.ceil(bitsPerSecond / 2) + 2;
}

function unpadSignal(bits, bitsPerSecond) {
  bits = bits.slice(getNumberOfPaddingBits(bitsPerSecond));
  return bits.slice(0, -getNumberOfPaddingBits(bitsPerSecond));
}

function padSignal(bits, bitsPerSecond) {
  var padBits = '';

  for (var i = 0; i < getNumberOfPaddingBits(bitsPerSecond); ++i) {
    padBits += i < getNumberOfPaddingBits(bitsPerSecond) - 2 ? '1' : 0;
  }

  return padBits + bits + padBits;
}

function run() {
  out = [];
  var baud = parseInt(document.querySelector('[name="baud"]').value);
  var low = parseInt(document.querySelector('[name="low"]').value);
  var high = parseInt(document.querySelector('[name="high"]').value);
  var binsPerBit = Math.ceil(SAMPLE_RATE / baud);
  BitThreshold = 65 - 0.18 * baud;

  data = padSignal(
    stringToBinary(document.querySelector('[name="message"]').value),
    baud
  );

  remainder = [];

  k = 0.5 + (binsPerBit * (high) / SAMPLE_RATE);
  length = 1 / baud;

  osc = context.createOscillator();
  osc2 = context.createOscillator();
  processor = context.createScriptProcessor(bufferFrameSize, 1, 1);
  osc.connect(processor);
  //osc2.connect(processor);
  //osc2.connect(context.destination);
  osc.connect(context.destination);
  processor.connect(context.destination);

  processor.onaudioprocess = function(e) {
    processData = e.inputBuffer.getChannelData(0);
    remainder = remainder.concat(Array.prototype.slice.call(processData, 0));
    remainder = goertzel(k, binsPerBit, remainder, out);
  };

  data.split('').forEach(function(v, i) {
    osc2.frequency.setValueAtTime(Math.random() * 2000, i * length + context.currentTime);
    osc.frequency.setValueAtTime(v == '1' ? high : low, i * length + context.currentTime);
  });

  //osc2.start();
  osc.start(context.currentTime);
  osc.frequency.value = 0;

  //osc2.stop(data.length*length+context.currentTime);
  osc.stop(data.length * length + context.currentTime);
  lastTime = data.length * length;

  osc.onended = function() {
    osc.disconnect(processor);
    osc.disconnect(context.destination);
    processor.disconnect(context.destination);
    paintAll(out, data);
    decode(out, baud);
  };
}

function startMic() {
  navigator.webkitGetUserMedia({audio: true}, function(stream) {
    mic = context.createMediaStreamSource(stream);
    var baud = parseInt(document.querySelector('[name="baud"]').value);
    var low = parseInt(document.querySelector('[name="low"]').value);
    var high = parseInt(document.querySelector('[name="high"]').value);
    var binsPerBit = Math.ceil(SAMPLE_RATE / baud);
    remainder = [];
    k = 0.5 + (binsPerBit * (high) / SAMPLE_RATE);

    processor = context.createScriptProcessor(bufferFrameSize, 1, 1);
    mic.connect(processor);
    processor.connect(context.destination);

    processor.onaudioprocess = function(e) {
      processData = e.inputBuffer.getChannelData(0);
      remainder = remainder.concat(Array.prototype.slice.call(processData, 0));
      remainder = goertzel(k, binsPerBit, remainder, out);
    };
  }, function(err) { });
}

function closeMic() {
  mic.disconnect(processor);
  paintAll(out, data);
  decode(out, parseInt(document.querySelector('[name="baud"]').value));
}

module.exports = {
  run: run,
  mic: startMic,
  closeMic: closeMic
};
