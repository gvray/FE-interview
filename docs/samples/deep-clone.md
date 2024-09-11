---
sidebar_position: 5
---
# 手写深拷贝

> 深拷贝是面试高频题，但「能跑」的版本和「工业级」的版本差距很大。本文从最简的递归版逐步加上循环引用处理、特殊对象支持、引用保持等能力，最后与原生 `structuredClone` 做横向对比。

## 题目描述

实现 `deepClone(obj, options)`：

1. 正确处理 `Object` / `Array` 的嵌套拷贝。
2. 处理循环引用（不爆栈、不丢失）。
3. 支持常见特殊对象：`Date` / `RegExp` / `Map` / `Set` / `BigInt` / `Symbol`。
4. 同一对象在源里多次引用，拷贝后仍保持同一引用（引用保持）。
5. 不丢失原型链上的属性（可选）。

## 思路分析

整体策略：**用 WeakMap 记录「源对象 → 克隆对象」的映射**，遇到第二次再遇到同一引用时直接返回缓存，解决循环引用 + 引用保持。

按类型分派：

- **基础类型**（`null` / `undefined` / `number` / `string` / `boolean` / `symbol` / `bigint`）：直接返回原值。
- **函数**：通常返回原函数（或用 `new Function` 重建，但会丢闭包，工业上不推荐拷贝函数）。
- **Date**：`new Date(date)`。
- **RegExp**：`new RegExp(re.source, re.flags)`。
- **Map**：新建 Map，递归拷贝每个 `key/value`。
- **Set**：新建 Set，递归拷贝每个 `value`。
- **ArrayBuffer / TypedArray**：底层 buffer 拷贝再构造。
- **普通对象/数组**：根据 `constructor` 重建同类型实例，遍历可枚举属性递归拷贝。
- **Symbol 作为 key**：用 `Reflect.ownKeys` 拿到所有 key（含 Symbol）。

边界：`constructor` 可能被改写或不存在（如 `Object.create(null)`），需要 fallback。

## 完整实现

```js
const PURE_OBJECT = Object.prototype;

function isObject(obj) {
  const type = typeof obj;
  return obj !== null && (type === 'object' || type === 'function');
}

function isBuffer(val) {
  return typeof ArrayBuffer !== 'undefined' && val instanceof ArrayBuffer;
}

function isTypedArray(val) {
  // Uint8Array / Int32Array / Float64Array 等
  const proto = Object.getPrototypeOf(val);
  return proto && proto.constructor && /^(Uint|Int|Float)\d+Array$/.test(proto.constructor.name);
}

function initClone(val) {
  // 根据类型构造一个空壳，后续填充
  if (Array.isArray(val)) return [];
  if (val instanceof Date) return new Date(val.getTime());
  if (val instanceof RegExp) return new RegExp(val.source, val.flags);
  if (val instanceof Map) return new Map();
  if (val instanceof Set) return new Set();
  if (isBuffer(val)) return val.slice(0); // 共享 buffer 副本
  if (isTypedArray(val)) {
    const Ctor = val.constructor;
    return new Ctor(val.buffer.slice(0), val.byteOffset, val.length);
  }
  // 普通对象：尝试用原构造函数，否则用空对象
  const Ctor = val.constructor;
  if (Ctor && Ctor !== Object && typeof Ctor === 'function') {
    try {
      return new Ctor();
    } catch (e) {
      // 构造函数有副作用或必传参数，回退到纯对象
      return Object.create(Object.getPrototypeOf(val));
    }
  }
  return Object.create(Object.getPrototypeOf(val));
}

function deepClone(source, hash = new WeakMap(), options = {}) {
  const { preserveFunc = true } = options;

  // 基础类型直接返回
  if (!isObject(source)) return source;

  // 函数：默认原样返回（闭包无法重建）
  if (typeof source === 'function') {
    return preserveFunc ? source : undefined;
  }

  // 命中缓存，解决循环引用 + 引用保持
  if (hash.has(source)) return hash.get(source);

  const target = initClone(source);
  hash.set(source, target);

  // Map / Set 单独遍历
  if (source instanceof Map) {
    source.forEach((value, key) => {
      target.set(deepClone(key, hash, options), deepClone(value, hash, options));
    });
    return target;
  }
  if (source instanceof Set) {
    source.forEach((value) => {
      target.add(deepClone(value, hash, options));
    });
    return target;
  }

  // 普通对象/数组：遍历所有自有 key（含 Symbol）
  const keys = Reflect.ownKeys(source);
  for (let i = 0; i < keys.length; i++) {
    const key = keys[i];
    // 跳过可能因为 setter 导致副作用的描述符为访问器的情况
    const descriptor = Object.getOwnPropertyDescriptor(source, key);
    if (descriptor && 'value' in descriptor) {
      target[key] = deepClone(source[key], hash, options);
    } else {
      // 访问器属性：直接拷贝描述符，不调用 getter（避免副作用）
      Object.defineProperty(target, key, descriptor);
    }
  }
  return target;
}
```

