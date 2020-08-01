"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = void 0;
var Logger = /** @class */ (function () {
    function Logger(debug) {
        this.Reset = "\x1b[0m";
        this.Bright = "\x1b[1m";
        this.Dim = "\x1b[2m";
        this.Underscore = "\x1b[4m";
        this.Blink = "\x1b[5m";
        this.Reverse = "\x1b[7m";
        this.Hidden = "\x1b[8m";
        this.FgBlack = "\x1b[30m";
        this.FgRed = "\x1b[31m";
        this.FgGreen = "\x1b[32m";
        this.FgYellow = "\x1b[33m";
        this.FgBlue = "\x1b[34m";
        this.FgMagenta = "\x1b[35m";
        this.FgCyan = "\x1b[36m";
        this.FgWhite = "\x1b[37m";
        this.BgBlack = "\x1b[40m";
        this.BgRed = "\x1b[41m";
        this.BgGreen = "\x1b[42m";
        this.BgYellow = "\x1b[43m";
        this.BgBlue = "\x1b[44m";
        this.BgMagenta = "\x1b[45m";
        this.BgCyan = "\x1b[46m";
        this.BgWhite = "\x1b[47m";
        this.debug = debug;
    }
    Logger.prototype.Info = function (message) {
        var date = new Date();
        console.log(this.FgCyan + "[" + date.getHours() + ":" + date.getMinutes() + "][INFO] " + message + this.FgWhite);
    };
    Logger.prototype.Error = function (message) {
        var date = new Date();
        console.log(this.FgRed + "[" + date.getHours() + ":" + date.getMinutes() + "][ERROR] " + message + this.FgWhite);
    };
    Logger.prototype.Debug = function (message) {
        if (this.debug) {
            var date = new Date();
            console.log(this.FgYellow + "[" + date.getHours() + ":" + date.getMinutes() + "][DEBUG] " + message + this.FgWhite);
        }
    };
    return Logger;
}());
exports.Logger = Logger;
