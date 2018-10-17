export default class GenericKeyHandlerInput {
  constructor (onUpdate) {
    this._keys = new Set()
    this.onUpdate = onUpdate || (() => {})
  }

  onKeyUp (noPreventDefault) {
    return e => {
      if (!noPreventDefault) {
        e.preventDefault()
      }
      this._keys.delete(e.key)
    }
  }

  onKeyDown (noPreventDefault) {
    return e => {
      if (!noPreventDefault) {
        e.preventDefault()
      }
      this._keys.add(e.key)
    }
  }

  // This function must return the type name of the camera, it could be used for serializing your scene
  getTypeName () {
    return 'GenericKeyHandlerInput'
  }

  // This function must return the simple name that will be injected in the input manager as short hand
  // for example "mouse" will turn into camera.inputs.attached.mouse
  getSimpleName () {
    return 'genericKey'
  }

  // This function must activate your input event.  Even if your input does not need a DOM element
  //  element and noPreventDefault must be present and used as parameter names.
  //  Return void.
  attachControl (element, noPreventDefault) {
    this._onKeyDown = this.onKeyDown(noPreventDefault)
    this._onKeyUp = this.onKeyUp(noPreventDefault)
    element.addEventListener('keydown', this._onKeyDown, false)
    element.addEventListener('keyup', this._onKeyUp, false)
  }

  // Detach control must deactivate your input and release all pointers, closures or event listeners
  // element must be present as a parameter name.
  //  Return void.
  detachControl (element) {
    element.removeEventListener('keydown', this._onKeyDown)
    element.removeEventListener('keyup', this._onKeyUp)
    this._keys = new Set()
    delete this._onKeyDown
    delete this._onKeyUp
  }

  // This optional function will get called for each rendered frame, if you want to synchronize your input to rendering,
  // no need to use requestAnimationFrame. It's a good place for applying calculations if you have to.
  //  Return void.
  checkInputs () {
    this.onUpdate(this._keys)
  }
}
