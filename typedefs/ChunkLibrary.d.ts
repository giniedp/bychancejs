declare module Bychance {
    interface IChunkLibrary {
        chunks: ChunkTemplate[];
    }
    module ChunkLibrary {
        function process(data: any[]): IChunkLibrary;
        class Builder {
            current: ChunkTemplate;
            templates: ChunkTemplate[];
            beginTemplate(options: any): void;
            context(options: any): void;
            anchor(options: any): void;
            endTemplate(): void;
            finish(): IChunkLibrary;
        }
    }
}
