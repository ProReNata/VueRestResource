/*!
{
  "copywrite": "Copyright (c) 2017-present, ProReNata AB",
  "date": "2020-03-12T20:37:19.746Z",
  "describe": "",
  "description": "Rest resource management for Vue.js and Vuex projects",
  "file": "vue-rest-resource.js",
  "hash": "d0fc56e6c68ccbc76e59",
  "license": "MIT",
  "version": "1.1.2"
}
*/
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["VueRestResource"] = factory();
	else
		root["VueRestResource"] = factory();
})((function() {
  'use strict';

  if (typeof self !== 'undefined') {
    return self;
  }

  if (typeof window !== 'undefined') {
    return window;
  }

  if (typeof global !== 'undefined') {
    return global;
  }

  return Function('return this')();
}()), function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 16);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var bind = __webpack_require__(6);

/*global toString:true*/

// utils is a library of generic helper functions non-specific to axios

var toString = Object.prototype.toString;

/**
 * Determine if a value is an Array
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Array, otherwise false
 */
function isArray(val) {
  return toString.call(val) === '[object Array]';
}

/**
 * Determine if a value is undefined
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if the value is undefined, otherwise false
 */
function isUndefined(val) {
  return typeof val === 'undefined';
}

/**
 * Determine if a value is a Buffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Buffer, otherwise false
 */
function isBuffer(val) {
  return val !== null && !isUndefined(val) && val.constructor !== null && !isUndefined(val.constructor)
    && typeof val.constructor.isBuffer === 'function' && val.constructor.isBuffer(val);
}

/**
 * Determine if a value is an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an ArrayBuffer, otherwise false
 */
function isArrayBuffer(val) {
  return toString.call(val) === '[object ArrayBuffer]';
}

/**
 * Determine if a value is a FormData
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an FormData, otherwise false
 */
function isFormData(val) {
  return (typeof FormData !== 'undefined') && (val instanceof FormData);
}

/**
 * Determine if a value is a view on an ArrayBuffer
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a view on an ArrayBuffer, otherwise false
 */
function isArrayBufferView(val) {
  var result;
  if ((typeof ArrayBuffer !== 'undefined') && (ArrayBuffer.isView)) {
    result = ArrayBuffer.isView(val);
  } else {
    result = (val) && (val.buffer) && (val.buffer instanceof ArrayBuffer);
  }
  return result;
}

/**
 * Determine if a value is a String
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a String, otherwise false
 */
function isString(val) {
  return typeof val === 'string';
}

/**
 * Determine if a value is a Number
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Number, otherwise false
 */
function isNumber(val) {
  return typeof val === 'number';
}

/**
 * Determine if a value is an Object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is an Object, otherwise false
 */
function isObject(val) {
  return val !== null && typeof val === 'object';
}

/**
 * Determine if a value is a Date
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Date, otherwise false
 */
function isDate(val) {
  return toString.call(val) === '[object Date]';
}

/**
 * Determine if a value is a File
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a File, otherwise false
 */
function isFile(val) {
  return toString.call(val) === '[object File]';
}

/**
 * Determine if a value is a Blob
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Blob, otherwise false
 */
function isBlob(val) {
  return toString.call(val) === '[object Blob]';
}

/**
 * Determine if a value is a Function
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Function, otherwise false
 */
function isFunction(val) {
  return toString.call(val) === '[object Function]';
}

/**
 * Determine if a value is a Stream
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a Stream, otherwise false
 */
function isStream(val) {
  return isObject(val) && isFunction(val.pipe);
}

/**
 * Determine if a value is a URLSearchParams object
 *
 * @param {Object} val The value to test
 * @returns {boolean} True if value is a URLSearchParams object, otherwise false
 */
function isURLSearchParams(val) {
  return typeof URLSearchParams !== 'undefined' && val instanceof URLSearchParams;
}

/**
 * Trim excess whitespace off the beginning and end of a string
 *
 * @param {String} str The String to trim
 * @returns {String} The String freed of excess whitespace
 */
function trim(str) {
  return str.replace(/^\s*/, '').replace(/\s*$/, '');
}

/**
 * Determine if we're running in a standard browser environment
 *
 * This allows axios to run in a web worker, and react-native.
 * Both environments support XMLHttpRequest, but not fully standard globals.
 *
 * web workers:
 *  typeof window -> undefined
 *  typeof document -> undefined
 *
 * react-native:
 *  navigator.product -> 'ReactNative'
 * nativescript
 *  navigator.product -> 'NativeScript' or 'NS'
 */
function isStandardBrowserEnv() {
  if (typeof navigator !== 'undefined' && (navigator.product === 'ReactNative' ||
                                           navigator.product === 'NativeScript' ||
                                           navigator.product === 'NS')) {
    return false;
  }
  return (
    typeof window !== 'undefined' &&
    typeof document !== 'undefined'
  );
}

/**
 * Iterate over an Array or an Object invoking a function for each item.
 *
 * If `obj` is an Array callback will be called passing
 * the value, index, and complete array for each item.
 *
 * If 'obj' is an Object callback will be called passing
 * the value, key, and complete object for each property.
 *
 * @param {Object|Array} obj The object to iterate
 * @param {Function} fn The callback to invoke for each item
 */
function forEach(obj, fn) {
  // Don't bother if no value provided
  if (obj === null || typeof obj === 'undefined') {
    return;
  }

  // Force an array if not already something iterable
  if (typeof obj !== 'object') {
    /*eslint no-param-reassign:0*/
    obj = [obj];
  }

  if (isArray(obj)) {
    // Iterate over array values
    for (var i = 0, l = obj.length; i < l; i++) {
      fn.call(null, obj[i], i, obj);
    }
  } else {
    // Iterate over object keys
    for (var key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        fn.call(null, obj[key], key, obj);
      }
    }
  }
}

/**
 * Accepts varargs expecting each argument to be an object, then
 * immutably merges the properties of each object and returns result.
 *
 * When multiple objects contain the same key the later object in
 * the arguments list will take precedence.
 *
 * Example:
 *
 * ```js
 * var result = merge({foo: 123}, {foo: 456});
 * console.log(result.foo); // outputs 456
 * ```
 *
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function merge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = merge(result[key], val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Function equal to merge with the difference being that no reference
 * to original objects is kept.
 *
 * @see merge
 * @param {Object} obj1 Object to merge
 * @returns {Object} Result of all merge properties
 */
function deepMerge(/* obj1, obj2, obj3, ... */) {
  var result = {};
  function assignValue(val, key) {
    if (typeof result[key] === 'object' && typeof val === 'object') {
      result[key] = deepMerge(result[key], val);
    } else if (typeof val === 'object') {
      result[key] = deepMerge({}, val);
    } else {
      result[key] = val;
    }
  }

  for (var i = 0, l = arguments.length; i < l; i++) {
    forEach(arguments[i], assignValue);
  }
  return result;
}

/**
 * Extends object a by mutably adding to it the properties of object b.
 *
 * @param {Object} a The object to be extended
 * @param {Object} b The object to copy properties from
 * @param {Object} thisArg The object to bind function to
 * @return {Object} The resulting value of object a
 */
function extend(a, b, thisArg) {
  forEach(b, function assignValue(val, key) {
    if (thisArg && typeof val === 'function') {
      a[key] = bind(val, thisArg);
    } else {
      a[key] = val;
    }
  });
  return a;
}

module.exports = {
  isArray: isArray,
  isArrayBuffer: isArrayBuffer,
  isBuffer: isBuffer,
  isFormData: isFormData,
  isArrayBufferView: isArrayBufferView,
  isString: isString,
  isNumber: isNumber,
  isObject: isObject,
  isUndefined: isUndefined,
  isDate: isDate,
  isFile: isFile,
  isBlob: isBlob,
  isFunction: isFunction,
  isStream: isStream,
  isURLSearchParams: isURLSearchParams,
  isStandardBrowserEnv: isStandardBrowserEnv,
  forEach: forEach,
  merge: merge,
  deepMerge: deepMerge,
  extend: extend,
  trim: trim
};


/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _constants = _interopRequireDefault(__webpack_require__(2));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

var componentRegisterMap = {};
var indexCounter = 0;
var initialInstanceId = _constants.default.initialInstanceId;
/*
The logic of idsAssignedWithoutInstance is only to track if there are no bugs.
We could remove it since it produces no value but we keep it so we can track errors in buggy cases
*/

var idsAssignedWithoutInstance = [];
var _default = {
  add: function add(instance) {
    var _this = this;

    if (!instance) {
      // lets return early since the instance is not compulsory
      indexCounter += 1;
      idsAssignedWithoutInstance.push(String(indexCounter));
      return String(indexCounter);
    }

    var instanceId = Object.keys(componentRegisterMap).find(function (uuid) {
      _newArrowCheck(this, _this);

      return componentRegisterMap[uuid] === instance;
    }.bind(this));

    if (instanceId) {
      // its already there, lets not override it
      return instanceId;
    }

    indexCounter += 1;
    componentRegisterMap[indexCounter] = instance;
    return String(indexCounter);
  },
  delete: function _delete(instanceId) {
    var idHasNoInstance = idsAssignedWithoutInstance.includes(instanceId);

    if (idHasNoInstance) {
      idsAssignedWithoutInstance.splice(idsAssignedWithoutInstance.indexOf(instanceId), 1);
    }

    componentRegisterMap[instanceId] = null;
    delete componentRegisterMap[instanceId];
  },
  get: function get(instanceId) {
    if (instanceId === initialInstanceId) {
      return undefined;
    }

    return componentRegisterMap[instanceId];
  }
};
exports.default = _default;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var constants = Object.defineProperties({}, {
  initialInstanceId: {
    value: {},
    writable: false
  },
  noValueFound: {
    value: {},
    writable: false
  }
});
var _default = constants;
exports.default = _default;

