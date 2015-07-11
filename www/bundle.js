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

function handleOrientation(event) {
  var absolute = event.absolute;

// alpha is the compass direction the device is facing in degrees
  // The DeviceOrientationEvent.alpha value represents the motion of the device around the z axis, represented in degrees with values ranging from 0 to 360.
  // The DeviceOrientationEvent.beta value represents the motion of the device around the x axis, represented in degrees with values ranging from -180 to 180.  This represents a front to back motion of the device.
  // The DeviceOrientationEvent.gamma value represents the motion of the device around the y axis, represented in degrees with values ranging from -90 to 90. This represents a left to right motion of the device.
  var alpha    = event.alpha;
  var beta     = event.beta;
  var gamma    = event.gamma;
  console.log(alpha, beta, gamma)
  if(alpha) {
    nodes[0].filter.frequency.value = mapRange(alpha, 0, 360, 200, 2500)
    nodes[0].lowFilter.frequency.value = mapRange(alpha, -180, 180, 300, 2000)
  }
  if(beta) {
    nodes[1].filter.frequency.value = mapRange(beta, 0, 360, 200, 2500)
    nodes[1].lowFilter.frequency.value = mapRange(beta, -180, 180, 300, 2000)
  }
  if(gamma) {
    nodes[2].filter.frequency.value = mapRange(gamma, 0, 360, 200, 2500)
    nodes[2].lowFilter.frequency.value = mapRange(gamma, -180, 180, 300, 2000)

  }
}

// window.addEventListener("devicemotion", handleMotion, true);

// function handleMotion(eventData) {
//   // these are probs all between 0 and 1 anyways?
//   // Grab the acceleration from the results
//   var acceleration = eventData.acceleration;
//   nodes.source.detune.value = acceleration.x * 250
//   nodes.filter.Q.value = acceleration.y * 100
//   nodes.lowFilter.Q.value = acceleration.z * 100


//   // Grab the rotation rate from the results
//   var rotation = eventData.rotationRate
//   nodes.distortion.curve = distort(rotation.alpha * 400)
//   nodes.filter.detune.value = rotation.beta * 500
//   nodes.lowFilter.detune.value = rotation.gamma * 500

