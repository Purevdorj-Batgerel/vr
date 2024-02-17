import { WebXRButton } from '../util/webxr-button.js'

import onSessionStarted from './onSessionStarted'
import onRequestSession from './onRequestSession'
import onEndSession from './onEndSession'

import { headerElem, setLeftHandNode, setXRButton, xrButton } from '../global'
import xrMode from '../constants/xrMode'

export function initXR(leftHandNode, rightHandNode) {
  setXRButton(
    new WebXRButton({
      onRequestSession,
      onEndSession,
    })
  )
  headerElem.appendChild(xrButton().domElement)

  if (leftHandNode) setLeftHandNode(leftHandNode)

  if (navigator.xr) {
    navigator.xr.isSessionSupported(xrMode.IMMERSIVE_VR).then(supported => {
      xrButton().enabled = supported
    })

    navigator.xr.requestSession(xrMode.INLINE).then(onSessionStarted)
  }
}