/***/ }),
/* 3 */
/***/ (function(module, exports) {

/**
 * Checks if `value` is classified as an `Array` object.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an array, else `false`.
 * @example
 *
 * _.isArray([1, 2, 3]);
 * // => true
 *
 * _.isArray(document.body.children);
 * // => false
 *
 * _.isArray('abc');
 * // => false
 *
 * _.isArray(_.noop);
 * // => false
 */
var isArray = Array.isArray;

module.exports = isArray;


/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _axios = _interopRequireDefault(__webpack_require__(5));

var _this = void 0;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

var defaultResourceHandlers = {
  create: function create(response) {
    _newArrowCheck(this, _this);

    return response.data;
  }.bind(void 0),
  get: function get(response) {
    _newArrowCheck(this, _this);

    return response.data;
  }.bind(void 0),
  list: function list(response) {
    _newArrowCheck(this, _this);

    return response.data.objects;
  }.bind(void 0),
  update: function update(response) {
    _newArrowCheck(this, _this);

    return response.data;
  }.bind(void 0),
  remote: function remote(response) {
    _newArrowCheck(this, _this);

    return response.data;
  }.bind(void 0)
};

var _default =
/*#__PURE__*/
function () {
  function _default(resource, config) {
    _classCallCheck(this, _default);

    this.handler = _objectSpread({}, defaultResourceHandlers, {}, resource.handler || {});
    this.errorHandler = config.errorHandler;
    this.baseUrl = config.baseUrl;
    this.slowTimeout = config.slowTimeout || 2000;
    this.failedTimeout = config.failedTimeout || 15000;
    this.apiModel = resource.apiModel;
    this.apiModule = resource.apiModule;
    this.endpoint = "".concat([this.baseUrl, this.apiModule, this.apiModel].filter(Boolean).join('/').toLowerCase(), "/");
    this.defaultParams = config.defaultParams;
    this.httpHeaders = {
      headers: config.httpHeaders
    };
    this.resource = resource;
    this.actionObjectDefault = {
      apiModel: this.apiModel,
      apiModule: this.apiModule
    };
  }

  _createClass(_default, [{
    key: "get",
    value: function get(callerInstance, id) {
      var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var cb = arguments.length > 3 ? arguments[3] : undefined;

      var resources = _objectSpread({}, this.actionObjectDefault, {
        callback: cb,
        endpoint: "".concat(this.endpoint + id, "/"),
        handler: this.handler.get,
        callerInstance: callerInstance
      });

      return this.dispatch('get', resources, {
        headers: this.httpHeaders,
        params: _objectSpread({}, data, {}, this.defaultParams)
      }).catch(this.errorHandler);
    }
  }, {
    key: "list",
    value: function list(callerInstance) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var cb = arguments.length > 2 ? arguments[2] : undefined;

      var resources = _objectSpread({}, this.actionObjectDefault, {
        callback: cb,
        endpoint: this.endpoint,
        handler: this.handler.list,
        callerInstance: callerInstance
      });

      var resp = this.dispatch('list', resources, _objectSpread({}, this.httpHeaders, {
        params: _objectSpread({}, data, {}, this.defaultParams)
      })).catch(this.errorHandler);
      return resp;
    }
  }, {
    key: "create",
    value: function create(callerInstance) {
      var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
      var cb = arguments.length > 2 ? arguments[2] : undefined;

      var resources = _objectSpread({}, this.actionObjectDefault, {
        callback: cb,
        endpoint: this.endpoint,
        handler: this.handler.create,
        callerInstance: callerInstance
      });

      return this.dispatch('post', resources, data, _objectSpread({}, this.httpHeaders)).catch(this.errorHandler);
    }
  }, {
    key: "update",
    value: function update(callerInstance, id) {
      var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var cb = arguments.length > 3 ? arguments[3] : undefined;

      var resources = _objectSpread({}, this.actionObjectDefault, {
        callback: cb,
        endpoint: "".concat(this.endpoint + id, "/"),
        handler: this.handler.update,
        callerInstance: callerInstance
      });

      return this.dispatch('put', resources, data, _objectSpread({}, this.httpHeaders)).catch(this.errorHandler);
    }
  }, {
    key: "delete",
    value: function _delete(callerInstance, id, cb) {
      var _this2 = this;

      var resources = _objectSpread({}, this.actionObjectDefault, {
        callback: cb,
        deletedId: id,
        endpoint: "".concat(this.endpoint + id, "/"),
        handler: this.handler.delete || function () {
          _newArrowCheck(this, _this2);

          return id;
        }.bind(this),
        callerInstance: callerInstance
      });

      return this.dispatch('delete', resources, _objectSpread({}, this.httpHeaders)).catch(this.errorHandler);
    }
  }, {
    key: "remoteAction",
    value: function remoteAction(callerInstance, id) {
      var data = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
      var options = this.resource.remoteAction(this, id, data, this.actionObjectDefault);

      if (!options.handler) {
        options.handler = defaultResourceHandlers.remote;
      }

      options.callerInstance = callerInstance;
      return this.dispatch(this.resource.httpMethod, options, data, {
        headers: _objectSpread({}, this.httpHeaders.headers, {
          'Content-Type': 'application/json'
        })
      }).catch(this.errorHandler);
    } // dispatch for de-coupled components

  }, {
    key: "dispatch",
    value: function dispatch(action, _ref) {
      var _this3 = this;

      var endpoint = _ref.endpoint,
          handler = _ref.handler;

      /*
       * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
       *     This class method is only for components that           *
       *     need to speak with server de-coupled from store.        *
       *     Rule is: all Components should instantiate methods.js   *
       * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * * *
       */
      var actionType = action === 'list' ? 'get' : action; // axios has no 'list'

      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      var ajax = _axios.default[actionType].apply(_axios.default, [endpoint].concat(args));

      return ajax.then(function (res) {
        _newArrowCheck(this, _this3);

        return handler(res);
      }.bind(this));
    }
  }]);

  return _default;
}();

exports.default = _default;

/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(18);

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function bind(fn, thisArg) {
  return function wrap() {
    var args = new Array(arguments.length);
    for (var i = 0; i < args.length; i++) {
      args[i] = arguments[i];
    }
    return fn.apply(thisArg, args);
  };
};


/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

function encode(val) {
  return encodeURIComponent(val).
    replace(/%40/gi, '@').
    replace(/%3A/gi, ':').
    replace(/%24/g, '$').
    replace(/%2C/gi, ',').
    replace(/%20/g, '+').
    replace(/%5B/gi, '[').
    replace(/%5D/gi, ']');
}

/**
 * Build a URL by appending params to the end
 *
 * @param {string} url The base of the url (e.g., http://www.google.com)
 * @param {object} [params] The params to be appended
 * @returns {string} The formatted url
 */
module.exports = function buildURL(url, params, paramsSerializer) {
  /*eslint no-param-reassign:0*/
  if (!params) {
    return url;
  }

  var serializedParams;
  if (paramsSerializer) {
    serializedParams = paramsSerializer(params);
  } else if (utils.isURLSearchParams(params)) {
    serializedParams = params.toString();
  } else {
    var parts = [];

    utils.forEach(params, function serialize(val, key) {
      if (val === null || typeof val === 'undefined') {
        return;
      }

      if (utils.isArray(val)) {
        key = key + '[]';
      } else {
        val = [val];
      }

      utils.forEach(val, function parseValue(v) {
        if (utils.isDate(v)) {
          v = v.toISOString();
        } else if (utils.isObject(v)) {
          v = JSON.stringify(v);
        }
        parts.push(encode(key) + '=' + encode(v));
      });
    });

    serializedParams = parts.join('&');
  }

  if (serializedParams) {
    var hashmarkIndex = url.indexOf('#');
    if (hashmarkIndex !== -1) {
      url = url.slice(0, hashmarkIndex);
    }

    url += (url.indexOf('?') === -1 ? '?' : '&') + serializedParams;
  }

  return url;
};


/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = function isCancel(value) {
  return !!(value && value.__CANCEL__);
};


/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

var utils = __webpack_require__(0);
var normalizeHeaderName = __webpack_require__(24);

var DEFAULT_CONTENT_TYPE = {
  'Content-Type': 'application/x-www-form-urlencoded'
};

function setContentTypeIfUnset(headers, value) {
  if (!utils.isUndefined(headers) && utils.isUndefined(headers['Content-Type'])) {
    headers['Content-Type'] = value;
  }
}

function getDefaultAdapter() {
  var adapter;
  if (typeof XMLHttpRequest !== 'undefined') {
    // For browsers use XHR adapter
    adapter = __webpack_require__(10);
  } else if (typeof process !== 'undefined' && Object.prototype.toString.call(process) === '[object process]') {
    // For node use HTTP adapter
    adapter = __webpack_require__(10);
  }
  return adapter;
}

var defaults = {
  adapter: getDefaultAdapter(),

  transformRequest: [function transformRequest(data, headers) {
    normalizeHeaderName(headers, 'Accept');
    normalizeHeaderName(headers, 'Content-Type');
    if (utils.isFormData(data) ||
      utils.isArrayBuffer(data) ||
      utils.isBuffer(data) ||
      utils.isStream(data) ||
      utils.isFile(data) ||
      utils.isBlob(data)
    ) {
      return data;
    }
    if (utils.isArrayBufferView(data)) {
      return data.buffer;
    }
    if (utils.isURLSearchParams(data)) {
      setContentTypeIfUnset(headers, 'application/x-www-form-urlencoded;charset=utf-8');
      return data.toString();
    }
    if (utils.isObject(data)) {
      setContentTypeIfUnset(headers, 'application/json;charset=utf-8');
      return JSON.stringify(data);
    }
    return data;
  }],

  transformResponse: [function transformResponse(data) {
    /*eslint no-param-reassign:0*/
    if (typeof data === 'string') {
      try {
        data = JSON.parse(data);
      } catch (e) { /* Ignore */ }
    }
    return data;
  }],

  /**
   * A timeout in milliseconds to abort a request. If set to 0 (default) a
   * timeout is not created.
   */
  timeout: 0,

  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',

  maxContentLength: -1,

  validateStatus: function validateStatus(status) {
    return status >= 200 && status < 300;
  }
};

defaults.headers = {
  common: {
    'Accept': 'application/json, text/plain, */*'
  }
};

utils.forEach(['delete', 'get', 'head'], function forEachMethodNoData(method) {
  defaults.headers[method] = {};
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  defaults.headers[method] = utils.merge(DEFAULT_CONTENT_TYPE);
});

module.exports = defaults;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(23)))

/***/ }),
/* 10 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);
var settle = __webpack_require__(25);
var buildURL = __webpack_require__(7);
var buildFullPath = __webpack_require__(27);
var parseHeaders = __webpack_require__(30);
var isURLSameOrigin = __webpack_require__(31);
var createError = __webpack_require__(11);

module.exports = function xhrAdapter(config) {
  return new Promise(function dispatchXhrRequest(resolve, reject) {
    var requestData = config.data;
    var requestHeaders = config.headers;

    if (utils.isFormData(requestData)) {
      delete requestHeaders['Content-Type']; // Let the browser set it
    }

    var request = new XMLHttpRequest();

    // HTTP basic authentication
    if (config.auth) {
      var username = config.auth.username || '';
      var password = config.auth.password || '';
      requestHeaders.Authorization = 'Basic ' + btoa(username + ':' + password);
    }

    var fullPath = buildFullPath(config.baseURL, config.url);
    request.open(config.method.toUpperCase(), buildURL(fullPath, config.params, config.paramsSerializer), true);

    // Set the request timeout in MS
    request.timeout = config.timeout;

    // Listen for ready state
    request.onreadystatechange = function handleLoad() {
      if (!request || request.readyState !== 4) {
        return;
      }

      // The request errored out and we didn't get a response, this will be
      // handled by onerror instead
      // With one exception: request that using file: protocol, most browsers
      // will return status as 0 even though it's a successful request
      if (request.status === 0 && !(request.responseURL && request.responseURL.indexOf('file:') === 0)) {
        return;
      }

      // Prepare the response
      var responseHeaders = 'getAllResponseHeaders' in request ? parseHeaders(request.getAllResponseHeaders()) : null;
      var responseData = !config.responseType || config.responseType === 'text' ? request.responseText : request.response;
      var response = {
        data: responseData,
        status: request.status,
        statusText: request.statusText,
        headers: responseHeaders,
        config: config,
        request: request
      };

      settle(resolve, reject, response);

      // Clean up request
      request = null;
    };

    // Handle browser request cancellation (as opposed to a manual cancellation)
    request.onabort = function handleAbort() {
      if (!request) {
        return;
      }

      reject(createError('Request aborted', config, 'ECONNABORTED', request));

      // Clean up request
      request = null;
    };

    // Handle low level network errors
    request.onerror = function handleError() {
      // Real errors are hidden from us by the browser
      // onerror should only fire if it's a network error
      reject(createError('Network Error', config, null, request));

      // Clean up request
      request = null;
    };

    // Handle timeout
    request.ontimeout = function handleTimeout() {
      var timeoutErrorMessage = 'timeout of ' + config.timeout + 'ms exceeded';
      if (config.timeoutErrorMessage) {
        timeoutErrorMessage = config.timeoutErrorMessage;
      }
      reject(createError(timeoutErrorMessage, config, 'ECONNABORTED',
        request));

      // Clean up request
      request = null;
    };

    // Add xsrf header
    // This is only done if running in a standard browser environment.
    // Specifically not if we're in a web worker, or react-native.
    if (utils.isStandardBrowserEnv()) {
      var cookies = __webpack_require__(32);

      // Add xsrf header
      var xsrfValue = (config.withCredentials || isURLSameOrigin(fullPath)) && config.xsrfCookieName ?
        cookies.read(config.xsrfCookieName) :
        undefined;

      if (xsrfValue) {
        requestHeaders[config.xsrfHeaderName] = xsrfValue;
      }
    }

    // Add headers to the request
    if ('setRequestHeader' in request) {
      utils.forEach(requestHeaders, function setRequestHeader(val, key) {
        if (typeof requestData === 'undefined' && key.toLowerCase() === 'content-type') {
          // Remove Content-Type if data is undefined
          delete requestHeaders[key];
        } else {
          // Otherwise add header to the request
          request.setRequestHeader(key, val);
        }
      });
    }

    // Add withCredentials to request if needed
    if (!utils.isUndefined(config.withCredentials)) {
      request.withCredentials = !!config.withCredentials;
    }

    // Add responseType to request if needed
    if (config.responseType) {
      try {
        request.responseType = config.responseType;
      } catch (e) {
        // Expected DOMException thrown by browsers not compatible XMLHttpRequest Level 2.
        // But, this can be suppressed for 'json' type as it can be parsed by default 'transformResponse' function.
        if (config.responseType !== 'json') {
          throw e;
        }
      }
    }

    // Handle progress if needed
    if (typeof config.onDownloadProgress === 'function') {
      request.addEventListener('progress', config.onDownloadProgress);
    }

    // Not all browsers support upload events
    if (typeof config.onUploadProgress === 'function' && request.upload) {
      request.upload.addEventListener('progress', config.onUploadProgress);
    }

    if (config.cancelToken) {
      // Handle cancellation
      config.cancelToken.promise.then(function onCanceled(cancel) {
        if (!request) {
          return;
        }

        request.abort();
        reject(cancel);
        // Clean up request
        request = null;
      });
    }

    if (requestData === undefined) {
      requestData = null;
    }

    // Send the request
    request.send(requestData);
  });
};


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var enhanceError = __webpack_require__(26);

/**
 * Create an Error with the specified message, config, error code, request and response.
 *
 * @param {string} message The error message.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The created error.
 */
