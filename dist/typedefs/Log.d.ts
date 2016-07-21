declare module Bychance.Log {
    let Enabled: boolean;
    var log: (msg: any, ...text: any[]) => string;
    var info: (msg: any, ...text: any[]) => string;
    var debug: (msg: any, ...text: any[]) => string;
    var warn: (msg: any, ...text: any[]) => string;
    var error: (msg: any, ...text: any[]) => string;
}
