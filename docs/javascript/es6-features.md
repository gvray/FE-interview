---
sidebar_position: 21
title: ES6+有哪些新特性
---

# ES6+有哪些新特性

## ES6新增特性

- let 和 const 声明
- 解构（数组、对象解构）-快速提取数组/对象中的元素
- 模板字符串-可以换行、插值、使用标签函数进行字符串操作
- 字符串扩展方法（includes, startsWith, endsWith...）
- 参数默认值和剩余参数
- 扩展运算符
- 箭头函数
- 类和继承
- 对象新增了些方法 (Object.is, Object.assign...)
- Promise
- 模块化 可以使用 import 和 export 关键字来导入和导出模块。
- 新的数据结构 包括 Map、Set、WeakMap 和 WeakSet。
- Proxy 非必需
- Reflect 对象的操作更加统一、灵活和标准化。 非必需
- Symbol
- Iterator 迭代器 和 for...of 循环
- Generator 生成器

## FAQ?

### es5 中的类和es6中的class有什么区别？

- class类必须new调用，不可以直接执行
- class类不存在变量提升
- class类无法遍历它实例原型链上的属性和方法
- es6为new命令引入了一个new.target属性，它会返回new命令作用于的那个构造函数。如果不是通过new调用或Reflect.construct()调用的，new.target会返回undefined
- class类有static静态方法

### 你是怎么理解ES6中 Decorator 的？使用场景有哪些？

Decorator（装饰器）是一种与类（class）相关的语法，用来修改和注解类及其成员。它本质上是一个函数，在类声明时被调用，接收被装饰的目标（类、方法、属性等）并返回新的描述或直接修改原目标。装饰器目前仍是提案（TC39 Stage 3），常通过 Babel 编译使用。

**基本语法：**

```js
// 类装饰器
function loggable(target) {
  target.prototype.log = function () {
    console.log(this.constructor.name);
  };
}

@loggable
class Foo {}
new Foo().log(); // Foo

// 方法装饰器：(target, key, descriptor)
function readonly(target, key, descriptor) {
  descriptor.writable = false;
  return descriptor;
}

class Person {
  @readonly
  getName() {
    return this.name;
  }
}
```

**使用场景：**

- 日志、埋点：在方法执行前后统一打印日志或上报数据。
- 权限控制：根据角色决定方法是否可调用。
- 数据校验：校验方法参数或属性赋值。
- 防抖/节流：将普通方法包装成 debounced 方法。
- 类的混入（mixin）：动态给类扩展能力。
- 框架中的广泛应用：Angular（组件、依赖注入）、TypeScript 类注解、NestJS（控制器、中间件）等。

装饰器的好处是把与核心业务无关的横切逻辑（日志、权限、校验等）从业务代码中抽离出来，提升可复用性和可维护性。

### 你是怎么理解ES6中Proxy的？使用场景有哪些?

`Proxy` 是一种用于创建代理对象的机制，它允许你在目标对象之前设置一个拦截器（handler），从而可以对目标对象的访问进行控制、修改和扩展。

**`Proxy` 的基本语法如下：**

```javascript
let proxy = new Proxy(target, handler);
```

- `target`：要代理的目标对象。
- `handler`：一个对象，定义了拦截器（handler）函数，可以定制目标对象的行为。

**handler解析**

关于`handler`拦截属性，有如下：

- get(target,propKey,receiver)：拦截对象属性的读取
- set(target,propKey,value,receiver)：拦截对象属性的设置
- has(target,propKey)：拦截`propKey in proxy`的操作，返回一个布尔值
- deleteProperty(target,propKey)：拦截`delete proxy[propKey]`的操作，返回一个布尔值
- ownKeys(target)：拦截`Object.keys(proxy)`、`for...in`等循环，返回一个数组
- getOwnPropertyDescriptor(target, propKey)：拦截`Object.getOwnPropertyDescriptor(proxy, propKey)`，返回属性的描述对象
- defineProperty(target, propKey, propDesc)：拦截`Object.defineProperty(proxy, propKey, propDesc）`，返回一个布尔值
- preventExtensions(target)：拦截`Object.preventExtensions(proxy)`，返回一个布尔值
- getPrototypeOf(target)：拦截`Object.getPrototypeOf(proxy)`，返回一个对象
- isExtensible(target)：拦截`Object.isExtensible(proxy)`，返回一个布尔值
- setPrototypeOf(target, proto)：拦截`Object.setPrototypeOf(proxy, proto)`，返回一个布尔值
- apply(target, object, args)：拦截 Proxy 实例作为函数调用的操作
- construct(target, args)：拦截 Proxy 实例作为构造函数调用的操作

