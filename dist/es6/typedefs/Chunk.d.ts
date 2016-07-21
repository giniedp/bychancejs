declare module Bychance {
    class Chunk {
        template: ChunkTemplate;
        contexts: Context[];
        anchors: Anchor[];
        position: IVec2;
        constructor(template: ChunkTemplate);
        getAlignedContextCount(): number;
    }
}
