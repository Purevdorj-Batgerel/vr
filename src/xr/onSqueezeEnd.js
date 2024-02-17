import { currentlyGrabbedImage, setCurrentlyGrabbedImage } from '../global'

export default function onSqueezeEnd(event) {
  if (event.inputSource.handedness === 'right') {
    console.log('squeezeend ' + currentlyGrabbedImage())
    if (currentlyGrabbedImage()?.grabbed) {
      currentlyGrabbedImage().scale = [1, 1, 1]
      currentlyGrabbedImage().position = currentlyGrabbedImage().originalPos

      const node = currentlyGrabbedImage().node
      node.matrix = currentlyGrabbedImage().originalMatrix

      currentlyGrabbedImage().grabbed = false
      setCurrentlyGrabbedImage(null)
    }
  }
}