使用场景包括但不限于：

`Proxy`其功能非常类似于设计模式中的代理模式，常用功能如下：

- 拦截和监视外部对对象的访问
- 降低函数或类的复杂度
- 在复杂操作前对操作进行校验或对所需资源进行管理

使用 `Proxy` 保障数据类型的准确性

```js
let numericDataStore = { count: 0, amount: 1234, total: 14 };
numericDataStore = new Proxy(numericDataStore, {
    set(target, key, value, proxy) {
        if (typeof value !== 'number') {
            throw Error("属性只能是number类型");
        }
        return Reflect.set(target, key, value, proxy);
    }
});

numericDataStore.count = "foo"
// Error: 属性只能是number类型

numericDataStore.count = 333
// 赋值成功
```

声明了一个私有的 `apiKey`，便于 `api` 这个对象内部的方法调用，但不希望从外部也能够访问 `api._apiKey`

```js
let api = {
    _apiKey: '123abc456def',
    getUsers: function(){ },
    getUser: function(userId){ },
    setUser: function(userId, config){ }
};
const RESTRICTED = ['_apiKey'];
api = new Proxy(api, {
    get(target, key, proxy) {
        if(RESTRICTED.indexOf(key) > -1) {
            throw Error(`${key} 不可访问.`);
        } return Reflect.get(target, key, proxy);
    },
    set(target, key, value, proxy) {
        if(RESTRICTED.indexOf(key) > -1) {
            throw Error(`${key} 不可修改`);
        } return Reflect.get(target, key, value, proxy);
    }
});

console.log(api._apiKey)
api._apiKey = '987654321'
// 上述都抛出错误
```

还能通过使用`Proxy`实现观察者模式

观察者模式（Observer mode）指的是函数自动观察数据对象，一旦对象有变化，函数就会自动执行

`observable`函数返回一个原始对象的 `Proxy` 代理，拦截赋值操作，触发充当观察者的各个函数

```js
const queuedObservers = new Set();

const observe = fn => queuedObservers.add(fn);
const observable = obj => new Proxy(obj, {set});

function set(target, key, value, receiver) {
  const result = Reflect.set(target, key, value, receiver);
  queuedObservers.forEach(observer => observer());
  return result;
}
```

其他、属性访问控制、属性值的验证、函数调用拦截、属性枚举控制、日志记录等

### 怎么理解ES6中 Generator的？使用场景有哪些？

Generator 是 ES6 提供的一种可以暂停执行、再恢复执行的函数。写法上在 `function` 关键字后加 `*`，函数内部通过 `yield` 表达式定义暂停点。调用 Generator 函数不会立即执行，而是返回一个迭代器（Iterator）对象，通过调用它的 `next()` 方法依次执行到下一个 `yield`，返回 `{ value, done }`。

```js
function* gen() {
  const a = yield 1;
  console.log("a =", a);
  const b = yield 2;
  console.log("b =", b);
  return 3;
}

const it = gen();
it.next();        // { value: 1, done: false }
it.next("AA");    // 打印 a = AA，返回 { value: 2, done: false }
it.next("BB");    // 打印 b = BB，返回 { value: 3, done: true }
```

Generator 的关键特性：

- 函数体可以分段执行，通过 `yield` 暂停并通过 `next(value)` 向内传值。
- 自动实现 `Symbol.iterator`，因此可被 `for...of`、扩展运算符、解构等消费。
- 可以用 `yield*` 委托给另一个可迭代对象，组合多个生成器。
- 与 `Promise` 配合可以实现异步流程控制（早期 `co` 库即基于此）。

**使用场景：**

