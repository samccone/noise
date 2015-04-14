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

function encodeString(string, outputContainer) {
  outputContainer.innerHTML = require('string-to-binary')(string);
}

module.exports = {
  stopOsc: stopOsc,
  onStringChange: encodeString,
  updateOsc: updateOsc
};

},{"string-to-binary":2}],2:[function(require,module,exports){
module.exports = function(str) {
  var pad = "00000000";

  return str.split('').map(function(str) {
    var binary = str.charCodeAt(0).toString(2);

    return pad.slice(binary.length)+binary;
  }).join('');
}

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiL1VzZXJzL3NhbS9EZXNrdG9wL3JlcG9zL25vaXNlL2NvbXBvbmVudC1kZW1vcy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9zdHJpbmctdG8tYmluYXJ5L2luZGV4LmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7QUNBQSxJQUFNLEtBQUssR0FBSSxNQUFNLENBQUMsWUFBWSxJQUFJLE1BQU0sQ0FBQyxrQkFBa0IsQUFBQyxDQUFDO0FBQ2pFLElBQU0sT0FBTyxHQUFHLElBQUksS0FBSyxFQUFFLENBQUM7QUFDNUIsSUFBSSxHQUFHLFlBQUEsQ0FBQzs7QUFFUixTQUFTLFFBQVEsR0FBRztBQUNsQixLQUFHLEdBQUcsT0FBTyxDQUFDLGdCQUFnQixFQUFFLENBQUM7QUFDakMsS0FBRyxDQUFDLE9BQU8sQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDakMsS0FBRyxDQUFDLEtBQUssRUFBRSxDQUFDO0NBQ2I7O0FBRUQsU0FBUyxTQUFTLEdBQUc7QUFDbkIsTUFBSSxDQUFDLEdBQUcsRUFBRTtBQUNSLFlBQVEsRUFBRSxDQUFDO0dBQ1o7O0FBRUQsS0FBRyxDQUFDLFNBQVMsQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDLFFBQVEsQ0FBQyxhQUFhLENBQUMscUJBQXFCLENBQUMsQ0FBQyxLQUFLLEVBQUUsRUFBRSxDQUFDLENBQUM7Q0FDekY7O0FBRUQsU0FBUyxPQUFPLEdBQUc7QUFDakIsS0FBRyxDQUFDLFVBQVUsQ0FBQyxPQUFPLENBQUMsV0FBVyxDQUFDLENBQUM7QUFDcEMsS0FBRyxHQUFHLElBQUksQ0FBQztDQUNaOztBQUVELFNBQVMsWUFBWSxDQUFDLE1BQU0sRUFBRSxlQUFlLEVBQUU7QUFDN0MsaUJBQWUsQ0FBQyxTQUFTLEdBQUcsT0FBTyxDQUFDLGtCQUFrQixDQUFDLENBQUMsTUFBTSxDQUFDLENBQUM7Q0FDakU7O0FBRUQsTUFBTSxDQUFDLE9BQU8sR0FBRztBQUNmLFNBQU8sRUFBRSxPQUFPO0FBQ2hCLGdCQUFjLEVBQUUsWUFBWTtBQUM1QixXQUFTLEVBQUUsU0FBUztDQUNyQixDQUFDOzs7QUMvQkY7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiY29uc3QgQXVkaW8gPSAod2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0KTtcbmNvbnN0IGNvbnRleHQgPSBuZXcgQXVkaW8oKTtcbmxldCBvc2M7XG5cbmZ1bmN0aW9uIHN0YXJ0T3NjKCkge1xuICBvc2MgPSBjb250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcbiAgb3NjLmNvbm5lY3QoY29udGV4dC5kZXN0aW5hdGlvbik7XG4gIG9zYy5zdGFydCgpO1xufVxuXG5mdW5jdGlvbiB1cGRhdGVPc2MoKSB7XG4gIGlmICghb3NjKSB7XG4gICAgc3RhcnRPc2MoKTtcbiAgfVxuXG4gIG9zYy5mcmVxdWVuY3kudmFsdWUgPSBwYXJzZUludChkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCdpbnB1dFt0eXBlPVwicmFuZ2VcIl0nKS52YWx1ZSwgMTApO1xufVxuXG5mdW5jdGlvbiBzdG9wT3NjKCkge1xuICBvc2MuZGlzY29ubmVjdChjb250ZXh0LmRlc3RpbmF0aW9uKTtcbiAgb3NjID0gbnVsbDtcbn1cblxuZnVuY3Rpb24gZW5jb2RlU3RyaW5nKHN0cmluZywgb3V0cHV0Q29udGFpbmVyKSB7XG4gIG91dHB1dENvbnRhaW5lci5pbm5lckhUTUwgPSByZXF1aXJlKCdzdHJpbmctdG8tYmluYXJ5Jykoc3RyaW5nKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gIHN0b3BPc2M6IHN0b3BPc2MsXG4gIG9uU3RyaW5nQ2hhbmdlOiBlbmNvZGVTdHJpbmcsXG4gIHVwZGF0ZU9zYzogdXBkYXRlT3NjXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihzdHIpIHtcbiAgdmFyIHBhZCA9IFwiMDAwMDAwMDBcIjtcblxuICByZXR1cm4gc3RyLnNwbGl0KCcnKS5tYXAoZnVuY3Rpb24oc3RyKSB7XG4gICAgdmFyIGJpbmFyeSA9IHN0ci5jaGFyQ29kZUF0KDApLnRvU3RyaW5nKDIpO1xuXG4gICAgcmV0dXJuIHBhZC5zbGljZShiaW5hcnkubGVuZ3RoKStiaW5hcnk7XG4gIH0pLmpvaW4oJycpO1xufVxuIl19
