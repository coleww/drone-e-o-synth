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

if (window.DeviceOrientationEvent) {
  window.addEventListener("deviceorientation", handleOrientation, true);
} else {
  document.body.textContent = 'BORKED yr browser does not support deviceorientation'
}

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJpbmRleC5qcyIsInd3dy9kZW1vLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIm1vZHVsZS5leHBvcnRzLnN5bnRoID0gZnVuY3Rpb24oY29udGV4dCl7XG5cblxuXG4gIHZhciBub2Rlcz17fTtcbiAgbm9kZXMuc291cmNlID0gY29udGV4dC5jcmVhdGVPc2NpbGxhdG9yKCk7XG4gIG5vZGVzLnNvdXJjZS50eXBlID0gMTtcbiAgbm9kZXMuc291cmNlLmZyZXF1ZW5jeS52YWx1ZSA9IFsxMDAsIDE1MCwgMjAwLCAyNTAsIDUwXVtNYXRoLmZsb29yKE1hdGgucmFuZG9tKCkgKiA1KV07XG5cbiAgbm9kZXMuZmlsdGVyID0gY29udGV4dC5jcmVhdGVCaXF1YWRGaWx0ZXIoKTtcbiAgbm9kZXMuZmlsdGVyLlEudmFsdWUgPSAyNTtcbiAgbm9kZXMuZmlsdGVyLmZyZXF1ZW5jeS52YWx1ZSA9IDQwMDtcbiAgbm9kZXMuZmlsdGVyLnR5cGUgPSAnbG93c2hlbGYnOy8vMDsgLy8wIGlzIGEgbG93IHBhc3MgZmlsdGVyXG5cbiAgbm9kZXMuZGlzdG9ydGlvbiA9IGNvbnRleHQuY3JlYXRlV2F2ZVNoYXBlcigpO1xuICBub2Rlcy5hbmFseXNlciA9IGNvbnRleHQuY3JlYXRlQW5hbHlzZXIoKTtcbiAgbm9kZXMuZGlzdG9ydGlvbi5jdXJ2ZSA9IG1ha2VEaXN0b3J0aW9uQ3VydmUoMTAwKTtcblxuXG5cbiAgbm9kZXMubG93RmlsdGVyID0gY29udGV4dC5jcmVhdGVCaXF1YWRGaWx0ZXIoKTtcbiAgbm9kZXMubG93RmlsdGVyLlEudmFsdWUgPSAyNTtcbiAgbm9kZXMubG93RmlsdGVyLnR5cGUgPSAwO1xuICBub2Rlcy5sb3dGaWx0ZXIuZnJlcXVlbmN5LnZhbHVlID0gMzAwO1xuXG4gIG5vZGVzLnZvbHVtZSA9IGNvbnRleHQuY3JlYXRlR2FpbigpO1xuICBub2Rlcy52b2x1bWUuZ2Fpbi52YWx1ZSA9IDAuMztcblxuICBub2Rlcy5zb3VyY2UuY29ubmVjdChub2Rlcy5maWx0ZXIpO1xuICBub2Rlcy5maWx0ZXIuY29ubmVjdChub2Rlcy5hbmFseXNlcik7XG4gIG5vZGVzLmFuYWx5c2VyLmNvbm5lY3Qobm9kZXMuZGlzdG9ydGlvbik7XG4gIG5vZGVzLmRpc3RvcnRpb24uY29ubmVjdChub2Rlcy5sb3dGaWx0ZXIpO1xuICBub2Rlcy5sb3dGaWx0ZXIuY29ubmVjdChub2Rlcy52b2x1bWUpO1xuXG4gIHJldHVybiBub2Rlcztcbn1cblxuZnVuY3Rpb24gbWFrZURpc3RvcnRpb25DdXJ2ZShhbW91bnQpIHtcbiAgdmFyIGsgPSB0eXBlb2YgYW1vdW50ID09PSAnbnVtYmVyJyA/IGFtb3VudCA6IDUwLFxuICAgIG5fc2FtcGxlcyA9IDQ0MTAwLFxuICAgIGN1cnZlID0gbmV3IEZsb2F0MzJBcnJheShuX3NhbXBsZXMpLFxuICAgIGRlZyA9IE1hdGguUEkgLyAxODAsXG4gICAgaSA9IDAsXG4gICAgeDtcbiAgZm9yICggOyBpIDwgbl9zYW1wbGVzOyArK2kgKSB7XG4gICAgeCA9IGkgKiAyIC8gbl9zYW1wbGVzIC0gMTtcbiAgICBjdXJ2ZVtpXSA9ICggMyArIGsgKSAqIHggKiAyMCAqIGRlZyAvICggTWF0aC5QSSArIGsgKiBNYXRoLmFicyh4KSApO1xuICB9XG4gIHJldHVybiBjdXJ2ZTtcbn1cblxubW9kdWxlLmV4cG9ydHMuZGlzdG9ydCA9IG1ha2VEaXN0b3J0aW9uQ3VydmUiLCJ2YXIgbWFrZVN5bnRoID0gcmVxdWlyZSgnLi4vJykuc3ludGhcblxuLy8gUkVQTEFDRSBUSEVTRSBXIFJFQUwgTU9EVUxFU1xudmFyIGRpc3RvcnQgPSByZXF1aXJlKCcuLi8nKS5kaXN0b3J0XG5mdW5jdGlvbiBtYXBSYW5nZSh2YWx1ZSwgbG93MSwgaGlnaDEsIGxvdzIsIGhpZ2gyKSB7XG4gIHJldHVybiBsb3cyICsgKGhpZ2gyIC0gbG93MikgKiAodmFsdWUgLSBsb3cxKSAvIChoaWdoMSAtIGxvdzEpO1xufVxuXG52YXIgY29udGV4dCA9IG5ldyAod2luZG93LkF1ZGlvQ29udGV4dCB8fCB3aW5kb3cud2Via2l0QXVkaW9Db250ZXh0KSgpXG5cblxudmFyIG5vZGVzID0gW11cbmZvcih2YXIgaSA9IDA7IGkgPCAzOyBpKyspe1xuICBub2Rlcy5wdXNoKG1ha2VTeW50aChjb250ZXh0KSlcbiAgbm9kZXNbaV0udm9sdW1lLmNvbm5lY3QoY29udGV4dC5kZXN0aW5hdGlvbilcbiAgbm9kZXNbaV0uc291cmNlLnN0YXJ0KClcbn1cblxuaWYgKHdpbmRvdy5EZXZpY2VPcmllbnRhdGlvbkV2ZW50KSB7XG4gIHdpbmRvdy5hZGRFdmVudExpc3RlbmVyKFwiZGV2aWNlb3JpZW50YXRpb25cIiwgaGFuZGxlT3JpZW50YXRpb24sIHRydWUpO1xufSBlbHNlIHtcbiAgZG9jdW1lbnQuYm9keS50ZXh0Q29udGVudCA9ICdCT1JLRUQgeXIgYnJvd3NlciBkb2VzIG5vdCBzdXBwb3J0IGRldmljZW9yaWVudGF0aW9uJ1xufVxuXG52YXIgciA9IDBcbnZhciBnID0gMFxudmFyIGIgPSAwXG5cbmZ1bmN0aW9uIGhhbmRsZU9yaWVudGF0aW9uKGV2ZW50KSB7XG4gIHZhciBhYnNvbHV0ZSA9IGV2ZW50LmFic29sdXRlO1xuXG4vLyBhbHBoYSBpcyB0aGUgY29tcGFzcyBkaXJlY3Rpb24gdGhlIGRldmljZSBpcyBmYWNpbmcgaW4gZGVncmVlc1xuICAvLyBUaGUgRGV2aWNlT3JpZW50YXRpb25FdmVudC5hbHBoYSB2YWx1ZSByZXByZXNlbnRzIHRoZSBtb3Rpb24gb2YgdGhlIGRldmljZSBhcm91bmQgdGhlIHogYXhpcywgcmVwcmVzZW50ZWQgaW4gZGVncmVlcyB3aXRoIHZhbHVlcyByYW5naW5nIGZyb20gMCB0byAzNjAuXG4gIC8vIFRoZSBEZXZpY2VPcmllbnRhdGlvbkV2ZW50LmJldGEgdmFsdWUgcmVwcmVzZW50cyB0aGUgbW90aW9uIG9mIHRoZSBkZXZpY2UgYXJvdW5kIHRoZSB4IGF4aXMsIHJlcHJlc2VudGVkIGluIGRlZ3JlZXMgd2l0aCB2YWx1ZXMgcmFuZ2luZyBmcm9tIC0xODAgdG8gMTgwLiAgVGhpcyByZXByZXNlbnRzIGEgZnJvbnQgdG8gYmFjayBtb3Rpb24gb2YgdGhlIGRldmljZS5cbiAgLy8gVGhlIERldmljZU9yaWVudGF0aW9uRXZlbnQuZ2FtbWEgdmFsdWUgcmVwcmVzZW50cyB0aGUgbW90aW9uIG9mIHRoZSBkZXZpY2UgYXJvdW5kIHRoZSB5IGF4aXMsIHJlcHJlc2VudGVkIGluIGRlZ3JlZXMgd2l0aCB2YWx1ZXMgcmFuZ2luZyBmcm9tIC05MCB0byA5MC4gVGhpcyByZXByZXNlbnRzIGEgbGVmdCB0byByaWdodCBtb3Rpb24gb2YgdGhlIGRldmljZS5cbiAgdmFyIGFscGhhICAgID0gZXZlbnQuYWxwaGE7XG4gIHZhciBiZXRhICAgICA9IGV2ZW50LmJldGE7XG4gIHZhciBnYW1tYSAgICA9IGV2ZW50LmdhbW1hO1xuICAvLyBjb25zb2xlLmxvZyhhbHBoYSwgYmV0YSwgZ2FtbWEpXG4gIGlmKGFscGhhKSB7XG4gICAgciA9IG1hcFJhbmdlKGFscGhhLCAwLCAzNjAsIDAsIDI1NSlcbiAgICBub2Rlc1swXS5maWx0ZXIuZnJlcXVlbmN5LnZhbHVlID0gbWFwUmFuZ2UoYWxwaGEsIDAsIDM2MCwgMjAwLCAyNTAwKVxuICAgIG5vZGVzWzBdLmxvd0ZpbHRlci5mcmVxdWVuY3kudmFsdWUgPSBtYXBSYW5nZShhbHBoYSwgLTE4MCwgMTgwLCAzMDAsIDIwMDApXG4gIH1cbiAgaWYoYmV0YSkge1xuICAgIGcgPSBtYXBSYW5nZShiZXRhLCAtMTgwLCAxODAsIDAsIDI1NSlcbiAgICBub2Rlc1sxXS5maWx0ZXIuZnJlcXVlbmN5LnZhbHVlID0gbWFwUmFuZ2UoYmV0YSwgLTE4MCwgMTgwLCAyMDAsIDI1MDApXG4gICAgbm9kZXNbMV0ubG93RmlsdGVyLmZyZXF1ZW5jeS52YWx1ZSA9IG1hcFJhbmdlKGJldGEsIC0xODAsIDE4MCwgMzAwLCAyMDAwKVxuICB9XG4gIGlmKGdhbW1hKSB7XG4gICAgYiA9IG1hcFJhbmdlKGdhbW1hLCAtOTAsIDkwLCAwLCAyNTUpXG4gICAgbm9kZXNbMl0uZmlsdGVyLmZyZXF1ZW5jeS52YWx1ZSA9IG1hcFJhbmdlKGdhbW1hLCAtOTAsIDkwICwgMjAwLCAyNTAwKVxuICAgIG5vZGVzWzJdLmxvd0ZpbHRlci5mcmVxdWVuY3kudmFsdWUgPSBtYXBSYW5nZShnYW1tYSwgLTkwLCA5MCwgMzAwLCAyMDAwKVxuICB9XG4gIC8vIGNvbnNvbGUubG9nKFwicmdiKFwiK3IrXCIsXCIrZytcIixcIitiK1wiKVwiKVxuICBkb2N1bWVudC5ib2R5LnN0eWxlLmJhY2tncm91bmRDb2xvciA9IFwicmdiKFwiK35+citcIixcIit+fmcrXCIsXCIrfn5iK1wiKVwiXG59XG5cbi8vIG9oIG15IGdsb2IgdGhpcyBzb3VuZHMgYXdmdWxcblxuLy8gd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoXCJkZXZpY2Vtb3Rpb25cIiwgaGFuZGxlTW90aW9uLCB0cnVlKTtcblxuLy8gZnVuY3Rpb24gaGFuZGxlTW90aW9uKGV2ZW50RGF0YSkge1xuLy8gLy8gICAvLyB0aGVzZSBhcmUgcHJvYnMgYWxsIGJldHdlZW4gMCBhbmQgMSBhbnl3YXlzPyBwcm9iYWJseT9cbi8vIC8vICAgLy8gR3JhYiB0aGUgYWNjZWxlcmF0aW9uIGZyb20gdGhlIHJlc3VsdHNcbi8vICAgdmFyIGFjY2VsZXJhdGlvbiA9IGV2ZW50RGF0YS5hY2NlbGVyYXRpb247XG4vLyAgIGlmKGFjY2VsZXJhdGlvbi54KXtcbi8vICAgICBub2Rlc1swXS5zb3VyY2UuZGV0dW5lLnNldFZhbHVlQXRUaW1lKGFjY2VsZXJhdGlvbi54ICogMjUwLCBjb250ZXh0LmN1cnJlbnRUaW1lKVxuLy8gICAgIG5vZGVzWzBdLnNvdXJjZS5kZXR1bmUubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMCwgY29udGV4dC5jdXJyZW50VGltZSswLjEpXG4vLyAgIH1cbi8vICAgaWYoYWNjZWxlcmF0aW9uLnkpe1xuLy8gICAgIG5vZGVzWzFdLnNvdXJjZS5kZXR1bmUuc2V0VmFsdWVBdFRpbWUoYWNjZWxlcmF0aW9uLnkgKiAyNTAsIGNvbnRleHQuY3VycmVudFRpbWUpXG4vLyAgICAgbm9kZXNbMV0uc291cmNlLmRldHVuZS5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgwLCBjb250ZXh0LmN1cnJlbnRUaW1lKzAuMSlcbi8vICAgfVxuLy8gICBpZihhY2NlbGVyYXRpb24ueil7XG4vLyAgICAgICBub2Rlc1syXS5zb3VyY2UuZGV0dW5lLnNldFZhbHVlQXRUaW1lKGFjY2VsZXJhdGlvbi56ICogMjUwLCBjb250ZXh0LmN1cnJlbnRUaW1lKVxuLy8gICAgICAgbm9kZXNbMl0uc291cmNlLmRldHVuZS5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgwLCBjb250ZXh0LmN1cnJlbnRUaW1lKzAuMSlcbi8vICAgfVxuLy8gLy8gICBub2Rlcy5maWx0ZXIuUS52YWx1ZSA9IGFjY2VsZXJhdGlvbi55ICogMTAwXG4vLyAvLyAgIG5vZGVzLmxvd0ZpbHRlci5RLnZhbHVlID0gYWNjZWxlcmF0aW9uLnogKiAxMDBcblxuXG4vLyAvLyAgIC8vIEdyYWIgdGhlIHJvdGF0aW9uIHJhdGUgZnJvbSB0aGUgcmVzdWx0c1xuLy8gICB2YXIgcm90YXRpb24gPSBldmVudERhdGEucm90YXRpb25SYXRlXG4vLyAgIGlmKHJvdGF0aW9uLmFscGhhKXtcbi8vICAgICBub2Rlc1swXS5maWx0ZXIuUS5zZXRWYWx1ZUF0VGltZShyb3RhdGlvbi5hbHBoYSAqIDEwMCwgY29udGV4dC5jdXJyZW50VGltZSlcbi8vICAgICBub2Rlc1swXS5sb3dGaWx0ZXIuUS5zZXRWYWx1ZUF0VGltZShyb3RhdGlvbi5hbHBoYSAgKiAxMDAsIGNvbnRleHQuY3VycmVudFRpbWUpXG4vLyAgICAgbm9kZXNbMF0uZmlsdGVyLlEubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMCwgY29udGV4dC5jdXJyZW50VGltZSArIDAuMSlcbi8vICAgICBub2Rlc1swXS5sb3dGaWx0ZXIuUS5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgwLCBjb250ZXh0LmN1cnJlbnRUaW1lICsgMC4xKVxuLy8gICB9XG4vLyAgIGlmKHJvdGF0aW9uLmJldGEpe1xuLy8gICAgIG5vZGVzWzFdLmZpbHRlci5RLnNldFZhbHVlQXRUaW1lKHJvdGF0aW9uLmFscGhhICogMTAwLCBjb250ZXh0LmN1cnJlbnRUaW1lKVxuLy8gICAgIG5vZGVzWzFdLmxvd0ZpbHRlci5RLnNldFZhbHVlQXRUaW1lKHJvdGF0aW9uLmFscGhhICAqIDEwMCwgY29udGV4dC5jdXJyZW50VGltZSlcbi8vICAgICBub2Rlc1sxXS5maWx0ZXIuUS5saW5lYXJSYW1wVG9WYWx1ZUF0VGltZSgwLCBjb250ZXh0LmN1cnJlbnRUaW1lICsgMC4xKVxuLy8gICAgIG5vZGVzWzFdLmxvd0ZpbHRlci5RLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDAsIGNvbnRleHQuY3VycmVudFRpbWUgKyAwLjEpXG5cbi8vICAgfVxuLy8gICBpZihyb3RhdGlvbi5nYW1tYSl7XG4vLyAgICAgbm9kZXNbMl0uZmlsdGVyLlEuc2V0VmFsdWVBdFRpbWUocm90YXRpb24uYWxwaGEgKiAxMDAsIGNvbnRleHQuY3VycmVudFRpbWUpXG4vLyAgICAgbm9kZXNbMl0ubG93RmlsdGVyLlEuc2V0VmFsdWVBdFRpbWUocm90YXRpb24uYWxwaGEgICogMTAwLCBjb250ZXh0LmN1cnJlbnRUaW1lKVxuLy8gICAgIG5vZGVzWzJdLmZpbHRlci5RLmxpbmVhclJhbXBUb1ZhbHVlQXRUaW1lKDAsIGNvbnRleHQuY3VycmVudFRpbWUgKyAwLjEpXG4vLyAgICAgbm9kZXNbMl0ubG93RmlsdGVyLlEubGluZWFyUmFtcFRvVmFsdWVBdFRpbWUoMCwgY29udGV4dC5jdXJyZW50VGltZSArIDAuMSlcblxuLy8gICB9XG4vLyAvLyAgIG5vZGVzLmRpc3RvcnRpb24uY3VydmUgPSBkaXN0b3J0KHJvdGF0aW9uLmFscGhhICogNDAwKVxuLy8gLy8gICBub2Rlcy5maWx0ZXIuZGV0dW5lLnZhbHVlID0gcm90YXRpb24uYmV0YSAqIDUwMFxuLy8gLy8gICBub2Rlcy5sb3dGaWx0ZXIuZGV0dW5lLnZhbHVlID0gcm90YXRpb24uZ2FtbWEgKiA1MDBcblxuLy8gfSJdfQ==
