module Bychance {
  export class Chunk {
    contexts: Context[] = []
    anchors: Anchor[] = []
    position: IVec2 = Vec2.create()

    constructor(public template:ChunkTemplate) {
      // Copy contexts from template.
      for (let context of template.contexts) {
        this.contexts.push(context.createForChunk(this))
      }

      // Copy anchors from template.
      for (let anchor of template.anchors) {
        this.anchors.push(anchor.createForChunk(this))
      }
    }

    getAlignedContextCount() {
      let targetCount = 0;
      for (let context of this.contexts) {
        if (context.target) targetCount++
      }
      return targetCount
    }
  }
}
