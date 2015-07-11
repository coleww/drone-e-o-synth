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

// oh my glob this sounds awful

// window.addEventListener("devicemotion", handleMotion, true);

// function handleMotion(eventData) {
// //   // these are probs all between 0 and 1 anyways? probably?
// //   // Grab the acceleration from the results
//   var acceleration = eventData.acceleration;
//   if(acceleration.x){
//     nodes[0].source.detune.setValueAtTime(acceleration.x * 250, context.currentTime)
//     nodes[0].source.detune.linearRampToValueAtTime(0, context.currentTime+0.1)
//   }
//   if(acceleration.y){
//     nodes[1].source.detune.setValueAtTime(acceleration.y * 250, context.currentTime)
//     nodes[1].source.detune.linearRampToValueAtTime(0, context.currentTime+0.1)
//   }
//   if(acceleration.z){
//       nodes[2].source.detune.setValueAtTime(acceleration.z * 250, context.currentTime)
//       nodes[2].source.detune.linearRampToValueAtTime(0, context.currentTime+0.1)
//   }
// //   nodes.filter.Q.value = acceleration.y * 100
// //   nodes.lowFilter.Q.value = acceleration.z * 100


// //   // Grab the rotation rate from the results
//   var rotation = eventData.rotationRate
//   if(rotation.alpha){
//     nodes[0].filter.Q.setValueAtTime(rotation.alpha * 100, context.currentTime)
//     nodes[0].lowFilter.Q.setValueAtTime(rotation.alpha  * 100, context.currentTime)
//     nodes[0].filter.Q.linearRampToValueAtTime(0, context.currentTime + 0.1)
//     nodes[0].lowFilter.Q.linearRampToValueAtTime(0, context.currentTime + 0.1)
//   }
//   if(rotation.beta){
//     nodes[1].filter.Q.setValueAtTime(rotation.alpha * 100, context.currentTime)
//     nodes[1].lowFilter.Q.setValueAtTime(rotation.alpha  * 100, context.currentTime)
//     nodes[1].filter.Q.linearRampToValueAtTime(0, context.currentTime + 0.1)
//     nodes[1].lowFilter.Q.linearRampToValueAtTime(0, context.currentTime + 0.1)

//   }
//   if(rotation.gamma){
//     nodes[2].filter.Q.setValueAtTime(rotation.alpha * 100, context.currentTime)
//     nodes[2].lowFilter.Q.setValueAtTime(rotation.alpha  * 100, context.currentTime)
//     nodes[2].filter.Q.linearRampToValueAtTime(0, context.currentTime + 0.1)
//     nodes[2].lowFilter.Q.linearRampToValueAtTime(0, context.currentTime + 0.1)

//   }
// //   nodes.distortion.curve = distort(rotation.alpha * 400)
// //   nodes.filter.detune.value = rotation.beta * 500
// //   nodes.lowFilter.detune.value = rotation.gamma * 500

