import { Material } from '../core/material.js'
import { Node } from '../core/node.js'
import { PrimitiveStream } from '../geometry/primitive-stream.js'

const BUTTON_LAYER_DISTANCE = 0.005
const MAX_DIMENSION = 0.2

class ImageMaterial extends Material {
  constructor() {
    super()

    this.state.blend = true

    this.image = this.defineSampler('image')
  }

  get materialName() {
    return 'BUTTON_IMAGE_MATERIAL'
  }

  get vertexSource() {
    return `
    attribute vec3 POSITION;
    attribute vec2 TEXCOORD_0;

    varying vec2 vTexCoord;

    vec4 vertex_main(mat4 proj, mat4 view, mat4 model) {
      vTexCoord = TEXCOORD_0;
      return proj * view * model * vec4(POSITION, 1.0);
    }`
  }

  get fragmentSource() {
    return `
    uniform sampler2D image;
    varying vec2 vTexCoord;

    vec4 fragment_main() {
      return texture2D(image, vTexCoord);
    }`
  }
}

export class ImageNode extends Node {
  constructor(imageTexture, callback) {
    super()

    // All buttons are selectable by default.
    this.selectable = true

    this._selectHandler = callback
    this._imageTexture = imageTexture
    this._hovered = false
    this._hoverT = 0
  }

  get imageTexture() {
    return this._imageTexture
  }

  set imageTexture(value) {
    if (this._imageTexture === value) {
      return
    }

    this._imageTexture = value
    this._imageRenderPrimitive.samplers.image.texture = value
  }

  onRendererChanged(renderer) {
    const stream = new PrimitiveStream()

    const hd = BUTTON_LAYER_DISTANCE * 0.5
    const divider =
      Math.max(this._imageTexture.width, this._imageTexture.height) /
      MAX_DIMENSION
    const hw = this._imageTexture.width / divider
    const hh = this._imageTexture.height / divider

    stream.startGeometry()

    stream.pushVertex(-hw, hh, hd, 0, 0, 0, 0, 1)
    stream.pushVertex(-hw, -hh, hd, 0, 1, 0, 0, 1)
    stream.pushVertex(hw, -hh, hd, 1, 1, 0, 0, 1)
    stream.pushVertex(hw, hh, hd, 1, 0, 0, 0, 1)

    stream.pushTriangle(0, 1, 2)
    stream.pushTriangle(0, 2, 3)

    stream.endGeometry()

    const imagePrimitive = stream.finishPrimitive(renderer)
    const imageMaterial = new ImageMaterial()
    imageMaterial.image.texture = this._imageTexture
    this._imageRenderPrimitive = renderer.createRenderPrimitive(
      imagePrimitive,
      imageMaterial
    )
    this.addRenderPrimitive(this._imageRenderPrimitive)
  }
}
