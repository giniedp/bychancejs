module Bychance {
  export interface IRandom {
    next():number
  }

  export module Random {
    export var Naive:IRandom = {
      next: function() { 
        return Math.random() 
      }
    }
  }
}
