module Bychance {
  export interface IRectangle {
    x:number
    y:number
    width:number
    height:number
  }

  export module Rectangle {
    export function create(x:number, y:number, width:number, height:number):IRectangle {
      return { x: x, y: y, width: width, height: height }
    }

    export function intersects(a:IRectangle, b:IRectangle):boolean {
      return (
        a.x < (b.x + b.width) &&
        a.y < (b.y + b.height) && 
        (a.x + a.width) > b.x && 
        (a.y + a.height) > b.y)
    }

    export function contains(a:IRectangle, b:IRectangle):boolean {
      return ((a.x <= b.x) && 
              (a.y <= b.y) &&
              (a.x + a.width) >= (b.x + b.width) &&
              (a.y + a.height) >= (b.y + b.height))
    }
  }
}