module.exports = function createError(message, config, code, request, response) {
  var error = new Error(message);
  return enhanceError(error, config, code, request, response);
};


/***/ }),
/* 12 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

/**
 * Config-specific merge-function which creates a new config-object
 * by merging two configuration objects together.
 *
 * @param {Object} config1
 * @param {Object} config2
 * @returns {Object} New object resulting from merging config2 to config1
 */
module.exports = function mergeConfig(config1, config2) {
  // eslint-disable-next-line no-param-reassign
  config2 = config2 || {};
  var config = {};

  var valueFromConfig2Keys = ['url', 'method', 'params', 'data'];
  var mergeDeepPropertiesKeys = ['headers', 'auth', 'proxy'];
  var defaultToConfig2Keys = [
    'baseURL', 'url', 'transformRequest', 'transformResponse', 'paramsSerializer',
    'timeout', 'withCredentials', 'adapter', 'responseType', 'xsrfCookieName',
    'xsrfHeaderName', 'onUploadProgress', 'onDownloadProgress',
    'maxContentLength', 'validateStatus', 'maxRedirects', 'httpAgent',
    'httpsAgent', 'cancelToken', 'socketPath'
  ];

  utils.forEach(valueFromConfig2Keys, function valueFromConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    }
  });

  utils.forEach(mergeDeepPropertiesKeys, function mergeDeepProperties(prop) {
    if (utils.isObject(config2[prop])) {
      config[prop] = utils.deepMerge(config1[prop], config2[prop]);
    } else if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (utils.isObject(config1[prop])) {
      config[prop] = utils.deepMerge(config1[prop]);
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  utils.forEach(defaultToConfig2Keys, function defaultToConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  var axiosKeys = valueFromConfig2Keys
    .concat(mergeDeepPropertiesKeys)
    .concat(defaultToConfig2Keys);

  var otherKeys = Object
    .keys(config2)
    .filter(function filterAxiosKeys(key) {
      return axiosKeys.indexOf(key) === -1;
    });

  utils.forEach(otherKeys, function otherKeysDefaultToConfig2(prop) {
    if (typeof config2[prop] !== 'undefined') {
      config[prop] = config2[prop];
    } else if (typeof config1[prop] !== 'undefined') {
      config[prop] = config1[prop];
    }
  });

  return config;
};


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * A `Cancel` is an object that is thrown when an operation is canceled.
 *
 * @class
 * @param {string=} message The message.
 */
function Cancel(message) {
  this.message = message;
}

Cancel.prototype.toString = function toString() {
  return 'Cancel' + (this.message ? ': ' + this.message : '');
};

Cancel.prototype.__CANCEL__ = true;

module.exports = Cancel;


/***/ }),
/* 14 */
/***/ (function(module, exports) {

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;


/***/ }),
/* 15 */
/***/ (function(module, exports) {

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;


/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(17);


/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _methods = _interopRequireDefault(__webpack_require__(4));

var _http = _interopRequireDefault(__webpack_require__(35));

var _helpers = _interopRequireDefault(__webpack_require__(37));

var _requestsStore = _interopRequireDefault(__webpack_require__(47));

var _storeBoilerplateGenerators = _interopRequireDefault(__webpack_require__(49));

var _moduleName = _interopRequireDefault(__webpack_require__(61));

var _this = void 0;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

var mergeOptions = function mergeOptions(original) {
  var _this2 = this;

  _newArrowCheck(this, _this);

  var defaults = {
    logEndpoints: true,
    logInstance: true,
    vrrModuleName: _moduleName.default,
    errorHandler: function errorHandler(err) {
      _newArrowCheck(this, _this2);

      return console.log('VRR error, logging to the console since no handler was provided.', err);
    }.bind(this)
  };
  return Object.keys(original).reduce(function (obj, key) {
    _newArrowCheck(this, _this2);

    return _objectSpread({}, obj, _defineProperty({}, key, original[key]));
  }.bind(this), defaults);
}.bind(void 0);

var _default = {
  createVueRestResource: function createVueRestResource(config) {
    var options = mergeOptions(config);
    var store = options.store,
        vrrModuleName = options.vrrModuleName;
    store.registerModule(vrrModuleName, (0, _requestsStore.default)());
    return _objectSpread({
      HTTP:
      /*#__PURE__*/
      function (_HTTP2) {
        _inherits(HTTP, _HTTP2);

        function HTTP(resource) {
          _classCallCheck(this, HTTP);

          return _possibleConstructorReturn(this, _getPrototypeOf(HTTP).call(this, resource, options));
        }

        return HTTP;
      }(_methods.default),
      registerResource: function registerResource(resource, customStore) {
        var _this3 = this;

        // if null, we turn it off on purpose
        if (customStore !== null) {
          var moduleName = resource.__name;

          var moduleStore = customStore || _objectSpread({}, (0, _storeBoilerplateGenerators.default)(resource), {
            namespaced: moduleName !== ''
          });

          store.registerModule(moduleName, moduleStore);
        }

        return Object.keys(resource).filter(function (k) {
          _newArrowCheck(this, _this3);

          return k[0] !== '_';
        }.bind(this)).reduce(function (Api, model) {
          _newArrowCheck(this, _this3);

          return _objectSpread({}, Api, _defineProperty({}, model, new _http.default(resource[model], options)));
        }.bind(this), {});
      }
    }, (0, _helpers.default)(options));
  },
  storeBoilerplateGenerators: _storeBoilerplateGenerators.default
};
exports.default = _default;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);
var bind = __webpack_require__(6);
var Axios = __webpack_require__(19);
var mergeConfig = __webpack_require__(12);
var defaults = __webpack_require__(9);

/**
 * Create an instance of Axios
 *
 * @param {Object} defaultConfig The default config for the instance
 * @return {Axios} A new instance of Axios
 */
function createInstance(defaultConfig) {
  var context = new Axios(defaultConfig);
  var instance = bind(Axios.prototype.request, context);

  // Copy axios.prototype to instance
  utils.extend(instance, Axios.prototype, context);

  // Copy context to instance
  utils.extend(instance, context);

  return instance;
}

// Create the default instance to be exported
var axios = createInstance(defaults);

// Expose Axios class to allow class inheritance
axios.Axios = Axios;

// Factory for creating new instances
axios.create = function create(instanceConfig) {
  return createInstance(mergeConfig(axios.defaults, instanceConfig));
};

// Expose Cancel & CancelToken
axios.Cancel = __webpack_require__(13);
axios.CancelToken = __webpack_require__(33);
axios.isCancel = __webpack_require__(8);

// Expose all/spread
axios.all = function all(promises) {
  return Promise.all(promises);
};
axios.spread = __webpack_require__(34);

module.exports = axios;

// Allow use of default import syntax in TypeScript
module.exports.default = axios;


/***/ }),
/* 19 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);
var buildURL = __webpack_require__(7);
var InterceptorManager = __webpack_require__(20);
var dispatchRequest = __webpack_require__(21);
var mergeConfig = __webpack_require__(12);

/**
 * Create a new instance of Axios
 *
 * @param {Object} instanceConfig The default config for the instance
 */
function Axios(instanceConfig) {
  this.defaults = instanceConfig;
  this.interceptors = {
    request: new InterceptorManager(),
    response: new InterceptorManager()
  };
}

/**
 * Dispatch a request
 *
 * @param {Object} config The config specific for this request (merged with this.defaults)
 */
Axios.prototype.request = function request(config) {
  /*eslint no-param-reassign:0*/
  // Allow for axios('example/url'[, config]) a la fetch API
  if (typeof config === 'string') {
    config = arguments[1] || {};
    config.url = arguments[0];
  } else {
    config = config || {};
  }

  config = mergeConfig(this.defaults, config);

  // Set config.method
  if (config.method) {
    config.method = config.method.toLowerCase();
  } else if (this.defaults.method) {
    config.method = this.defaults.method.toLowerCase();
  } else {
    config.method = 'get';
  }

  // Hook up interceptors middleware
  var chain = [dispatchRequest, undefined];
  var promise = Promise.resolve(config);

  this.interceptors.request.forEach(function unshiftRequestInterceptors(interceptor) {
    chain.unshift(interceptor.fulfilled, interceptor.rejected);
  });

  this.interceptors.response.forEach(function pushResponseInterceptors(interceptor) {
    chain.push(interceptor.fulfilled, interceptor.rejected);
  });

  while (chain.length) {
    promise = promise.then(chain.shift(), chain.shift());
  }

  return promise;
};

Axios.prototype.getUri = function getUri(config) {
  config = mergeConfig(this.defaults, config);
  return buildURL(config.url, config.params, config.paramsSerializer).replace(/^\?/, '');
};

// Provide aliases for supported request methods
utils.forEach(['delete', 'get', 'head', 'options'], function forEachMethodNoData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url
    }));
  };
});

