(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
module.exports.synth = function(context){



  var nodes={};
  nodes.source = context.createOscillator();
  nodes.source.type = 1;
  nodes.source.frequency.value = [100, 150, 200, 250, 50][Math.floor(Math.random() * 5)];

  nodes.filter = context.createBiquadFilter();
  nodes.filter.Q.value = 25;
  nodes.filter.frequency.value = 400;
  nodes.filter.type = 'lowshelf';//0; //0 is a low pass filter

  nodes.distortion = context.createWaveShaper();
  nodes.analyser = context.createAnalyser();
  nodes.distortion.curve = makeDistortionCurve(100);



  nodes.lowFilter = context.createBiquadFilter();
  nodes.lowFilter.Q.value = 25;
  nodes.lowFilter.type = 0;
  nodes.lowFilter.frequency.value = 300;

  nodes.volume = context.createGain();
  nodes.volume.gain.value = 0.3;

  nodes.source.connect(nodes.filter);
  nodes.filter.connect(nodes.analyser);
  nodes.analyser.connect(nodes.distortion);
  nodes.distortion.connect(nodes.lowFilter);
  nodes.lowFilter.connect(nodes.volume);

  return nodes;
}

function makeDistortionCurve(amount) {
  var k = typeof amount === 'number' ? amount : 50,
    n_samples = 44100,
    curve = new Float32Array(n_samples),
    deg = Math.PI / 180,
    i = 0,
    x;
  for ( ; i < n_samples; ++i ) {
    x = i * 2 / n_samples - 1;
    curve[i] = ( 3 + k ) * x * 20 * deg / ( Math.PI + k * Math.abs(x) );
  }
  return curve;
}

module.exports.distort = makeDistortionCurve
},{}],2:[function(require,module,exports){
var makeSynth = require('../').synth

// REPLACE THESE W REAL MODULES
var distort = require('../').distort
function mapRange(value, low1, high1, low2, high2) {
  return low2 + (high2 - low2) * (value - low1) / (high1 - low1);
}

var context = new (window.AudioContext || window.webkitAudioContext)()


var nodes = []
for(var i = 0; i < 3; i++){
  nodes.push(makeSynth(context))
  nodes[i].volume.connect(context.destination)
  nodes[i].source.start()
}


window.addEventListener("deviceorientation", handleOrientation, true);


var r = 0
var g = 0
var b = 0

function handleOrientation(event) {
  var absolute = event.absolute;

// alpha is the compass direction the device is facing in degrees
  // The DeviceOrientationEvent.alpha value represents the motion of the device around the z axis, represented in degrees with values ranging from 0 to 360.
  // The DeviceOrientationEvent.beta value represents the motion of the device around the x axis, represented in degrees with values ranging from -180 to 180.  This represents a front to back motion of the device.
  // The DeviceOrientationEvent.gamma value represents the motion of the device around the y axis, represented in degrees with values ranging from -90 to 90. This represents a left to right motion of the device.
  var alpha    = event.alpha;
  var beta     = event.beta;
  var gamma    = event.gamma;
  // console.log(alpha, beta, gamma)
  if(alpha) {
    r = mapRange(alpha, 0, 360, 0, 255)
    nodes[0].filter.frequency.value = mapRange(alpha, 0, 360, 200, 2500)
    nodes[0].lowFilter.frequency.value = mapRange(alpha, -180, 180, 300, 2000)
  }
  if(beta) {
    g = mapRange(beta, -180, 180, 0, 255)
    nodes[1].filter.frequency.value = mapRange(beta, -180, 180, 200, 2500)
    nodes[1].lowFilter.frequency.value = mapRange(beta, -180, 180, 300, 2000)
  }
  if(gamma) {
    b = mapRange(gamma, -90, 90, 0, 255)
    nodes[2].filter.frequency.value = mapRange(gamma, -90, 90 , 200, 2500)
    nodes[2].lowFilter.frequency.value = mapRange(gamma, -90, 90, 300, 2000)
  }
  // console.log("rgb("+r+","+g+","+b+")")
  document.body.style.backgroundColor = "rgb("+~~r+","+~~g+","+~~b+")"
}

window.addEventListener("devicemotion", handleMotion, true);

function handleMotion(eventData) {
//   // these are probs all between 0 and 1 anyways? probably?
//   // Grab the acceleration from the results
  var acceleration = eventData.acceleration;
  if(acceleration.x){
    nodes[0].source.detune.setValueAtTime(acceleration.x * 250, context.currentTime)
    nodes[0].source.detune.linearRampToValueAtTime(0, context.currentTime+0.1)
  }
  if(acceleration.y){
    nodes[1].source.detune.setValueAtTime(acceleration.y * 250, context.currentTime)
    nodes[1].source.detune.linearRampToValueAtTime(0, context.currentTime+0.1)
  }
  if(acceleration.z){
      nodes[2].source.detune.setValueAtTime(acceleration.z * 250, context.currentTime)
      nodes[2].source.detune.linearRampToValueAtTime(0, context.currentTime+0.1)
  }
//   nodes.filter.Q.value = acceleration.y * 100
//   nodes.lowFilter.Q.value = acceleration.z * 100


//   // Grab the rotation rate from the results
  var rotation = eventData.rotationRate
  if(rotation.alpha){
    nodes[0].filter.Q.setValueAtTime(rotation.alpha * 100, context.currentTime)
    nodes[0].lowFilter.Q.setValueAtTime(rotation.alpha  * 100, context.currentTime)
    nodes[0].filter.Q.linearRampToValueAtTime(0, context.currentTime + 0.1)
    nodes[0].lowFilter.Q.linearRampToValueAtTime(0, context.currentTime + 0.1)
  }
  if(rotation.beta){
    nodes[1].filter.Q.setValueAtTime(rotation.alpha * 100, context.currentTime)
    nodes[1].lowFilter.Q.setValueAtTime(rotation.alpha  * 100, context.currentTime)
    nodes[1].filter.Q.linearRampToValueAtTime(0, context.currentTime + 0.1)
    nodes[1].lowFilter.Q.linearRampToValueAtTime(0, context.currentTime + 0.1)

  }
  if(rotation.gamma){
    nodes[2].filter.Q.setValueAtTime(rotation.alpha * 100, context.currentTime)
    nodes[2].lowFilter.Q.setValueAtTime(rotation.alpha  * 100, context.currentTime)
    nodes[2].filter.Q.linearRampToValueAtTime(0, context.currentTime + 0.1)
    nodes[2].lowFilter.Q.linearRampToValueAtTime(0, context.currentTime + 0.1)

  }
//   nodes.distortion.curve = distort(rotation.alpha * 400)
//   nodes.filter.detune.value = rotation.beta * 500
//   nodes.lowFilter.detune.value = rotation.gamma * 500

}
},{"../":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsInd3dy9kZW1vLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJtb2R1bGUuZXhwb3J0cy5zeW50aCA9IGZ1bmN0aW9uKGNvbnRleHQpe1xuXG5cblxuICB2YXIgbm9kZXM9e307XG4gIG5vZGVzLnNvdXJjZSA9IGNvbnRleHQuY3JlYXRlT3NjaWxsYXRvcigpO1xuICBub2Rlcy5zb3VyY2UudHlwZSA9IDE7XG4gIG5vZGVzLnNvdXJjZS5mcmVxdWVuY3kudmFsdWUgPSBbMTAwLCAxNTAsIDIwMCwgMjUwLCA1MF1bTWF0aC5mbG9vcihNYXRoLnJhbmRvbSgpICogNSldO1xuXG4gIG5vZGVzLmZpbHRlciA9IGNvbnRleHQuY3JlYXRlQmlxdWFkRmlsdGVyKCk7XG4gIG5vZGVzLmZpbHRlci5RLnZhbHVlID0gMjU7XG4gIG5vZGVzLmZpbHRlci5mcmVxdWVuY3kudmFsdWUgPSA0MDA7XG4gIG5vZGVzLmZpbHRlci50eXBlID0gJ2xvd3NoZWxmJzsvLzA7IC8vMCBpcyBhIGxvdyBwYXNzIGZpbHRlclxuXG4gIG5vZGVzLmRpc3RvcnRpb24gPSBjb250ZXh0LmNyZWF0ZVdhdmVTaGFwZXIoKTtcbiAgbm9kZXMuYW5hbHlzZXIgPSBjb250ZXh0LmNyZWF0ZUFuYWx5c2VyKCk7XG4gIG5vZGVzLmRpc3RvcnRpb24uY3VydmUgPSBtYWtlRGlzdG9ydGlvbkN1cnZlKDEwMCk7XG5cblxuXG4gIG5vZGVzLmxvd0ZpbHRlciA9IGNvbnRleHQuY3JlYXRlQmlxdWFkRmlsdGVyKCk7XG4gIG5vZGVzLmxvd0ZpbHRlci5RLnZhbHVlID0gMjU7XG4gIG5vZGVzLmxvd0ZpbHRlci50eXBlID0gMDtcbiAgbm9kZXMubG93RmlsdGVyLmZyZXF1ZW5jeS52YWx1ZSA9IDMwMDtcblxuICBub2Rlcy52b2x1bWUgPSBjb250ZXh0LmNyZWF0ZUdhaW4oKTtcbiAgbm9kZXMudm9sdW1lLmdhaW4udmFsdWUgPSAwLjM7XG5cbiAgbm9kZXMuc291cmNlLmNvbm5lY3Qobm9kZXMuZmlsdGVyKTtcbiAgbm9kZXMuZmlsdGVyLmNvbm5lY3Qobm9kZXMuYW5hbHlzZXIpO1xuICBub2Rlcy5hbmFseXNlci5jb25uZWN0KG5vZGVzLmRpc3RvcnRpb24pO1xuICBub2Rlcy5kaXN0b3J0aW9uLmNvbm5lY3Qobm9kZXMubG93RmlsdGVyKTtcbiAgbm9kZXMubG93RmlsdGVyLmNvbm5lY3Qobm9kZXMudm9sdW1lKTtcblxuICByZXR1cm4gbm9kZXM7XG59XG5cbmZ1bmN0aW9uIG1ha2VEaXN0b3J0aW9uQ3VydmUoYW1vdW50KSB7XG4gIHZhciBrID0gdHlwZW9mIGFtb3VudCA9PT0gJ251bWJlcicgPyBhbW91bnQgOiA1MCxcbiAgICBuX3NhbXBsZXMgPSA0NDEwMCxcbiAgICBjdXJ2ZSA9IG5ldyBGbG9hdDMyQXJyYXkobl9zYW1wbGVzKSxcbiAgICBkZWcgPSBNYXRoLlBJIC8gMTgwLFxuICAgIGkgPSAwLFxuICAgIHg7XG4gIGZvciAoIDsgaSA8IG5fc2FtcGxlczsgKytpICkge1xuICAgIHggPSBpICogMiAvIG5fc2FtcGxlcyAtIDE7XG4gICAgY3VydmVbaV0gPSAoIDMgKyBrICkgKiB4ICogMjAgKiBkZWcgLyAoIE1hdGguUEkgKyBrICogTWF0aC5hYnMoeCkgKTtcbiAgfVxuICByZXR1cm4gY3VydmU7XG59XG5cbm1vZHVsZS5leHBvcnRzLmRpc3RvcnQgPSBtYWtlRGlzdG9ydGlvbkN1cnZlIiwidmFyIG1ha2VTeW50aCA9IHJlcXVpcmUoJy4uLycpLnN5bnRoXG5cbi8vIFJFUExBQ0UgVEhFU0UgVyBSRUFMIE1PRFVMRVNcbnZhciBkaXN0b3J0ID0gcmVxdWlyZSgnLi4vJykuZGlzdG9ydFxuZnVuY3Rpb24gbWFwUmFuZ2UodmFsdWUsIGxvdzEsIGhpZ2gxLCBsb3cyLCBoaWdoMikge1xuICByZXR1cm4gbG93MiArIChoaWdoMiAtIGxvdzIpICogKHZhbHVlIC0gbG93MSkgLyAoaGlnaDEgLSBsb3cxKTtcbn1cblxudmFyIGNvbnRleHQgPSBuZXcgKHdpbmRvdy5BdWRpb0NvbnRleHQgfHwgd2luZG93LndlYmtpdEF1ZGlvQ29udGV4dCkoKVxuXG5cbnZhciBub2RlcyA9IFtdXG5mb3IodmFyIGkgPSAwOyBpIDwgMzsgaSsrKXtcbiAgbm9kZXMucHVzaChtYWtlU3ludGgoY29udGV4dCkpXG4gIG5vZGVzW2ldLnZvbHVtZS5jb25uZWN0KGNvbnRleHQuZGVzdGluYXRpb24pXG4gIG5vZGVzW2ldLnNvdXJjZS5zdGFydCgpXG59XG5cblxud2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJkZXZpY2VvcmllbnRhdGlvblwiLCBoYW5kbGVPcmllbnRhdGlvbiwgdHJ1ZSk7XG5cblxudmFyIHIgPSAwXG52YXIgZyA9IDBcbnZhciBiID0gMFxuXG5mdW5jdGlvbiBoYW5kbGVPcmllbnRhdGlvbihldmVudCkge1xuICB2YXIgYWJzb2x1dGUgPSBldmVudC5hYnNvbHV0ZTtcblxuLy8gYWxwaGEgaXMgdGhlIGNvbXBhc3MgZGlyZWN0aW9uIHRoZSBkZXZpY2UgaXMgZmFjaW5nIGluIGRlZ3JlZXNcbiAgLy8gVGhlIERldmljZU9yaWVudGF0aW9uRXZlbnQuYWxwaGEgdmFsdWUgcmVwcmVzZW50cyB0aGUgbW90aW9uIG9mIHRoZSBkZXZpY2UgYXJvdW5kIHRoZSB6IGF4aXMsIHJlcHJlc2VudGVkIGluIGRlZ3JlZXMgd2l0aCB2YWx1ZXMgcmFuZ2luZyBmcm9tIDAgdG8gMzYwLlxuICAvLyBUaGUgRGV2aWNlT3JpZW50YXRpb25FdmVudC5iZXRhIHZhbHVlIHJlcHJlc2VudHMgdGhlIG1vdGlvbiBvZiB0aGUgZGV2aWNlIGFyb3VuZCB0aGUgeCBheGlzLCByZXByZXNlbnRlZCBpbiBkZWdyZWVzIHdpdGggdmFsdWVzIHJhbmdpbmcgZnJvbSAtMTgwIHRvIDE4MC4gIFRoaXMgcmVwcmVzZW50cyBhIGZyb250IHRvIGJhY2sgbW90aW9uIG9mIHRoZSBkZXZpY2UuXG4gIC8vIFRoZSBEZXZpY2VPcmllbnRhdGlvbkV2ZW50LmdhbW1hIHZhbHVlIHJlcHJlc2VudHMgdGhlIG1vdGlvbiBvZiB0aGUgZGV2aWNlIGFyb3VuZCB0aGUgeSBheGlzLCByZXByZXNlbnRlZCBpbiBkZWdyZWVzIHdpdGggdmFsdWVzIHJhbmdpbmcgZnJvbSAtOTAgdG8gOTAuIFRoaXMgcmVwcmVzZW50cyBhIGxlZnQgdG8gcmlnaHQgbW90aW9uIG9mIHRoZSBkZXZpY2UuXG4gIHZhciBhbHBoYSAgICA9IGV2ZW50LmFscGhhO1xuICB2YXIgYmV0YSAgICAgPSBldmVudC5iZXRhO1xuICB2YXIgZ2FtbWEgICAgPSBldmVudC5nYW1tYTtcbiAgLy8gY29uc29sZS5sb2coYWxwaGEsIGJldGEsIGdhbW1hKVxuICBpZihhbHBoYSkge1xuICAgIHIgPSBtYXBSYW5nZShhbHBoYSwgMCwgMzYwLCAwLCAyNTUpXG4gICAgbm9kZXNbMF0uZmlsdGVyLmZyZXF1ZW5jeS52YWx1ZSA9IG1hcFJhbmdlKGFscGhhLCAwLCAzNjAsIDIwMCwgMjUwMClcbiAgICBub2Rlc1swXS5sb3dGaWx0ZXIuZnJlcXVlbmN5LnZhbHVlID0gbWFwUmFuZ2UoYWxwaGEsIC0xODAsIDE4MCwgMzAwLCAyMDAwKVxuICB9XG4gIGlmKGJldGEpIHtcbiAgICBnID0gbWFwUmFuZ2UoYmV0YSwgLTE4MCwgMTgwLCAwLCAyNTUpXG4gICAgbm9kZXNbMV0uZmlsdGVyLmZyZXF1ZW5jeS52YWx1ZSA9IG1hcFJhbmdlKGJldGEsIC0xODAsIDE4MCwgMjAwLCAyNTAwKVxuICAgIG5vZGVzWzFdLmxvd0ZpbHRlci5mcmVxdWVuY3kudmFsdWUgPSBtYXBSYW5nZShiZXRhLCAtMTgwLCAxODAsIDMwMCwgMjAwMClcbiAgfVxuICBpZihnYW1tYSkge1xuICAgIGIgPSBtYXBSYW5nZShnYW1tYSwgLTkwLCA5MCwgMCwgMjU1KVxuICAgIG5vZGVzWzJdLmZpbHRlci5mcmVxdWVuY3kudmFsdWUgPSBtYXBSYW5nZShnYW1tYSwgLTkwLCA5MCAsIDIwMCwgMjUwMClcbiAgICBub2Rlc1syXS5sb3dGaWx0ZXIuZnJlcXVlbmN5LnZhbHVlID0gbWFwUmFuZ2UoZ2FtbWEsIC05MCwgOTAsIDMwMCwgMjAwMClcbiAgfVxuICAvLyBjb25zb2xlLmxvZyhcInJnYihcIityK1wiLFwiK2crXCIsXCIrYitcIilcIilcbiAgZG9jdW1lbnQuYm9keS5zdHlsZS5iYWNrZ3JvdW5kQ29sb3IgPSBcInJnYihcIit+fnIrXCIsXCIrfn5nK1wiLFwiK35+YitcIilcIlxufVxuXG53aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImRldmljZW1vdGlvblwiLCBoYW5kbGVNb3Rpb24sIHRydWUpO1xuXG5mdW5jdGlvbiBoYW5kbGVNb3Rpb24oZXZlbnREYXRhKSB7XG4vLyAgIC8vIHRoZXNlIGFyZSBwcm9icyBhbGwgYmV0d2VlbiAwIGFuZCAxIGFueXdheXM/IHByb2JhYmx5P1xuLy8gICAvLyBHcmFiIHRoZSBhY2NlbGVyYXRpb24gZnJvbSB0aGUgcmVzdWx0c1xuICB2YXIgYWNjZWxlcmF0aW9uID0gZXZlbnREYXRhLmFjY2VsZXJhdGlvbjtcbiAgaWYoYWNjZWxlcmF0aW9uLngpe1xuICAgIG5vZGVzWzBdLnNvdXJjZS5kZXR1bmUuc2V0VmFsdWVBdFRpbWUoYWNjZWxlcmF0aW9uLnggKiAyNTAsIGNvbnRleHQuY3VycmVudFRpbWUpXG4gICAgbm9kZXNbMF0uc291cmNlLmRldHVuZS5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgwLCBjb250ZXh0LmN1cnJlbnRUaW1lKzAuMSlcbiAgfVxuICBpZihhY2NlbGVyYXRpb24ueSl7XG4gICAgbm9kZXNbMV0uc291cmNlLmRldHVuZS5zZXRWYWx1ZUF0VGltZShhY2NlbGVyYXRpb24ueSAqIDI1MCwgY29udGV4dC5jdXJyZW50VGltZSlcbiAgICBub2Rlc1sxXS5zb3VyY2UuZGV0dW5lLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDAsIGNvbnRleHQuY3VycmVudFRpbWUrMC4xKVxuICB9XG4gIGlmKGFjY2VsZXJhdGlvbi56KXtcbiAgICAgIG5vZGVzWzJdLnNvdXJjZS5kZXR1bmUuc2V0VmFsdWVBdFRpbWUoYWNjZWxlcmF0aW9uLnogKiAyNTAsIGNvbnRleHQuY3VycmVudFRpbWUpXG4gICAgICBub2Rlc1syXS5zb3VyY2UuZGV0dW5lLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDAsIGNvbnRleHQuY3VycmVudFRpbWUrMC4xKVxuICB9XG4vLyAgIG5vZGVzLmZpbHRlci5RLnZhbHVlID0gYWNjZWxlcmF0aW9uLnkgKiAxMDBcbi8vICAgbm9kZXMubG93RmlsdGVyLlEudmFsdWUgPSBhY2NlbGVyYXRpb24ueiAqIDEwMFxuXG5cbi8vICAgLy8gR3JhYiB0aGUgcm90YXRpb24gcmF0ZSBmcm9tIHRoZSByZXN1bHRzXG4gIHZhciByb3RhdGlvbiA9IGV2ZW50RGF0YS5yb3RhdGlvblJhdGVcbiAgaWYocm90YXRpb24uYWxwaGEpe1xuICAgIG5vZGVzWzBdLmZpbHRlci5RLnNldFZhbHVlQXRUaW1lKHJvdGF0aW9uLmFscGhhICogMTAwLCBjb250ZXh0LmN1cnJlbnRUaW1lKVxuICAgIG5vZGVzWzBdLmxvd0ZpbHRlci5RLnNldFZhbHVlQXRUaW1lKHJvdGF0aW9uLmFscGhhICAqIDEwMCwgY29udGV4dC5jdXJyZW50VGltZSlcbiAgICBub2Rlc1swXS5maWx0ZXIuUS5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgwLCBjb250ZXh0LmN1cnJlbnRUaW1lICsgMC4xKVxuICAgIG5vZGVzWzBdLmxvd0ZpbHRlci5RLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDAsIGNvbnRleHQuY3VycmVudFRpbWUgKyAwLjEpXG4gIH1cbiAgaWYocm90YXRpb24uYmV0YSl7XG4gICAgbm9kZXNbMV0uZmlsdGVyLlEuc2V0VmFsdWVBdFRpbWUocm90YXRpb24uYWxwaGEgKiAxMDAsIGNvbnRleHQuY3VycmVudFRpbWUpXG4gICAgbm9kZXNbMV0ubG93RmlsdGVyLlEuc2V0VmFsdWVBdFRpbWUocm90YXRpb24uYWxwaGEgICogMTAwLCBjb250ZXh0LmN1cnJlbnRUaW1lKVxuICAgIG5vZGVzWzFdLmZpbHRlci5RLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDAsIGNvbnRleHQuY3VycmVudFRpbWUgKyAwLjEpXG4gICAgbm9kZXNbMV0ubG93RmlsdGVyLlEubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMCwgY29udGV4dC5jdXJyZW50VGltZSArIDAuMSlcblxuICB9XG4gIGlmKHJvdGF0aW9uLmdhbW1hKXtcbiAgICBub2Rlc1syXS5maWx0ZXIuUS5zZXRWYWx1ZUF0VGltZShyb3RhdGlvbi5hbHBoYSAqIDEwMCwgY29udGV4dC5jdXJyZW50VGltZSlcbiAgICBub2Rlc1syXS5sb3dGaWx0ZXIuUS5zZXRWYWx1ZUF0VGltZShyb3RhdGlvbi5hbHBoYSAgKiAxMDAsIGNvbnRleHQuY3VycmVudFRpbWUpXG4gICAgbm9kZXNbMl0uZmlsdGVyLlEubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMCwgY29udGV4dC5jdXJyZW50VGltZSArIDAuMSlcbiAgICBub2Rlc1syXS5sb3dGaWx0ZXIuUS5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgwLCBjb250ZXh0LmN1cnJlbnRUaW1lICsgMC4xKVxuXG4gIH1cbi8vICAgbm9kZXMuZGlzdG9ydGlvbi5jdXJ2ZSA9IGRpc3RvcnQocm90YXRpb24uYWxwaGEgKiA0MDApXG4vLyAgIG5vZGVzLmZpbHRlci5kZXR1bmUudmFsdWUgPSByb3RhdGlvbi5iZXRhICogNTAwXG4vLyAgIG5vZGVzLmxvd0ZpbHRlci5kZXR1bmUudmFsdWUgPSByb3RhdGlvbi5nYW1tYSAqIDUwMFxuXG59Il19
