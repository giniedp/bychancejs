module Bychance {
  export interface IVec2 {
    x:number
    y:number
  }
  
  export module Vec2 {
    export function clone(other:IVec2): IVec2 {
      return { x: other.x, y: other.y}
    }
    export function create(x:number = 0, y:number = 0): IVec2 {
      return { x: x, y: y}
    }
    export function distance(a:IVec2, b:IVec2):number {
      var x = a.x - b.x;
      var y = a.y - b.y;
      return Math.sqrt(x * x + y * y);
    }
    export function distanceSquared(a:IVec2, b:IVec2):number {
      var x = a.x - b.x;
      var y = a.y - b.y;
      return x * x + y * y;
    }
    export function add(a:IVec2, b:IVec2):IVec2 {
      return create(a.x + b.x, a.y + b.y)
    }
    export function subtract(a:IVec2, b:IVec2) {
      return create(a.x - b.x, a.y - b.y)
    }
  }
}
