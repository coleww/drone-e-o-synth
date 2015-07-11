var makeDistortionCurve = require('make-distortion-curve')

module.exports = function(context, data){
  var nodes={}
  nodes.source = context.createOscillator()
  nodes.filter = context.createBiquadFilter()
  nodes.analyser = context.createAnalyser()
  nodes.distortion = context.createWaveShaper()

  nodes.lowFilter = context.createBiquadFilter()
  nodes.volume = context.createGain()

  nodes.source.connect(nodes.filter)
  nodes.filter.connect(nodes.analyser)
  nodes.analyser.connect(nodes.distortion)
  nodes.distortion.connect(nodes.lowFilter)
  nodes.lowFilter.connect(nodes.volume)

  nodes.import = function(data){
    data = data || {}
    data.source = data.source || {}
    data.distortion = data.distortion || {}
    data.filter = data.filter || {}
    data.lowFilter = data.lowFilter || {}
    data.volume = data.volume || {}

    this.source.type = data.source.type || 'square'
    this.source.frequency.value = data.source.frequency || [100, 150, 200, 250, 50][Math.floor(Math.random() * 5)]
    this.source.detune.value = data.source.detune || 0

    this.distortion.curve = data.distortion.curve || makeDistortionCurve(100)

    this.filter.Q.value = data.filter.Q || 25
    this.filter.frequency.value = data.filter.frequency || 400
    this.filter.type = data.filter.type || 'lowshelf'
    this.filter.detune = data.filter.detune || 0

    this.lowFilter.Q.value = data.lowFilter.Q || 25
    this.lowFilter.frequency.value = data.lowFilter.frequency || 300
    this.lowFilter.type = data.lowFilter.type || 'lowpass'
    this.lowFilter.detune = data.lowFilter.detune || 0

    this.volume.gain.value = data.volume.gain || 0.3
  }

  nodes.export = function(){
    return {
      source: {
        type: this.source.type,
        frequency: this.source.frequency.value,
        detune: this.source.detune.value
      },
      filter: {
        Q: this.filter.q.value,
        frequency: this.filter.frequency.value,
        type: this.filter.type,
        detune: this.filter.detune.value
      },
      distortion: {
        curve: this.distortion.curve
      },
      lowFilter: {
        Q: this.lowFilter.q.value,
        frequency: this.lowFilter.frequency.value,
        type: this.lowFilter.type,
        detune: this.lowFilter.detune.value
      },
      volume: {
        gain: this.volume.gain.value
      }
    }
  }

  nodes.connect = function(destination){
    this.volume.connect(destination)
  }

  nodes.start = function(){
    this.source.start()
  }

  nodes.keys = function(){
    return Object.keys(this).filter(function(k){
      return ['import', 'export', 'connect', 'start', 'keys'].indexOf(k) === -1
    })
  }

  nodes.import(data)

  return nodes
}
