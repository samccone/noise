var bufferFrameSize = 2048;
var SampleRate = 44100;
var Audio = (window.AudioContext || window.webkitAudioContext);
var context = new Audio();

var data = '01101000011001010110110001101100011011110010000001101101011110010010000001101110011000010110110101100101001000000110100101110011001000000111000001100001011101010110110000100000011010010010000001100001011011010010000001100001001000000110110101100001011011100010000001100001011011100110010000100000011010010010000001101000011000010111011001100101001000000110000100100000011011100110100101100011011001010010000001101100011010010110011001100101001000000110010001101111001000000111100101101111011101010010000001101100011010010110101101100101001000000110001101101000011001010111001101110011011001010010000001100010011001010110001101100001011101010111001101100101001000000111000001100001011101010110110000100000011001000110111101100101011100110010000001101110011011110111010000100000011010000110010100100000011010010111001100100000011001100111001001101111011011010010000001100011011000010110111001100001011001000110000100100000';

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

  var baud = parseInt(document.querySelector('[name="baud"]').value);
  var mark = parseInt(document.querySelector('[name="mark"]').value);
  var shift = parseInt(document.querySelector('[name="shift"]').value);
  var binsPerBit = Math.ceil((SampleRate/bufferFrameSize)/baud * bufferFrameSize);
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
    if (out.length === 0) {
      remainder = remainder.filter(function(v){return v;});
    }

    while(remainder.length >= binsPerBit) {
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

    //paint(Array.prototype.slice.call(processData, 0), 0);
  };

  data.split('').forEach(function(v, i) {
    osc.frequency.setValueAtTime(v == '1' ? mark+shift : mark, i*length+context.currentTime);
  });

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