utils.forEach(['post', 'put', 'patch'], function forEachMethodWithData(method) {
  /*eslint func-names:0*/
  Axios.prototype[method] = function(url, data, config) {
    return this.request(utils.merge(config || {}, {
      method: method,
      url: url,
      data: data
    }));
  };
});

module.exports = Axios;


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

function InterceptorManager() {
  this.handlers = [];
}

/**
 * Add a new interceptor to the stack
 *
 * @param {Function} fulfilled The function to handle `then` for a `Promise`
 * @param {Function} rejected The function to handle `reject` for a `Promise`
 *
 * @return {Number} An ID used to remove interceptor later
 */
InterceptorManager.prototype.use = function use(fulfilled, rejected) {
  this.handlers.push({
    fulfilled: fulfilled,
    rejected: rejected
  });
  return this.handlers.length - 1;
};

/**
 * Remove an interceptor from the stack
 *
 * @param {Number} id The ID that was returned by `use`
 */
InterceptorManager.prototype.eject = function eject(id) {
  if (this.handlers[id]) {
    this.handlers[id] = null;
  }
};

/**
 * Iterate over all the registered interceptors
 *
 * This method is particularly useful for skipping over any
 * interceptors that may have become `null` calling `eject`.
 *
 * @param {Function} fn The function to call for each interceptor
 */
InterceptorManager.prototype.forEach = function forEach(fn) {
  utils.forEach(this.handlers, function forEachHandler(h) {
    if (h !== null) {
      fn(h);
    }
  });
};

module.exports = InterceptorManager;


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);
var transformData = __webpack_require__(22);
var isCancel = __webpack_require__(8);
var defaults = __webpack_require__(9);

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
function throwIfCancellationRequested(config) {
  if (config.cancelToken) {
    config.cancelToken.throwIfRequested();
  }
}

/**
 * Dispatch a request to the server using the configured adapter.
 *
 * @param {object} config The config that is to be used for the request
 * @returns {Promise} The Promise to be fulfilled
 */
module.exports = function dispatchRequest(config) {
  throwIfCancellationRequested(config);

  // Ensure headers exist
  config.headers = config.headers || {};

  // Transform request data
  config.data = transformData(
    config.data,
    config.headers,
    config.transformRequest
  );

  // Flatten headers
  config.headers = utils.merge(
    config.headers.common || {},
    config.headers[config.method] || {},
    config.headers
  );

  utils.forEach(
    ['delete', 'get', 'head', 'post', 'put', 'patch', 'common'],
    function cleanHeaderConfig(method) {
      delete config.headers[method];
    }
  );

  var adapter = config.adapter || defaults.adapter;

  return adapter(config).then(function onAdapterResolution(response) {
    throwIfCancellationRequested(config);

    // Transform response data
    response.data = transformData(
      response.data,
      response.headers,
      config.transformResponse
    );

    return response;
  }, function onAdapterRejection(reason) {
    if (!isCancel(reason)) {
      throwIfCancellationRequested(config);

      // Transform response data
      if (reason && reason.response) {
        reason.response.data = transformData(
          reason.response.data,
          reason.response.headers,
          config.transformResponse
        );
      }
    }

    return Promise.reject(reason);
  });
};


/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

/**
 * Transform the data for a request or a response
 *
 * @param {Object|String} data The data to be transformed
 * @param {Array} headers The headers for the request or response
 * @param {Array|Function} fns A single function or Array of functions
 * @returns {*} The resulting transformed data
 */
module.exports = function transformData(data, headers, fns) {
  /*eslint no-param-reassign:0*/
  utils.forEach(fns, function transform(fn) {
    data = fn(data, headers);
  });

  return data;
};


/***/ }),
/* 23 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

module.exports = function normalizeHeaderName(headers, normalizedName) {
  utils.forEach(headers, function processHeader(value, name) {
    if (name !== normalizedName && name.toUpperCase() === normalizedName.toUpperCase()) {
      headers[normalizedName] = value;
      delete headers[name];
    }
  });
};


/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var createError = __webpack_require__(11);

/**
 * Resolve or reject a Promise based on response status.
 *
 * @param {Function} resolve A function that resolves the promise.
 * @param {Function} reject A function that rejects the promise.
 * @param {object} response The response.
 */
module.exports = function settle(resolve, reject, response) {
  var validateStatus = response.config.validateStatus;
  if (!validateStatus || validateStatus(response.status)) {
    resolve(response);
  } else {
    reject(createError(
      'Request failed with status code ' + response.status,
      response.config,
      null,
      response.request,
      response
    ));
  }
};


/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Update an Error with the specified config, error code, and response.
 *
 * @param {Error} error The error to update.
 * @param {Object} config The config.
 * @param {string} [code] The error code (for example, 'ECONNABORTED').
 * @param {Object} [request] The request.
 * @param {Object} [response] The response.
 * @returns {Error} The error.
 */
module.exports = function enhanceError(error, config, code, request, response) {
  error.config = config;
  if (code) {
    error.code = code;
  }

  error.request = request;
  error.response = response;
  error.isAxiosError = true;

  error.toJSON = function() {
    return {
      // Standard
      message: this.message,
      name: this.name,
      // Microsoft
      description: this.description,
      number: this.number,
      // Mozilla
      fileName: this.fileName,
      lineNumber: this.lineNumber,
      columnNumber: this.columnNumber,
      stack: this.stack,
      // Axios
      config: this.config,
      code: this.code
    };
  };
  return error;
};


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var isAbsoluteURL = __webpack_require__(28);
var combineURLs = __webpack_require__(29);

/**
 * Creates a new URL by combining the baseURL with the requestedURL,
 * only when the requestedURL is not already an absolute URL.
 * If the requestURL is absolute, this function returns the requestedURL untouched.
 *
 * @param {string} baseURL The base URL
 * @param {string} requestedURL Absolute or relative URL to combine
 * @returns {string} The combined full path
 */
module.exports = function buildFullPath(baseURL, requestedURL) {
  if (baseURL && !isAbsoluteURL(requestedURL)) {
    return combineURLs(baseURL, requestedURL);
  }
  return requestedURL;
};


/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Determines whether the specified URL is absolute
 *
 * @param {string} url The URL to test
 * @returns {boolean} True if the specified URL is absolute, otherwise false
 */
module.exports = function isAbsoluteURL(url) {
  // A URL is considered absolute if it begins with "<scheme>://" or "//" (protocol-relative URL).
  // RFC 3986 defines scheme name as a sequence of characters beginning with a letter and followed
  // by any combination of letters, digits, plus, period, or hyphen.
  return /^([a-z][a-z\d\+\-\.]*:)?\/\//i.test(url);
};


/***/ }),
/* 29 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Creates a new URL by combining the specified URLs
 *
 * @param {string} baseURL The base URL
 * @param {string} relativeURL The relative URL
 * @returns {string} The combined URL
 */
module.exports = function combineURLs(baseURL, relativeURL) {
  return relativeURL
    ? baseURL.replace(/\/+$/, '') + '/' + relativeURL.replace(/^\/+/, '')
    : baseURL;
};


/***/ }),
/* 30 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

// Headers whose duplicates are ignored by node
// c.f. https://nodejs.org/api/http.html#http_message_headers
var ignoreDuplicateOf = [
  'age', 'authorization', 'content-length', 'content-type', 'etag',
  'expires', 'from', 'host', 'if-modified-since', 'if-unmodified-since',
  'last-modified', 'location', 'max-forwards', 'proxy-authorization',
  'referer', 'retry-after', 'user-agent'
];

/**
 * Parse headers into an object
 *
 * ```
 * Date: Wed, 27 Aug 2014 08:58:49 GMT
 * Content-Type: application/json
 * Connection: keep-alive
 * Transfer-Encoding: chunked
 * ```
 *
 * @param {String} headers Headers needing to be parsed
 * @returns {Object} Headers parsed into an object
 */
module.exports = function parseHeaders(headers) {
  var parsed = {};
  var key;
  var val;
  var i;

  if (!headers) { return parsed; }

  utils.forEach(headers.split('\n'), function parser(line) {
    i = line.indexOf(':');
    key = utils.trim(line.substr(0, i)).toLowerCase();
    val = utils.trim(line.substr(i + 1));

    if (key) {
      if (parsed[key] && ignoreDuplicateOf.indexOf(key) >= 0) {
        return;
      }
      if (key === 'set-cookie') {
        parsed[key] = (parsed[key] ? parsed[key] : []).concat([val]);
      } else {
        parsed[key] = parsed[key] ? parsed[key] + ', ' + val : val;
      }
    }
  });

  return parsed;
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs have full support of the APIs needed to test
  // whether the request URL is of the same origin as current location.
    (function standardBrowserEnv() {
      var msie = /(msie|trident)/i.test(navigator.userAgent);
      var urlParsingNode = document.createElement('a');
      var originURL;

      /**
    * Parse a URL to discover it's components
    *
    * @param {String} url The URL to be parsed
    * @returns {Object}
    */
      function resolveURL(url) {
        var href = url;

        if (msie) {
        // IE needs attribute set twice to normalize properties
          urlParsingNode.setAttribute('href', href);
          href = urlParsingNode.href;
        }

        urlParsingNode.setAttribute('href', href);

        // urlParsingNode provides the UrlUtils interface - http://url.spec.whatwg.org/#urlutils
        return {
          href: urlParsingNode.href,
          protocol: urlParsingNode.protocol ? urlParsingNode.protocol.replace(/:$/, '') : '',
          host: urlParsingNode.host,
          search: urlParsingNode.search ? urlParsingNode.search.replace(/^\?/, '') : '',
          hash: urlParsingNode.hash ? urlParsingNode.hash.replace(/^#/, '') : '',
          hostname: urlParsingNode.hostname,
          port: urlParsingNode.port,
          pathname: (urlParsingNode.pathname.charAt(0) === '/') ?
            urlParsingNode.pathname :
            '/' + urlParsingNode.pathname
        };
      }

      originURL = resolveURL(window.location.href);

      /**
    * Determine if a URL shares the same origin as the current location
    *
    * @param {String} requestURL The URL to test
    * @returns {boolean} True if URL shares the same origin, otherwise false
    */
      return function isURLSameOrigin(requestURL) {
        var parsed = (utils.isString(requestURL)) ? resolveURL(requestURL) : requestURL;
        return (parsed.protocol === originURL.protocol &&
            parsed.host === originURL.host);
      };
    })() :

  // Non standard browser envs (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return function isURLSameOrigin() {
        return true;
      };
    })()
);


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var utils = __webpack_require__(0);

module.exports = (
  utils.isStandardBrowserEnv() ?

  // Standard browser envs support document.cookie
    (function standardBrowserEnv() {
      return {
        write: function write(name, value, expires, path, domain, secure) {
          var cookie = [];
          cookie.push(name + '=' + encodeURIComponent(value));

          if (utils.isNumber(expires)) {
            cookie.push('expires=' + new Date(expires).toGMTString());
          }

          if (utils.isString(path)) {
            cookie.push('path=' + path);
          }

          if (utils.isString(domain)) {
            cookie.push('domain=' + domain);
          }

          if (secure === true) {
            cookie.push('secure');
          }

          document.cookie = cookie.join('; ');
        },

        read: function read(name) {
          var match = document.cookie.match(new RegExp('(^|;\\s*)(' + name + ')=([^;]*)'));
          return (match ? decodeURIComponent(match[3]) : null);
        },

        remove: function remove(name) {
          this.write(name, '', Date.now() - 86400000);
        }
      };
    })() :

  // Non standard browser env (web workers, react-native) lack needed support.
    (function nonStandardBrowserEnv() {
      return {
        write: function write() {},
        read: function read() { return null; },
        remove: function remove() {}
      };
    })()
);


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Cancel = __webpack_require__(13);

