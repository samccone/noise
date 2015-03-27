var bufferFrameSize = 2048;
var SampleRate = 44100;
var Audio = (window.AudioContext || window.webkitAudioContext);
var context = new Audio();

var data = '111000111000111000111000111000111';

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
  var binsPerBit = (SampleRate/bufferFrameSize)/baud * bufferFrameSize;
  remainder = [];

  k = 0.5 + (binsPerBit * (mark+shift) / SampleRate);

  length = 1/baud;

  osc = context.createOscillator();
  processor = context.createScriptProcessor(bufferFrameSize, 1, 1);
  osc.connect(processor);
  osc.connect(context.destination);
  processor.connect(context.destination);

  processor.onaudioprocess = function(e) {
    processData = e.inputBuffer.getChannelData(0);

    remainder = remainder.concat(Array.prototype.slice.call(processData, 0));

    // trim leading 0's
    if (out.length == 0) {
      remainder = remainder.filter(function(v){return v});
    }

    while(remainder.length > binsPerBit) {
      var chunk = remainder.slice(0, binsPerBit);
      remainder = remainder.slice(binsPerBit);
      var q = [0,0,0];

      var realW = 2 * Math.cos(2 * Math.PI * k /binsPerBit);
      var imagW = Math.sin(2 * Math.PI*k/binsPerBit);

      for(var i=0; i<binsPerBit; ++i) {
        var y = chunk[i] + realW * q[1] - q[2];
        q[2] = q[1];
        q[1] = y;
      }

      var resultR = 0.5 * realW * q[1] - q[2];
      var resultI = imagW * q[1];

      out.push({
        real: resultR,
        imag: resultI
      });
    }

    paint(Array.prototype.slice.call(processData, 0), 0);
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

