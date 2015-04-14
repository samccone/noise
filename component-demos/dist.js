(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.noise = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var Audio = window.AudioContext || window.webkitAudioContext;
var context = new Audio();
var osc = undefined;

function startOsc() {
  osc = context.createOscillator();
  osc.connect(context.destination);
  osc.start();
}

function updateOsc() {
  if (!osc) {
    startOsc();
  }

  osc.frequency.value = parseInt(document.querySelector('input[type="range"]').value, 10);
}

function stopOsc() {
  osc.disconnect(context.destination);
  osc = null;
}

module.exports = {
  stopOsc: stopOsc,
  updateOsc: updateOsc
};

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL3NhbS9EZXNrdG9wL3JlcG9zL2Fmc2svY29tcG9uZW50LWRlbW9zL2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFNLEtBQUssR0FBSSxNQUFNLENBQUMsWUFBWSxJQUFJLE1BQU0sQ0FBQyxrQkFBa0IsQUFBQyxDQUFDO0FBQ2pFLElBQU0sT0FBTyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7QUFDNUIsSUFBSSxHQUFHLFlBQUEsQ0FBQzs7QUFFUixTQUFTLFFBQVEsR0FBRztBQUNsQixLQUFHLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixFQUFFLENBQUM7QUFDakMsS0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDakMsS0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO0NBQ2I7O0FBRUQsU0FBUyxTQUFTLEdBQUc7QUFDbkIsTUFBSSxDQUFDLEdBQUcsRUFBRTtBQUNSLFlBQVEsRUFBRSxDQUFDO0dBQ1o7O0FBRUQsS0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7Q0FDekY7O0FBRUQsU0FBUyxPQUFPLEdBQUc7QUFDakIsS0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDcEMsS0FBRyxHQUFHLElBQUksQ0FBQztDQUNaOztBQUVELE1BQU0sQ0FBQyxPQUFPLEdBQUc7QUFDZixTQUFPLEVBQUUsT0FBTztBQUNoQixXQUFTLEVBQUUsU0FBUztDQUNyQixDQUFDIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImNvbnN0IEF1ZGlvID0gKHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dCk7XG5jb25zdCBjb250ZXh0ID0gbmV3IEF1ZGlvKCk7XG5sZXQgb3NjO1xuXG5mdW5jdGlvbiBzdGFydE9zYygpIHtcbiAgb3NjID0gY29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKCk7XG4gIG9zYy5jb25uZWN0KGNvbnRleHQuZGVzdGluYXRpb24pO1xuICBvc2Muc3RhcnQoKTtcbn1cblxuZnVuY3Rpb24gdXBkYXRlT3NjKCkge1xuICBpZiAoIW9zYykge1xuICAgIHN0YXJ0T3NjKCk7XG4gIH1cblxuICBvc2MuZnJlcXVlbmN5LnZhbHVlID0gcGFyc2VJbnQoZG9jdW1lbnQucXVlcnlTZWxlY3RvcignaW5wdXRbdHlwZT1cInJhbmdlXCJdJykudmFsdWUsIDEwKTtcbn1cblxuZnVuY3Rpb24gc3RvcE9zYygpIHtcbiAgb3NjLmRpc2Nvbm5lY3QoY29udGV4dC5kZXN0aW5hdGlvbik7XG4gIG9zYyA9IG51bGw7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICBzdG9wT3NjOiBzdG9wT3NjLFxuICB1cGRhdGVPc2M6IHVwZGF0ZU9zY1xufTtcbiJdfQ==