// }
},{"../":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsInd3dy9kZW1vLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMuc3ludGggPSBmdW5jdGlvbihjb250ZXh0KXtcblxuXG5cbiAgdmFyIG5vZGVzPXt9O1xuICBub2Rlcy5zb3VyY2UgPSBjb250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcbiAgbm9kZXMuc291cmNlLnR5cGUgPSAxO1xuICBub2Rlcy5zb3VyY2UuZnJlcXVlbmN5LnZhbHVlID0gWzEwMCwgMTUwLCAyMDAsIDI1MCwgNTBdW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUpXTtcblxuICBub2Rlcy5maWx0ZXIgPSBjb250ZXh0LmNyZWF0ZUJpcXVhZEZpbHRlcigpO1xuICBub2Rlcy5maWx0ZXIuUS52YWx1ZSA9IDI1O1xuICBub2Rlcy5maWx0ZXIuZnJlcXVlbmN5LnZhbHVlID0gNDAwO1xuICBub2Rlcy5maWx0ZXIudHlwZSA9ICdsb3dzaGVsZic7Ly8wOyAvLzAgaXMgYSBsb3cgcGFzcyBmaWx0ZXJcblxuICBub2Rlcy5kaXN0b3J0aW9uID0gY29udGV4dC5jcmVhdGVXYXZlU2hhcGVyKCk7XG4gIG5vZGVzLmFuYWx5c2VyID0gY29udGV4dC5jcmVhdGVBbmFseXNlcigpO1xuICBub2Rlcy5kaXN0b3J0aW9uLmN1cnZlID0gbWFrZURpc3RvcnRpb25DdXJ2ZSgxMDApO1xuXG5cblxuICBub2Rlcy5sb3dGaWx0ZXIgPSBjb250ZXh0LmNyZWF0ZUJpcXVhZEZpbHRlcigpO1xuICBub2Rlcy5sb3dGaWx0ZXIuUS52YWx1ZSA9IDI1O1xuICBub2Rlcy5sb3dGaWx0ZXIudHlwZSA9IDA7XG4gIG5vZGVzLmxvd0ZpbHRlci5mcmVxdWVuY3kudmFsdWUgPSAzMDA7XG5cbiAgbm9kZXMudm9sdW1lID0gY29udGV4dC5jcmVhdGVHYWluKCk7XG4gIG5vZGVzLnZvbHVtZS5nYWluLnZhbHVlID0gMC4zO1xuXG4gIG5vZGVzLnNvdXJjZS5jb25uZWN0KG5vZGVzLmZpbHRlcik7XG4gIG5vZGVzLmZpbHRlci5jb25uZWN0KG5vZGVzLmFuYWx5c2VyKTtcbiAgbm9kZXMuYW5hbHlzZXIuY29ubmVjdChub2Rlcy5kaXN0b3J0aW9uKTtcbiAgbm9kZXMuZGlzdG9ydGlvbi5jb25uZWN0KG5vZGVzLmxvd0ZpbHRlcik7XG4gIG5vZGVzLmxvd0ZpbHRlci5jb25uZWN0KG5vZGVzLnZvbHVtZSk7XG5cbiAgcmV0dXJuIG5vZGVzO1xufVxuXG5mdW5jdGlvbiBtYWtlRGlzdG9ydGlvbkN1cnZlKGFtb3VudCkge1xuICB2YXIgayA9IHR5cGVvZiBhbW91bnQgPT09ICdudW1iZXInID8gYW1vdW50IDogNTAsXG4gICAgbl9zYW1wbGVzID0gNDQxMDAsXG4gICAgY3VydmUgPSBuZXcgRmxvYXQzMkFycmF5KG5fc2FtcGxlcyksXG4gICAgZGVnID0gTWF0aC5QSSAvIDE4MCxcbiAgICBpID0gMCxcbiAgICB4O1xuICBmb3IgKCA7IGkgPCBuX3NhbXBsZXM7ICsraSApIHtcbiAgICB4ID0gaSAqIDIgLyBuX3NhbXBsZXMgLSAxO1xuICAgIGN1cnZlW2ldID0gKCAzICsgayApICogeCAqIDIwICogZGVnIC8gKCBNYXRoLlBJICsgayAqIE1hdGguYWJzKHgpICk7XG4gIH1cbiAgcmV0dXJuIGN1cnZlO1xufVxuXG5tb2R1bGUuZXhwb3J0cy5kaXN0b3J0ID0gbWFrZURpc3RvcnRpb25DdXJ2ZSIsInZhciBtYWtlU3ludGggPSByZXF1aXJlKCcuLi8nKS5zeW50aFxuXG4vLyBSRVBMQUNFIFRIRVNFIFcgUkVBTCBNT0RVTEVTXG52YXIgZGlzdG9ydCA9IHJlcXVpcmUoJy4uLycpLmRpc3RvcnRcbmZ1bmN0aW9uIG1hcFJhbmdlKHZhbHVlLCBsb3cxLCBoaWdoMSwgbG93MiwgaGlnaDIpIHtcbiAgcmV0dXJuIGxvdzIgKyAoaGlnaDIgLSBsb3cyKSAqICh2YWx1ZSAtIGxvdzEpIC8gKGhpZ2gxIC0gbG93MSk7XG59XG5cbnZhciBjb250ZXh0ID0gbmV3ICh3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQpKClcblxuXG52YXIgbm9kZXMgPSBbXVxuZm9yKHZhciBpID0gMDsgaSA8IDM7IGkrKyl7XG4gIG5vZGVzLnB1c2gobWFrZVN5bnRoKGNvbnRleHQpKVxuICBub2Rlc1tpXS52b2x1bWUuY29ubmVjdChjb250ZXh0LmRlc3RpbmF0aW9uKVxuICBub2Rlc1tpXS5zb3VyY2Uuc3RhcnQoKVxufVxuXG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZGV2aWNlb3JpZW50YXRpb25cIiwgaGFuZGxlT3JpZW50YXRpb24sIHRydWUpO1xuXG5mdW5jdGlvbiBoYW5kbGVPcmllbnRhdGlvbihldmVudCkge1xuICB2YXIgYWJzb2x1dGUgPSBldmVudC5hYnNvbHV0ZTtcblxuLy8gYWxwaGEgaXMgdGhlIGNvbXBhc3MgZGlyZWN0aW9uIHRoZSBkZXZpY2UgaXMgZmFjaW5nIGluIGRlZ3JlZXNcbiAgLy8gVGhlIERldmljZU9yaWVudGF0aW9uRXZlbnQuYWxwaGEgdmFsdWUgcmVwcmVzZW50cyB0aGUgbW90aW9uIG9mIHRoZSBkZXZpY2UgYXJvdW5kIHRoZSB6IGF4aXMsIHJlcHJlc2VudGVkIGluIGRlZ3JlZXMgd2l0aCB2YWx1ZXMgcmFuZ2luZyBmcm9tIDAgdG8gMzYwLlxuICAvLyBUaGUgRGV2aWNlT3JpZW50YXRpb25FdmVudC5iZXRhIHZhbHVlIHJlcHJlc2VudHMgdGhlIG1vdGlvbiBvZiB0aGUgZGV2aWNlIGFyb3VuZCB0aGUgeCBheGlzLCByZXByZXNlbnRlZCBpbiBkZWdyZWVzIHdpdGggdmFsdWVzIHJhbmdpbmcgZnJvbSAtMTgwIHRvIDE4MC4gIFRoaXMgcmVwcmVzZW50cyBhIGZyb250IHRvIGJhY2sgbW90aW9uIG9mIHRoZSBkZXZpY2UuXG4gIC8vIFRoZSBEZXZpY2VPcmllbnRhdGlvbkV2ZW50LmdhbW1hIHZhbHVlIHJlcHJlc2VudHMgdGhlIG1vdGlvbiBvZiB0aGUgZGV2aWNlIGFyb3VuZCB0aGUgeSBheGlzLCByZXByZXNlbnRlZCBpbiBkZWdyZWVzIHdpdGggdmFsdWVzIHJhbmdpbmcgZnJvbSAtOTAgdG8gOTAuIFRoaXMgcmVwcmVzZW50cyBhIGxlZnQgdG8gcmlnaHQgbW90aW9uIG9mIHRoZSBkZXZpY2UuXG4gIHZhciBhbHBoYSAgICA9IGV2ZW50LmFscGhhO1xuICB2YXIgYmV0YSAgICAgPSBldmVudC5iZXRhO1xuICB2YXIgZ2FtbWEgICAgPSBldmVudC5nYW1tYTtcbiAgY29uc29sZS5sb2coYWxwaGEsIGJldGEsIGdhbW1hKVxuICBpZihhbHBoYSkge1xuICAgIG5vZGVzWzBdLmZpbHRlci5mcmVxdWVuY3kudmFsdWUgPSBtYXBSYW5nZShhbHBoYSwgMCwgMzYwLCAyMDAsIDI1MDApXG4gICAgbm9kZXNbMF0ubG93RmlsdGVyLmZyZXF1ZW5jeS52YWx1ZSA9IG1hcFJhbmdlKGFscGhhLCAtMTgwLCAxODAsIDMwMCwgMjAwMClcbiAgfVxuICBpZihiZXRhKSB7XG4gICAgbm9kZXNbMV0uZmlsdGVyLmZyZXF1ZW5jeS52YWx1ZSA9IG1hcFJhbmdlKGJldGEsIDAsIDM2MCwgMjAwLCAyNTAwKVxuICAgIG5vZGVzWzFdLmxvd0ZpbHRlci5mcmVxdWVuY3kudmFsdWUgPSBtYXBSYW5nZShiZXRhLCAtMTgwLCAxODAsIDMwMCwgMjAwMClcbiAgfVxuICBpZihnYW1tYSkge1xuICAgIG5vZGVzWzJdLmZpbHRlci5mcmVxdWVuY3kudmFsdWUgPSBtYXBSYW5nZShnYW1tYSwgMCwgMzYwLCAyMDAsIDI1MDApXG4gICAgbm9kZXNbMl0ubG93RmlsdGVyLmZyZXF1ZW5jeS52YWx1ZSA9IG1hcFJhbmdlKGdhbW1hLCAtMTgwLCAxODAsIDMwMCwgMjAwMClcblxuICB9XG59XG5cbi8vIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZGV2aWNlbW90aW9uXCIsIGhhbmRsZU1vdGlvbiwgdHJ1ZSk7XG5cbi8vIGZ1bmN0aW9uIGhhbmRsZU1vdGlvbihldmVudERhdGEpIHtcbi8vICAgLy8gdGhlc2UgYXJlIHByb2JzIGFsbCBiZXR3ZWVuIDAgYW5kIDEgYW55d2F5cz9cbi8vICAgLy8gR3JhYiB0aGUgYWNjZWxlcmF0aW9uIGZyb20gdGhlIHJlc3VsdHNcbi8vICAgdmFyIGFjY2VsZXJhdGlvbiA9IGV2ZW50RGF0YS5hY2NlbGVyYXRpb247XG4vLyAgIG5vZGVzLnNvdXJjZS5kZXR1bmUudmFsdWUgPSBhY2NlbGVyYXRpb24ueCAqIDI1MFxuLy8gICBub2Rlcy5maWx0ZXIuUS52YWx1ZSA9IGFjY2VsZXJhdGlvbi55ICogMTAwXG4vLyAgIG5vZGVzLmxvd0ZpbHRlci5RLnZhbHVlID0gYWNjZWxlcmF0aW9uLnogKiAxMDBcblxuXG4vLyAgIC8vIEdyYWIgdGhlIHJvdGF0aW9uIHJhdGUgZnJvbSB0aGUgcmVzdWx0c1xuLy8gICB2YXIgcm90YXRpb24gPSBldmVudERhdGEucm90YXRpb25SYXRlXG4vLyAgIG5vZGVzLmRpc3RvcnRpb24uY3VydmUgPSBkaXN0b3J0KHJvdGF0aW9uLmFscGhhICogNDAwKVxuLy8gICBub2Rlcy5maWx0ZXIuZGV0dW5lLnZhbHVlID0gcm90YXRpb24uYmV0YSAqIDUwMFxuLy8gICBub2Rlcy5sb3dGaWx0ZXIuZGV0dW5lLnZhbHVlID0gcm90YXRpb24uZ2FtbWEgKiA1MDBcblxuLy8gfSJdfQ==
