import { inlineViewerHelper, scene, xrImmersiveRefSpace } from '../global'

export default function onSelect(event) {
  const refSpace = event.frame.session.isImmersive
    ? xrImmersiveRefSpace()
    : inlineViewerHelper().referenceSpace

  scene().handleSelect(event.inputSource, event.frame, refSpace)
}
