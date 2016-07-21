declare module Bychance {
    function generate(data: any, width: number, height: number, random?: IRandom): Level;
    class LevelGenerator {
        canBeAligned(firstContext: Context, secondContext: Context): boolean;
        getEffectiveWeight(firstContext: Context, secondContext: Context, occurrences: any): number;
        generateLevel(lib: IChunkLibrary, level: Level, random: IRandom): void;
    }
}
