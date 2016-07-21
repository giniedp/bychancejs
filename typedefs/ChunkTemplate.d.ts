declare module Bychance {
    class ChunkTemplate {
        width: number;
        height: number;
        weight: number;
        tag: any;
        allowRotation: boolean;
        contexts: Context[];
        anchors: Anchor[];
        index: number;
        constructor(width?: number, height?: number, weight?: number, tag?: any, allowRotation?: boolean);
    }
}
