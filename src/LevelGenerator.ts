module Bychance {

  export function generate(data:any, width:number, height:number, random:IRandom = Random.Naive): Level {
    if (data instanceof Array) {
      data = ChunkLibrary.process(data)
    }
    let level = new Level(width, height)
    let generator = new LevelGenerator()
    generator.generateLevel(data, level, random);
    return level;
  }
  
  export class LevelGenerator {

    canBeAligned(firstContext:Context, secondContext:Context) {
      return true;
    };

    getEffectiveWeight(firstContext:Context, secondContext:Context, occurrences) {
      return secondContext.chunk.template.weight;
    };

    generateLevel(lib:IChunkLibrary, level:Level, random:IRandom) {
      if (!lib.chunks.length) {
        Log.warn("Chunk library is empty")
        return
      }

      var chunkQuantities:number[] = []
      for (var i = 0; i < lib.chunks.length; i++) {
        chunkQuantities[i] = 0
      }

      Log.debug(`Chunk library has ${lib.chunks.length} chunk template(s).`)

      if (level.findProcessibleContext() == null) {
        Log.warn("Level seems not to have a starting chunk. Generating one for you")
        level.setRandomStartingChunk(new Chunk(lib.chunks[0]) , random)
      }

      // Main level generation loop.
      while (true) {
        var freeContext = level.findProcessibleContext()
        if (freeContext == null) {
          // TODO After finishing the level generation, start post-processing.
          Log.debug(`Generated level contains ${level.chunks.length} chunks:`)
          for (i = 0; i < chunkQuantities.length; i++) {
            Log.debug(`  ${(chunkQuantities[i] * 100 / level.chunks.length)|0}% of the chunks are instances of chunk ${i}`)
          }
          return
        }

        var chunk = freeContext.chunk

        Log.debug("Expanding level at ", freeContext.absolutePosition)

        // Clear candidate lists after each iteration.
        let chunkCandidates:Chunk[] = []
        let contextCandidates:number[] = []

        // Filter chunk library for compatible chunk candidates.
        for (let chunkTemplate of lib.chunks) {
          let possibleChunk = new Chunk(chunkTemplate)
          for (let possibleContext of possibleChunk.contexts) {
            if (this.canBeAligned(possibleContext, freeContext) && level.fitsLevelGeometry(freeContext, possibleContext)) {
              chunkCandidates.push(possibleChunk) 
              contextCandidates.push(possibleContext.index) 
              break
            }
          }
        }

        Log.debug(`Found ${chunkCandidates.length} chunk candidates.`, chunkCandidates.map((it) => { return it.template.index}).join(','));
        
        // If no candidates are available for the selected context, block and ignore it in further iterations.
        if (chunkCandidates.length == 0) {
          freeContext.blocked = true
          Log.debug("Blocked context for further iterations.")
          continue
        }

        // Compute effective weights for each chunk candidate.
        let effectiveWeights = []
        for (let i in chunkCandidates) {
          let chunk = chunkCandidates[i]
          effectiveWeights.push(this.getEffectiveWeight(freeContext, chunk.contexts[contextCandidates[i]], chunkQuantities[chunk.template.index]))
        }


        // Compute the sum of all effective chunk weights.
        let totalWeight = 0;
        for (i = 0; i < effectiveWeights.length; i++) {
          totalWeight += effectiveWeights[i];
        }
        Log.debug(`Calculated total weight: ${totalWeight}`);

        // Pick a chunk at random.
        let randomWeight = Math.floor(random.next() * totalWeight);
        Log.debug(`Calculated random weight: ${randomWeight}`);

        for (i = 0; i < chunkCandidates.length; i++) {
          randomWeight -= effectiveWeights[i]
          if (randomWeight < 0) {
            // Integrate selected chunk into level.
            let chunk = chunkCandidates[i]
            let context = chunk.contexts[contextCandidates[i]]
            level.addChunk(freeContext, context)
            chunkQuantities[context.chunk.template.index] = chunkQuantities[context.chunk.template.index] + 1
            break;
          }
        }
      }
    };
  }
}
