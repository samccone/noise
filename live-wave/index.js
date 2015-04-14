const Audio = (window.AudioContext || window.webkitAudioContext);
const audioCtx = new Audio();

let canvas = document.createElement('canvas');

canvas.setAttribute('width', '1024px');
canvas.setAttribute('height', '400px');

let ctx = canvas.getContext('2d');
let raw;

document.body.appendChild(canvas);

(function paintFrame() {
  if (raw) {
    ctx.clearRect(0, 0, 1024, 400);
    raw.forEach((v, i) => {
      let n = (v + 1) / 2;
      ctx.fillRect(i, n*400, 2, 2);
    });
  }

  window.requestAnimationFrame(paintFrame);
})();

navigator.webkitGetUserMedia({audio: true}, (stream) => {
  let mic = audioCtx.createMediaStreamSource(stream);
  let processor = audioCtx.createScriptProcessor(1024, 1, 1);

  mic.connect(processor);
  processor.connect(audioCtx.destination);

  processor.onaudioprocess = (e) => {
    raw = Array.prototype.slice.call(e.inputBuffer.getChannelData(0), 0);
  };
}, (err) => { });