/**
 * A `CancelToken` is an object that can be used to request cancellation of an operation.
 *
 * @class
 * @param {Function} executor The executor function.
 */
function CancelToken(executor) {
  if (typeof executor !== 'function') {
    throw new TypeError('executor must be a function.');
  }

  var resolvePromise;
  this.promise = new Promise(function promiseExecutor(resolve) {
    resolvePromise = resolve;
  });

  var token = this;
  executor(function cancel(message) {
    if (token.reason) {
      // Cancellation has already been requested
      return;
    }

    token.reason = new Cancel(message);
    resolvePromise(token.reason);
  });
}

/**
 * Throws a `Cancel` if cancellation has been requested.
 */
CancelToken.prototype.throwIfRequested = function throwIfRequested() {
  if (this.reason) {
    throw this.reason;
  }
};

/**
 * Returns an object that contains a new `CancelToken` and a function that, when called,
 * cancels the `CancelToken`.
 */
CancelToken.source = function source() {
  var cancel;
  var token = new CancelToken(function executor(c) {
    cancel = c;
  });
  return {
    token: token,
    cancel: cancel
  };
};

module.exports = CancelToken;


/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Syntactic sugar for invoking a function and expanding an array for arguments.
 *
 * Common use case would be to use `Function.prototype.apply`.
 *
 *  ```js
 *  function f(x, y, z) {}
 *  var args = [1, 2, 3];
 *  f.apply(null, args);
 *  ```
 *
 * With `spread` this example can be re-written.
 *
 *  ```js
 *  spread(function(x, y, z) {})([1, 2, 3]);
 *  ```
 *
 * @param {Function} callback
 * @returns {Function}
 */
module.exports = function spread(callback) {
  return function wrap(arr) {
    return callback.apply(null, arr);
  };
};


/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _axios = _interopRequireDefault(__webpack_require__(5));

var _methods = _interopRequireDefault(__webpack_require__(4));

var _subscriber = _interopRequireDefault(__webpack_require__(36));

var _componentRegisterMap = _interopRequireDefault(__webpack_require__(1));

var _this = void 0;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