## 边界与测试用例

```js
// 1. 基础对象
const obj = { a: 1, b: { c: 2 }, d: [1, 2, { e: 3 }] };
const cp = deepClone(obj);
console.log(cp.b === obj.b); // false
cp.b.c = 999;
console.log(obj.b.c); // 2，原对象未受影响

// 2. 循环引用
const cyclic = { name: 'root' };
cyclic.self = cyclic;
const c = deepClone(cyclic);
console.log(c.self === c); // true，引用保持
console.log(c === cyclic); // false

// 3. 同一对象被多处引用
const child = { v: 1 };
const holder = { a: child, b: child };
const h2 = deepClone(holder);
console.log(h2.a === h2.b); // true，引用关系保留

// 4. 特殊对象
const special = {
  date: new Date('2024-01-01'),
  reg: /abc/gi,
  map: new Map([['k', { v: 1 }]]),
  set: new Set([1, 2, 3]),
  sym: Symbol('s'),
  bigint: 10n,
};
const sc = deepClone(special);
console.log(sc.date instanceof Date, sc.date.getTime()); // true, same
console.log(sc.reg.flags); // gi
console.log(sc.map.get('k').v); // 1

// 5. 访问器属性不被 getter 调用
let touched = 0;
const acc = {};
Object.defineProperty(acc, 'x', {
  get() {
    touched++;
    return 1;
  },
});
const accCp = deepClone(acc);
console.log(touched); // 0，未触发 getter

// 6. Symbol 作为 key
const withSym = { [Symbol('a')]: 1, b: 2 };
const ws = deepClone(withSym);
console.log(Object.getOwnPropertySymbols(ws).length); // 1
```

## 与 structuredClone 的对比

原生 `structuredClone` 自 Chrome 98 / Node 17 起可用：

```js
structuredClone({ a: 1, b: { c: 2 }, d: new Date() });
```

| 维度 | 手写深拷贝 | structuredClone |
| --- | --- | --- |
| 循环引用 | 支持（WeakMap） | 支持 |
| 引用保持 | 支持（WeakMap） | 支持 |
| 特殊对象 | 需自己 case-by-case 处理 | 内置支持 Date/RegExp/Map/Set/ArrayBuffer 等 |
| 函数 | 可选保留 | **直接抛 DataCloneError** |
| DOM 节点 | 自己实现可能出错 | 不支持，抛错 |
| 性能 | 大对象下慢 | C++ 实现，更快 |
| Symbol key | 支持 | 抛错 |
| 原型链 | 可保留 | 保留（同构造） |
| 错误对象 | 保留 `Error` 实例 | 保留 |

结论：**没有特殊需求优先用 `structuredClone`**，需要拷贝函数或 Symbol key、需要兼容老浏览器时用手写版。`JSON.parse(JSON.stringify(x))` 仅适合纯数据场景，会丢 `undefined` / 函数 / Symbol / Date 等，并且不能处理循环引用。

## 进阶追问

1. **为什么用 WeakMap 而不是 Map？** WeakMap 的 key 是弱引用，clone 完成后无外部引用可被 GC，不会内存泄漏；Map 会强引用源对象。
2. **如何处理访问器属性？** 应该用 `getOwnPropertyDescriptor` + `Object.defineProperty` 直接拷贝描述符，而不是调用 getter，否则可能触发副作用或抛错。
3. **如何保留原型链？** 用 `Object.create(Object.getPrototypeOf(source))` 创建空壳，再定义属性即可保留原型。
4. **Symbol key 怎么不丢？** 用 `Reflect.ownKeys` 或 `Object.getOwnPropertySymbols` 拿到全部自有 key。
5. **栈溢出怎么办？** 递归版在深嵌套（如几千层链表）时会爆栈，工业实现要改成迭代 + 显式栈，每个节点记录「未处理子项的迭代器」。
6. **拷贝 `class` 实例会发生什么？** 如果构造函数有必传参数或副作用，`new Ctor()` 会出问题。更安全的做法是 `Object.create(proto)` 再拷属性，但这样跳过了构造逻辑。
7. **`JSON.parse(JSON.stringify(x))` 为什么不够？** 丢 `undefined` / 函数 / Symbol、Date 变字符串、RegExp 变空对象、循环引用直接抛 `TypeError`。
8. **如何做到「按需克隆」惰性？** 用 Proxy 包一层，访问到才递归拷贝子树，适合大对象的延迟深拷贝。
