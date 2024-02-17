import { Scene } from './render/scenes/scene'
import createValue from './util/createValue'

// WebGL scene globals.
export const [gl, setGL] = createValue()
export const [renderer, setRenderer] = createValue()
export const [scene, setScene] = createValue(new Scene())

// Indicates if we are currently presenting a spectator view of the
// scene to an external display.
export const [spectatorMode, setSpectatorMode] = createValue(true)
export function toggleSpectatorMode() {
  setSpectatorMode(!spectatorMode())
}

// XR globals.
export const [xrButton, setXRButton] = createValue()
export const [xrImmersiveRefSpace, setXRImmersiveRefSpace] = createValue()
export const [inlineViewerHelper, setInlineViewerHelper] = createValue()

export const [spectatorCameraFromCorner, setSpectatorCameraFromCorner] =
  createValue(true)
export function toggleSpectatorCamera() {
  setSpectatorCameraFromCorner(!spectatorCameraFromCorner())
}

export const headerElem = document.querySelector('header')

export const [leftHandNode, setLeftHandNode] = createValue()
export const [rightHandNode, setRightHandNode] = createValue()

export const video = document.createElement('video')

export const [currentlyGrabbedImage, setCurrentlyGrabbedImage] =
  createValue(null)

export const images = []
