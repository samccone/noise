var bufferFrameSize = 2048;
var SampleRate = 44100;
var Audio = (window.AudioContext || window.webkitAudioContext);
var context = new Audio();
var LIMIT = 100;
var data = '';

var lastTime = 0;
var out = [];
var ctx = document.querySelector('canvas').getContext('2d');
var processData = [];
var k;
var x = 0;
var mic;
var stringToBinary = require('string-to-binary');
var binaryToString = require('binary-to-string');

function paint(d, m) {
  ctx.beginPath();

  for(var i = 0; i < d.length; ++i) {
    ctx.lineTo(x+i/4, 100+d[i]*20, 1, 1);
  }
  x+= d.length/4;

  ctx.stroke();
  ctx.closePath();
  ctx.fillRect(x, m, 10, 10);
}

function paintAll(out, data) {
  var sorted = out.map(function(v){return v.m;})
  .filter(function(v){return v !== -Infinity;})
  .sort(function(a, b){ return a - b; });

  var min = sorted[0];
  var max = sorted[data.length-1];

  for(var i = 0; i < out.length; ++i) {
    ctx.fillStyle = data[i] == '0' ? 'rgba(0,0,255,0.2)' : 'rgba(255,0,0,0.2)';
    ctx.fillRect(i*20, 0, 10, 800);
    ctx.fillStyle = out[i].m > LIMIT ? "rgba(255,0,0,0.5)" : "rgba(0,0,255, 0.5)";
    ctx.fillRect(i*20, out[i].m - min, 10, 10);
  }
}

function decode(out) {
  console.log(
    binaryToString(
      out.map(function(v) {
        return v.m > LIMIT ? 1 : 0;
      }).join('')
    )
  );
}

function processChunk(k, binsPerBit, raw, out) {
  while(raw.length >= binsPerBit) {
    var chunk = raw.slice(0, binsPerBit);
    raw = raw.slice(binsPerBit);
    var realW = 2 * Math.cos(2 * Math.PI * k /binsPerBit);
    var imagW = Math.sin(2 * Math.PI*k/binsPerBit);
    var d1 = 0.0;
    var d2 = 0.0;

    for(var i=0; i < binsPerBit; ++i) {
      var y = chunk[i] + realW * d1 - d2;
      d2 = d1;
      d1 = y;
    }

    var r = 0.5 * realW * d1 - d2;
    var im = imagW * d1;

    out.push({
      real: r,
      imag: im * d1,
      m: 20 * Math.log(Math.sqrt(Math.pow(r,2) + Math.pow(im,2)))
    });
  }

  return raw;
}

function run() {
  var sampleRate = context.sampleRate;

  var baud = parseInt(document.querySelector('[name="baud"]').value);
  var low = parseInt(document.querySelector('[name="low"]').value);
  var high = parseInt(document.querySelector('[name="high"]').value);
  var binsPerBit = Math.ceil(SampleRate/baud);
  data = stringToBinary(document.querySelector('[name="message"]').value);
  remainder = [];

  k = 0.5 + (binsPerBit * (high) / SampleRate);
  length = 1/baud;

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
    remainder = processChunk(k, binsPerBit, remainder, out);
  };

  data.split('').forEach(function(v, i) {
    osc2.frequency.setValueAtTime(Math.random()*2000, i*length+context.currentTime);
    osc.frequency.setValueAtTime(v == '1' ? high : low, i*length+context.currentTime);
  });

  //osc2.start();
  osc.start();
  osc.frequency.value = 0;

  //osc2.stop(data.length*length+context.currentTime);
  osc.stop(data.length*length+context.currentTime);
  lastTime = data.length*length;

  osc.onended = function() {
    osc.disconnect(processor);
    osc.disconnect(context.destination);
    processor.disconnect(context.destination);
    paintAll(out, data);
    decode(out);
  };
}

function startMic() {
  navigator.webkitGetUserMedia({audio: true}, function(stream) {
    mic = context.createMediaStreamSource(stream);
    var sampleRate = context.sampleRate;
    var baud = parseInt(document.querySelector('[name="baud"]').value);
    var low = parseInt(document.querySelector('[name="low"]').value);
    var high = parseInt(document.querySelector('[name="high"]').value);
    var binsPerBit = Math.ceil(SampleRate/baud);
    remainder = [];
    k = 0.5 + (binsPerBit * (high) / SampleRate);

    processor = context.createScriptProcessor(bufferFrameSize, 1, 1);
    mic.connect(processor);
    processor.connect(context.destination);

    processor.onaudioprocess = function(e) {
      processData = e.inputBuffer.getChannelData(0);
      remainder = remainder.concat(Array.prototype.slice.call(processData, 0));
      remainder = processChunk(k, binsPerBit, remainder, out);
    };
  }, function(err) { });
}

function closeMic() {
  mic.disconnect(processor);
  paintAll(out, data);
  decode(out);
}

module.exports = {
  run: run,
  mic: startMic,
  closeMic: closeMic
};
