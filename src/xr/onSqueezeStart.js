import { mat4 } from 'gl-matrix'
import {
  currentlyGrabbedImage,
  images,
  inlineViewerHelper,
  scene,
  setCurrentlyGrabbedImage,
  xrImmersiveRefSpace,
} from '../global'

export default function onSqueezeStart(event) {
  if (event.inputSource.handedness === 'right') {
    console.log('squeezeStart', currentlyGrabbedImage())
    const refSpace = event.frame.session.isImmersive
      ? xrImmersiveRefSpace()
      : inlineViewerHelper().referenceSpace

    const targetRayPose = event.frame.getPose(
      event.inputSource.targetRaySpace,
      refSpace
    )
    if (!targetRayPose) {
      return
    }

    const hitResult = scene().hitTest(targetRayPose.transform)
    if (hitResult) {
      // Check to see if the hit result was one of our boxes.
      for (const image of images) {
        if (hitResult.node === image.node) {
          setCurrentlyGrabbedImage(image)
          image.scale = [2, 2, 2]
          image.originalPos = image.position
          image.originalMatrix = mat4.clone(image.node.matrix)
          image.grabbed = true
        }
      }
    }
  }
}
