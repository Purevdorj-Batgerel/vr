import { scene } from '../global'
import { Gltf2Node } from '../render/nodes/gltf2'

export const headModel = new Gltf2Node({
  url: 'media/gltf/steampunk_glasses__goggles/scene.gltf',
})

export function initHeadModel() {
  scene().addNode(headModel)
}
