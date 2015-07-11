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