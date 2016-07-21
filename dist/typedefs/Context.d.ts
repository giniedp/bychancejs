declare module Bychance {
    class Context {
        index: number;
        position: IVec2;
        tag: any;
        chunk: Chunk;
        target: Context;
        blocked: boolean;
        constructor(index: number, position: IVec2, tag: any, chunk?: Chunk);
        absolutePosition: IVec2;
        createForChunk(chunk: Chunk): Context;
        alignTo(context: Context): void;
        clearTarget(): void;
        isAdjacentTo(otherContext: Context, offset: number): boolean;
    }
}