- 自定义迭代器：将任意数据结构按规则遍历输出。
- 状态机：利用暂停和恢复表达复杂的状态流转。
- 惰性计算：按需生成无限序列，如斐波那契数列。
- 异步流程控制：`async/await` 本质就是 Generator + Promise 的语法糖，Babel 编译时也依赖 Generator 的运行时。
- React 中的 `redux-saga` 通过 Generator 组织副作用，让异步代码可测试、易于取消。

### ES6中新增的Set、Map两种数据结构怎么理解?

`Set`是一种叫做集合的数据结构，`Map`是一种叫做字典的数据结构

### ES6中函数新增了哪些扩展?

1. **参数**

   - 允许默认参数
   - 形参是默认声明的，不能使用`let`或`const`再次声明
   - 参数默认值可以与解构赋值的默认值结合起来使用

2. **属性**

   - length`将返回没有指定默认值的参数个数

     ```js
     (function (a) {}).length // 1
     (function (a = 5) {}).length // 0
     (function (a, b, c = 5) {}).length // 2
     (function(...args) {}).length // 0 rest 参数也不会计入length属性
     (function (a = 0, b, c) {}).length // 0 如果设置了默认值的参数不是尾参数，那么length属性也不再计入后面的参数了
     
     ```

   - name属性

     ```js
     var f = function () {};
     // ES5
     f.name // ""
     // ES6
     f.name // "f"
     
     // 如果将一个具名函数赋值给一个变量，则 name属性都返回这个具名函数原本的名字
     const bar = function baz() {};
     bar.name // "baz"
     // Function构造函数返回的函数实例，name属性的值为anonymous
     (new Function).name // "anonymous"
     // bind返回的函数，name属性值会加上bound前缀
     function foo() {};
     foo.bind({}).name // "bound foo"
     
     (function(){}).bind({}).name // "bound "
     ```

3. **作用域**

   - 一旦设置了参数的默认值，函数进行声明初始化时，参数会形成一个单独的作用域
   - 等到初始化结束，这个作用域就会消失。这种语法行为，在不设置参数默认值时，是不会出现的
   - 下面例子中，`y=x`会形成一个单独作用域，`x`没有被定义，所以指向全局变量`x`

    ```js
    let x = 1;

    function f(y = x) { 
    // 等同于 let y = x  
    let x = 2; 
    console.log(y);
    }

    f() // 1
    ```

4. **严格模式**

 要函数参数使用了默认值、解构赋值、或者扩展运算符，那么函数内部就不能显式设定为严格模式，否则会报错

    ```js
    // 报错
    function doSomething(a, b = a) {
    'use strict';
    // code
    }
    
    // 报错
    const doSomething = function ({a, b}) {
    'use strict';
    // code
    };
    
    // 报错
    const doSomething = (...a) => {
    'use strict';
    // code
    };
    
    const obj = {
    // 报错
    doSomething({a, b}) {
        'use strict';
        // code
    }
    };
    
    ```

5. **箭头函数**

- 函数体内的`this`对象，就是定义时所在的对象，而不是使用时所在的对象
- 不可以当作构造函数，也就是说，不可以使用`new`命令，否则会抛出一个错误
- 不可以使用`arguments`对象，该对象在函数体内不存在。如果要用，可以用 `rest` 参数代替
- 不可以使用`yield`命令，因此箭头函数不能用作 Generator 函数

6. **尾调用优化**

   尾调用是指函数的最后一步是调用另一个函数，并且当前函数的返回值就是另一个函数的返回值。ES6 规范中要求 JavaScript 引擎对尾调用进行优化，避免出现栈溢出的情况。

### ES6中对象新增了哪些扩展?

1. **对象字面量扩展**：

   - **简洁属性**：属性方法简写

   ```javascript
   let name = 'John';
   let age = 30;
   let person = { name, age, say(){} };
   ```

   - **计算属性名**：允许在对象字面量中使用表达式作为属性名。

   ```javascript
   let prop = 'name';
   let person = {
       [prop]: 'John'
   };
   ```

2. **super 关键字**：
   `super` 关键字用于在子类中调用父类的方法。

   ```javascript
   class Parent {
       constructor() {
           this.name = 'Parent';
       }
       greet() {
           return 'Hello, ' + this.name;
       }
   }
   
   class Child extends Parent {
       constructor() {
           super();
           this.name = 'Child';
       }
       greet() {
           return super.greet() + '!';
       }
   }
   
   let child = new Child();
   child.greet(); // 输出 "Hello, Child!"
   ```

3. **扩展运算符**

   在解构赋值中，未被读取的可遍历的属性，分配到指定的对象上面

   ```js
   let { x, y, ...z } = { x: 1, y: 2, a: 3, b: 4 };
   x // 1
   y // 2
   z // { a: 3, b: 4 }
   ```

4. **属性的遍历**

   ES6 一共有 5 种方法可以遍历对象的属性。

   - for...in：循环遍历对象自身的和继承的可枚举属性（不含 Symbol 属性）
   - Object.keys(obj)：返回一个数组，包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名
   - Object.getOwnPropertyNames(obj)：回一个数组，包含对象自身的所有属性（不含 Symbol 属性，但是包括不可枚举属性）的键名
   - Object.getOwnPropertySymbols(obj)：返回一个数组，包含对象自身的所有 Symbol 属性的键名
   - Reflect.ownKeys(obj)：返回一个数组，包含对象自身的（不含继承的）所有键名，不管键名是 Symbol 或字符串，也不管是否可枚举

   上述遍历，都遵守同样的属性遍历的次序规则：

   - 首先遍历所有数值键，按照数值升序排列
   - 其次遍历所有字符串键，按照加入时间升序排列
   - 最后遍历所有 Symbol 键，按照加入时间升序排

   ```js
   Reflect.ownKeys({ [Symbol()]:0, b:0, 10:0, 2:0, a:0 })
   // ['2', '10', 'b', 'a', Symbol()]
   ```

5. **Object.assign() 方法**：
   `Object.assign()` 方法用于将源对象的所有可枚举属性复制到目标对象中，并返回目标对象。如果目标对象已经存在相同的属性，则后面的属性将覆盖前面的属性。

   ```javascript
   let target = { a: 1, b: 2 };
   let source = { b: 3, c: 4 };
   let result = Object.assign(target, source);
   // result: { a: 1, b: 3, c: 4 }
   ```

6. **Object.keys()、Object.values() 和 Object.entries() 方法**：
   - `Object.keys()` 方法返回一个包含对象自身可枚举属性名称的数组。
   - `Object.values()` 方法返回一个包含对象自身可枚举属性值的数组。
   - `Object.entries()` 方法返回一个包含对象自身可枚举属性键值对的数组。

   ```javascript
   let obj = { a: 1, b: 2, c: 3 };
   Object.keys(obj); // ['a', 'b', 'c']
   Object.values(obj); // [1, 2, 3]
   Object.entries(obj); // [['a', 1], ['b', 2], ['c', 3]]
   ```

7. **Object.setPrototypeOf() 和 getPrototypeOf() getOwnPropertyDescriptors()**：
   `Object.setPrototypeOf()` 方法用于设置一个对象的原型（即修改对象的 `[[Prototype]]` 属性）。

   ```javascript
   let obj = Object.create(null);
   Object.setPrototypeOf(obj, Object.prototype);
   //用于读取一个对象的原型对象
   Object.getPrototypeOf(obj);
   
   // 返回指定对象所有自身属性（非继承属性）的描述对象
   const obj = {
     foo: 123,
     get bar() { return 'abc' }
   };
   
   Object.getOwnPropertyDescriptors(obj)
   // { foo:
   //    { value: 123,
   //      writable: true,
   //      enumerable: true,
   //      configurable: true },
   //   bar:
   //    { get: [Function: get bar],
   //      set: undefined,
   //      enumerable: true,
   //      configurable: true } }
   ```

8. **Object.is()**

   严格判断两个值是否相等，与严格比较运算符（===）的行为基本一致，不同之处只有两个：一是`+0`不等于`-0`，二是`NaN`等于自身

   ```js
   +0 === -0 //true
   NaN === NaN // false
   
   Object.is(+0, -0) // false
   Object.is(NaN, NaN) // true
   ```

### ES6中数组新增了哪些扩展?

1. **扩展运算符（Spread Operator）**：
   扩展运算符（`...`）可以将一个可迭代对象（如数组）展开为多个参数或元素。它可以用于创建新数组、合并数组、传递函数参数等。

   ```javascript
   let arr1 = [1, 2, 3];
   let arr2 = [4, 5, 6];
   let combined = [...arr1, ...arr2]; // [1, 2, 3, 4, 5, 6]
   ```

2. **Array.from() 方法**：
   `Array.from()` 方法可以将类数组对象或可迭代对象（如字符串、Set、Map 等）转换为数组。

   ```javascript
   let str = 'hello';
   let chars = Array.from(str); // ['h', 'e', 'l', 'l', 'o']
   ```

3. **Array.of() 方法**：
   `Array.of()` 方法用于创建一个新数组，它接受任意数量的参数，并将这些参数作为数组的元素。

   ```javascript
   let arr = Array.of(1, 2, 3); // [1, 2, 3]
   ```

4. **Array.prototype.find() 和 Array.prototype.findIndex() 方法**：
   `find()` 方法用于查找数组中满足条件的第一个元素，并返回其值；`findIndex()` 方法用于查找数组中满足条件的第一个元素，并返回其索引。

   ```javascript
   let arr = [1, 2, 3, 4, 5];
   let found = arr.find(num => num > 2); // 3
   let foundIndex = arr.findIndex(num => num > 2); // 2
   ```

5. **Array.prototype.includes() 方法**：
   `includes()` 方法用于判断数组是否包含某个值，返回一个布尔值。

   ```javascript
   let arr = [1, 2, 3, 4, 5];
   let hasThree = arr.includes(3); // true
   ```

6. **Array.prototype.fill() 方法**：
   `fill()` 方法用于填充数组的元素，可以指定填充的值和起始索引、结束索引。

   ```javascript
   let arr = [1, 2, 3, 4, 5];
   arr.fill(0, 1, 3); // [1, 0, 0, 4, 5]
   ```

7. **Array.prototype.keys()、Array.prototype.values() 和 Array.prototype.entries() 方法**：
   `keys()` 方法返回一个包含数组索引的迭代器；`values()` 方法返回一个包含数组值的迭代器；`entries()` 方法返回一个包含数组索引和值的迭代器。

   ```javascript
   let arr = ['a', 'b', 'c'];
   for (let index of arr.keys()) {
       console.log(index); // 0, 1, 2
   }
   ```

8. **Array.prototype.flat() 和 Array.prototype.flatMap() 方法**：
   `flat()` 方法用于将多维数组展平为一维数组；`flatMap()` 方法先对数组每个元素执行一个映射函数，然后对返回的结果数组执行 `flat()` 方法。

   ```javascript
   let arr = [1, [2, 3], [4, [5]]];
   let flatArr = arr.flat(); // [1, 2, 3, 4, [5]]
   ```

9. entries()、keys() 和 values()：用于遍历数组的键值对、键和值。
10. 数组的扩展属性：`Array.prototype.length` 可以被修改，`Array.prototype[@@toStringTag]` 返回 `"Array"`。

### 如何把一个对象变成可迭代对象？

```js
let info = {
  bears: ['ice', 'panda', 'grizzly'],
  [Symbol.iterator]: function() {
    let index = 0
    let _iterator = {
       //这里一定要箭头函数，或者手动保存上层作用域的this
       next: () => {
        if (index < this.bears.length) {
          return { done: false, value: this.bears[index++] }
        }
  
        return { done: true, value: undefined }
      }
    }

    return _iterator
  }
}

