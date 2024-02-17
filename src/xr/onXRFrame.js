import { mat4, quat, vec3 } from 'gl-matrix'
import {
  currentlyGrabbedImage,
  gl,
  inlineViewerHelper,
  leftHandNode,
  scene,
  spectatorCameraFromCorner,
  spectatorMode,
  xrImmersiveRefSpace,
} from '../global'
import { Ray } from '../render/math/ray'

import { coverPictureAnimation } from '../components/coverPicture'
import { greenScreenAnimation } from '../components/greenScreen'
import { headModel } from '../components/head'

// Set up a view point in a front of the room scene
// near the forward wall and looking down at the origin/user.
const spectatorProjectionMatrix = mat4.create()
const spectatorQuat = quat.create()
quat.rotateY(spectatorQuat, spectatorQuat, (Math.PI * -180) / 180)
quat.rotateX(spectatorQuat, spectatorQuat, (Math.PI * -27) / 180)
const spectatorTransform = new window.XRRigidTransform(
  { x: 0.0, y: 1.5, z: -0.8 },
  {
    x: spectatorQuat[0],
    y: spectatorQuat[1],
    z: spectatorQuat[2],
    w: spectatorQuat[3],
  }
)

export default function onXRFrame(t, frame) {
  const session = frame.session
  const refSpace = session.isImmersive
    ? xrImmersiveRefSpace()
    : inlineViewerHelper().referenceSpace
  const pose = frame.getViewerPose(refSpace)

  scene().startFrame()

  session.requestAnimationFrame(onXRFrame)

  // Update the pose of the display to sync with the controller.
  for (const source of session.inputSources) {
    if (source.gamepad) {
      const targetRayPose = frame.getPose(source.targetRaySpace, refSpace)
      if (targetRayPose) {
        const targetRay = new Ray(targetRayPose.transform.matrix)
        const grabDistance = 0.1
        const grabPos = vec3.fromValues(
          targetRay.origin[0], // x
          targetRay.origin[1], // y
          targetRay.origin[2] // z
        )
        vec3.add(grabPos, grabPos, [
          targetRay.direction[0] * grabDistance,
          targetRay.direction[1] * grabDistance + 0.06, // 6 cm up to avoid collision with a ray
          targetRay.direction[2] * grabDistance,
        ])

        if (source.handedness === 'left' && leftHandNode()) {
          leftHandNode().translation = grabPos

          leftHandNode().rotation = new Float32Array([
            targetRayPose.transform.orientation.x,
            targetRayPose.transform.orientation.y,
            targetRayPose.transform.orientation.z,
            targetRayPose.transform.orientation.w,
          ])

          mat4.rotateX(leftHandNode().matrix, leftHandNode().matrix, -0.15)
        } else if (currentlyGrabbedImage()?.grabbed) {
          currentlyGrabbedImage().position = grabPos

          const node = currentlyGrabbedImage().node
          mat4.identity(node.matrix)
          mat4.translate(
            node.matrix,
            node.matrix,
            currentlyGrabbedImage().position
          )
          mat4.scale(node.matrix, node.matrix, currentlyGrabbedImage().scale)
        }
      }
    }
  }

  coverPictureAnimation()
  greenScreenAnimation()

  scene().updateInputSources(frame, refSpace)

  scene().drawXRFrame(frame, pose)

  // If spectator mode is active, draw a 3rd person view of the scene to
  // the WebGL context's default backbuffer.
  if (spectatorMode() && pose) {
    // Bind the WebGL context's default framebuffer, so that the rendered
    // content shows up in the canvas element.
    gl().bindFramebuffer(gl().FRAMEBUFFER, null)

    // Clear the framebuffer
    gl().clear(gl().COLOR_BUFFER_BIT | gl().DEPTH_BUFFER_BIT)

    // Set the viewport to the whole canvas
    gl().viewport(0, 0, gl().drawingBufferWidth, gl().drawingBufferHeight)

    if (spectatorCameraFromCorner()) {
      // Set up a sensible projection matrix for the canvas
      mat4.perspective(
        spectatorProjectionMatrix,
        Math.PI * 0.4,
        gl().drawingBufferWidth / gl().drawingBufferHeight,
        session.renderState.depthNear,
        session.renderState.depthFar
      )

      // Update the headset's pose to match the user's and make it visible
      // for this draw.
      headModel.visible = true
      headModel.matrix = pose.transform.matrix
      mat4.rotateY(headModel.matrix, headModel.matrix, Math.PI)
      mat4.scale(headModel.matrix, headModel.matrix, [0.2, 0.2, 0.2])

      // Draw the spectator view of the scene.
      scene().draw(spectatorProjectionMatrix, spectatorTransform)

      // Ensure the headset isn't visible in the VR view.
      headModel.visible = false
    } else {
      scene().draw(pose.views[0].projectionMatrix, pose.transform)
    }
  }

  scene().endFrame()
}
