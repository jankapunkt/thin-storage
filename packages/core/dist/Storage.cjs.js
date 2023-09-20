'use strict';

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(obj, key, value) { key = _toPropertyKey(key); if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }
function _regeneratorRuntime() { "use strict"; /*! regenerator-runtime -- Copyright (c) 2014-present, Facebook, Inc. -- license (MIT): https://github.com/facebook/regenerator/blob/main/LICENSE */ _regeneratorRuntime = function _regeneratorRuntime() { return e; }; var t, e = {}, r = Object.prototype, n = r.hasOwnProperty, o = Object.defineProperty || function (t, e, r) { t[e] = r.value; }, i = "function" == typeof Symbol ? Symbol : {}, a = i.iterator || "@@iterator", c = i.asyncIterator || "@@asyncIterator", u = i.toStringTag || "@@toStringTag"; function define(t, e, r) { return Object.defineProperty(t, e, { value: r, enumerable: !0, configurable: !0, writable: !0 }), t[e]; } try { define({}, ""); } catch (t) { define = function define(t, e, r) { return t[e] = r; }; } function wrap(t, e, r, n) { var i = e && e.prototype instanceof Generator ? e : Generator, a = Object.create(i.prototype), c = new Context(n || []); return o(a, "_invoke", { value: makeInvokeMethod(t, r, c) }), a; } function tryCatch(t, e, r) { try { return { type: "normal", arg: t.call(e, r) }; } catch (t) { return { type: "throw", arg: t }; } } e.wrap = wrap; var h = "suspendedStart", l = "suspendedYield", f = "executing", s = "completed", y = {}; function Generator() {} function GeneratorFunction() {} function GeneratorFunctionPrototype() {} var p = {}; define(p, a, function () { return this; }); var d = Object.getPrototypeOf, v = d && d(d(values([]))); v && v !== r && n.call(v, a) && (p = v); var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p); function defineIteratorMethods(t) { ["next", "throw", "return"].forEach(function (e) { define(t, e, function (t) { return this._invoke(e, t); }); }); } function AsyncIterator(t, e) { function invoke(r, o, i, a) { var c = tryCatch(t[r], t, o); if ("throw" !== c.type) { var u = c.arg, h = u.value; return h && "object" == _typeof(h) && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) { invoke("next", t, i, a); }, function (t) { invoke("throw", t, i, a); }) : e.resolve(h).then(function (t) { u.value = t, i(u); }, function (t) { return invoke("throw", t, i, a); }); } a(c.arg); } var r; o(this, "_invoke", { value: function value(t, n) { function callInvokeWithMethodAndArg() { return new e(function (e, r) { invoke(t, n, e, r); }); } return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg(); } }); } function makeInvokeMethod(e, r, n) { var o = h; return function (i, a) { if (o === f) throw new Error("Generator is already running"); if (o === s) { if ("throw" === i) throw a; return { value: t, done: !0 }; } for (n.method = i, n.arg = a;;) { var c = n.delegate; if (c) { var u = maybeInvokeDelegate(c, n); if (u) { if (u === y) continue; return u; } } if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) { if (o === h) throw o = s, n.arg; n.dispatchException(n.arg); } else "return" === n.method && n.abrupt("return", n.arg); o = f; var p = tryCatch(e, r, n); if ("normal" === p.type) { if (o = n.done ? s : l, p.arg === y) continue; return { value: p.arg, done: n.done }; } "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg); } }; } function maybeInvokeDelegate(e, r) { var n = r.method, o = e.iterator[n]; if (o === t) return r.delegate = null, "throw" === n && e.iterator["return"] && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y; var i = tryCatch(o, e.iterator, r.arg); if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y; var a = i.arg; return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y); } function pushTryEntry(t) { var e = { tryLoc: t[0] }; 1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e); } function resetTryEntry(t) { var e = t.completion || {}; e.type = "normal", delete e.arg, t.completion = e; } function Context(t) { this.tryEntries = [{ tryLoc: "root" }], t.forEach(pushTryEntry, this), this.reset(!0); } function values(e) { if (e || "" === e) { var r = e[a]; if (r) return r.call(e); if ("function" == typeof e.next) return e; if (!isNaN(e.length)) { var o = -1, i = function next() { for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next; return next.value = t, next.done = !0, next; }; return i.next = i; } } throw new TypeError(_typeof(e) + " is not iterable"); } return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", { value: GeneratorFunctionPrototype, configurable: !0 }), o(GeneratorFunctionPrototype, "constructor", { value: GeneratorFunction, configurable: !0 }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) { var e = "function" == typeof t && t.constructor; return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name)); }, e.mark = function (t) { return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t; }, e.awrap = function (t) { return { __await: t }; }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () { return this; }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) { void 0 === i && (i = Promise); var a = new AsyncIterator(wrap(t, r, n, o), i); return e.isGeneratorFunction(r) ? a : a.next().then(function (t) { return t.done ? t.value : a.next(); }); }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () { return this; }), define(g, "toString", function () { return "[object Generator]"; }), e.keys = function (t) { var e = Object(t), r = []; for (var n in e) r.push(n); return r.reverse(), function next() { for (; r.length;) { var t = r.pop(); if (t in e) return next.value = t, next.done = !1, next; } return next.done = !0, next; }; }, e.values = values, Context.prototype = { constructor: Context, reset: function reset(e) { if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t); }, stop: function stop() { this.done = !0; var t = this.tryEntries[0].completion; if ("throw" === t.type) throw t.arg; return this.rval; }, dispatchException: function dispatchException(e) { if (this.done) throw e; var r = this; function handle(n, o) { return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o; } for (var o = this.tryEntries.length - 1; o >= 0; --o) { var i = this.tryEntries[o], a = i.completion; if ("root" === i.tryLoc) return handle("end"); if (i.tryLoc <= this.prev) { var c = n.call(i, "catchLoc"), u = n.call(i, "finallyLoc"); if (c && u) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } else if (c) { if (this.prev < i.catchLoc) return handle(i.catchLoc, !0); } else { if (!u) throw new Error("try statement without catch or finally"); if (this.prev < i.finallyLoc) return handle(i.finallyLoc); } } } }, abrupt: function abrupt(t, e) { for (var r = this.tryEntries.length - 1; r >= 0; --r) { var o = this.tryEntries[r]; if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) { var i = o; break; } } i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null); var a = i ? i.completion : {}; return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a); }, complete: function complete(t, e) { if ("throw" === t.type) throw t.arg; return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y; }, finish: function finish(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y; } }, "catch": function _catch(t) { for (var e = this.tryEntries.length - 1; e >= 0; --e) { var r = this.tryEntries[e]; if (r.tryLoc === t) { var n = r.completion; if ("throw" === n.type) { var o = n.arg; resetTryEntry(r); } return o; } } throw new Error("illegal catch attempt"); }, delegateYield: function delegateYield(e, r, n) { return this.delegate = { iterator: values(e), resultName: r, nextLoc: n }, "next" === this.method && (this.arg = t), y; } }, e; }
function _createForOfIteratorHelper(o, allowArrayLike) { var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"]; if (!it) { if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") { if (it) o = it; var i = 0; var F = function F() {}; return { s: F, n: function n() { if (i >= o.length) return { done: true }; return { done: false, value: o[i++] }; }, e: function e(_e) { throw _e; }, f: F }; } throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); } var normalCompletion = true, didErr = false, err; return { s: function s() { it = it.call(o); }, n: function n() { var step = it.next(); normalCompletion = step.done; return step; }, e: function e(_e2) { didErr = true; err = _e2; }, f: function f() { try { if (!normalCompletion && it["return"] != null) it["return"](); } finally { if (didErr) throw err; } } }; }
function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }
function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i]; return arr2; }
function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { Promise.resolve(value).then(_next, _throw); } }
function _asyncToGenerator(fn) { return function () { var self = this, args = arguments; return new Promise(function (resolve, reject) { var gen = fn.apply(self, args); function _next(value) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value); } function _throw(err) { asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err); } _next(undefined); }); }; }
function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }
function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor); } }
function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); Object.defineProperty(Constructor, "prototype", { writable: false }); return Constructor; }
function _toPropertyKey(arg) { var key = _toPrimitive(arg, "string"); return _typeof(key) === "symbol" ? key : String(key); }
function _toPrimitive(input, hint) { if (_typeof(input) !== "object" || input === null) return input; var prim = input[Symbol.toPrimitive]; if (prim !== undefined) { var res = prim.call(input, hint || "default"); if (_typeof(res) !== "object") return res; throw new TypeError("@@toPrimitive must return a primitive value."); } return (hint === "string" ? String : Number)(input); }
var Storage = /*#__PURE__*/function () {
  function Storage() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    _classCallCheck(this, Storage);
    this.documents = new Set();
    this.keys = new Map();
    this.name = options.name;
    this.primary = options.primary || 'id';
    this.handler = options.handler ? Array.isArray(options.handler) ? options.handler : [options.handler] : [];
    this.hasInsert = this.handler.find(function (h) {
      return !!h.insert;
    });
    this.hasUpdate = this.handler.find(function (h) {
      return !!h.update;
    });
    this.hasRemove = this.handler.find(function (h) {
      return !!h.remove;
    });
  }
  _createClass(Storage, [{
    key: "insert",
    value: function () {
      var _insert = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee() {
        var _this = this;
        var documents,
          local,
          primaries,
          options,
          _iterator,
          _step,
          handler,
          _args = arguments;
        return _regeneratorRuntime().wrap(function _callee$(_context) {
          while (1) switch (_context.prev = _context.next) {
            case 0:
              documents = _args.length > 0 && _args[0] !== undefined ? _args[0] : [];
              documents = Array.isArray(documents) ? documents : [documents];
              local = shallowCopies(documents);
              primaries = [];
              if (!this.hasInsert) {
                _context.next = 29;
                break;
              }
              options = getOptions(this); // this runs a middleware stack on the shallow copies of the docs
              // which might even alter the size and the signature of the docs
              // as long as the last return value is the array with the primary keys
              // which is also passed as third argument in order to allow
              // throughput until the end, in case it has been created
              // before the last handler in the stack
              _iterator = _createForOfIteratorHelper(this.handler);
              _context.prev = 7;
              _iterator.s();
            case 9:
              if ((_step = _iterator.n()).done) {
                _context.next = 17;
                break;
              }
              handler = _step.value;
              if (!handler.insert) {
                _context.next = 15;
                break;
              }
              _context.next = 14;
              return handler.insert(local, options, primaries);
            case 14:
              primaries = _context.sent;
            case 15:
              _context.next = 9;
              break;
            case 17:
              _context.next = 22;
              break;
            case 19:
              _context.prev = 19;
              _context.t0 = _context["catch"](7);
              _iterator.e(_context.t0);
            case 22:
              _context.prev = 22;
              _iterator.f();
              return _context.finish(22);
            case 25:
              if (!(!primaries || primaries.length !== local.length)) {
                _context.next = 27;
                break;
              }
              throw new Error("Insert return values expected to be of length (".concat(primaries.length, "), got (").concat(local.length, ") in storage ").concat(this.name));
            case 27:
              _context.next = 30;
              break;
            case 29:
              primaries = local.map(function () {
                return incrementKey();
              });
            case 30:
              local.forEach(function (doc, index) {
                var key = primaries[index];
                doc[_this.primary] = key;
                _this.keys.set(key, doc);
                _this.documents.add(doc);
              });
              local.length = 0;
              return _context.abrupt("return", primaries);
            case 33:
            case "end":
              return _context.stop();
          }
        }, _callee, this, [[7, 19, 22, 25]]);
      }));
      function insert() {
        return _insert.apply(this, arguments);
      }
      return insert;
    }()
  }, {
    key: "update",
    value: function () {
      var _update = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2(query, modifier) {
        var _this2 = this;
        var options,
          local,
          entries,
          updated,
          _iterator2,
          _step2,
          handler,
          _args2 = arguments;
        return _regeneratorRuntime().wrap(function _callee2$(_context2) {
          while (1) switch (_context2.prev = _context2.next) {
            case 0:
              options = _args2.length > 2 && _args2[2] !== undefined ? _args2[2] : {};
              if (!(this.primary in modifier)) {
                _context2.next = 3;
                break;
              }
              throw new Error("Unexpected primary in modifier in store ".concat(this.name));
            case 3:
              local = shallowCopies(this.find(query, options));
              entries = Object.entries(modifier);
              updated = local.map(function (doc) {
                var copy = _objectSpread({}, doc);
                entries.forEach(function (_ref) {
                  var _ref2 = _slicedToArray(_ref, 2),
                    key = _ref2[0],
                    value = _ref2[1];
                  var val = typeof value === 'function' ? value(copy[key]) : value;
                  if (val === null) {
                    delete copy[key];
                  } else if (val !== undefined) {
                    copy[key] = val;
                  }
                });
                return copy;
              });
              if (!this.hasUpdate) {
                _context2.next = 28;
                break;
              }
              _iterator2 = _createForOfIteratorHelper(this.handler);
              _context2.prev = 8;
              _iterator2.s();
            case 10:
              if ((_step2 = _iterator2.n()).done) {
                _context2.next = 18;
                break;
              }
              handler = _step2.value;
              if (!handler.update) {
                _context2.next = 16;
                break;
              }
              _context2.next = 15;
              return handler.update(local, modifier, options, updated);
            case 15:
              updated = _context2.sent;
            case 16:
              _context2.next = 10;
              break;
            case 18:
              _context2.next = 23;
              break;
            case 20:
              _context2.prev = 20;
              _context2.t0 = _context2["catch"](8);
              _iterator2.e(_context2.t0);
            case 23:
              _context2.prev = 23;
              _iterator2.f();
              return _context2.finish(23);
            case 26:
              if (!(updated.length !== local.length)) {
                _context2.next = 28;
                break;
              }
              throw new Error("Update return values expected to be of length (".concat(updated.length, "), got (").concat(local.length, ") in storage ").concat(this.name));
            case 28:
              updated.forEach(function (doc) {
                var key = doc[_this2.primary];
                var original = _this2.keys.get(key);
                if (!original) {
                  throw new Error("Doc not found by primary key ".concat(key));
                }
                _this2.documents["delete"](original);
                _this2.documents.add(doc);
                _this2.keys.set(key, doc);
              });
              return _context2.abrupt("return", updated.length);
            case 30:
            case "end":
              return _context2.stop();
          }
        }, _callee2, this, [[8, 20, 23, 26]]);
      }));
      function update(_x, _x2) {
        return _update.apply(this, arguments);
      }
      return update;
    }()
  }, {
    key: "remove",
    value: function () {
      var _remove = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(query) {
        var _this3 = this;
        var options,
          local,
          removed,
          _options,
          _iterator3,
          _step3,
          handler,
          _args3 = arguments;
        return _regeneratorRuntime().wrap(function _callee3$(_context3) {
          while (1) switch (_context3.prev = _context3.next) {
            case 0:
              options = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : {};
              local = shallowCopies(this.find(query, options));
              removed = local.map(function (doc) {
                return doc[_this3.primary];
              });
              if (!this.hasRemove) {
                _context3.next = 26;
                break;
              }
              _options = getOptions(this);
              _iterator3 = _createForOfIteratorHelper(this.handler);
              _context3.prev = 6;
              _iterator3.s();
            case 8:
              if ((_step3 = _iterator3.n()).done) {
                _context3.next = 16;
                break;
              }
              handler = _step3.value;
              if (!handler.remove) {
                _context3.next = 14;
                break;
              }
              _context3.next = 13;
              return handler.remove(local, _options, removed);
            case 13:
              removed = _context3.sent;
            case 14:
              _context3.next = 8;
              break;
            case 16:
              _context3.next = 21;
              break;
            case 18:
              _context3.prev = 18;
              _context3.t0 = _context3["catch"](6);
              _iterator3.e(_context3.t0);
            case 21:
              _context3.prev = 21;
              _iterator3.f();
              return _context3.finish(21);
            case 24:
              if (!(removed.length !== local.length)) {
                _context3.next = 26;
                break;
              }
              throw new Error("Remove return values expected to be of length (".concat(removed.length, "), got (").concat(local.length, ") in storage ").concat(this.name));
            case 26:
              removed.forEach(function (key) {
                var original = _this3.keys.get(key);
                if (!original) {
                  throw new Error("Doc not found by primary key ".concat(key));
                }
                _this3.documents["delete"](original);
                _this3.keys["delete"](key);
              });
              return _context3.abrupt("return", removed.length);
            case 28:
            case "end":
              return _context3.stop();
          }
        }, _callee3, this, [[6, 18, 21, 24]]);
      }));
      function remove(_x3) {
        return _remove.apply(this, arguments);
      }
      return remove;
    }()
  }, {
    key: "find",
    value: function find(query) {
      var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var limit = options.limit;
      var docs = this.documents.values();
      if (!query) {
        return filterDocs({
          docs: docs,
          limit: limit,
          query: function query() {
            return true;
          }
        });
      }
      var queryType = _typeof(query);
      if (queryType === 'string') {
        // string query is expected to be a primary key
        var doc = this.keys.get(query);
        return doc ? [doc] : [];
      }
      if (queryType === 'function') {
        return filterDocs({
          docs: docs,
          limit: limit,
          query: query
        });
      }
      if (queryType === 'object') {
        var looseMatching = options.looseMatching;
        var entries = Object.entries(query);
        if (entries.length === 0) {
          return filterDocs({
            docs: docs,
            limit: limit,
            query: function query() {
              return true;
            }
          });
        }
        var byMatcher = function byMatcher(doc) {
          return entries.every(function (_ref3) {
            var _ref4 = _slicedToArray(_ref3, 2),
              key = _ref4[0],
              value = _ref4[1];
            return looseMatching ? doc[key] == value // eslint-disable-line
            : doc[key] === value;
          });
        };
        return filterDocs({
          docs: docs,
          limit: limit,
          query: byMatcher
        });
      }
      throw new Error("Unsupported query type \"".concat(queryType, "\""));
    }
  }]);
  return Storage;
}();
var shallowCopies = function shallowCopies(docs) {
  return docs.map(function (doc) {
    return _objectSpread({}, doc);
  });
};
var getOptions = function getOptions(_ref5) {
  var primary = _ref5.primary,
    name = _ref5.name;
  return {
    primary: primary,
    name: name
  };
};
var filterDocs = function filterDocs(_ref6) {
  var docs = _ref6.docs,
    query = _ref6.query,
    limit = _ref6.limit;
  var filtered = [];
  var _iterator4 = _createForOfIteratorHelper(docs),
    _step4;
  try {
    for (_iterator4.s(); !(_step4 = _iterator4.n()).done;) {
      var doc = _step4.value;
      if (query(doc)) {
        filtered.push(doc);
      }
      if (limit > 0 && filtered.length >= limit) {
        return filtered;
      }
    }
  } catch (err) {
    _iterator4.e(err);
  } finally {
    _iterator4.f();
  }
  return filtered;
};
var incrementKey = function () {
  var count = 0;
  return function () {
    var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;
    return (++count).toString(10).padStart(length, '0');
  };
}();
exports.Storage = Storage;
//# sourceMappingURL=Storage.cjs.js.map
