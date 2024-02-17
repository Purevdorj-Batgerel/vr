import xrMode from '../constants/xrMode'
import { headerElem, video } from '../global'
import sessionFeatures from '../constants/sessionFeatures'

import onSessionStarted from './onSessionStarted'
import { onResize } from '../webGL'
import { initHeadModel } from '../components/head'

export default function () {
  const pending = video.play().then(() => {
    video.pause()
  })

  return navigator.xr
    .requestSession(xrMode.IMMERSIVE_VR, {
      requiredFeatures: [sessionFeatures.LOCAL_FLOOR],
    })
    .then(session => {
      headerElem.style.display = 'none'
      session.isImmersive = true
      onSessionStarted(session)

      onResize()
      // Load up a mesh that we can use to visualize the headset's pose.
      initHeadModel()

      pending.then(() => {
        video.play()
      })
    })
}