function _possibleConstructorReturn(self, call) { if (call && (_typeof(call) === "object" || typeof call === "function")) { return call; } return _assertThisInitialized(self); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function"); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, writable: true, configurable: true } }); if (superClass) _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

var capitalizeFirst = function capitalizeFirst(str) {
  _newArrowCheck(this, _this);

  return str.charAt(0).toUpperCase() + str.slice(1);
}.bind(void 0);
/*
 * Global Queue has the purpose of preventing N requests being sent in a row to same endpoint.
 *
 * If 1 request is pending to a specific endpoint a success result will be applied to all
 * queued requests, without them having to be fired to server.
 *
 * All requests gets registered in store as pending, so we can track they existed.
 * We add a prop .debouncedResponse with value: null - if the request got its own
 * response; Object - the request object of the request that got the response data
 *
 * Not implemented yet:
 *
 *     If a "update" request gets in between 2 get requests, the earlier "get" will be
 *     postponed, we send the "update" to server and apply its response to both "get"s.
 *
 */


var globalQueue = {
  activeRequests: {},
  // endpoints as key values
  queuedRequests: {} // endpoints as key values

};
var requestCounter = 0;

var Rest =
/*#__PURE__*/
function (_HTTP) {
  _inherits(Rest, _HTTP);

  function Rest(resource, config) {
    var _this2;

    _classCallCheck(this, Rest);

    _this2 = _possibleConstructorReturn(this, _getPrototypeOf(Rest).call(this, resource, config));
    _this2.store = config.store;
    _this2.logEndpoints = Boolean(config.logEndpoints);
    _this2.logInstance = Boolean(config.logInstance);
    _this2.vrrModuleName = config.vrrModuleName;

    var _assertThisInitialize = _assertThisInitialized(_this2),
        logEndpoints = _assertThisInitialize.logEndpoints,
        logInstance = _assertThisInitialize.logInstance,
        store = _assertThisInitialize.store;

    _this2.updateStore = function updateStore(storeAction, payload) {
      if (logEndpoints || logInstance) {
        store.dispatch(storeAction, payload);
      }
    };

    return _this2;
  } // Dispatcher methods (overrides HTTP dispatch method)


  _createClass(Rest, [{
    key: "dispatch",
    value: function dispatch(action, _ref) {
      var _this3 = this;

      var endpoint = _ref.endpoint,
          handler = _ref.handler,
          callback = _ref.callback,
          apiModel = _ref.apiModel,
          apiModule = _ref.apiModule,
          deletedId = _ref.deletedId,
          callerInstance = _ref.callerInstance;
      var mutation = [apiModule, "".concat(action).concat(capitalizeFirst(apiModel))].filter(Boolean).join('/');
      var actionType = action === 'list' ? 'get' : action; // axios has no 'list'

      var REGISTER_REQUEST = "".concat(this.vrrModuleName, "/registerRequest");
      var UPDATE_REQUEST = "".concat(this.vrrModuleName, "/updateRequest");
      var DELETE_INSTANCE = "".concat(this.vrrModuleName, "/deleteInstance");
      var logEndpoints = this.logEndpoints,
          logInstance = this.logInstance,
          updateStore = this.updateStore;
      var instanceUUID = null;

      if (logInstance) {
        instanceUUID = _componentRegisterMap.default.add(callerInstance);

        if (callerInstance && callerInstance.$once) {
          callerInstance.$once('hook:beforeDestroy', function () {
            _newArrowCheck(this, _this3);

            updateStore(DELETE_INSTANCE, instanceUUID);
          }.bind(this));
        }
      }

      var discard = false; // prepare for request timeout

      var timeout = false;
      /*
       * Status types:
       *   - registered (before axios is called)
       *   - success
       *   - failed
       *   - slow
       *   - timeout
       *   - pending
       */

      for (var _len = arguments.length, args = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        args[_key - 2] = arguments[_key];
      }

      var request = this.register.apply(this, [actionType, {
        apiModel: apiModel,
        apiModule: apiModule,
        endpoint: endpoint,
        callerInstance: instanceUUID,
        logEndpoints: logEndpoints,
        logInstance: logInstance
      }].concat(args));

      request.cancel = function () {
        _newArrowCheck(this, _this3);

        discard = true;
        updateStore(UPDATE_REQUEST, _objectSpread({}, request, {
          status: 'canceled',
          completed: Date.now()
        }));
      }.bind(this);

      updateStore(REGISTER_REQUEST, _objectSpread({}, request)); // prepare for slow request

      var slowRequest = setTimeout(function () {
        _newArrowCheck(this, _this3);

        updateStore(UPDATE_REQUEST, _objectSpread({}, request, {
          status: 'slow'
        }));
      }.bind(this), this.slowTimeout);
      var requestTimeout = setTimeout(function () {
        _newArrowCheck(this, _this3);

        timeout = true;
        updateStore(UPDATE_REQUEST, _objectSpread({}, request, {
          completed: Date.now(),
          status: 'timeout'
        }));
      }.bind(this), this.failedTimeout);
      var ajax = this.handleQueue.apply(this, [request, actionType, endpoint].concat(args));
      /* @todo: add a global warning component when requests fail */
      // tell the store a request was fired

      updateStore(UPDATE_REQUEST, _objectSpread({}, request, {
        status: 'pending'
      }));

      var handleQueueOnBadRequest = function handleQueueOnBadRequest() {
        _newArrowCheck(this, _this3);

        if (globalQueue.queuedRequests[endpoint]) {
          // call next in queue
          var activeRequest = globalQueue.activeRequests[endpoint];

          if (activeRequest && activeRequest.id === request.id) {
            delete globalQueue.activeRequests[endpoint];
            var next = globalQueue.queuedRequests[endpoint].shift();

            if (next) {
              var rqst = next.request,
                  act = next.action,
                  end = next.endpoint,
                  rest = next.args;
              this.handleQueue.apply(this, [rqst, act, end].concat(_toConsumableArray(rest)));
            }
          }
        }
      }.bind(this);

      ajax.then(function (res) {
        var _this4 = this;

        _newArrowCheck(this, _this3);

        clearTimeout(slowRequest);
        clearTimeout(requestTimeout);

        if (timeout || discard) {
          return undefined;
        }

        var response = !res && action === 'delete' ? deletedId : res;
        var responseCopy = JSON.parse(JSON.stringify({
          data: response.data
        })); //

        var data = handler(responseCopy, this.store);
        /*
         * About using callbacks here:
         * Sometimes the data Axios gets needs to be processed. We can do this in
         * the Store or in the Controller of the component. Use callback & Controller
         * pattern if you want to keep the store "logic free".
         */

        if (callback) {
          // Used in some controllers when data from server needs to be processed before being set in store
          callback(data, this.store);
        } else {
          updateStore(mutation, data);
        }

        var updated = _objectSpread({}, request, {
          completed: Date.now(),
          response: data,
          status: 'success'
        });

        updateStore(UPDATE_REQUEST, updated); // lets use setTimeout so we don't remove the request before the Subscriber promise resolves

        setTimeout(function () {
          _newArrowCheck(this, _this4);

          return this.unregister(request);
        }.bind(this), 1);
        var activeRequest = globalQueue.activeRequests[endpoint];

        if (activeRequest && activeRequest.id === request.id) {
          var queuedRquestsIteratee = function queuedRquestsIteratee(queued) {
            queued.request.Promise.resolve(response); // resolve pending requests with same response
          };

          globalQueue.queuedRequests[endpoint].forEach(queuedRquestsIteratee);
          globalQueue.queuedRequests[endpoint] = []; // done, reset pending requests array

          delete globalQueue.activeRequests[endpoint]; // done, remove the active request pointer
        }

        return undefined;
      }.bind(this)).catch(function (err) {
        _newArrowCheck(this, _this3);

        clearTimeout(slowRequest);
        clearTimeout(requestTimeout);
        this.unregister(request);

        var updated = _objectSpread({}, request, {
          completed: Date.now(),
          response: err.response && err.response.data,
          status: 'failed'
        });

        updateStore(UPDATE_REQUEST, updated);
        handleQueueOnBadRequest(); // TODO / QUESTION: maybe we should also unregister the request?
        // this.unregister(request);
      }.bind(this));
      var store = this.store;
      return new Promise(function (resolve, reject) {
        var _this5 = this;

        _newArrowCheck(this, _this3);

        new _subscriber.default(endpoint, request.id, store, UPDATE_REQUEST).onSuccess(resolve).onFail(function (data) {
          _newArrowCheck(this, _this5);

          handleQueueOnBadRequest();
          reject(data);
        }.bind(this));
      }.bind(this));
    }
  }, {
    key: "handleQueue",
    value: function handleQueue(request, action, endpoint) {
      var _this6 = this;

      for (var _len2 = arguments.length, args = new Array(_len2 > 3 ? _len2 - 3 : 0), _key2 = 3; _key2 < _len2; _key2++) {
        args[_key2 - 3] = arguments[_key2];
      }

      if (action !== 'get') {
        // NB: check comment text about implementation of "update" requests inside queue of "get"s (on top of this file)
        return _axios.default[action].apply(_axios.default, [endpoint].concat(args));
      }

      var activeRequest = globalQueue.activeRequests[endpoint];
      var hasDifferentParms = !activeRequest || !Object.keys(request.params).every(function (param) {
        _newArrowCheck(this, _this6);

        if (param[0] === '_') {
          // consider as meta data, not crucial
          // we might make this configurable in the future
          return true;
        }

        return activeRequest.params[param] === request.params[param];
      }.bind(this));

      if (hasDifferentParms) {
        // first request, no queue
        globalQueue.activeRequests[endpoint] = request;

        if (!globalQueue.queuedRequests[endpoint]) {
          globalQueue.queuedRequests[endpoint] = [];
        }

        return _axios.default[action].apply(_axios.default, [endpoint].concat(args));
      } // pending request already registered, queue this request


      var pending = globalQueue.queuedRequests[endpoint];
      pending.push({
        action: action,
        args: args,
        endpoint: endpoint,
        request: request
      });

      var executor = function executor(resolve, reject) {
        request.Promise = {
          reject: reject,
          resolve: resolve
        };
      };

      var deferred = new Promise(executor);
      request.Promise.instance = deferred;
      return deferred;
    }
  }, {
    key: "register",
    value: function register(action, moduleInfo) {
      var _this7 = this;

      requestCounter += 1;
      var id = [moduleInfo.apiModule, moduleInfo.apiModel, requestCounter].join('_');

      for (var _len3 = arguments.length, args = new Array(_len3 > 2 ? _len3 - 2 : 0), _key3 = 2; _key3 < _len3; _key3++) {
        args[_key3 - 2] = arguments[_key3];
      }

      var httpData = args.find(function (obj) {
        _newArrowCheck(this, _this7);

        return obj.params;
      }.bind(this));
      var params = httpData && httpData.params;
      return _objectSpread({}, moduleInfo, {
        action: action,
        created: Date.now(),
        id: id,
        params: params,
        status: 'registered'
      });
    }
  }, {
    key: "unregister",
    value: function unregister(request) {
      var UNREGISTER = "".concat(this.vrrModuleName, "/unregisterRequest");
      this.updateStore(UNREGISTER, request);
    }
  }]);

  return Rest;
}(_methods.default);

exports.default = Rest;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var activeListeners = {
  mutation: {}
};
var registeredStores = new Map();

var subscriber = function subscriber(vrrStoreUpdatePath, mutation) {
  var type = mutation.type; // endpoint

  if (type !== vrrStoreUpdatePath) {
    return;
  }

  var _mutation$payload = mutation.payload,
      id = _mutation$payload.id,
      status = _mutation$payload.status,
      endpoint = _mutation$payload.endpoint;
  var listeners = activeListeners.mutation[endpoint] && activeListeners.mutation[endpoint][id];

  if (!listeners) {
    return;
  }

  if (status === 'success') {
    var successIteratee = function successIteratee(_ref) {
      var callbacks = _ref.callbacks;

      if (callbacks.onSuccess) {
        callbacks.onSuccess(id);
      }
    };

    listeners.forEach(successIteratee);
  } else if (status === 'timeout' || status === 'failed' || status === 'canceled') {
    var timeoutIteratee = function timeoutIteratee(_ref2) {
      var callbacks = _ref2.callbacks;

      if (callbacks.onFail) {
        callbacks.onFail(mutation.payload);
      }
    };

    listeners.forEach(timeoutIteratee);
  } else if (status === 'slow') {
    var slowIteratee = function slowIteratee(_ref3) {
      var callbacks = _ref3.callbacks;

      if (callbacks.onSlow) {
        callbacks.onSlow();
      }
    };

    listeners.forEach(slowIteratee);
  }
};

var Subscriber =
/*#__PURE__*/
function () {
  function Subscriber(endpoint, uuid, store, vrrStoreUpdatePath) {
    _classCallCheck(this, Subscriber);

    this.endpoint = endpoint;
    this.uuid = uuid;
    this.callbacks = {};
    this.store = store;

    if (!registeredStores.get(store)) {
      var unsubscriber = store.subscribe(subscriber.bind(null, vrrStoreUpdatePath));
      registeredStores.set(store, unsubscriber); // NOTE: if needed we can call "unsubscriber", but probably we never un-mount VRR
    }

    this.registerListener();
    return this;
  }

  _createClass(Subscriber, [{
    key: "registerListener",
    value: function registerListener() {
      if (!activeListeners.mutation[this.endpoint]) {
        activeListeners.mutation[this.endpoint] = {};
      }

      if (!activeListeners.mutation[this.endpoint][this.uuid]) {
        activeListeners.mutation[this.endpoint][this.uuid] = [];
      }

      activeListeners.mutation[this.endpoint][this.uuid].push(this);
    }
  }, {
    key: "unregisterListener",
    value: function unregisterListener() {
      var index = activeListeners.mutation[this.endpoint][this.uuid].indexOf(this);
      activeListeners.mutation[this.endpoint][this.uuid].splice(index, 1);
    }
  }, {
    key: "onSuccess",
    value: function onSuccess(fn) {
      var _this = this;

      this.callbacks.onSuccess = function (id) {
        _newArrowCheck(this, _this);

        fn(id);
        this.unregisterListener();
      }.bind(this);

      return this;
    }
  }, {
    key: "onSlow",
    value: function onSlow(fn) {
      this.callbacks.onSlow = fn;
      return this;
    }
  }, {
    key: "onFail",
    value: function onFail(fn) {
      var _this2 = this;

      this.callbacks.onFail = function (requestData) {
        _newArrowCheck(this, _this2);

        fn(requestData);
        this.unregisterListener();
      }.bind(this);

      return this;
    }
  }]);

  return Subscriber;
}();

exports.default = Subscriber;

/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _castArray = _interopRequireDefault(__webpack_require__(38));

var _get = _interopRequireDefault(__webpack_require__(39));

var _componentRegisterMap = _interopRequireDefault(__webpack_require__(1));

var _constants = _interopRequireDefault(__webpack_require__(2));

var _this = void 0;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

var noValueFound = _constants.default.noValueFound;

var getStorePath = function getStorePath(resource) {
  _newArrowCheck(this, _this);

  var apiModule = resource.apiModule,
      apiModel = resource.apiModel;
  return [apiModule, apiModel].filter(Boolean).join('/');
}.bind(void 0);

var getStateForResource = function getStateForResource(instance, resource) {
  _newArrowCheck(this, _this);

  var storePath = getStorePath(resource);
  return instance.$store.getters[storePath] || [];
}.bind(void 0);

var getStoreResourceValue = function getStoreResourceValue(instance, asyncID, resource) {
  if (asyncID === null) {
    return null;
  }

  var state = getStateForResource(instance, resource);

  if (Array.isArray(state)) {
    var findStatePredicate = function findStatePredicate(obj) {
      return obj.id === asyncID;
    };

    var value = state.find(findStatePredicate);
    return value || noValueFound;
  } // if (state[asyncKey] === asyncID) {
  //   return state;
  // }


  return noValueFound;
};

var getStoreResourceValueByKeys = function getStoreResourceValueByKeys(instance, filter, resource) {
  if (filter === null) {
    return null;
  }

  var state = getStateForResource(instance, resource);

  if (Array.isArray(state)) {
    var findStatePredicate = function findStatePredicate(obj) {
      var _this2 = this;

      var keys = Object.keys(filter);
      return keys.every(function (key) {
        _newArrowCheck(this, _this2);

        return obj[key] === filter[key];
      }.bind(this));
    };

    var value = state.filter(findStatePredicate);
    return value || noValueFound;
  }

  return noValueFound;
};

var getResourceValue = function getResourceValue(instance, restResources, asyncValueResolvers, relatedAsyncID) {
  if (relatedAsyncID === -1) {
    return undefined;
  }

  var resourceValue = relatedAsyncID;
  var storeValues = [];

  var _loop = function _loop(i, l) {
    var _this3 = this;

    var asyncValueResolver = asyncValueResolvers[i];
    var storeValue = getStoreResourceValue(instance, resourceValue, restResources[i]);

    if (storeValue === noValueFound) {
      // we need a setTimeout here so the values/getters this method calls don't get logged by computed properties
      // and so don't get registered as dependencies to react on
      var action = (0, _get.default)(restResources[i], 'resource.remoteAction') ? 'remoteAction' : 'get';
      setTimeout(function () {
        _newArrowCheck(this, _this3);

        return restResources[i][action](instance, resourceValue);
      }.bind(this), 1); // resource not loaded yet,
      // the computed function will be called again when store is updated

      return {
        v: undefined
      };
    }

    storeValues.push(storeValue); // re-assign resourceValue to be applied as next foreign key

    resourceValue = asyncValueResolver(storeValue, noValueFound, storeValues);
  };

  for (var i = 0, l = restResources.length; i < l; i += 1) {
    var _ret = _loop(i, l);

    if (_typeof(_ret) === "object") return _ret.v;
  }

  return resourceValue;
};

var pathIteratee = function pathIteratee(obj, key, i) {
  if (key === 'this' && i === 0) {
    return obj;
  }

  return obj[key] || noValueFound;
};

var _default = function (options) {
  _newArrowCheck(this, _this);

  return {
    /**
     * Loads in the specific object in the store.
     * Use this to bind a state to a computed property.
     * If the Object is not found in the store, it fills the store with data from the server.
     *
     * Use as `...asyncResourceGetter(name, Resource, id)` in the components computed properties.
     * To get a nested object: `...asyncResourceGetter(name, [ResourceA, ResourceB], id, [(dataResourceA) => data.IdToPassToResourceB, (dataResourceB) => data])` in the components computed properties.
     *
     * @param {string} computedPropertyName - Name of the computed property that will be created.
     * @param {object[]|object} restResources - The model to use.
     * @param {string | number} initialId -  The computed property, or prop, with/or the `id` of the object you want or the name of the instance value/property to observe.
     * @param {Function} resolverFunctions - Callback to transform the data from the store before providing it as the value of the computed property. If you don't need it just pass `(data) => data`.
     *
     * @returns {object} - Places a computed property with the values in your state.
     */
    asyncResourceGetter: function asyncResourceGetter(computedPropertyName, restResources, initialId) {
      var _this4 = this;

      var resolverFunctions = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : function (data) {
        _newArrowCheck(this, _this4);

        return data;
      }.bind(this);
      return _defineProperty({}, computedPropertyName, function () {
        var _this5 = this;

        // get the needed values from object nested (or not) paths in `this`
        var _map = [resolverFunctions, initialId].map(function (value) {
          _newArrowCheck(this, _this5);

          if (typeof value !== 'string') {
            return value;
          }

          return value.split('.').reduce(pathIteratee, this);
        }.bind(this)),
            _map2 = _slicedToArray(_map, 2),
            asyncValueResolvers = _map2[0],
            relatedAsyncID = _map2[1];

        return getResourceValue(this, (0, _castArray.default)(restResources), (0, _castArray.default)(asyncValueResolvers), relatedAsyncID);
      });
    },
    // use as `...asyncResourceValue` in the components computed properties
    asyncResourceValue: {
      asyncResourceValue: function asyncResourceValue() {
        var restResources = this.restResources,
            relatedAsyncID = this.relatedAsyncID,
            asyncValueResolver = this.asyncValueResolver;
        return getResourceValue(this, (0, _castArray.default)(restResources), (0, _castArray.default)(asyncValueResolver), relatedAsyncID);
      }
    },
    activeRequests: function activeRequests() {
      var computedPropertyName = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'activeRequests';
      var emptyArray = [];
      return _defineProperty({}, computedPropertyName, function () {
        var instanceUUID = _componentRegisterMap.default.add(this);

        var vrrModuleName = options.vrrModuleName;
        var requests = this.$store.state[vrrModuleName].activeRequestsFromComponent;
        return requests[instanceUUID] || emptyArray;
      });
    },
    // PROBABLY WILL BE DEPRECATED / REWRITEN
    updateResourceListWatcher: function updateResourceListWatcher(watcherPropertyName, immediate, resources) {
      var resourceRelatedKeys = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : 'id';
      var verificationKey = arguments.length > 4 ? arguments[4] : undefined;
      return _defineProperty({}, watcherPropertyName, {
        immediate: immediate,
        handler: function handler(updatedValue, oldValue) {
          var _this7 = this;

          if (typeof updatedValue === 'undefined' && !immediate) {
            return;
          }

          var callerInstance = this;
          var updated = updatedValue && typeof verificationKey !== 'undefined' ? updatedValue[verificationKey] : updatedValue;
          var outdated = oldValue && typeof verificationKey !== 'undefined' ? oldValue[verificationKey] : oldValue;
          var resourceMatches = outdated && updated === outdated || updatedValue && !oldValue;

          if (resourceMatches) {
            var resourceIteratee = function resourceIteratee(resource, i) {
              var _this6 = this;

              var resourceKey = Array.isArray(resourceRelatedKeys) ? resourceRelatedKeys[i] : resourceRelatedKeys;
              setTimeout(function () {
                _newArrowCheck(this, _this6);

                resource.list(callerInstance, _defineProperty({}, resourceKey, updated));
              }.bind(this), 1);
            };

            (0, _castArray.default)(resources).map(function (resource) {
              _newArrowCheck(this, _this7);

              return this[resource];
            }.bind(this)).forEach(resourceIteratee);
          }
        }
      });
    },

    /**
     * Updates the store with a list based on a relation of keys.
     *
     * Use: resourceListGetter('students', Patients, {school: 20, class: 'A'}).
     * Use: resourceListGetter('seenhints', SeenHints, [1, 2, 4]).
     *
     * @param {string} computedPropertyName - Name of the computed property that will be created.
     * @param {object[]|object} resource - The model to use.
     * @param {string[]|object[]} pathToInitialValues - The computed property name that has a array with IDs or a object to be used as a filter for the query.
     *
     * @returns {object} - Places a computed property with the values in your state.
     */
    resourceListGetter: function resourceListGetter(computedPropertyName, resource, pathToInitialValues) {
      var emptyArray = [];
      return _defineProperty({}, computedPropertyName, function () {
        var _this8 = this;

        var callerInstance = this;
        var computed = pathToInitialValues.split('.').reduce(pathIteratee, callerInstance);

        if (computed === noValueFound) {
          return emptyArray;
        }

        var isArray = Array.isArray(computed);
        var isObject = computed instanceof Object && !isArray;
        var allValuesInStore = false;
        var resourceValues = [noValueFound];

        if (isObject) {
          resourceValues = getStoreResourceValueByKeys(this, computed, resource);
          allValuesInStore = resourceValues.some(function (value) {
            _newArrowCheck(this, _this8);

            return value !== noValueFound;
          }.bind(this));
        }

        if (isArray) {
          var ids = isArray ? computed || [] : (0, _castArray.default)(computed);
          resourceValues = ids.map(function (id) {
            _newArrowCheck(this, _this8);

            return getStoreResourceValue(this, id, resource);
          }.bind(this));
          allValuesInStore = resourceValues.every(function (value) {
            _newArrowCheck(this, _this8);

            return value !== noValueFound;
          }.bind(this));
        }

        if (allValuesInStore) {
          if (isArray) {
            return resourceValues;
          }

          return resourceValues[0] === noValueFound ? emptyArray : resourceValues;
        } // do server request


        setTimeout(function () {
          _newArrowCheck(this, _this8);

          resource.list(callerInstance, isArray ? {
            id: (0, _castArray.default)(computed).join(',')
          } : computed);
        }.bind(this), 1);
        return emptyArray;
      });
    }
  };
}.bind(void 0);

exports.default = _default;

/***/ }),
/* 38 */
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(3);

