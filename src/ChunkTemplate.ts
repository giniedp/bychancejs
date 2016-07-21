module Bychance {
  export class ChunkTemplate {
    contexts: Context[] = []
    anchors: Anchor[] = []
    index: number = 0
    constructor(
      public width: number = 0,
      public height: number = 0,
      public weight: number = 0,
      public tag: any = null,
      public allowRotation: boolean = false
    ) {

    }
  }
}
