import {
  StandardMaterial,
  Texture,
  Vector3,
  MeshBuilder
} from 'babylonjs'

const { CreateSphere } = MeshBuilder

export default (scene, { x = 0, y = 0, z = 0, diameter = 4 }) => {
  const playerFire = new CreateSphere('playerWater', { diameter }, scene)
  playerFire.position = new Vector3(x, y, z)
  playerFire.material = new StandardMaterial('water', scene)
  playerFire.material.ambientTexture = new Texture(require('../water.jpg'), scene)
  return playerFire
}
