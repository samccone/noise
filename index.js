var context = new (window.AudioContext || window.webkitAudioContext);
var sampleRate = 44100;
var baud = 100;
var mark = 2000;
var shift = 1000;
var length = 1/baud;
var data = '0100100001100101011011000110110001101111001000010010000001101101011110010010000001101110011000010110110101100101001000000110100101110011001000000111001101100001011011010010000001110011011000010110001101100011011011110110111001100101001000000110100001101111011101110010000001100001011100100110010100100000011110010110111101110101';
var i = 0;
var osc = context.createOscillator();
var processor = context.createScriptProcessor(4096, 1, 1);
var bandpass = context.createBiquadFilter();
var out = [];

processor.onaudioprocess = function(e) {
  var d = e.inputBuffer.getChannelData(0);
  var sectionSum = 0;
  var prevSectionSum = 0;

  for(var i =0; i< d.length; ++i) {
    sectionSum+= Math.abs(d[i]);

    if (i%((sampleRate/baud)/1) == 0) {
      out.push(sectionSum);
      prevSectionSum = sectionSum;
      sectionSum = 0;
    }
  }
}

bandpass.type="bandpass";
bandpass.frequency.value = mark+shift;
bandpass.Q.value = 300;

osc.connect(bandpass);
osc.frequency.value = mark;
osc.start();

bandpass.connect(context.destination);
bandpass.connect(processor);
//need to connect the processor node to the output
// because otherwise chrome will not work.
processor.connect(context.destination);

while(i++ < data.length) {
  osc.detune.setValueAtTime(data[i] == '1' ? 0 : shift, i*length);
}
osc.stop(data.length*length);
osc.onended = function() {
  bandpass.disconnect(processor);
  processor.disconnect(context.destination);
}

