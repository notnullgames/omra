import {
  StandardMaterial,
  Texture,
  Vector3,
  MeshBuilder
} from 'babylonjs'

const { CreateSphere } = MeshBuilder

export default (scene, { x = 0, y = 0, z = 0, diameter = 4, ...options }) => {
  const playerFire = new CreateSphere('playerFire', { diameter, ...options }, scene)
  playerFire.position = new Vector3(x, y, z)
  playerFire.material = new StandardMaterial('fire', scene)
  playerFire.material.ambientTexture = new Texture(require('../fire.jpg'), scene)
  return playerFire
}
