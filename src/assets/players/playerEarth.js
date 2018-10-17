import {
  StandardMaterial,
  Texture,
  Vector3,
  MeshBuilder
} from 'babylonjs'

const { CreateSphere } = MeshBuilder

export default (scene, { x = 0, y = 0, z = 0, diameter = 4 }) => {
  const playerFire = new CreateSphere('playerEarth', { diameter }, scene)
  playerFire.position = new Vector3(x, y, z)
  playerFire.material = new StandardMaterial('earth', scene)
  playerFire.material.ambientTexture = new Texture(require('../earth.png'), scene)
  return playerFire
}
