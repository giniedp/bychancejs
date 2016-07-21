declare module Bychance {
    interface IRandom {
        next(): number;
    }
    module Random {
        var Naive: IRandom;
    }
}
