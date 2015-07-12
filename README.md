drone-e-o-synth
----------------

[PLAY THREE OF THEM AT THE SAME TIME WITH A SMART PHONE](http://coleww.github.io/shake-it-off)

----------------------------

[![NPM](https://nodei.co/npm/drone-e-o-synth.png)](https://nodei.co/npm/drone-e-o-synth/)

WEB AUDIO SYNTH MODULEZZZ https://www.npmjs.com/package/drone-e-o-synth

An experiment in using NPM for building modular noise instruments.

Each instrument is an object filled with already-connected and setup audioNodes. The instrument responds to:

- keys() => returns list of keys to audioNodes
- connect(destination) => connect the output nodes to a destination or other nodes
- start() => calls start() on all the source nodes
- export() => returns JSON respresentation of the instrument
- import(data) => loads a JSON of the instrument state.

From there, writing a module that auto-magically builds UI for each of the nodes shouldn't be _too_ hard.

-----------------

### INSTALL 

`npm install drone-e-o-synth`

### EXAMPLE 

```
var makeSynth = require('drone-e-o-synth')
var context = new (window.AudioContext || window.webkitAudioContext)()
var synth = makeSynth(context)

// synth is an object filled with audio nodes that are already connected together!

synth.connect(context.destination)
// connect yr synth to the audio context destination, or to other nodes

synth.keys() => ['source', 'filter', lowFilter', 'distortion', 'volume']
// returns a list of keys to audio nodes, so you can do stuff like synth.source.type = "triangle"

var data = synth.export() => exports the current state of the audio nodes to a json object
synth.import(data) => resets state of audio nodes from JSON object
```

### DEV

```
# install dependencies
npm install

# start watchify
npm run watch

# start local server
python -m SimpleHTTPServer
```