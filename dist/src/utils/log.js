export default class LOG {
}
LOG.test = console.warn.bind(window.console, '[SDK][test] ');
LOG.warn = console.warn.bind(window.console, '[SDK][warn] ');
LOG.error = console.error.bind(window.console, '[SDK][error] ');
LOG.todo = console.warn.bind(window.console, '[SDK][todo] ');
LOG.assert = console.assert.bind(window.console);
LOG.debug = (thisArg, ...argArray) => { };
//# sourceMappingURL=log.js.map