// }
},{"../":1}]},{},[2])
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsInd3dy9kZW1vLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwibW9kdWxlLmV4cG9ydHMuc3ludGggPSBmdW5jdGlvbihjb250ZXh0KXtcblxuXG5cbiAgdmFyIG5vZGVzPXt9O1xuICBub2Rlcy5zb3VyY2UgPSBjb250ZXh0LmNyZWF0ZU9zY2lsbGF0b3IoKTtcbiAgbm9kZXMuc291cmNlLnR5cGUgPSAxO1xuICBub2Rlcy5zb3VyY2UuZnJlcXVlbmN5LnZhbHVlID0gWzEwMCwgMTUwLCAyMDAsIDI1MCwgNTBdW01hdGguZmxvb3IoTWF0aC5yYW5kb20oKSAqIDUpXTtcblxuICBub2Rlcy5maWx0ZXIgPSBjb250ZXh0LmNyZWF0ZUJpcXVhZEZpbHRlcigpO1xuICBub2Rlcy5maWx0ZXIuUS52YWx1ZSA9IDI1O1xuICBub2Rlcy5maWx0ZXIuZnJlcXVlbmN5LnZhbHVlID0gNDAwO1xuICBub2Rlcy5maWx0ZXIudHlwZSA9ICdsb3dzaGVsZic7Ly8wOyAvLzAgaXMgYSBsb3cgcGFzcyBmaWx0ZXJcblxuICBub2Rlcy5kaXN0b3J0aW9uID0gY29udGV4dC5jcmVhdGVXYXZlU2hhcGVyKCk7XG4gIG5vZGVzLmFuYWx5c2VyID0gY29udGV4dC5jcmVhdGVBbmFseXNlcigpO1xuICBub2Rlcy5kaXN0b3J0aW9uLmN1cnZlID0gbWFrZURpc3RvcnRpb25DdXJ2ZSgxMDApO1xuXG5cblxuICBub2Rlcy5sb3dGaWx0ZXIgPSBjb250ZXh0LmNyZWF0ZUJpcXVhZEZpbHRlcigpO1xuICBub2Rlcy5sb3dGaWx0ZXIuUS52YWx1ZSA9IDI1O1xuICBub2Rlcy5sb3dGaWx0ZXIudHlwZSA9IDA7XG4gIG5vZGVzLmxvd0ZpbHRlci5mcmVxdWVuY3kudmFsdWUgPSAzMDA7XG5cbiAgbm9kZXMudm9sdW1lID0gY29udGV4dC5jcmVhdGVHYWluKCk7XG4gIG5vZGVzLnZvbHVtZS5nYWluLnZhbHVlID0gMC4zO1xuXG4gIG5vZGVzLnNvdXJjZS5jb25uZWN0KG5vZGVzLmZpbHRlcik7XG4gIG5vZGVzLmZpbHRlci5jb25uZWN0KG5vZGVzLmFuYWx5c2VyKTtcbiAgbm9kZXMuYW5hbHlzZXIuY29ubmVjdChub2Rlcy5kaXN0b3J0aW9uKTtcbiAgbm9kZXMuZGlzdG9ydGlvbi5jb25uZWN0KG5vZGVzLmxvd0ZpbHRlcik7XG4gIG5vZGVzLmxvd0ZpbHRlci5jb25uZWN0KG5vZGVzLnZvbHVtZSk7XG5cbiAgcmV0dXJuIG5vZGVzO1xufVxuXG5mdW5jdGlvbiBtYWtlRGlzdG9ydGlvbkN1cnZlKGFtb3VudCkge1xuICB2YXIgayA9IHR5cGVvZiBhbW91bnQgPT09ICdudW1iZXInID8gYW1vdW50IDogNTAsXG4gICAgbl9zYW1wbGVzID0gNDQxMDAsXG4gICAgY3VydmUgPSBuZXcgRmxvYXQzMkFycmF5KG5fc2FtcGxlcyksXG4gICAgZGVnID0gTWF0aC5QSSAvIDE4MCxcbiAgICBpID0gMCxcbiAgICB4O1xuICBmb3IgKCA7IGkgPCBuX3NhbXBsZXM7ICsraSApIHtcbiAgICB4ID0gaSAqIDIgLyBuX3NhbXBsZXMgLSAxO1xuICAgIGN1cnZlW2ldID0gKCAzICsgayApICogeCAqIDIwICogZGVnIC8gKCBNYXRoLlBJICsgayAqIE1hdGguYWJzKHgpICk7XG4gIH1cbiAgcmV0dXJuIGN1cnZlO1xufVxuXG5tb2R1bGUuZXhwb3J0cy5kaXN0b3J0ID0gbWFrZURpc3RvcnRpb25DdXJ2ZSIsInZhciBtYWtlU3ludGggPSByZXF1aXJlKCcuLi8nKS5zeW50aFxuXG4vLyBSRVBMQUNFIFRIRVNFIFcgUkVBTCBNT0RVTEVTXG52YXIgZGlzdG9ydCA9IHJlcXVpcmUoJy4uLycpLmRpc3RvcnRcbmZ1bmN0aW9uIG1hcFJhbmdlKHZhbHVlLCBsb3cxLCBoaWdoMSwgbG93MiwgaGlnaDIpIHtcbiAgcmV0dXJuIGxvdzIgKyAoaGlnaDIgLSBsb3cyKSAqICh2YWx1ZSAtIGxvdzEpIC8gKGhpZ2gxIC0gbG93MSk7XG59XG5cbnZhciBjb250ZXh0ID0gbmV3ICh3aW5kb3cuQXVkaW9Db250ZXh0IHx8IHdpbmRvdy53ZWJraXRBdWRpb0NvbnRleHQpKClcblxuXG52YXIgbm9kZXMgPSBbXVxuZm9yKHZhciBpID0gMDsgaSA8IDM7IGkrKyl7XG4gIG5vZGVzLnB1c2gobWFrZVN5bnRoKGNvbnRleHQpKVxuICBub2Rlc1tpXS52b2x1bWUuY29ubmVjdChjb250ZXh0LmRlc3RpbmF0aW9uKVxuICBub2Rlc1tpXS5zb3VyY2Uuc3RhcnQoKVxufVxuXG5cbndpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZGV2aWNlb3JpZW50YXRpb25cIiwgaGFuZGxlT3JpZW50YXRpb24sIHRydWUpO1xuXG5cbnZhciByID0gMFxudmFyIGcgPSAwXG52YXIgYiA9IDBcblxuZnVuY3Rpb24gaGFuZGxlT3JpZW50YXRpb24oZXZlbnQpIHtcbiAgdmFyIGFic29sdXRlID0gZXZlbnQuYWJzb2x1dGU7XG5cbi8vIGFscGhhIGlzIHRoZSBjb21wYXNzIGRpcmVjdGlvbiB0aGUgZGV2aWNlIGlzIGZhY2luZyBpbiBkZWdyZWVzXG4gIC8vIFRoZSBEZXZpY2VPcmllbnRhdGlvbkV2ZW50LmFscGhhIHZhbHVlIHJlcHJlc2VudHMgdGhlIG1vdGlvbiBvZiB0aGUgZGV2aWNlIGFyb3VuZCB0aGUgeiBheGlzLCByZXByZXNlbnRlZCBpbiBkZWdyZWVzIHdpdGggdmFsdWVzIHJhbmdpbmcgZnJvbSAwIHRvIDM2MC5cbiAgLy8gVGhlIERldmljZU9yaWVudGF0aW9uRXZlbnQuYmV0YSB2YWx1ZSByZXByZXNlbnRzIHRoZSBtb3Rpb24gb2YgdGhlIGRldmljZSBhcm91bmQgdGhlIHggYXhpcywgcmVwcmVzZW50ZWQgaW4gZGVncmVlcyB3aXRoIHZhbHVlcyByYW5naW5nIGZyb20gLTE4MCB0byAxODAuICBUaGlzIHJlcHJlc2VudHMgYSBmcm9udCB0byBiYWNrIG1vdGlvbiBvZiB0aGUgZGV2aWNlLlxuICAvLyBUaGUgRGV2aWNlT3JpZW50YXRpb25FdmVudC5nYW1tYSB2YWx1ZSByZXByZXNlbnRzIHRoZSBtb3Rpb24gb2YgdGhlIGRldmljZSBhcm91bmQgdGhlIHkgYXhpcywgcmVwcmVzZW50ZWQgaW4gZGVncmVlcyB3aXRoIHZhbHVlcyByYW5naW5nIGZyb20gLTkwIHRvIDkwLiBUaGlzIHJlcHJlc2VudHMgYSBsZWZ0IHRvIHJpZ2h0IG1vdGlvbiBvZiB0aGUgZGV2aWNlLlxuICB2YXIgYWxwaGEgICAgPSBldmVudC5hbHBoYTtcbiAgdmFyIGJldGEgICAgID0gZXZlbnQuYmV0YTtcbiAgdmFyIGdhbW1hICAgID0gZXZlbnQuZ2FtbWE7XG4gIC8vIGNvbnNvbGUubG9nKGFscGhhLCBiZXRhLCBnYW1tYSlcbiAgaWYoYWxwaGEpIHtcbiAgICByID0gbWFwUmFuZ2UoYWxwaGEsIDAsIDM2MCwgMCwgMjU1KVxuICAgIG5vZGVzWzBdLmZpbHRlci5mcmVxdWVuY3kudmFsdWUgPSBtYXBSYW5nZShhbHBoYSwgMCwgMzYwLCAyMDAsIDI1MDApXG4gICAgbm9kZXNbMF0ubG93RmlsdGVyLmZyZXF1ZW5jeS52YWx1ZSA9IG1hcFJhbmdlKGFscGhhLCAtMTgwLCAxODAsIDMwMCwgMjAwMClcbiAgfVxuICBpZihiZXRhKSB7XG4gICAgZyA9IG1hcFJhbmdlKGJldGEsIC0xODAsIDE4MCwgMCwgMjU1KVxuICAgIG5vZGVzWzFdLmZpbHRlci5mcmVxdWVuY3kudmFsdWUgPSBtYXBSYW5nZShiZXRhLCAtMTgwLCAxODAsIDIwMCwgMjUwMClcbiAgICBub2Rlc1sxXS5sb3dGaWx0ZXIuZnJlcXVlbmN5LnZhbHVlID0gbWFwUmFuZ2UoYmV0YSwgLTE4MCwgMTgwLCAzMDAsIDIwMDApXG4gIH1cbiAgaWYoZ2FtbWEpIHtcbiAgICBiID0gbWFwUmFuZ2UoZ2FtbWEsIC05MCwgOTAsIDAsIDI1NSlcbiAgICBub2Rlc1syXS5maWx0ZXIuZnJlcXVlbmN5LnZhbHVlID0gbWFwUmFuZ2UoZ2FtbWEsIC05MCwgOTAgLCAyMDAsIDI1MDApXG4gICAgbm9kZXNbMl0ubG93RmlsdGVyLmZyZXF1ZW5jeS52YWx1ZSA9IG1hcFJhbmdlKGdhbW1hLCAtOTAsIDkwLCAzMDAsIDIwMDApXG4gIH1cbiAgLy8gY29uc29sZS5sb2coXCJyZ2IoXCIrcitcIixcIitnK1wiLFwiK2IrXCIpXCIpXG4gIGRvY3VtZW50LmJvZHkuc3R5bGUuYmFja2dyb3VuZENvbG9yID0gXCJyZ2IoXCIrfn5yK1wiLFwiK35+ZytcIixcIit+fmIrXCIpXCJcbn1cblxuLy8gb2ggbXkgZ2xvYiB0aGlzIHNvdW5kcyBhd2Z1bFxuXG4vLyB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcihcImRldmljZW1vdGlvblwiLCBoYW5kbGVNb3Rpb24sIHRydWUpO1xuXG4vLyBmdW5jdGlvbiBoYW5kbGVNb3Rpb24oZXZlbnREYXRhKSB7XG4vLyAvLyAgIC8vIHRoZXNlIGFyZSBwcm9icyBhbGwgYmV0d2VlbiAwIGFuZCAxIGFueXdheXM/IHByb2JhYmx5P1xuLy8gLy8gICAvLyBHcmFiIHRoZSBhY2NlbGVyYXRpb24gZnJvbSB0aGUgcmVzdWx0c1xuLy8gICB2YXIgYWNjZWxlcmF0aW9uID0gZXZlbnREYXRhLmFjY2VsZXJhdGlvbjtcbi8vICAgaWYoYWNjZWxlcmF0aW9uLngpe1xuLy8gICAgIG5vZGVzWzBdLnNvdXJjZS5kZXR1bmUuc2V0VmFsdWVBdFRpbWUoYWNjZWxlcmF0aW9uLnggKiAyNTAsIGNvbnRleHQuY3VycmVudFRpbWUpXG4vLyAgICAgbm9kZXNbMF0uc291cmNlLmRldHVuZS5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgwLCBjb250ZXh0LmN1cnJlbnRUaW1lKzAuMSlcbi8vICAgfVxuLy8gICBpZihhY2NlbGVyYXRpb24ueSl7XG4vLyAgICAgbm9kZXNbMV0uc291cmNlLmRldHVuZS5zZXRWYWx1ZUF0VGltZShhY2NlbGVyYXRpb24ueSAqIDI1MCwgY29udGV4dC5jdXJyZW50VGltZSlcbi8vICAgICBub2Rlc1sxXS5zb3VyY2UuZGV0dW5lLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDAsIGNvbnRleHQuY3VycmVudFRpbWUrMC4xKVxuLy8gICB9XG4vLyAgIGlmKGFjY2VsZXJhdGlvbi56KXtcbi8vICAgICAgIG5vZGVzWzJdLnNvdXJjZS5kZXR1bmUuc2V0VmFsdWVBdFRpbWUoYWNjZWxlcmF0aW9uLnogKiAyNTAsIGNvbnRleHQuY3VycmVudFRpbWUpXG4vLyAgICAgICBub2Rlc1syXS5zb3VyY2UuZGV0dW5lLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDAsIGNvbnRleHQuY3VycmVudFRpbWUrMC4xKVxuLy8gICB9XG4vLyAvLyAgIG5vZGVzLmZpbHRlci5RLnZhbHVlID0gYWNjZWxlcmF0aW9uLnkgKiAxMDBcbi8vIC8vICAgbm9kZXMubG93RmlsdGVyLlEudmFsdWUgPSBhY2NlbGVyYXRpb24ueiAqIDEwMFxuXG5cbi8vIC8vICAgLy8gR3JhYiB0aGUgcm90YXRpb24gcmF0ZSBmcm9tIHRoZSByZXN1bHRzXG4vLyAgIHZhciByb3RhdGlvbiA9IGV2ZW50RGF0YS5yb3RhdGlvblJhdGVcbi8vICAgaWYocm90YXRpb24uYWxwaGEpe1xuLy8gICAgIG5vZGVzWzBdLmZpbHRlci5RLnNldFZhbHVlQXRUaW1lKHJvdGF0aW9uLmFscGhhICogMTAwLCBjb250ZXh0LmN1cnJlbnRUaW1lKVxuLy8gICAgIG5vZGVzWzBdLmxvd0ZpbHRlci5RLnNldFZhbHVlQXRUaW1lKHJvdGF0aW9uLmFscGhhICAqIDEwMCwgY29udGV4dC5jdXJyZW50VGltZSlcbi8vICAgICBub2Rlc1swXS5maWx0ZXIuUS5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgwLCBjb250ZXh0LmN1cnJlbnRUaW1lICsgMC4xKVxuLy8gICAgIG5vZGVzWzBdLmxvd0ZpbHRlci5RLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDAsIGNvbnRleHQuY3VycmVudFRpbWUgKyAwLjEpXG4vLyAgIH1cbi8vICAgaWYocm90YXRpb24uYmV0YSl7XG4vLyAgICAgbm9kZXNbMV0uZmlsdGVyLlEuc2V0VmFsdWVBdFRpbWUocm90YXRpb24uYWxwaGEgKiAxMDAsIGNvbnRleHQuY3VycmVudFRpbWUpXG4vLyAgICAgbm9kZXNbMV0ubG93RmlsdGVyLlEuc2V0VmFsdWVBdFRpbWUocm90YXRpb24uYWxwaGEgICogMTAwLCBjb250ZXh0LmN1cnJlbnRUaW1lKVxuLy8gICAgIG5vZGVzWzFdLmZpbHRlci5RLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDAsIGNvbnRleHQuY3VycmVudFRpbWUgKyAwLjEpXG4vLyAgICAgbm9kZXNbMV0ubG93RmlsdGVyLlEubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMCwgY29udGV4dC5jdXJyZW50VGltZSArIDAuMSlcblxuLy8gICB9XG4vLyAgIGlmKHJvdGF0aW9uLmdhbW1hKXtcbi8vICAgICBub2Rlc1syXS5maWx0ZXIuUS5zZXRWYWx1ZUF0VGltZShyb3RhdGlvbi5hbHBoYSAqIDEwMCwgY29udGV4dC5jdXJyZW50VGltZSlcbi8vICAgICBub2Rlc1syXS5sb3dGaWx0ZXIuUS5zZXRWYWx1ZUF0VGltZShyb3RhdGlvbi5hbHBoYSAgKiAxMDAsIGNvbnRleHQuY3VycmVudFRpbWUpXG4vLyAgICAgbm9kZXNbMl0uZmlsdGVyLlEubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMCwgY29udGV4dC5jdXJyZW50VGltZSArIDAuMSlcbi8vICAgICBub2Rlc1syXS5sb3dGaWx0ZXIuUS5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgwLCBjb250ZXh0LmN1cnJlbnRUaW1lICsgMC4xKVxuXG4vLyAgIH1cbi8vIC8vICAgbm9kZXMuZGlzdG9ydGlvbi5jdXJ2ZSA9IGRpc3RvcnQocm90YXRpb24uYWxwaGEgKiA0MDApXG4vLyAvLyAgIG5vZGVzLmZpbHRlci5kZXR1bmUudmFsdWUgPSByb3RhdGlvbi5iZXRhICogNTAwXG4vLyAvLyAgIG5vZGVzLmxvd0ZpbHRlci5kZXR1bmUudmFsdWUgPSByb3RhdGlvbi5nYW1tYSAqIDUwMFxuXG4vLyB9Il19
