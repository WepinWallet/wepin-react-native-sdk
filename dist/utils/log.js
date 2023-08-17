"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var LOG = (function () {
    function LOG() {
    }
    LOG.test = console.warn.bind(window.console, '[SDK][test] ');
    LOG.warn = console.warn.bind(window.console, '[SDK][warn] ');
    LOG.error = console.error.bind(window.console, '[SDK][error] ');
    LOG.todo = console.warn.bind(window.console, '[SDK][todo] ');
    LOG.assert = console.assert.bind(window.console);
    LOG.debug = process.env.NODE_ENV !== 'development'
        ? function () { }
        : console.log.bind(window.console, '[SDK][debug]');
    return LOG;
}());
exports.default = LOG;
//# sourceMappingURL=log.js.map