let iter = info[Symbol.iterator]()
console.log(iter.next())
console.log(iter.next())
console.log(iter.next())
console.log(iter.next())

//符合可迭代对象协议 就可以利用 for of 遍历
for (let bear of info) {
  console.log(bear)
}
//ice panda grizzly
```

### 说说你对 Iterator, Generator 和 Async/Await 的理解

**Iterrator**

简单的说，我们常用的 `for of` 循环，都是通过调用被循环对象的一个特殊函数 `Iterator` 来实现的，但是以前这个函数是隐藏的我们无法访问， 从 `Symbol` 引入之后，我们就可以通过 `Symbol.iterator` 来直接读写这个特殊函数。

对于循环语句来说，他并不关心被循环的对象到底是什么，他只负责调用 `data[Symbol.iterator]` 函数，然后根据返回值来进行循环。所以任何对象只要提供了标准的 Iterator 接口即可被循环，比如我们现在来创造一个自定义的数据：

```js
var students = {}
students[Symbol.iterator] = function() {
  let index = 1;
  return { next() {
    return {done: index>100, value: index++} }
  }
}

for(var i of students) { console.log(i); }
```

**Generator**

Generator是一个可以暂停和继续执行的函数。简单的用法，可以当做一个Iterator来用，进行一些遍历操作。复杂一些的用法，他可以在内部保存一些状态，成为一个状态机。

```js
function * count() {
  yield 1
  yield 2
  return 3
}
var c = count()
console.log(c.next()) // { value: 1, done: false }
console.log(c.next()) // { value: 2, done: false }
console.log(c.next()) // { value: 3, done: true }
console.log(c.next()) // { value: undefined, done: true }
```

由于Generator也存在 `Symbol.iterator` 接口，所以他也可以被 `for` 循环调用：

```js
function * count() {
  yield 1
  yield 2
  return 3
}
var c = count()
for (i of c) console.log(i) // 1, 2 不过这里要注意一个不同点，调用 next 的时候能得到 3 ，但是用 for 则会忽略最后的 return 语句。 也就是 for 循环会忽略 generator 中的 return 语句.
```

**Async/Await**

我最开始接触到 Async/Await 的时候把它当成了一个 `promise` 的语法糖，但是经过我们对 `Generator` 的理解后，明白了其实他就是 `Generator` 的一个语法糖：

- `async` 对应的是 `*`
- `await` 对应的是 `yield`

他只是自动帮我们进行了 `Generator` 的流程控制而已。

和上面的获取用户信息实现一样的功能的话，基本语法如下：

```js
async function fetchUser() {
  const user = await ajax()
  console.log(user)
}
```

因为有自动的流程控制，所以我们不用手动在ajax成功的时候手动调用 `next`。相比于 `Promise` 或者 `Generator` 的实现，代码要明显更加优雅。

如果有兴趣的话，可以参考一下 `Babel` 是如何编译 `Async/Await` 的，简单的说，代码分成了两部分，一部分是编译了一个 `Generator`，另一部分是通过 promise 实现了generator的流程控制。

```js
async function count () {
  let a = await 1;
  let b = await 2;
  return a+b
}
```

编译后的代码：

```js
var count = function () {
  // 下面这部分是 generator 的一个实现
  var _ref = _asyncToGenerator( /*#__PURE__*/regeneratorRuntime.mark(function _callee() {
    var a, b;
    return regeneratorRuntime.wrap(function _callee$(_context) {
      while (1) {
        switch (_context.prev = _context.next) {
          case 0:
            _context.next = 2;
            return 1;

            // 省略...
        }
      }
    }, _callee, this);
  }));

  return function count() {
    return _ref.apply(this, arguments);
  };
}();

