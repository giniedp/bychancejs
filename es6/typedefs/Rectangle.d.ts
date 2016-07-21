declare module Bychance {
    interface IRectangle {
        x: number;
        y: number;
        width: number;
        height: number;
    }
    module Rectangle {
        function create(x: number, y: number, width: number, height: number): IRectangle;
        function intersects(a: IRectangle, b: IRectangle): boolean;
        function contains(a: IRectangle, b: IRectangle): boolean;
    }
}
