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