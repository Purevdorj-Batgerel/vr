import InlineViewerHelper from '../util/inline-viewer-helper'

import onSessionEnded from './onSessionEnded'
import onSelect from './onSelect'
import onSqueezeStart from './onSqueezeStart'
import onSqueezeEnd from './onSqueezeEnd'
import onXRFrame from './onXRFrame'

import { initGL } from '../webGL'
import referenceSpaceTypes from '../constants/referenceSpaceTypes'
import {
  gl,
  inlineViewerHelper,
  scene,
  setInlineViewerHelper,
  setXRImmersiveRefSpace,
} from '../global'

export default function onSessionStarted(session) {
  session.addEventListener('end', onSessionEnded)
  session.addEventListener('select', onSelect)
  session.addEventListener('squeezestart', onSqueezeStart)
  session.addEventListener('squeezeend', onSqueezeEnd)

  initGL()
  scene().inputRenderer.useProfileControllerMeshes(session)

  const glLayer = new window.XRWebGLLayer(session, gl())
  session.updateRenderState({ baseLayer: glLayer })

  const refSpaceType = session.isImmersive
    ? referenceSpaceTypes.LOCAL_FLOOR
    : referenceSpaceTypes.VIEWER
  session.requestReferenceSpace(refSpaceType).then(refSpace => {
    if (session.isImmersive) {
      setXRImmersiveRefSpace(refSpace)
    } else {
      setInlineViewerHelper(new InlineViewerHelper(gl().canvas, refSpace))
      inlineViewerHelper().setHeight(1.6)
    }

    session.requestAnimationFrame(onXRFrame)
  })
}
