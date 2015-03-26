var bufferFrameSize = 256;
var SampleRate = 44100;
var Audio = (window.AudioContext || window.webkitAudioContext);
var context = new Audio();

var data = '111000111';

var lastTime = 0;
var out = [];
var ctx = document.querySelector('canvas').getContext('2d');
var processData = [];
var k;
var x = 0;

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

function run() {
  var sampleRate = context.sampleRate;
  var i=0;

  var baud = parseInt(document.querySelector('[name="baud"]').value);
  var mark = parseInt(document.querySelector('[name="mark"]').value);
  var shift = parseInt(document.querySelector('[name="shift"]').value);

  k = 0.5 + (bufferFrameSize * (mark+shift) / SampleRate);

  length = 1/baud;

  osc = context.createOscillator();
  processor = context.createScriptProcessor(bufferFrameSize, 1, 1);
  osc.connect(processor);
  osc.connect(context.destination);
  processor.connect(context.destination);

  processor.onaudioprocess = function(e) {
    var q = [0,0,0];
    processData = e.inputBuffer.getChannelData(0);

    for(var i =0; i< bufferFrameSize; i++) {
      var w = 2*i/bufferFrameSize;
      cos = Math.cos(w);
      sin = Math.sin(w);
      coeff = 2 * cos;
      q[0] = coeff * q[1] - q[2] + processData[i];
      q[2] = q[1];
      q[1] = q[0];
    }

    var real = q[1] - q[2] * cos;
    var imag = q[2] * sin;
    var magnitude = Math.pow(real,2) + Math.pow(imag, 2);
    console.log("!");
    paint(Array.prototype.slice.call(processData, 0), magnitude);

    out.push({
      real: real,
      imag: imag,
      magnitude: magnitude
    });
  };

  while(i++ < data.length) {
    osc.frequency.setValueAtTime(data[i] == '1' ? mark+shift : mark, i*length+context.currentTime);
  }

  osc.start();
  osc.frequency.value = 0;

  osc.stop(data.length*length+context.currentTime);
  lastTime = data.length*length;

  osc.onended = function() {
    osc.disconnect(processor);
    osc.disconnect(context.destination);
    processor.disconnect(context.destination);
  };
}

