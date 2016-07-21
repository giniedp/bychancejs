module Bychance {
  export class Context {
    target: Context = null
    blocked: boolean = false 

    constructor(
      public index: number, 
      public position:IVec2, 
      public tag: any,
      public chunk: Chunk = null) {

    }

    get absolutePosition () {
      return Vec2.add(this.chunk.position, this.position)
    }

    createForChunk(chunk:Chunk) {
      return new Context(this.index, this.position, this.tag, chunk)
    };

    alignTo (context:Context) {
      this.target = context
      context.target = this
    };

    clearTarget() {
      if (this.target) {
        this.target.target = null
        this.target = null
      }
    };

    isAdjacentTo(otherContext:Context, offset:number) {
      var distance = Vec2.distanceSquared(otherContext.absolutePosition, this.absolutePosition)
      return distance <= offset * offset
    }
  }

}
