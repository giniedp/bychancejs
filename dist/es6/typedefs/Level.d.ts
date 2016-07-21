declare module Bychance {
    class Level {
        width: number;
        height: number;
        chunks: Chunk[];
        constructor(width: number, height: number);
        findProcessibleContext(): Context;
        calculateRectangleByGivenContexts(existingContext: Context, newContext: Context): IRectangle;
        fitsLevelGeometry(existingContext: Context, possibleContext: Context): boolean;
        addChunk(freeContext: Context, newContext: Context): void;
        setStartingChunk(chunk: Chunk, position: IVec2): void;
        setRandomStartingChunk(chunk: Chunk, random: IRandom): void;
    }
}
