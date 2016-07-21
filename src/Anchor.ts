module Bychance {
  export class Anchor {

    constructor(
      public index:number, 
      public position:IVec2, 
      public tag:any, 
      public chunk:Chunk=null) {
    }

    createForChunk(chunk:Chunk):Anchor {
      return new Anchor(this.index, this.position, this.tag, chunk)
    }

    get absolutePosition():IVec2 {
      if (this.chunk) {
        return Vec2.add(this.chunk.position, this.position)
      } else {
        return Vec2.clone(this.position)
      }
    }
  }
}
