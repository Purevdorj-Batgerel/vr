import { Renderer, createWebGLContext } from './render/core/renderer'
import {
  gl,
  setGL,
  scene,
  renderer,
  setRenderer,
  // spectatorMode,
} from './global'

export function onResize() {
  const scaleFactor = window.devicePixelRatio

  // if (spectatorMode()) {
  //   // The spectator view does take time to render, and can impact the
  //   // performance of the in-headset view. To help mitigate that, we'll
  //   // draw the spectator view at half the native resolution.
  //   scaleFactor /= 2.0
  // }

  gl().canvas.width = gl().canvas.offsetWidth * scaleFactor
  gl().canvas.height = gl().canvas.offsetHeight * scaleFactor
}

export function initGL() {
  if (gl()) return

  setGL(
    createWebGLContext({
      webgl2: true,
      xrCompatible: true,
      alpha: false,
    })
  )
  document.body.appendChild(gl().canvas)

  onResize()
  window.addEventListener('resize', onResize)

  setRenderer(new Renderer(gl()))
  scene().setRenderer(renderer())
}
