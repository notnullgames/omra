import { Engine } from 'babylonjs'
import music from './music'

class GameManager {
  constructor () {
    this.canvas = document.createElement('canvas')
    this.engine = new Engine(this.canvas, true, {}, true)
    document.getElementById('root').appendChild(this.canvas)
    this.engine.runRenderLoop(() => {
      this.engine.scenes.forEach(scene => scene.render())
    })
    window.addEventListener('resize', () => this.engine.resize())
    this.engine.resize()
  }

  load (level, extra = {}) {
    music.stop()
    delete this.engine.scenes
    this.engine.scenes = []
    level(this.engine, this.canvas, music, extra)
  }
}

export default new GameManager()
