module Bychance {
  export interface IChunkLibrary {
    chunks:ChunkTemplate[]  
  }

  export module ChunkLibrary {
    export function process(data:any[]): IChunkLibrary {
      let builder = new Builder()
      for (let item of data) {
        builder.beginTemplate(item)
        for (let context of item.contexts) {
          builder.context(context)
        }
        for (let anchor of item.anchors) {
          builder.anchor(anchor)
        }
        builder.endTemplate()
      }
      return builder.finish()
    }

    export class Builder {

      current:ChunkTemplate = null
      templates:ChunkTemplate[] = []

      beginTemplate(options:any) {
        this.endTemplate()
        this.current = new ChunkTemplate(options.width, options.height, options.weight, options.tag, !!options.allowRotation)
        this.current.index = this.templates.length
      }
      context(options:any) {
        this.current.contexts.push(new Context(this.current.contexts.length, { x: options.x, y: options.y }, options.tag))
      }
      anchor(options:any) {
        this.current.anchors.push(new Anchor(this.current.anchors.length, { x: options.x, y: options.y }, options.tag))
      }
      endTemplate() {
        if (this.current){
          this.templates.push(this.current)
        }
        this.current = null
      }

      finish():IChunkLibrary {
        this.endTemplate()
        let result = { chunks: this.templates }
        this.templates = []
        return result
      }
    }
  }
}
