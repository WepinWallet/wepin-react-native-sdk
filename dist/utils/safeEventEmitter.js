"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        if (typeof b !== "function" && b !== null)
            throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var eventemitter3_1 = __importDefault(require("eventemitter3"));
function safeApply(handler, context, args) {
    try {
        Reflect.apply(handler, context, args);
    }
    catch (err) {
        setTimeout(function () {
            throw err;
        });
    }
}
function arrayClone(arr) {
    var n = arr.length;
    var copy = new Array(n);
    for (var i = 0; i < n; i += 1) {
        copy[i] = arr[i];
    }
    return copy;
}
var SafeEventEmitter = (function (_super) {
    __extends(SafeEventEmitter, _super);
    function SafeEventEmitter() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    SafeEventEmitter.prototype.emit = function (event) {
        var args = [];
        for (var _i = 1; _i < arguments.length; _i++) {
            args[_i - 1] = arguments[_i];
        }
        var doError = event === 'error';
        var events = this._events;
        if (events !== undefined) {
            doError = doError && events.error === undefined;
        }
        else if (!doError) {
            return false;
        }
        if (doError) {
            var er = void 0;
            if (args.length > 0) {
                ;
                er = args[0];
            }
            if (er instanceof Error) {
                throw er;
            }
            var err = new Error("Unhandled error.".concat(er ? " (".concat(er.message, ")") : ''));
            err.context = er;
            throw err;
        }
        var handler = events[event];
        if (handler === undefined) {
            return false;
        }
        if (typeof handler === 'function') {
            safeApply(handler, this, args);
        }
        else {
            var len = handler.length;
            var listeners = arrayClone(handler);
            for (var i = 0; i < len; i += 1) {
                safeApply(listeners[i], this, args);
            }
        }
        return true;
    };
    return SafeEventEmitter;
}(eventemitter3_1.default));
exports.default = SafeEventEmitter;
//# sourceMappingURL=safeEventEmitter.js.map