// 下面这部分是用 promise 实现了流程控制。
function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }
```

所以我们可以大约这么认为： **async/await == generator + promise**

**总结**

- `Iterator` 是一个循环接口，任何实现了此接口的数据都可以被 `for of` 循环遍历
- `Generator` 是一个可以暂停和继续执行的函数，他可以完全实现 `Iterator` 的功能，并且由于可以保存上下文，他非常适合实现简单的状态机。另外通过一些流程控制代码的配合，可以比较容易进行异步操作。
- `Async/Await` 就是generator进行异步操作的语法糖。而这个语法糖反而是被使用最广泛的，比如著名的 `Koa`

### Map和WeakMap区别

- Map的键可以是任意类型，WeakMap只接受对象作为键，不接受其它类型的值作为键
- Map的键实际上是跟内存地址绑定的，只要内存地址不一样，就视为两个键；WeakMap的键是弱引用，键所指向的对象是可以被垃圾回收，此时键是无效的。
- Map可以被遍历，WeakMap不能被遍历

### 说说你对 new.target 的理解

`new.target`属性允许你检测函数或构造方法是否是通过new运算符被调用的。

在通过new运算符被初始化的函数或构造方法中，`new.target`返回一个指向构造方法或函数的引用。在普通的函数调用中，`new.target` 的值是undefined。

我们可以使用它来检测，一个函数是否是作为构造函数通过new被调用的。

```js
function Foo() {
  if (!new.target) throw "Foo() must be called with new";
  console.log("Foo instantiated with new");
}

