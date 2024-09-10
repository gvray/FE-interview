---
sidebar_position: 7
---

# Rust 所有权

Rust 的 **所有权** (ownership) 是其核心的内存管理机制之一，它使得 Rust 能够在不依赖垃圾回收 (GC) 或手动内存管理的情况下，确保内存安全。理解所有权的规则对于掌握 Rust 的内存管理非常重要。我们将从基本概念、借用、移动、克隆、引用等方面来详细讲解 Rust 的所有权。

## 1. 基本概念
在 Rust 中，每一个值都有一个**所有者**。所有权规则如下：
- 每个值都有且只有一个所有者。
- 当所有者离开作用域时，值会被释放，内存也会被回收。
- 所有权可以在不同变量之间转移，但在同一时间只能有一个所有者。

### 示例：

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1;  // s1 的所有权被移动到 s2

    // println!("{}", s1);  // 编译错误：s1 已经失效
    println!("{}", s2);  // s2 是新的所有者
}
```

在上面的例子中，`s1` 拥有字符串 `"hello"` 的所有权。当我们将 `s1` 赋值给 `s2` 时，所有权从 `s1` 转移到了 `s2`，因此 `s1` 不再有效。如果我们尝试使用 `s1`，Rust 编译器会报错。

## 2. 移动 (Move)

在 Rust 中，当你将一个值赋值给另一个变量时，默认情况下会发生**所有权的转移**（也称为移动）。移动意味着原变量的所有权被转移，原变量不再有效。

### 示例：

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1;  // s1 的所有权被移动到 s2
    println!("{}", s2);
}
```

如上例所示，`s1` 的所有权被移动到 `s2`。在这个过程中，并不会复制数据，而是简单地转移了所有权。

**注意**：对于基本类型（例如 `i32`），它们实现了 `Copy` trait，因此赋值时不会移动，而是进行浅拷贝。

```rust
fn main() {
    let x = 5;
    let y = x;  // 这里 x 被复制，而不是移动
    println!("x = {}, y = {}", x, y);  // x 和 y 都有效
}
```

## 3. 克隆 (Clone)

如果你想**深拷贝**数据（而不是移动），可以使用 `clone` 方法。它会创建数据的副本，并赋予新变量所有权。

### 示例：

```rust
fn main() {
    let s1 = String::from("hello");
    let s2 = s1.clone();  // s1 被克隆到 s2
    println!("s1 = {}, s2 = {}", s1, s2);  // s1 和 s2 都有效
}
```

在这个例子中，`clone` 创建了一个新的堆数据的副本，因此 `s1` 和 `s2` 都拥有各自的所有权，并且都有效。

## 4. 借用 (Borrowing)

**借用**是 Rust 中允许多个变量访问同一个数据的机制。Rust 通过借用来避免内存的重复分配和不必要的所有权转移，但同时也强制我们遵守借用规则，确保数据一致性和安全性。

借用有两种形式：**不可变借用** 和 **可变借用**。

### 不可变借用 (`&T`)

你可以通过不可变借用（`&`）让一个值被临时借用，且借用期间值的所有权不会转移，数据不能被修改。

```rust
fn main() {
    let s = String::from("hello");

    let len = calculate_length(&s);  // 借用 s

    println!("The length of '{}' is {}.", s, len);  // s 仍然有效
}

fn calculate_length(s: &String) -> usize {
    s.len()  // 通过引用访问，不修改 s
}
```

**规则**：
- 可以有多个不可变借用。
- 不可变借用期间，不能有任何可变借用。

### 可变借用 (`&mut T`)

可变借用允许你修改借用的数据，但每次只能有一个可变借用，防止数据竞争。

```rust
fn main() {
    let mut s = String::from("hello");

    change(&mut s);  // 可变借用
    println!("{}", s);
}

fn change(s: &mut String) {
    s.push_str(", world");
}
```

**规则**：
- 在同一作用域中，不能同时有可变借用和不可变借用。
- 在同一作用域内，不能有多个可变借用。

## 5. 悬垂引用 (Dangling References)

Rust 通过其所有权和借用系统防止悬垂引用（Dangling References）。悬垂引用是指指向已经释放的内存的引用。在 Rust 中，编译器会确保任何引用在使用时都是有效的。

### 示例：

```rust
fn dangle() -> &String {
    let s = String::from("hello");
    &s  // 错误：s 在函数结束时会被释放
}
```

上面的代码会报错，因为当函数 `dangle` 返回时，`s` 会被销毁，而 `&s` 引用的值不再存在，这会造成悬垂引用。Rust 编译器会在编译阶段捕获这种错误，确保内存安全。

## 6. 所有权与函数

当我们将一个值传递给函数时，所有权会移动到函数中。如果我们想让外部依然拥有该值，可以使用借用。

### 所有权转移：

```rust
fn main() {
    let s = String::from("hello");
    takes_ownership(s);  // s 的所有权被转移
    // println!("{}", s);  // 错误：s 已经失效
}

fn takes_ownership(s: String) {
    println!("{}", s);
}
```

### 借用：

```rust
fn main() {
    let s = String::from("hello");
    let len = calculate_length(&s);  // 借用 s
    println!("Length is {}", len);  // s 仍然有效
}

fn calculate_length(s: &String) -> usize {
    s.len()
}
```


# FAQ?

## 所有权存在的原因
- 所有权解决的问题：
  - 跟踪代码的哪些部分正在使用 heap 的哪些数据
  - 最小化 heap 上的重复数据量
  - 清理 heap 上未使用的数据以避免空间不足。
- 一旦你懂的了所有权，那么就不需要经常去想 stack 或 heap 了。
- 但是知道管理 heap 数据是所有权存在的原因，这有助于解释它为什么会这样工作。

## 所有权规则
- 每个值都有一个变量，这个变量是该值的所有者
- 每个值同时只能有一个所有者
- 当所有者超出作用域（scope）时，该值将被删除。