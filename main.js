import { initXR } from './src/xr/xr'
import { mat4 } from 'gl-matrix'
import { scene } from './src/global'
import { initScreenCapture, startCapture } from './src/screenCapture'
import { Gltf2Node } from './src/render/nodes/gltf2'

const roomModel = new Gltf2Node({
  url: 'media/gltf/cube-room/cube-room.gltf',
})
const background = new Gltf2Node({
  url: 'media/gltf/cozy_room/scene.gltf',
})

background.translation = [0, -0.1, 0.7]
mat4.rotateY(background.matrix, background.matrix, (Math.PI * 197) / 180)

scene().addNode(roomModel)
scene().addNode(background)

try {
  const videoNode = initScreenCapture()
  await startCapture()

  // Start the XR application.
  initXR(videoNode)
} catch (err) {
  console.error('Error: ' + err)
}
