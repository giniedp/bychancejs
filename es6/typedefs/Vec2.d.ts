declare module Bychance {
    interface IVec2 {
        x: number;
        y: number;
    }
    module Vec2 {
        function clone(other: IVec2): IVec2;
        function create(x?: number, y?: number): IVec2;
        function distance(a: IVec2, b: IVec2): number;
        function distanceSquared(a: IVec2, b: IVec2): number;
        function add(a: IVec2, b: IVec2): IVec2;
        function subtract(a: IVec2, b: IVec2): IVec2;
    }
}
