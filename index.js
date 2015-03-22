var context = new (window.AudioContext || window.webkitAudioContext);
var baud = 100;
var mark = 2000;
var shift = 500;
var length = 1/baud;

var data = '0100100001100101011011000110110001101111001000010010000001101101011110010010000001101110011000010110110101100101001000000110100101110011001000000111001101100001011011010010000001110011011000010110001101100011011011110110111001100101001000000110100001101111011101110010000001100001011100100110010100100000011110010110111101110101';
var i = 0;
var osc = context.createOscillator();
var processor = context.createScriptProcessor(4096, 1, 1);
var bandpass = context.createBiquadFilter();

bandpass.type="bandpass";
bandpass.frequency.value = mark+shift;
bandpass.Q.value = 1000;

osc.connect(bandpass);
osc.frequency.value = mark;
osc.start();

bandpass.connect(context.destination);
bandpass.connect(processor);

while(i++ < data.length) {
  osc.detune.setValueAtTime(data[i] == '0' ? 0 : shift, i*length);
}
osc.stop(data.length*length);

processor.onaudioprocess = function(e) {
  console.log("2")
}