Foo(); // throws "Foo() must be called with new"
new Foo(); // logs "Foo instantiated with new"
```

### object.assign和扩展运算法是深拷贝还是浅拷贝，两者区别是什么？

- 扩展运算符

  ```js
  let outObj = {
    inObj: {a: 1, b: 2}
  }
  let newObj = {...outObj}
  newObj.inObj.a = 2
  console.log(outObj) // {inObj: {a: 2, b: 2}}
  ```

- Object.assign()

  ```js
  let outObj = {
    inObj: {a: 1, b: 2}
  }
  let newObj = Object.assign({}, outObj)
  newObj.inObj.a = 2
  console.log(outObj) // {inObj: {a: 2, b: 2}}
  ```

可以看到，两者都是浅拷贝。

Object.assign()方法接收的第一个参数作为目标对象，后面的所有参数作为源对象。然后把所有的源对象合并到目标对象中。它会修改了一个对象，因此会触发 ES6 setter。

扩展操作符（…）使用它时，数组或对象中的每一个值都会被拷贝到一个新的数组或对象中。它不复制继承的属性或类的属性，但是它会复制ES6的 symbols 属性。

### ES6中的 Reflect 对象有什么用？

Reflect 对象不是构造函数，所以创建时不是用 new 来进行创建。

在 ES6 中增加这个对象的目的：

- 将 Object 对象的一些明显属于语言内部的方法（比如 Object.defineProperty），放到 Reflect 对象上。现阶段，某些方法同时在 Object 和 Reflect 对象上部署，未来的新方法将只部署在 Reflect 对象上。也就是说，从 Reflect 对象上可以拿到语言内部的方法。
- 修改某些 Object 方法的返回结果，让其变得更合理。比如，Object.defineProperty(obj, name, desc)在无法定义属性时，会抛出一个错误，而 Reflect.defineProperty(obj, name, desc)则会返回 false。
- 让 Object 操作都变成函数行为。某些 Object 操作是命令式，比如 name in obj 和 delete obj[name]，而 Reflect.has(obj, name)和 Reflect.deleteProperty(obj, name)让它们变成了函数行为。
- Reflect 对象的方法与 Proxy 对象的方法一一对应，只要是 Proxy 对象的方法，就能在 Reflect 对象上找到对应的方法。这就让 Proxy 对象可以方便地调用对应的 Reflect 方法，完成默认行为，作为修改行为的基础。也就是说，不管 Proxy 怎么修改默认行为，你总可以在 Reflect 上获取默认行为。

```js
var loggedObj = new Proxy(obj, {
  get(target, name) {
    console.log("get", target, name);
    return Reflect.get(target, name);
  },
  deleteProperty(target, name) {
    console.log("delete" + name);
    return Reflect.deleteProperty(target, name);
  },
  has(target, name) {
    console.log("has" + name);
    return Reflect.has(target, name);
  },
});

```

上面代码中，每一个 Proxy 对象的拦截操作（get、delete、has），内部都调用对应的 Reflect 方法，保证原生行为能够正常执行。添加的工作，就是将每一个操作输出一行日志。

### 简单介绍一下symbol

Symbol 是 ES6 的新增属性，代表用给定名称作为唯一标识，这种类型的值可以这样创
建，let id=symbol(“id”)
Symbl 确保唯一，即使采用相同的名称，也会产生不同的值，我们创建一个字段，仅为
知道对应 symbol 的人能访问，使用 symbol 很有用，symbol 并不是 100%隐藏，有内置
方法 Object.getOwnPropertySymbols(obj)可以获得所有的 symbol。
也有一个方法 Reflect.ownKeys(obj)返回对象所有的键，包括 symbol。
所以并不是真正隐藏。但大多数库内置方法和语法结构遵循通用约定他们是隐藏的。

## 参考文献

[ES6官网](https://262.ecma-international.org/6.0/)
[阮一峰ES6学习电子书](https://es6.ruanyifeng.com/#docs/let)
[W3Cschool ES6中文教程](https://www.w3cschool.cn/escript6/escript6-s4pc37et.html)
[菜鸟教程](https://www.runoob.com/w3cnote/es6-tutorial.html)