/**
 * Casts `value` as an array if it's not one.
 *
 * @static
 * @memberOf _
 * @since 4.4.0
 * @category Lang
 * @param {*} value The value to inspect.
 * @returns {Array} Returns the cast array.
 * @example
 *
 * _.castArray(1);
 * // => [1]
 *
 * _.castArray({ 'a': 1 });
 * // => [{ 'a': 1 }]
 *
 * _.castArray('abc');
 * // => ['abc']
 *
 * _.castArray(null);
 * // => [null]
 *
 * _.castArray(undefined);
 * // => [undefined]
 *
 * _.castArray();
 * // => []
 *
 * var array = [1, 2, 3];
 * console.log(_.castArray(array) === array);
 * // => true
 */
function castArray() {
  if (!arguments.length) {
    return [];
  }
  var value = arguments[0];
  return isArray(value) ? value : [value];
}

module.exports = castArray;


/***/ }),
/* 39 */
/***/ (function(module, exports, __webpack_require__) {

var baseGet = __webpack_require__(40);

/**
 * Gets the value at `path` of `object`. If the resolved value is
 * `undefined`, the `defaultValue` is returned in its place.
 *
 * @static
 * @memberOf _
 * @since 3.7.0
 * @category Object
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
 * @returns {*} Returns the resolved value.
 * @example
 *
 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
 *
 * _.get(object, 'a[0].b.c');
 * // => 3
 *
 * _.get(object, ['a', '0', 'b', 'c']);
 * // => 3
 *
 * _.get(object, 'a.b.c', 'default');
 * // => 'default'
 */
function get(object, path, defaultValue) {
  var result = object == null ? undefined : baseGet(object, path);
  return result === undefined ? defaultValue : result;
}

module.exports = get;


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var castPath = __webpack_require__(41),
    toKey = __webpack_require__(46);

/**
 * The base implementation of `_.get` without support for default values.
 *
 * @private
 * @param {Object} object The object to query.
 * @param {Array|string} path The path of the property to get.
 * @returns {*} Returns the resolved value.
 */
function baseGet(object, path) {
  path = castPath(path, object);

  var index = 0,
      length = path.length;

  while (object != null && index < length) {
    object = object[toKey(path[index++])];
  }
  return (index && index == length) ? object : undefined;
}

module.exports = baseGet;


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(3),
    isKey = __webpack_require__(42),
    stringToPath = __webpack_require__(44),
    toString = __webpack_require__(14);

/**
 * Casts `value` to a path array if it's not one.
 *
 * @private
 * @param {*} value The value to inspect.
 * @param {Object} [object] The object to query keys on.
 * @returns {Array} Returns the cast property path array.
 */
function castPath(value, object) {
  if (isArray(value)) {
    return value;
  }
  return isKey(value, object) ? [value] : stringToPath(toString(value));
}

module.exports = castPath;


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

var isArray = __webpack_require__(3),
    isSymbol = __webpack_require__(43);

/** Used to match property names within property paths. */
var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
    reIsPlainProp = /^\w*$/;

/**
 * Checks if `value` is a property name and not a property path.
 *
 * @private
 * @param {*} value The value to check.
 * @param {Object} [object] The object to query keys on.
 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
 */
function isKey(value, object) {
  if (isArray(value)) {
    return false;
  }
  var type = typeof value;
  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
      value == null || isSymbol(value)) {
    return true;
  }
  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
    (object != null && value in Object(object));
}

module.exports = isKey;


/***/ }),
/* 43 */
/***/ (function(module, exports) {

/**
 * This method returns `false`.
 *
 * @static
 * @memberOf _
 * @since 4.13.0
 * @category Util
 * @returns {boolean} Returns `false`.
 * @example
 *
 * _.times(2, _.stubFalse);
 * // => [false, false]
 */
function stubFalse() {
  return false;
}

module.exports = stubFalse;


/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

var memoizeCapped = __webpack_require__(45);

/** Used to match property names within property paths. */
var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;

/** Used to match backslashes in property paths. */
var reEscapeChar = /\\(\\)?/g;

/**
 * Converts `string` to a property path array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the property path array.
 */
var stringToPath = memoizeCapped(function(string) {
  var result = [];
  if (string.charCodeAt(0) === 46 /* . */) {
    result.push('');
  }
  string.replace(rePropName, function(match, number, quote, subString) {
    result.push(quote ? subString.replace(reEscapeChar, '$1') : (number || match));
  });
  return result;
});

module.exports = stringToPath;


/***/ }),
/* 45 */
/***/ (function(module, exports) {

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;


/***/ }),
/* 46 */
/***/ (function(module, exports) {

/**
 * This method returns the first argument it receives.
 *
 * @static
 * @since 0.1.0
 * @memberOf _
 * @category Util
 * @param {*} value Any value.
 * @returns {*} Returns `value`.
 * @example
 *
 * var object = { 'a': 1 };
 *
 * console.log(_.identity(object) === object);
 * // => true
 */
function identity(value) {
  return value;
}

module.exports = identity;


/***/ }),
/* 47 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _noop = _interopRequireDefault(__webpack_require__(48));

var _componentRegisterMap = _interopRequireDefault(__webpack_require__(1));

var _constants = _interopRequireDefault(__webpack_require__(2));

var _this = void 0;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

var initialInstanceId = _constants.default.initialInstanceId;

var _default = function () {
  _newArrowCheck(this, _this);

  var actions = {
    init: _noop.default,
    registerRequest: function registerRequest(store, req) {
      store.commit('registerRequest', req);
    },
    unregisterRequest: function unregisterRequest(store, req) {
      store.commit('unregisterRequest', req);
    },
    updateRequest: function updateRequest(store, req) {
      store.commit('updateRequest', req);
    },
    deleteInstance: function deleteInstance(store, req) {
      store.commit('deleteInstance', req);
    }
  };
  var mutations = {
    deleteInstance: function deleteInstance(state, instanceUUID) {
      _componentRegisterMap.default.delete(instanceUUID);

      var tempState = _objectSpread({}, state.activeRequestsFromComponent, _defineProperty({}, instanceUUID, null));

      delete tempState[instanceUUID];
      state.activeRequestsFromComponent = tempState;
    },
    registerRequest: function registerRequest(state, request) {
      var logEndpoints = request.logEndpoints,
          logInstance = request.logInstance,
          endpoint = request.endpoint,
          callerInstance = request.callerInstance;
      delete request.callerInstance; // Avoid saving the instance, which includes a circular reference, in Vuex
      // register by component instance

      if (logInstance) {
        var instanceRequests = state.activeRequestsFromComponent[callerInstance] || [];
        state.activeRequestsFromComponent[callerInstance] = instanceRequests.concat(_objectSpread({}, request));
      } // register by endpoint


      if (logEndpoints) {
        var currentOpenRequestsToEndpoint = state.activeRequestsToEndpoint[endpoint] || [];
        state.activeRequestsToEndpoint = _objectSpread({}, state.activeRequestsToEndpoint, _defineProperty({}, endpoint, currentOpenRequestsToEndpoint.concat(_objectSpread({}, request))));
      }
    },
    unregisterRequest: function unregisterRequest(state, request) {
      var _this2 = this;

      var id = request.id,
          endpoint = request.endpoint,
          callerInstance = request.callerInstance;
      var activeRequests = state.activeRequestsToEndpoint[endpoint] || [];
      var others = activeRequests.filter(function (req) {
        _newArrowCheck(this, _this2);

        return req.id !== id;
      }.bind(this));
      state.activeRequestsToEndpoint = _objectSpread({}, state.activeRequestsToEndpoint, _defineProperty({}, endpoint, others)); // update component request list

      var instanceRequests = state.activeRequestsFromComponent[callerInstance];

      if (instanceRequests) {
        state.activeRequestsFromComponent = _objectSpread({}, state.activeRequestsFromComponent, _defineProperty({}, callerInstance, instanceRequests.filter(function (req) {
          _newArrowCheck(this, _this2);

          return req.id !== id;
        }.bind(this))));
      }
    },
    updateRequest: function updateRequest(state, request) {
      var id = request.id,
          logInstance = request.logInstance,
          logEndpoints = request.logEndpoints,
          endpoint = request.endpoint,
          callerInstance = request.callerInstance;
      delete request.callerInstance; // Avoid saving the instance, which includes a circular reference, in Vuex

      function requestUpdateIterator(req) {
        var updatedRequest = id === req.id ? request : req;
        return updatedRequest;
      } // Since we cannot use listener for complex/nested objects
      // we use a shallow state key that triggers listeners in components
      // and they can check if the change is related to them or ignore the call


      if (logInstance) {
        // update the component instance list
        var instanceRequests = state.activeRequestsFromComponent[callerInstance];
        state.lastUpdatedComponentId = callerInstance;

        if (instanceRequests) {
          // sometimes we have removed the component before the request is updated
          // in such cases we should not re-add the instance to the list
          state.activeRequestsFromComponent = _objectSpread({}, state.activeRequestsFromComponent, _defineProperty({}, callerInstance, (instanceRequests || []).map(requestUpdateIterator)));
        } else {
          state.activeRequestsFromComponent = _objectSpread({}, state.activeRequestsFromComponent, _defineProperty({}, callerInstance, (instanceRequests || []).concat(request)));
        }
      } // update the endpoint list


      if (logEndpoints) {
        var current = state.activeRequestsToEndpoint[endpoint];

        if (!current) {
          console.info('VRR: store mutations > updateRequest: Request not found in store');
          return;
        }

        var requestList = current.map(requestUpdateIterator);
        state.activeRequestsToEndpoint = _objectSpread({}, state.activeRequestsToEndpoint, _defineProperty({}, endpoint, requestList));
      }
    }
  };
  var getters = {
    activeRequestsToEndpoint: function activeRequestsToEndpoint(state) {
      return state.activeRequestsToEndpoint;
    },
    lastUpdatedComponent: function lastUpdatedComponent(state) {
      var componentId = state.lastUpdatedComponentId;
      return _componentRegisterMap.default.get(componentId); // Component instance
    },
    activeRequestsFromComponent: function activeRequestsFromComponent(state) {
      return state.activeRequestsFromComponent;
    }
  };
  return {
    actions: actions,
    getters: getters,
    mutations: mutations,
    namespaced: true,
    state: {
      activeRequestsToEndpoint: {},
      lastUpdatedComponentId: initialInstanceId,
      activeRequestsFromComponent: {}
    }
  };
}.bind(void 0);

exports.default = _default;

/***/ }),
/* 48 */
/***/ (function(module, exports) {

/**
 * This method returns `undefined`.
 *
 * @static
 * @memberOf _
 * @since 2.3.0
 * @category Util
 * @example
 *
 * _.times(2, _.noop);
 * // => [undefined, undefined]
 */
function noop() {
  // No operation performed.
}

module.exports = noop;


/***/ }),
/* 49 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _propertyAction = _interopRequireDefault(__webpack_require__(50));

var _filterDuplicatesById = _interopRequireDefault(__webpack_require__(58));

var _mergeById = _interopRequireDefault(__webpack_require__(60));

var _this = void 0;

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(Object(source), true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(Object(source)).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

var _default = function (resource) {
  var _this2 = this;

  _newArrowCheck(this, _this);

  var modules = Object.keys(resource).filter(function (k) {
    _newArrowCheck(this, _this2);

    return k[0] !== '_';
  }.bind(this)).map(function (key) {
    _newArrowCheck(this, _this2);

    return resource[key].apiModel;
  }.bind(this));
  var actions = modules.reduce(function (obj, name) {
    var _objectSpread2;

    _newArrowCheck(this, _this2);

    return _objectSpread({}, obj, (_objectSpread2 = {}, _defineProperty(_objectSpread2, (0, _propertyAction.default)('list', name), function (_ref, list) {
      var state = _ref.state,
          commit = _ref.commit;
      commit(name, list.concat(state[name]).filter(_filterDuplicatesById.default));
    }), _defineProperty(_objectSpread2, (0, _propertyAction.default)('get', name), function (_ref2, data) {
      var state = _ref2.state,
          commit = _ref2.commit;
      commit(name, (0, _mergeById.default)(state[name], data));
    }), _defineProperty(_objectSpread2, (0, _propertyAction.default)('put', name), function (_ref3, data) {
      var state = _ref3.state,
          commit = _ref3.commit;
      commit(name, (0, _mergeById.default)(state[name], data));
    }), _defineProperty(_objectSpread2, (0, _propertyAction.default)('post', name), function (_ref4, data) {
      var state = _ref4.state,
          commit = _ref4.commit;
      commit(name, (0, _mergeById.default)(state[name], data));
    }), _defineProperty(_objectSpread2, (0, _propertyAction.default)('delete', name), function (_ref5, id) {
      var _this3 = this;

      var state = _ref5.state,
          commit = _ref5.commit;
      commit(name, state[name].filter(function (entry) {
        _newArrowCheck(this, _this3);

        return entry.id !== id;
      }.bind(this)));
    }), _objectSpread2));
  }.bind(this), {});
  var mutations = modules.reduce(function (obj, name) {
    _newArrowCheck(this, _this2);

    return _objectSpread({}, obj, _defineProperty({}, name, function (state, arr) {
      state[name] = arr;
    }));
  }.bind(this), {});
  var getters = modules.reduce(function (obj, name) {
    _newArrowCheck(this, _this2);

    return _objectSpread({}, obj, _defineProperty({}, name, function (state) {
      return state[name];
    }));
  }.bind(this), {});
  var state = modules.reduce(function (obj, name) {
    _newArrowCheck(this, _this2);

    return _objectSpread({}, obj, _defineProperty({}, name, []));
  }.bind(this), {});
  return {
    actions: actions,
    getters: getters,
    mutations: mutations,
    state: state
  };
}.bind(void 0);

exports.default = _default;

/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = propertyAction;

var _upperFirst = _interopRequireDefault(__webpack_require__(51));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function propertyAction(action, property) {
  return "".concat(action).concat((0, _upperFirst.default)(property));
}

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

var createCaseFirst = __webpack_require__(52);

/**
 * Converts the first character of `string` to upper case.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category String
 * @param {string} [string=''] The string to convert.
 * @returns {string} Returns the converted string.
 * @example
 *
 * _.upperFirst('fred');
 * // => 'Fred'
 *
 * _.upperFirst('FRED');
 * // => 'FRED'
 */
