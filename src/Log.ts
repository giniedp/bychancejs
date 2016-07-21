module Bychance.Log {
  export let Enabled = false;

  var consoleDelegate = function (name:string):(msg:any, ...text:any[])=>string {
    
    if (!self.console || !self.console[name]) {
      return function (msg:any, ...text:any[]):string {
        return "";
      };
    }
    return function (msg:any, ...text:any[]):string {
      if (Enabled) {
        return self.console[name].apply(self.console, arguments);
      }
    };
  };

  export var log = consoleDelegate('log');
  export var info = consoleDelegate('info');
  export var debug = consoleDelegate('debug');
  export var warn = consoleDelegate('warn');
  export var error = consoleDelegate('error'); 
}
