var bufferFrameSize = 256;
var context = new (window.AudioContext || window.webkitAudioContext);

var data = '10';

var lastTime = 0;
var out = [];
var ctx = document.querySelector('canvas').getContext('2d');
var processData = [];
var k;

(function() {
  //ctx.clearRect(0,0, 2048, 200);
  ctx.beginPath();

  for(var i = 0; i < processData.length; ++i) {
    if (i%17 == 0) {
      ctx.fillRect(i/2, 65, 2, 2);
    }
    ctx.lineTo(i/2, 100+processData[i]*20, 1, 1);
  }

  ctx.stroke()
  ctx.closePath();

  requestAnimationFrame(arguments.callee);
})()

function run() {
  var sampleRate = context.sampleRate;
  var i=0;

  var baud =
    parseInt(document.querySelector('[name="baud"]').value)
    ||
    100;
  var mark = parseInt(document.querySelector('[name="mark"]').value)
    ||
    2000;
  var shift = parseInt(document.querySelector('[name="shift"]').value)
    || 1000


  k = 0.5 + (bufferFrameSize * (mark+shift) / 44100)

  length = 1/baud;

  osc = context.createOscillator();
  processor = context.createScriptProcessor(bufferFrameSize, 1, 1);
  processor.onaudioprocess = function(e) {
    console.log("tick");
    var q = [0,0,0];
    processData = e.inputBuffer.getChannelData(0);
    for(var i =0; i< bufferFrameSize; i++) {
      var w = 2*i/bufferFrameSize;
      cos = Math.cos(w);
      sin = Math.sin(w)
      coeff = 2 * cos;
      q[0] = coeff * q[1] - q[2] + processData[i];
      q[2] = q[1];
      q[1] = q[0];
    }

    var real = q[1] - q[2] * cos;
    var imag = q[2] * sin;
    var magnitude = Math.pow(real,2) + Math.pow(imag, 2);

    out.push({
      real: real,
      imag: imag,
      magnitude: magnitude
    })
  }

  while(i++ < data.length) {
    osc.frequency.setValueAtTime(data[i] == '1' ? mark : mark+shift, i*length+context.currentTime);
  }
  osc.frequency.value = mark;

  osc.connect(processor);
  osc.connect(context.destination)
  processor.connect(context.destination);

  osc.start();

  osc.stop(data.length*length+context.currentTime);
  lastTime = data.length*length;

  osc.onended = function() {
    for(var v=0;v<out.length;++v) {
      ctx.fillRect(v*4, out[v].magnitude, 2, 2);
    }
    osc.disconnect(processor);
    osc.disconnect(context.destination);
    processor.disconnect(context.destination);
  }
}