var upperFirst = createCaseFirst('toUpperCase');

module.exports = upperFirst;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

var castSlice = __webpack_require__(53),
    hasUnicode = __webpack_require__(15),
    stringToArray = __webpack_require__(55),
    toString = __webpack_require__(14);

/**
 * Creates a function like `_.lowerFirst`.
 *
 * @private
 * @param {string} methodName The name of the `String` case method to use.
 * @returns {Function} Returns the new case function.
 */
function createCaseFirst(methodName) {
  return function(string) {
    string = toString(string);

    var strSymbols = hasUnicode(string)
      ? stringToArray(string)
      : undefined;

    var chr = strSymbols
      ? strSymbols[0]
      : string.charAt(0);

    var trailing = strSymbols
      ? castSlice(strSymbols, 1).join('')
      : string.slice(1);

    return chr[methodName]() + trailing;
  };
}

module.exports = createCaseFirst;


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

var baseSlice = __webpack_require__(54);

/**
 * Casts `array` to a slice if it's needed.
 *
 * @private
 * @param {Array} array The array to inspect.
 * @param {number} start The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the cast slice.
 */
function castSlice(array, start, end) {
  var length = array.length;
  end = end === undefined ? length : end;
  return (!start && end >= length) ? array : baseSlice(array, start, end);
}

module.exports = castSlice;


/***/ }),
/* 54 */
/***/ (function(module, exports) {

/**
 * The base implementation of `_.slice` without an iteratee call guard.
 *
 * @private
 * @param {Array} array The array to slice.
 * @param {number} [start=0] The start position.
 * @param {number} [end=array.length] The end position.
 * @returns {Array} Returns the slice of `array`.
 */
function baseSlice(array, start, end) {
  var index = -1,
      length = array.length;

  if (start < 0) {
    start = -start > length ? 0 : (length + start);
  }
  end = end > length ? length : end;
  if (end < 0) {
    end += length;
  }
  length = start > end ? 0 : ((end - start) >>> 0);
  start >>>= 0;

  var result = Array(length);
  while (++index < length) {
    result[index] = array[index + start];
  }
  return result;
}

module.exports = baseSlice;


/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

var asciiToArray = __webpack_require__(56),
    hasUnicode = __webpack_require__(15),
    unicodeToArray = __webpack_require__(57);

/**
 * Converts `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function stringToArray(string) {
  return hasUnicode(string)
    ? unicodeToArray(string)
    : asciiToArray(string);
}

module.exports = stringToArray;


/***/ }),
/* 56 */
/***/ (function(module, exports) {

/**
 * Converts an ASCII `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function asciiToArray(string) {
  return string.split('');
}

module.exports = asciiToArray;


/***/ }),
/* 57 */
/***/ (function(module, exports) {

/**
 * Converts an ASCII `string` to an array.
 *
 * @private
 * @param {string} string The string to convert.
 * @returns {Array} Returns the converted array.
 */
function asciiToArray(string) {
  return string.split('');
}

module.exports = asciiToArray;


/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _filterDuplicatesByProperty = _interopRequireDefault(__webpack_require__(59));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _default = (0, _filterDuplicatesByProperty.default)('id');

exports.default = _default;

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = filterDuplicatesByProperty;

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

function filterDuplicatesByProperty(key) {
  return function boundFilterDuplicatesByProperty(el, i, arr) {
    var _this = this;

    var value = el[key];
    var firstEntry = arr.find(function (element) {
      _newArrowCheck(this, _this);

      return element[key] === value;
    }.bind(this));
    return arr.indexOf(firstEntry) === i;
  };
}

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = mergeById;

function _newArrowCheck(innerThis, boundThis) { if (innerThis !== boundThis) { throw new TypeError("Cannot instantiate an arrow function"); } }

function _toConsumableArray(arr) { return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread(); }

function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance"); }

function _iterableToArray(iter) { if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter); }

function _arrayWithoutHoles(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } }

function mergeById(originalArray, newData) {
  var _this = this;

  var shallowCopy = _toConsumableArray(originalArray);

  var index = shallowCopy.findIndex(function (data) {
    _newArrowCheck(this, _this);

    return data.id === newData.id;
  }.bind(this));

  if (index === -1) {
    shallowCopy.push(newData);
  } else {
    shallowCopy[index] = newData;
  }

  return shallowCopy;
}

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var _default = 'VRR';
exports.default = _default;

/***/ })
/******/ ]);
});
//# sourceMappingURL=vue-rest-resource.js.map