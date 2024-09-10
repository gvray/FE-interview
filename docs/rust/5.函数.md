---
sidebar_position: 5
---

# 函数

## 1. 定义函数
Rust 使用 `fn` 关键字来定义函数，基本结构如下：

```rust
fn function_name(parameter1: type, parameter2: type) -> return_type {
    // 函数体
}
```

- `fn` 是函数的声明关键字。
- `function_name` 是函数的名称。
- 函数参数在圆括号中定义，参数类型紧随其后。
- 使用 `-> return_type` 定义返回值类型。如果没有返回值，可以省略这个部分或使用 `()`，即空元组。
- 函数体用花括号包裹。

## 2. 示例：无参无返回值的函数

```rust
fn say_hello() {
    println!("Hello, world!");
}

fn main() {
    say_hello(); // 调用函数
}
```

这个函数不接受任何参数，也不返回任何值。`println!` 是一个宏，用于打印输出。

## 3. 有参数的函数

```rust
fn greet(name: &str) {
    println!("Hello, {}!", name);
}

fn main() {
    greet("Alice"); // 调用时传递参数
}
```

这里 `greet` 函数接受一个字符串参数，并在输出时使用。

## 4. 有返回值的函数

函数可以返回值，返回值的类型要在函数签名中指定，且最后一行可以省略 `return` 关键字：

```rust
fn add(x: i32, y: i32) -> i32 {
    x + y  // 省略 return，最后一行作为返回值
}

fn main() {
    let result = add(5, 3);
    println!("Result: {}", result);
}
```

这里 `add` 函数接受两个 `i32` 类型的参数，并返回它们的和。

## 5. 返回多个值（使用元组）

如果你想返回多个值，可以使用元组：

```rust
fn swap(x: i32, y: i32) -> (i32, i32) {
    (y, x)
}

fn main() {
    let (a, b) = swap(1, 2);
    println!("Swapped values: {} {}", a, b);
}
```

`swap` 函数返回一个元组，其中包含交换后的值。

## 6. 函数中的可变参数（可选参数）

Rust 不支持类似其他语言中的可变参数，但你可以使用 `Option` 来模拟可选参数：

```rust
fn maybe_print(value: Option<i32>) {
    match value {
        Some(v) => println!("Value is: {}", v),
        None => println!("No value provided"),
    }
}

fn main() {
    maybe_print(Some(10));
    maybe_print(None);
}
```

## 7. 高阶函数

Rust 支持函数作为参数和返回值，称为高阶函数：

```rust
fn apply<F>(f: F) 
where F: Fn() {
    f();
}

fn main() {
    let closure = || println!("This is a closure");
    apply(closure); // 传递闭包
}
```

这里 `apply` 函数接受一个闭包作为参数，并在函数体中调用该闭包。

## 8. 闭包

闭包是可以捕获外部环境的匿名函数：

```rust
fn main() {
    let x = 10;
    let print_x = || println!("x is: {}", x);
    print_x();
}
```
