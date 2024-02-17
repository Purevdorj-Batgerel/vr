import { setSpectatorMode, spectatorMode, xrButton } from '../global'
import { stopCapture } from '../screenCapture'

export default function onSessionEnded(event) {
  if (event.session.isImmersive) {
    xrButton().setSession(null)
    // video.pause()
    stopCapture()

    // When we exit the inline session stop presenting the spectator view.
    if (spectatorMode()) {
      setSpectatorMode(false)
    }
  }
}
