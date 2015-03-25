var bufferFrameSize = 4096;
var context = new (window.AudioContext || window.webkitAudioContext);

var data = '0100100001100101011011000110110001101111001000010010000001101101011110010010000001101110011000010110110101100101001000000110100101110011001000000111001101100001011011010010000001110011011000010110001101100011011011110110111001100101001000000110100001101111011101110010000001100001011100100110010100100000011110010110111101110101';

var lastTime = 0;
var out = [];
var ctx = document.querySelector('canvas').getContext('2d');
var processData = [];

(function() {
  ctx.clearRect(0,0, 2048, 200);
  ctx.beginPath();

  for(var i = 0; i < processData.length; ++i) {
    ctx.lineTo(i/2, 100+processData [i]*20, 1, 1);
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

  length = 1/baud;

  osc = context.createOscillator();
  processor = context.createScriptProcessor(bufferFrameSize, 1, 1);

  processor.onaudioprocess = function(e) {
    processData = e.inputBuffer.getChannelData(0);
    var sectionSum = 0;
    var prevSectionSum = 0;
     for(var i =0; i< 400; i+=4) {
      sectionSum+= Math.abs(processData[i]);
       if (i%((sampleRate/baud)/1) == 0) {
        out.push(sectionSum);
        prevSectionSum = sectionSum;
        sectionSum = 0;
      }
    }
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
    osc.disconnect(processor);
    osc.disconnect(context.destination);
    processor.disconnect(context.destination);
  }
}

