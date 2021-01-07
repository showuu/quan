module.exports = (function() {
var __MODS__ = {};
var __DEFINE__ = function(modId, func, req) { var m = { exports: {}, _tempexports: {} }; __MODS__[modId] = { status: 0, func: func, req: req, m: m }; };
var __REQUIRE__ = function(modId, source) { if(!__MODS__[modId]) return require(source); if(!__MODS__[modId].status) { var m = __MODS__[modId].m; m._exports = m._tempexports; var desp = Object.getOwnPropertyDescriptor(m, "exports"); if (desp && desp.configurable) Object.defineProperty(m, "exports", { set: function (val) { if(typeof val === "object" && val !== m._exports) { m._exports.__proto__ = val.__proto__; Object.keys(val).forEach(function (k) { m._exports[k] = val[k]; }); } m._tempexports = val }, get: function () { return m._tempexports; } }); __MODS__[modId].status = 1; __MODS__[modId].func(__MODS__[modId].req, m, m.exports); } return __MODS__[modId].m.exports; };
var __REQUIRE_WILDCARD__ = function(obj) { if(obj && obj.__esModule) { return obj; } else { var newObj = {}; if(obj != null) { for(var k in obj) { if (Object.prototype.hasOwnProperty.call(obj, k)) newObj[k] = obj[k]; } } newObj.default = obj; return newObj; } };
var __REQUIRE_DEFAULT__ = function(obj) { return obj && obj.__esModule ? obj.default : obj; };
__DEFINE__(1597893138137, function(require, module, exports) {
function defineReactive(obj, key, val, callback, options = {}) {
  Object.defineProperty(obj, key, {
    configurable: true,
    emuerable: true,
    get() {
      return val;
    },
    set(newVal) {
      console.log('set', newVal, val)
      if (newVal === val) {
        return;
      }
      const oldVal = val;
      val = newVal;
      callback && typeof callback === "function" && callback(newVal, oldVal);
      options.deep && watch(obj, key, callback, options);
    }
  });
}

function watch(data, exp, callback, options = {}) {
  const k = exp.split(".");
  for (let i = 0; i < k.length - 1; i++) {
    data = data[k[i]]; // 键路径最深一层所属的对象
  }
  const key = k[k.length - 1];
  let val = data[key];
  if (options.deep && typeof val === "object") {
    Object.keys(val).forEach(childKey => {
      watch(val, childKey, callback, options);
    });
  }
  defineReactive(data, key, val, callback, options);
}
function setObserver(ctx) {
  if (!ctx) {
    console.warn("未指定Page所在上下文环境");
    return;
  }
  if (!ctx.data) {
    console.warn("Page缺少data对象");
    return;
  }
  if (!ctx.watch) {
    console.warn("请在Page的watch对象中设置需要监听的属性");
    return;
  }
  // 为watch对象内的每一个属性表达式注册监听器
  Object.keys(ctx.watch).forEach(exp => {
    const callback = (ctx.watch[exp].handler || ctx.watch[exp]).bind(ctx);
    const deep = ctx.watch[exp].deep;
    const options = {
      ...(deep && { deep })
    };
    watch(ctx.data, exp, callback, options);
  });
}

if (!exports.__esModule) Object.defineProperty(exports, "__esModule", { value: true });Object.defineProperty(exports, 'setObserver', { enumerable: true, configurable: true, get: function() { return setObserver; } });Object.defineProperty(exports, 'watch', { enumerable: true, configurable: true, get: function() { return watch; } });

}, function(modId) {var map = {}; return __REQUIRE__(map[modId], modId); })
return __REQUIRE__(1597893138137);
})()
//# sourceMappingURL=index.js.map