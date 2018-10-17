import {
  FreeCamera,
  Scene,
  Vector3,
  Color3,
  HemisphericLight,
  PointLight,
  GUI
} from 'babylonjs'
import 'babylonjs-gui'

import game from '../game'
import song from '../assets/music/sway'
import menuPlunk from '../assets/sounds/menuPlunk'
import menuGo from '../assets/sounds/menuGo'
import GenericKeyHandlerInput from '../GenericKeyHandlerInput'
import { MusicPlayer } from '../music'
import mapPlay from './mapPlay'
import playerFire from '../assets/players/playerFire'
import playerWater from '../assets/players/playerWater'
import playerEarth from '../assets/players/playerEarth'

const { AdvancedDynamicTexture, Control: { VERTICAL_ALIGNMENT_BOTTOM, VERTICAL_ALIGNMENT_TOP }, TextBlock } = GUI

export default (engine, canvas, music) => {
  const scene = new Scene(engine)
  scene.clearColor = Color3.Black()
  music.load(song, true, true)

  const menuPlunkSound = new MusicPlayer(menuPlunk)
  const menuGoSound = new MusicPlayer(menuGo)

  const gui = AdvancedDynamicTexture.CreateFullscreenUI('UI')

  const text1 = new GUI.TextBlock()
  text1.text = '\n\n\n\n\n\nChoose your avatar'
  text1.color = 'white'
  text1.fontSize = 40
  text1.textVerticalAlignment = VERTICAL_ALIGNMENT_TOP
  gui.addControl(text1)

  const text2 = new TextBlock()
  text2.color = 'white'
  text2.fontSize = 200
  text2.textVerticalAlignment = VERTICAL_ALIGNMENT_BOTTOM
  gui.addControl(text2)

  const stuff = {}
  stuff.light1 = new HemisphericLight('light1', new Vector3(1, 1, 0), scene)
  stuff.light2 = new PointLight('light2', new Vector3(0, 1, -1), scene)

  stuff.playerFire = playerFire(scene, {})
  stuff.playerWater = playerWater(scene, { x: 7 })
  stuff.playerEarth = playerEarth(scene, { x: 14 })

  const camera = new FreeCamera('camera', Vector3.Zero(), scene)
  camera.inputs.clear()

  const players = ['Fire', 'Water', 'Earth']
  let currentPlayer = 0

  camera.inputs.add(new GenericKeyHandlerInput(keys => {
    if (keys.has('ArrowLeft')) {
      menuPlunkSound.play()
      keys.delete('ArrowLeft')
      currentPlayer = ((currentPlayer + players.length) - 1) % players.length
    }

    if (keys.has('ArrowRight')) {
      menuPlunkSound.play()
      keys.delete('ArrowRight')
      currentPlayer = (currentPlayer + 1) % players.length
    }

    if (keys.has('Enter')) {
      menuGoSound.play()
      keys.delete('Enter')
      game.load(mapPlay, { player: players[ currentPlayer ] })
    }

    const player = scene.getMeshByName(`player${players[ currentPlayer ]}`)
    camera.lockedTarget = player
    camera.position = new Vector3(player.y, 0, -10)

    text2.text = `${players[ currentPlayer ]}\n`
  }))
  camera.attachControl(canvas, true)

  return scene
}
