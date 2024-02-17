import { scene, video } from './global'
import { VideoNode } from './render/nodes/video'

const displayMediaOptions = {
  video: {
    cursor: 'always',
  },
  audio: false,
}
const VIDEO_SCALE = 0.3

export async function startCapture() {
  video.srcObject = await navigator.mediaDevices.getDisplayMedia(
    displayMediaOptions
  )
}

export function stopCapture() {
  video.pause()
  const tracks = video.srcObject?.getTracks()

  tracks?.forEach(track => track.stop())
  video.srcObject = null
}

export function initScreenCapture() {
  const videoNode = new VideoNode({
    video,
  })
  videoNode.translation = [0.025, 0.275, -4.4]
  videoNode.scale = [VIDEO_SCALE, VIDEO_SCALE, 1.0]

  video.addEventListener('loadeddata', () => {
    // Once the video has loaded up adjust the aspect ratio of the "screen"
    // to fit the video's native shape.
    const aspect = videoNode.aspectRatio

    if (aspect < 2.0) {
      videoNode.scale = [aspect * VIDEO_SCALE, VIDEO_SCALE, 1.0]
    } else {
      videoNode.scale = [VIDEO_SCALE, VIDEO_SCALE / aspect, 1.0]
    }
  })

  scene().addNode(videoNode)

  return videoNode
}
