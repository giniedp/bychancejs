declare module Bychance {
    class Anchor {
        index: number;
        position: IVec2;
        tag: any;
        chunk: Chunk;
        constructor(index: number, position: IVec2, tag: any, chunk?: Chunk);
        createForChunk(chunk: Chunk): Anchor;
        absolutePosition: IVec2;
    }
}
