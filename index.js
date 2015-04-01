var bufferFrameSize = 2048;
var SampleRate = 44100;
var Audio = (window.AudioContext || window.webkitAudioContext);
var context = new Audio();

var data = '';

var lastTime = 0;
var out = [];
var ctx = document.querySelector('canvas').getContext('2d');
var processData = [];
var k;
var x = 0;
var stringToBinary = require('string-to-binary');

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

function paintAll() {
  for(var i = 0; i < out.length; ++i) {
    ctx.fillStyle = data[i] == '0' ? 'rgba(0,0,255,0.2)' : 'rgba(255,0,0,0.2)';
    ctx.fillRect(i*20, 10, 10, 800)
    ctx.fillStyle = "black";
    ctx.fillRect(i*20, out[i].m * 3 + 100, 10, 10);
  }
}

module.exports = function() {
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
  osc2.connect(processor);
  osc2.connect(context.destination);
  osc.connect(context.destination);
  processor.connect(context.destination);

  processor.onaudioprocess = function(e) {
    processData = e.inputBuffer.getChannelData(0);

    remainder = remainder.concat(Array.prototype.slice.call(processData, 0));

    while(remainder.length >= binsPerBit) {
      var chunk = remainder.slice(0, binsPerBit);
      remainder = remainder.slice(binsPerBit);
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

    //paint(Array.prototype.slice.call(processData, 0), 0);
  };

  data.split('').forEach(function(v, i) {
    osc2.frequency.setValueAtTime(Math.random()*3000, i*length+context.currentTime);
    osc.frequency.setValueAtTime(v == '1' ? high : low, i*length+context.currentTime);
  });

//  osc2.start();
  osc.start();
  osc.frequency.value = 0;

//  osc2.stop(data.length*length+context.currentTime);
  osc.stop(data.length*length+context.currentTime);
  lastTime = data.length*length;

  osc.onended = function() {
    osc.disconnect(processor);
    osc.disconnect(context.destination);
    processor.disconnect(context.destination);
    paintAll();
  };
}

