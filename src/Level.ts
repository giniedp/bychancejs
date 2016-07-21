module Bychance {
  export class Level {
    chunks: Chunk[] = []

    constructor(public width:number, public height:number) {
      if (!width || !height) {
        Log.warn("width or height is not given or is 0")
      }
    }

    findProcessibleContext ():Context {
      for (let chunk of this.chunks) {
        for (let context of chunk.contexts) {
          if (!context.blocked) return context
        }
      }
      return null
    }

    calculateRectangleByGivenContexts (existingContext:Context, newContext:Context):IRectangle {
      var existingChunk = existingContext.chunk
      var possibleChunk = newContext.chunk

      var chunkPosition = Vec2.clone(existingChunk.position)
      chunkPosition = Vec2.add(chunkPosition, existingContext.position)
      chunkPosition = Vec2.subtract(chunkPosition, newContext.position)
      return Rectangle.create(chunkPosition.x, chunkPosition.y, possibleChunk.template.width, possibleChunk.template.height)
    }

    fitsLevelGeometry (existingContext:Context, possibleContext:Context):boolean {
      var levelRectangle = Rectangle.create(0, 0, this.width, this.height)
      var possibleChunkRectangle = this.calculateRectangleByGivenContexts(existingContext, possibleContext)
      
      // Check if possible context stays within level boundaries.
      
      if (!Rectangle.contains(levelRectangle, possibleChunkRectangle)) {
        return false
      }

      // Check if possible context overlaps with existing chunks.
      for (let chunk of this.chunks){
        var chunkRectangle = Rectangle.create(chunk.position.x, chunk.position.y, chunk.template.width, chunk.template.height)
        if (Rectangle.intersects(chunkRectangle, possibleChunkRectangle)) {
          return false
        }
      }

      return true
    }

    addChunk (freeContext:Context, newContext:Context) {
      // Calculate and set position for the new chunk.
      var newChunk = newContext.chunk
      var newChunkRectangle = this.calculateRectangleByGivenContexts(freeContext, newContext)
      newChunk.position = Vec2.clone(newChunkRectangle) 

      Log.debug(`Added chunk with ID ${newChunk.template.index} to the level at ${newChunk.position}`)
      
      // Block affected contexts.
      freeContext.blocked = true
      newContext.blocked = true
      freeContext.alignTo(newContext)

      // Add the new chunk to the level chunks.
      this.chunks.push(newChunk)
    }

    setStartingChunk(chunk:Chunk, position:IVec2) {
      chunk.position = position
      this.chunks.push(chunk)
    }

    setRandomStartingChunk (chunk:Chunk, random:IRandom) {
      Log.debug(random.next(), this.width, chunk.template.width);
      
      var startX = random.next() * (this.width - chunk.template.width)
      var startY = random.next() * (this.height - chunk.template.height)
      var startPosition = Vec2.create(startX, startY)
      this.setStartingChunk(chunk, startPosition)
    }
  }
}
