var ThinStorage = (function (exports) {
  'use strict';

  function _iterableToArrayLimit(r, l) {
    var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"];
    if (null != t) {
      var e,
        n,
        i,
        u,
        a = [],
        f = !0,
        o = !1;
      try {
        if (i = (t = t.call(r)).next, 0 === l) {
          if (Object(t) !== t) return;
          f = !1;
        } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0);
      } catch (r) {
        o = !0, n = r;
      } finally {
        try {
          if (!f && null != t.return && (u = t.return(), Object(u) !== u)) return;
        } finally {
          if (o) throw n;
        }
      }
      return a;
    }
  }
  function ownKeys(e, r) {
    var t = Object.keys(e);
    if (Object.getOwnPropertySymbols) {
      var o = Object.getOwnPropertySymbols(e);
      r && (o = o.filter(function (r) {
        return Object.getOwnPropertyDescriptor(e, r).enumerable;
      })), t.push.apply(t, o);
    }
    return t;
  }
  function _objectSpread2(e) {
    for (var r = 1; r < arguments.length; r++) {
      var t = null != arguments[r] ? arguments[r] : {};
      r % 2 ? ownKeys(Object(t), !0).forEach(function (r) {
        _defineProperty(e, r, t[r]);
      }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) {
        Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r));
      });
    }
    return e;
  }
  function _regeneratorRuntime() {
    _regeneratorRuntime = function () {
      return e;
    };
    var t,
      e = {},
      r = Object.prototype,
      n = r.hasOwnProperty,
      o = Object.defineProperty || function (t, e, r) {
        t[e] = r.value;
      },
      i = "function" == typeof Symbol ? Symbol : {},
      a = i.iterator || "@@iterator",
      c = i.asyncIterator || "@@asyncIterator",
      u = i.toStringTag || "@@toStringTag";
    function define(t, e, r) {
      return Object.defineProperty(t, e, {
        value: r,
        enumerable: !0,
        configurable: !0,
        writable: !0
      }), t[e];
    }
    try {
      define({}, "");
    } catch (t) {
      define = function (t, e, r) {
        return t[e] = r;
      };
    }
    function wrap(t, e, r, n) {
      var i = e && e.prototype instanceof Generator ? e : Generator,
        a = Object.create(i.prototype),
        c = new Context(n || []);
      return o(a, "_invoke", {
        value: makeInvokeMethod(t, r, c)
      }), a;
    }
    function tryCatch(t, e, r) {
      try {
        return {
          type: "normal",
          arg: t.call(e, r)
        };
      } catch (t) {
        return {
          type: "throw",
          arg: t
        };
      }
    }
    e.wrap = wrap;
    var h = "suspendedStart",
      l = "suspendedYield",
      f = "executing",
      s = "completed",
      y = {};
    function Generator() {}
    function GeneratorFunction() {}
    function GeneratorFunctionPrototype() {}
    var p = {};
    define(p, a, function () {
      return this;
    });
    var d = Object.getPrototypeOf,
      v = d && d(d(values([])));
    v && v !== r && n.call(v, a) && (p = v);
    var g = GeneratorFunctionPrototype.prototype = Generator.prototype = Object.create(p);
    function defineIteratorMethods(t) {
      ["next", "throw", "return"].forEach(function (e) {
        define(t, e, function (t) {
          return this._invoke(e, t);
        });
      });
    }
    function AsyncIterator(t, e) {
      function invoke(r, o, i, a) {
        var c = tryCatch(t[r], t, o);
        if ("throw" !== c.type) {
          var u = c.arg,
            h = u.value;
          return h && "object" == typeof h && n.call(h, "__await") ? e.resolve(h.__await).then(function (t) {
            invoke("next", t, i, a);
          }, function (t) {
            invoke("throw", t, i, a);
          }) : e.resolve(h).then(function (t) {
            u.value = t, i(u);
          }, function (t) {
            return invoke("throw", t, i, a);
          });
        }
        a(c.arg);
      }
      var r;
      o(this, "_invoke", {
        value: function (t, n) {
          function callInvokeWithMethodAndArg() {
            return new e(function (e, r) {
              invoke(t, n, e, r);
            });
          }
          return r = r ? r.then(callInvokeWithMethodAndArg, callInvokeWithMethodAndArg) : callInvokeWithMethodAndArg();
        }
      });
    }
    function makeInvokeMethod(e, r, n) {
      var o = h;
      return function (i, a) {
        if (o === f) throw new Error("Generator is already running");
        if (o === s) {
          if ("throw" === i) throw a;
          return {
            value: t,
            done: !0
          };
        }
        for (n.method = i, n.arg = a;;) {
          var c = n.delegate;
          if (c) {
            var u = maybeInvokeDelegate(c, n);
            if (u) {
              if (u === y) continue;
              return u;
            }
          }
          if ("next" === n.method) n.sent = n._sent = n.arg;else if ("throw" === n.method) {
            if (o === h) throw o = s, n.arg;
            n.dispatchException(n.arg);
          } else "return" === n.method && n.abrupt("return", n.arg);
          o = f;
          var p = tryCatch(e, r, n);
          if ("normal" === p.type) {
            if (o = n.done ? s : l, p.arg === y) continue;
            return {
              value: p.arg,
              done: n.done
            };
          }
          "throw" === p.type && (o = s, n.method = "throw", n.arg = p.arg);
        }
      };
    }
    function maybeInvokeDelegate(e, r) {
      var n = r.method,
        o = e.iterator[n];
      if (o === t) return r.delegate = null, "throw" === n && e.iterator.return && (r.method = "return", r.arg = t, maybeInvokeDelegate(e, r), "throw" === r.method) || "return" !== n && (r.method = "throw", r.arg = new TypeError("The iterator does not provide a '" + n + "' method")), y;
      var i = tryCatch(o, e.iterator, r.arg);
      if ("throw" === i.type) return r.method = "throw", r.arg = i.arg, r.delegate = null, y;
      var a = i.arg;
      return a ? a.done ? (r[e.resultName] = a.value, r.next = e.nextLoc, "return" !== r.method && (r.method = "next", r.arg = t), r.delegate = null, y) : a : (r.method = "throw", r.arg = new TypeError("iterator result is not an object"), r.delegate = null, y);
    }
    function pushTryEntry(t) {
      var e = {
        tryLoc: t[0]
      };
      1 in t && (e.catchLoc = t[1]), 2 in t && (e.finallyLoc = t[2], e.afterLoc = t[3]), this.tryEntries.push(e);
    }
    function resetTryEntry(t) {
      var e = t.completion || {};
      e.type = "normal", delete e.arg, t.completion = e;
    }
    function Context(t) {
      this.tryEntries = [{
        tryLoc: "root"
      }], t.forEach(pushTryEntry, this), this.reset(!0);
    }
    function values(e) {
      if (e || "" === e) {
        var r = e[a];
        if (r) return r.call(e);
        if ("function" == typeof e.next) return e;
        if (!isNaN(e.length)) {
          var o = -1,
            i = function next() {
              for (; ++o < e.length;) if (n.call(e, o)) return next.value = e[o], next.done = !1, next;
              return next.value = t, next.done = !0, next;
            };
          return i.next = i;
        }
      }
      throw new TypeError(typeof e + " is not iterable");
    }
    return GeneratorFunction.prototype = GeneratorFunctionPrototype, o(g, "constructor", {
      value: GeneratorFunctionPrototype,
      configurable: !0
    }), o(GeneratorFunctionPrototype, "constructor", {
      value: GeneratorFunction,
      configurable: !0
    }), GeneratorFunction.displayName = define(GeneratorFunctionPrototype, u, "GeneratorFunction"), e.isGeneratorFunction = function (t) {
      var e = "function" == typeof t && t.constructor;
      return !!e && (e === GeneratorFunction || "GeneratorFunction" === (e.displayName || e.name));
    }, e.mark = function (t) {
      return Object.setPrototypeOf ? Object.setPrototypeOf(t, GeneratorFunctionPrototype) : (t.__proto__ = GeneratorFunctionPrototype, define(t, u, "GeneratorFunction")), t.prototype = Object.create(g), t;
    }, e.awrap = function (t) {
      return {
        __await: t
      };
    }, defineIteratorMethods(AsyncIterator.prototype), define(AsyncIterator.prototype, c, function () {
      return this;
    }), e.AsyncIterator = AsyncIterator, e.async = function (t, r, n, o, i) {
      void 0 === i && (i = Promise);
      var a = new AsyncIterator(wrap(t, r, n, o), i);
      return e.isGeneratorFunction(r) ? a : a.next().then(function (t) {
        return t.done ? t.value : a.next();
      });
    }, defineIteratorMethods(g), define(g, u, "Generator"), define(g, a, function () {
      return this;
    }), define(g, "toString", function () {
      return "[object Generator]";
    }), e.keys = function (t) {
      var e = Object(t),
        r = [];
      for (var n in e) r.push(n);
      return r.reverse(), function next() {
        for (; r.length;) {
          var t = r.pop();
          if (t in e) return next.value = t, next.done = !1, next;
        }
        return next.done = !0, next;
      };
    }, e.values = values, Context.prototype = {
      constructor: Context,
      reset: function (e) {
        if (this.prev = 0, this.next = 0, this.sent = this._sent = t, this.done = !1, this.delegate = null, this.method = "next", this.arg = t, this.tryEntries.forEach(resetTryEntry), !e) for (var r in this) "t" === r.charAt(0) && n.call(this, r) && !isNaN(+r.slice(1)) && (this[r] = t);
      },
      stop: function () {
        this.done = !0;
        var t = this.tryEntries[0].completion;
        if ("throw" === t.type) throw t.arg;
        return this.rval;
      },
      dispatchException: function (e) {
        if (this.done) throw e;
        var r = this;
        function handle(n, o) {
          return a.type = "throw", a.arg = e, r.next = n, o && (r.method = "next", r.arg = t), !!o;
        }
        for (var o = this.tryEntries.length - 1; o >= 0; --o) {
          var i = this.tryEntries[o],
            a = i.completion;
          if ("root" === i.tryLoc) return handle("end");
          if (i.tryLoc <= this.prev) {
            var c = n.call(i, "catchLoc"),
              u = n.call(i, "finallyLoc");
            if (c && u) {
              if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
              if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
            } else if (c) {
              if (this.prev < i.catchLoc) return handle(i.catchLoc, !0);
            } else {
              if (!u) throw new Error("try statement without catch or finally");
              if (this.prev < i.finallyLoc) return handle(i.finallyLoc);
            }
          }
        }
      },
      abrupt: function (t, e) {
        for (var r = this.tryEntries.length - 1; r >= 0; --r) {
          var o = this.tryEntries[r];
          if (o.tryLoc <= this.prev && n.call(o, "finallyLoc") && this.prev < o.finallyLoc) {
            var i = o;
            break;
          }
        }
        i && ("break" === t || "continue" === t) && i.tryLoc <= e && e <= i.finallyLoc && (i = null);
        var a = i ? i.completion : {};
        return a.type = t, a.arg = e, i ? (this.method = "next", this.next = i.finallyLoc, y) : this.complete(a);
      },
      complete: function (t, e) {
        if ("throw" === t.type) throw t.arg;
        return "break" === t.type || "continue" === t.type ? this.next = t.arg : "return" === t.type ? (this.rval = this.arg = t.arg, this.method = "return", this.next = "end") : "normal" === t.type && e && (this.next = e), y;
      },
      finish: function (t) {
        for (var e = this.tryEntries.length - 1; e >= 0; --e) {
          var r = this.tryEntries[e];
          if (r.finallyLoc === t) return this.complete(r.completion, r.afterLoc), resetTryEntry(r), y;
        }
      },
      catch: function (t) {
        for (var e = this.tryEntries.length - 1; e >= 0; --e) {
          var r = this.tryEntries[e];
          if (r.tryLoc === t) {
            var n = r.completion;
            if ("throw" === n.type) {
              var o = n.arg;
              resetTryEntry(r);
            }
            return o;
          }
        }
        throw new Error("illegal catch attempt");
      },
      delegateYield: function (e, r, n) {
        return this.delegate = {
          iterator: values(e),
          resultName: r,
          nextLoc: n
        }, "next" === this.method && (this.arg = t), y;
      }
    }, e;
  }
  function _typeof(o) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) {
      return typeof o;
    } : function (o) {
      return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o;
    }, _typeof(o);
  }
  function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
    try {
      var info = gen[key](arg);
      var value = info.value;
    } catch (error) {
      reject(error);
      return;
    }
    if (info.done) {
      resolve(value);
    } else {
      Promise.resolve(value).then(_next, _throw);
    }
  }
  function _asyncToGenerator(fn) {
    return function () {
      var self = this,
        args = arguments;
      return new Promise(function (resolve, reject) {
        var gen = fn.apply(self, args);
        function _next(value) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
        }
        function _throw(err) {
          asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
        }
        _next(undefined);
      });
    };
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _defineProperty(obj, key, value) {
    key = _toPropertyKey(key);
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _toConsumableArray(arr) {
    return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _unsupportedIterableToArray(arr) || _nonIterableSpread();
  }
  function _arrayWithoutHoles(arr) {
    if (Array.isArray(arr)) return _arrayLikeToArray(arr);
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _iterableToArray(iter) {
    if (typeof Symbol !== "undefined" && iter[Symbol.iterator] != null || iter["@@iterator"] != null) return Array.from(iter);
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableSpread() {
    throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _createForOfIteratorHelper(o, allowArrayLike) {
    var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
    if (!it) {
      if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
        if (it) o = it;
        var i = 0;
        var F = function () {};
        return {
          s: F,
          n: function () {
            if (i >= o.length) return {
              done: true
            };
            return {
              done: false,
              value: o[i++]
            };
          },
          e: function (e) {
            throw e;
          },
          f: F
        };
      }
      throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
    }
    var normalCompletion = true,
      didErr = false,
      err;
    return {
      s: function () {
        it = it.call(o);
      },
      n: function () {
        var step = it.next();
        normalCompletion = step.done;
        return step;
      },
      e: function (e) {
        didErr = true;
        err = e;
      },
      f: function () {
        try {
          if (!normalCompletion && it.return != null) it.return();
        } finally {
          if (didErr) throw err;
        }
      }
    };
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  /**
   * Holds a reference to a document in the storage.
   * The reference can be swapped using the {Document.set} method,
   * which in turn allows updating documents in the set without removing them.
   * @class
   * @internal
   */
  var Document = /*#__PURE__*/function () {
    /**
     * Creates a new instance. Requires a target document object.
     * @param target {object} the document object to point to.
     * @constructor
     */
    function Document(target) {
      _classCallCheck(this, Document);
      this.set(target);
    }

    /**
     * Returns the referenced document.
     * @method
     * @returns {object}
     */
    _createClass(Document, [{
      key: "get",
      value: function get() {
        return refs.get(this);
      }

      /**
       * Establishes a reference (= points) to the target document object.
       * @method
       * @throws {TypeError} if the document is not of type 'object'
       * @param target {object} the document object to point to
       */
    }, {
      key: "set",
      value: function set(target) {
        if (_typeof(target) !== 'object') {
          throw new TypeError("Expected object, got ".concat(target));
        }
        refs.set(this, target);
      }
    }]);
    return Document;
  }();
  /**
   * Stores the actual reference to the documents.
   * Each reference is keyed by each {Document} instance.
   * @type {WeakMap<object, object>}
   * @private
   */
  var refs = new WeakMap();

  /**
   * Creates a new Document instance by given document object
   * @param doc {object} the document object to reference
   * @return {Document} a Document instance
   */
  var createDocument = function createDocument(doc) {
    return new Document(doc);
  };

  /**
   * Minimal storage interface using a middleware stack.
   * Documentation: https://github.com/jankapunkt/thin-storage
   */
  var ThinStorage = /*#__PURE__*/function () {
    /**
     * creates a new instance
     * @param {object=} options
     * @param {string} [options.set=new Set()] provide your own set, for example to make it observable with Vue refs
     * @param {string} [options.name='storage'] name of this storage, passed to middleware
     * @param {string} [options.primary='id'] primary key property name, passed to middleware
     * @param {function} [options.idGen=function():string] override id generation, applies only if no middleware is used
     * @param {object[]|object} [options.handler=[]] the middleware stack of handlers
     */
    function ThinStorage() {
      var _this = this;
      var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      _classCallCheck(this, ThinStorage);
      this.documents = options.set || new Set();
      this.keys = new Map();
      this.hooks = new Map();
      this.name = options.name || 'storage';
      this.primary = options.primary || 'id';
      this.idGen = options.idGen || incrementKey;
      this.handler = options.handler ? toArray(options.handler) : [];
      this.handler.forEach(function (h) {
        _this.hasInsert = _this.hasInsert || !!h.insert;
        _this.hasUpdate = _this.hasUpdate || !!h.update;
        _this.hasRemove = _this.hasRemove || !!h.remove;
        _this.hasFetch = _this.hasFetch || !!h.fetch;
      });
    }

    /**
     * Adds a new listener function to a given event.
     * @param name {string} name of the event
     * @param fn {function} handler to run on emit
     * @return {function(): *} returns a function to remove the listener
     */
    _createClass(ThinStorage, [{
      key: "on",
      value: function on(name, fn) {
        var _this$hooks$get,
          _this2 = this;
        ((_this$hooks$get = this.hooks.get(name)) === null || _this$hooks$get === void 0 ? void 0 : _this$hooks$get.add(fn)) || this.hooks.set(name, new Set([fn]));
        return function () {
          return _this2.hooks.get(name).remove(fn);
        };
      }

      /**
       * Clears the local documents without informing the middleware.
       * @fires Storage#remove
       * @fires Storage#change
       */
    }, {
      key: "clear",
      value: function clear() {
        this.documents.clear();
        var keys = _toConsumableArray(this.keys.keys());
        this.keys.clear();

        /**
         * remove event.
         *
         * @event Storage#remove
         * @type {object}
         * @property {string[]} keys - the list of removed keys
         */
        emit(this, 'remove', {
          documents: keys
        });

        /**
         * change event.
         *
         * @event Storage#change
         * @type {object}
         * @property {string} type - the type this change is associated with
         */
        emit(this, 'change', {
          type: 'clear'
        });
      }

      /**
       * Retrieves documents from a remote source through
       * handlers. If no handlers implement the fetch method then
       * nothing is retrieved and -1 is returned.
       *
       * @param query {object}
       * @param options {object=}
       * @fires Storage#fetch
       * @fires Storage#change
       * @throws {Error} if any fetched document contains no primary key
       * @return {Promise<number>}
       */
    }, {
      key: "fetch",
      value: function () {
        var _fetch = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee(query, options) {
          var _this3 = this;
          var fetched, fetchOptions, _iterator, _step, handler;
          return _regeneratorRuntime().wrap(function _callee$(_context) {
            while (1) switch (_context.prev = _context.next) {
              case 0:
                if (this.hasFetch) {
                  _context.next = 2;
                  break;
                }
                return _context.abrupt("return", -1);
              case 2:
                fetched = [];
                fetchOptions = _objectSpread2(_objectSpread2({}, options), getOptions(this));
                _iterator = _createForOfIteratorHelper(this.handler);
                _context.prev = 5;
                _iterator.s();
              case 7:
                if ((_step = _iterator.n()).done) {
                  _context.next = 15;
                  break;
                }
                handler = _step.value;
                if (!handler.fetch) {
                  _context.next = 13;
                  break;
                }
                _context.next = 12;
                return handler.fetch(query, fetchOptions, fetched);
              case 12:
                fetched = _context.sent;
              case 13:
                _context.next = 7;
                break;
              case 15:
                _context.next = 20;
                break;
              case 17:
                _context.prev = 17;
                _context.t0 = _context["catch"](5);
                _iterator.e(_context.t0);
              case 20:
                _context.prev = 20;
                _iterator.f();
                return _context.finish(20);
              case 23:
                fetched.forEach(function (doc, i) {
                  var key = doc[_this3.primary];
                  if (!key) {
                    throw new Error("Expected fetched document at index ".concat(i, " to have primary key \"").concat(_this3.primary, "\""));
                  }
                  if (_this3.keys.has(key)) {
                    var original = _this3.keys.get(key);
                    original.set(doc);
                  } else {
                    var wrapped = createDocument(doc);
                    _this3.keys.set(key, wrapped);
                    _this3.documents.add(wrapped);
                  }
                });

                /**
                 * fetch event.
                 *
                 * @event Storage#fetch
                 * @type {object}
                 * @property {object[]} documents - the list of fetched document objects
                 */
                emit(this, 'fetch', {
                  documents: fetched
                });
                emit(this, 'change', {
                  type: 'fetch'
                });
                return _context.abrupt("return", fetched.length);
              case 27:
              case "end":
                return _context.stop();
            }
          }, _callee, this, [[5, 17, 20, 23]]);
        }));
        function fetch(_x, _x2) {
          return _fetch.apply(this, arguments);
        }
        return fetch;
      }()
      /**
       *  Inserts new documents into the storage.
       *
       *  If middleware does not exist, it simply inserts
       *  the documents with a default primary key (incremented number).
       *
       *  Otherwise, it runs the middleware stack on the shallow copies of the docs.
       *  Handlers might even alter the size and the signature of the docs
       *  as long as the last return value is the array with the primary keys
       *  which is also passed as third argument in order to allow
       *  throughput until the end, in case it has been created
       *  before the last handler in the stack.
       *
       *  There is no insert operation, if any middleware throws an error.
       *
       * @param {object|object[]} documents
       * @fires Storage#insert
       * @fires Storage#change
       * @throws {Error} if handler returns a list of primaries with a different length of documents to be inserted
       * @return {Promise<Array.<Object>>}
       */
    }, {
      key: "insert",
      value: function () {
        var _insert = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee2() {
          var _this4 = this;
          var documents,
            local,
            primaries,
            options,
            _iterator2,
            _step2,
            handler,
            i,
            _args2 = arguments;
          return _regeneratorRuntime().wrap(function _callee2$(_context2) {
            while (1) switch (_context2.prev = _context2.next) {
              case 0:
                documents = _args2.length > 0 && _args2[0] !== undefined ? _args2[0] : [];
                documents = toArray(documents);
                local = copy(documents);
                primaries = [];
                if (!this.hasInsert) {
                  _context2.next = 29;
                  break;
                }
                options = getOptions(this);
                _iterator2 = _createForOfIteratorHelper(this.handler);
                _context2.prev = 7;
                _iterator2.s();
              case 9:
                if ((_step2 = _iterator2.n()).done) {
                  _context2.next = 17;
                  break;
                }
                handler = _step2.value;
                if (!handler.insert) {
                  _context2.next = 15;
                  break;
                }
                _context2.next = 14;
                return handler.insert(local, options, primaries);
              case 14:
                primaries = _context2.sent;
              case 15:
                _context2.next = 9;
                break;
              case 17:
                _context2.next = 22;
                break;
              case 19:
                _context2.prev = 19;
                _context2.t0 = _context2["catch"](7);
                _iterator2.e(_context2.t0);
              case 22:
                _context2.prev = 22;
                _iterator2.f();
                return _context2.finish(22);
              case 25:
                if (!(!primaries || primaries.length !== local.length)) {
                  _context2.next = 27;
                  break;
                }
                throw new Error("Insert return values expected to be of length (".concat(primaries.length, "), got (").concat(local.length, ") in storage ").concat(this.name));
              case 27:
                _context2.next = 38;
                break;
              case 29:
                primaries.length = local.length;
                i = 0;
              case 31:
                if (!(i < local.length)) {
                  _context2.next = 38;
                  break;
                }
                _context2.next = 34;
                return this.idGen();
              case 34:
                primaries[i] = _context2.sent;
              case 35:
                i++;
                _context2.next = 31;
                break;
              case 38:
                local.forEach(function (doc, index) {
                  var key = primaries[index];
                  doc[_this4.primary] = key;
                  var wrapped = createDocument(doc);
                  _this4.keys.set(key, wrapped);
                  _this4.documents.add(wrapped);
                });

                /**
                 * insert event.
                 *
                 * @event Storage#insert
                 * @type {object}
                 * @property {object[]} documents - the list of inserted document objects
                 */
                emit(this, 'insert', {
                  documents: local
                });
                emit(this, 'change', {
                  type: 'insert'
                });
                return _context2.abrupt("return", primaries);
              case 42:
              case "end":
                return _context2.stop();
            }
          }, _callee2, this, [[7, 19, 22, 25]]);
        }));
        function insert() {
          return _insert.apply(this, arguments);
        }
        return insert;
      }()
      /**
       * Updates documents by a given query and modifier.
       * If no middleware exists then the update is applied immediately.
       * Otherwise, it runs through all functions in the middleware stack
       * and awaits the updated array as result.
       *
       * The updated array must be the same length as the documents selected.
       * Note: middleware can alter or filter the documents.
       *
       * If a middleware throws an error then there will be no update at all.
       *
       * @param {object} query
       * @param {object} [options={}]
       * @param {boolean} [options.strict=] optional strict mode used to check for equal length queried and updated docs
       * @param {boolean} [options.strict=false]
       * @return {Promise<*>}
       */
    }, {
      key: "update",
      value: function () {
        var _update = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee3(query) {
          var _this5 = this;
          var modifier,
            options,
            local,
            entries,
            updated,
            updateOptions,
            _iterator3,
            _step3,
            handler,
            _args3 = arguments;
          return _regeneratorRuntime().wrap(function _callee3$(_context3) {
            while (1) switch (_context3.prev = _context3.next) {
              case 0:
                modifier = _args3.length > 1 && _args3[1] !== undefined ? _args3[1] : {};
                options = _args3.length > 2 && _args3[2] !== undefined ? _args3[2] : {};
                local = copy(this.find(query, options));
                entries = Object.entries(modifier);
                updated = local.map(function (doc) {
                  var copy = _objectSpread2({}, doc);
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
                  _context3.next = 28;
                  break;
                }
                updateOptions = _objectSpread2(_objectSpread2({}, options), getOptions(this));
                _iterator3 = _createForOfIteratorHelper(this.handler);
                _context3.prev = 8;
                _iterator3.s();
              case 10:
                if ((_step3 = _iterator3.n()).done) {
                  _context3.next = 18;
                  break;
                }
                handler = _step3.value;
                if (!handler.update) {
                  _context3.next = 16;
                  break;
                }
                _context3.next = 15;
                return handler.update(local, modifier, updateOptions, updated);
              case 15:
                updated = _context3.sent;
              case 16:
                _context3.next = 10;
                break;
              case 18:
                _context3.next = 23;
                break;
              case 20:
                _context3.prev = 20;
                _context3.t0 = _context3["catch"](8);
                _iterator3.e(_context3.t0);
              case 23:
                _context3.prev = 23;
                _iterator3.f();
                return _context3.finish(23);
              case 26:
                if (!(options.strict && updated.length !== local.length)) {
                  _context3.next = 28;
                  break;
                }
                throw new Error("Update return values expected to be of length (".concat(local.length, "), got (").concat(updated.length, ") in storage ").concat(this.name));
              case 28:
                updated.forEach(function (doc) {
                  var key = doc[_this5.primary];
                  var wrapped = _this5.keys.get(key);
                  if (!wrapped) {
                    throw new Error("Doc not found by primary key ".concat(key, " in storage ").concat(_this5.name));
                  }
                  wrapped.set(doc);
                });
                emit(this, 'update', {
                  documents: updated
                });
                emit(this, 'change', {
                  type: 'update'
                });
                return _context3.abrupt("return", updated.length);
              case 32:
              case "end":
                return _context3.stop();
            }
          }, _callee3, this, [[8, 20, 23, 26]]);
        }));
        function update(_x3) {
          return _update.apply(this, arguments);
        }
        return update;
      }()
      /**
       * Removes documents from the storage by given query.
       * If a middleware with remove implementation does not exist then the change is applied immediately.
       * @param query {object|string|string[]|function}
       * @param {object} [options={}]
       * @param {boolean} [options.strict=] optional strict mode used to check for equal length queried and removed docs
       * @return {Promise<number>} the number of removed documents
       */
    }, {
      key: "remove",
      value: function () {
        var _remove = _asyncToGenerator( /*#__PURE__*/_regeneratorRuntime().mark(function _callee4(query) {
          var _this6 = this;
          var options,
            local,
            removed,
            removeOptions,
            _iterator4,
            _step4,
            handler,
            _args4 = arguments;
          return _regeneratorRuntime().wrap(function _callee4$(_context4) {
            while (1) switch (_context4.prev = _context4.next) {
              case 0:
                options = _args4.length > 1 && _args4[1] !== undefined ? _args4[1] : {};
                local = copy(this.find(query, options));
                removed = local.map(function (doc) {
                  return doc[_this6.primary];
                });
                if (!this.hasRemove) {
                  _context4.next = 26;
                  break;
                }
                removeOptions = _objectSpread2(_objectSpread2({}, options), getOptions(this));
                _iterator4 = _createForOfIteratorHelper(this.handler);
                _context4.prev = 6;
                _iterator4.s();
              case 8:
                if ((_step4 = _iterator4.n()).done) {
                  _context4.next = 16;
                  break;
                }
                handler = _step4.value;
                if (!handler.remove) {
                  _context4.next = 14;
                  break;
                }
                _context4.next = 13;
                return handler.remove(local, removeOptions, removed);
              case 13:
                removed = _context4.sent;
              case 14:
                _context4.next = 8;
                break;
              case 16:
                _context4.next = 21;
                break;
              case 18:
                _context4.prev = 18;
                _context4.t0 = _context4["catch"](6);
                _iterator4.e(_context4.t0);
              case 21:
                _context4.prev = 21;
                _iterator4.f();
                return _context4.finish(21);
              case 24:
                if (!(options.strict && removed.length !== local.length)) {
                  _context4.next = 26;
                  break;
                }
                throw new Error("Remove return values expected to be of length (".concat(local.length, "), got (").concat(removed.length, ") in storage ").concat(this.name));
              case 26:
                removed.forEach(function (key) {
                  var original = _this6.keys.get(key);
                  if (!original) {
                    throw new Error("Doc not found by primary key ".concat(key, " in storage ").concat(_this6.name));
                  }
                  _this6.documents["delete"](original);
                  _this6.keys["delete"](key);
                });
                emit(this, 'remove', {
                  documents: removed
                });
                emit(this, 'change', {
                  type: 'remove'
                });
                return _context4.abrupt("return", removed.length);
              case 30:
              case "end":
                return _context4.stop();
            }
          }, _callee4, this, [[6, 18, 21, 24]]);
        }));
        function remove(_x4) {
          return _remove.apply(this, arguments);
        }
        return remove;
      }()
      /**
       * Select documents from the set by a given selector pattern (query).
       * @param {object|object[]|string|string[]|function|undefined} query
       * @param {object} [options={}]
       * @param {boolean} [options.loose=] use to check loosely (==) instead of strict (===)
       * @param {number} [options.limit=] limits the amount of documents to add to the result
       * @returns {object[]}
       */
    }, {
      key: "find",
      value: function find(query) {
        var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
        var limit = options.limit,
          loose = options.loose;
        var docs = this.documents;
        if (typeof query === 'undefined' || query === null) {
          return filterDocs({
            docs: docs,
            limit: limit,
            query: function query() {
              return true;
            }
          });
        }
        var isArray = Array.isArray(query);
        var queryType = _typeof(query);
        if (queryType === 'string') {
          // string query is expected to be a primary key
          var doc = this.keys.get(query);
          return doc ? [doc.get()] : [];
        }
        if (queryType === 'function') {
          return filterDocs({
            docs: docs,
            limit: limit,
            query: query
          });
        }
        if (queryType === 'object' && !isArray) {
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
              return toArray(value).some(function (val) {
                return loose ? doc[key] == val // eslint-disable-line
                : doc[key] === val;
              });
            });
          };
          return filterDocs({
            docs: docs,
            limit: limit,
            query: byMatcher
          });
        }
        if (isArray) {
          var subs = new Set();
          var add = function add(doc) {
            return limit > 0 && subs.size >= limit ? undefined : subs.add(doc);
          };
          var _iterator5 = _createForOfIteratorHelper(query),
            _step5;
          try {
            for (_iterator5.s(); !(_step5 = _iterator5.n()).done;) {
              var q = _step5.value;
              // beware this is a recursion, we hope you know what you are doing
              this.find(q, {
                loose: loose
              }).forEach(add);
            }
          } catch (err) {
            _iterator5.e(err);
          } finally {
            _iterator5.f();
          }
          return _toConsumableArray(subs);
        }
        throw new Error("Unsupported query type \"".concat(queryType, "\""));
      }
    }]);
    return ThinStorage;
  }();

  /***********
   * private *
   ***********/

  /**
   * Creates shallow copies of a list of given docs
   * @private
   * @param docs
   * @return {*}
   */
  var copy = function copy(docs) {
    return docs.map(function (doc) {
      return _objectSpread2({}, doc);
    });
  };

  /**
   * Emitter function; extracted, so it can't be invoked from external.
   * @private
   * @param self
   * @param name
   * @param options
   * @return {*|number}
   */
  var emit = function emit(self, name, options) {
    var hooks = self.hooks.get(name);
    return hooks && setTimeout(function () {
      return hooks.forEach(function (hook) {
        return hook(options);
      });
    }, 0);
  };
  /**
   * Extracts relevant properties to create options object
   * @private
   * @param primary
   * @param name
   * @return {{name, primary}}
   */
  var getOptions = function getOptions(_ref5) {
    var primary = _ref5.primary,
      name = _ref5.name;
    return {
      primary: primary,
      name: name
    };
  };

  /**
   * Applies query to each document and adds the document to the list,
   * if conditions apply and (optional) limit is not reached.
   * @private
   * @param docs
   * @param query
   * @param limit
   * @return {object[]}
   */
  var filterDocs = function filterDocs(_ref6) {
    var docs = _ref6.docs,
      query = _ref6.query,
      limit = _ref6.limit;
    var filtered = [];
    var _iterator6 = _createForOfIteratorHelper(docs),
      _step6;
    try {
      for (_iterator6.s(); !(_step6 = _iterator6.n()).done;) {
        var wrapped = _step6.value;
        var doc = wrapped.get();
        if (query(doc)) {
          filtered.push(doc);
        }
        if (limit > 0 && filtered.length >= limit) {
          return filtered;
        }
      }
    } catch (err) {
      _iterator6.e(err);
    } finally {
      _iterator6.f();
    }
    return filtered;
  };
  /**
   * Transform any incoming argument to an array.
   * @private
   * @param x {*}
   * @return {Array.<*>}
   */
  var toArray = function toArray(x) {
    return typeof x === 'undefined' ? [] : Array.isArray(x) ? x : [x];
  };
  var incrementKey = function (count) {
    return function () {
      var length = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 16;
      return (++count).toString(10).padStart(length, '0');
    };
  }(0);

  exports.ThinStorage = ThinStorage;

  return exports;

})({});
//# sourceMappingURL=ThinStorage.iife.js.map
