import {
  Scene,
  FollowCamera,
  Vector3,
  DirectionalLight,
  PhysicsImpostor,
  MeshBuilder,
  Color3,
  ShadowGenerator
} from 'babylonjs'

import song from '../assets/music/rechord'
import playerFire from '../assets/players/playerFire'
import playerWater from '../assets/players/playerWater'
import playerEarth from '../assets/players/playerEarth'
import shortSwoosh from '../assets/sounds/shortSwoosh'
import { MusicPlayer } from '../music'

const players = { playerFire, playerWater, playerEarth }
const { SphereImpostor, BoxImpostor } = PhysicsImpostor
const { CreateGround } = MeshBuilder

export default (engine, canvas, music, extra) => {
  const scene = new Scene(engine)
  scene.clearColor = Color3.Black()
  const shortSwooshSound = new MusicPlayer(shortSwoosh)

  const camera = new FollowCamera('FollowCam', Vector3.Zero(), scene)
  camera.checkCollisions = true
  camera.applyGravity = true
  camera.radius = 5
  camera.attachControl(canvas, true)

  var light = new DirectionalLight('dir01', new Vector3(-1, -2, -1), scene)
  light.position = new Vector3(20, 40, 20)
  light.intensity = 0.5
  const shadowGenerator = new ShadowGenerator(1024, light)
  shadowGenerator.useExponentialShadowMap = true

  const player = players[`player${extra.player}`](scene, { diameter: 1 })
  shadowGenerator.getShadowMap().renderList.push(player)
  player.position.y = 2
  camera.lockedTarget = player
  camera.position = new Vector3(player.y, 0, -10)
  shadowGenerator.addShadowCaster(player)

  const ground = CreateGround('ground1', { width: 16, height: 16, depth: 16, subdivs: 16 }, scene)
  ground.receiveShadows = true

  scene.enablePhysics()

  player.physicsImpostor = new PhysicsImpostor(player, SphereImpostor, { mass: 1, restitution: 0.9 }, scene)
  ground.physicsImpostor = new PhysicsImpostor(ground, BoxImpostor, { mass: 0, restitution: 0.9 }, scene)

  player.physicsImpostor.registerOnPhysicsCollide(ground.physicsImpostor, (main, collided) => {
    shortSwooshSound.stop()
    shortSwooshSound.play()
  })

  const handleKeys = keys => {
    const v = Vector3.Zero()
    if (keys.has('ArrowLeft')) {
      v.x = 1
    } else if (keys.has('ArrowRight')) {
      v.x = -1
    }
    if (keys.has('ArrowUp')) {
      v.z = -1
    } else if (keys.has('ArrowDown')) {
      v.z = 1
    }
    keys.delete('ArrowUp')
    keys.delete('ArrowDown')
    keys.delete('ArrowLeft')
    keys.delete('ArrowRight')
    player.physicsImpostor.setLinearVelocity(v)
  }

  const keys = new Set()
  canvas.addEventListener('keydown', e => {
    keys.add(e.key)
    handleKeys(keys)
  })
  canvas.addEventListener('keyup', e => {
    keys.delete(e.key)
    handleKeys(keys)
  })

  return scene
}
