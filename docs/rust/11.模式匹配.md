---
sidebar_position: 11
---

# 模式匹配

在 Rust 中，**模式匹配**是一种强大的语言特性，通过 `match`、`if let`、`while let` 等模式匹配表达式来解构复杂数据结构，并根据不同模式执行不同操作。模式匹配不仅能增强代码的可读性，还能让代码在编译时进行更多的错误检查。

### 1. `match` 表达式

`match` 是 Rust 中的主要模式匹配工具。它用于将一个值与一系列的模式进行比较，找到符合的模式并执行相应的代码块。`match` 表达式要求所有可能的情况都要被覆盖，这种**穷尽性检查**可以避免遗漏情况。

#### 基本语法
```rust
match 值 {
    模式1 => 代码块1,
    模式2 => 代码块2,
    _ => 兜底代码块, // 可选
}
```

#### 示例：匹配枚举
```rust
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

fn coin_value(coin: Coin) -> u8 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}

fn main() {
    let coin = Coin::Dime;
    println!("Value: {}", coin_value(coin));
}
```

在这个例子中，`match` 匹配 `coin` 的不同变体，并返回对应的面值。

#### `_` 模式
`_` 是一个通配模式，用于匹配所有未被捕获的情况。通常用于 `match` 的最后一项，作为兜底代码块处理剩余的情况。

```rust
fn is_even_or_odd(number: u32) -> &'static str {
    match number % 2 {
        0 => "Even",
        _ => "Odd",
    }
}
```

### 2. 模式匹配的细化

Rust 的模式匹配非常灵活，可以在模式中使用解构、绑定、守卫等语法，使得 `match` 的表达能力更加丰富。

#### 2.1 解构结构体、元组和数组

- **结构体**解构：匹配并获取结构体的字段值。
- **元组**解构：匹配元组中的每个元素。
- **数组**解构：匹配固定长度的数组中的元素。

```rust
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let point = Point { x: 10, y: 20 };

    match point {
        Point { x: 0, y } => println!("Point on the y-axis at {}", y),
        Point { x, y: 0 } => println!("Point on the x-axis at {}", x),
        Point { x, y } => println!("Point at ({}, {})", x, y),
    }
}
```

#### 2.2 绑定（`@`）

使用 `@` 语法可以为匹配的值绑定一个变量，以便在分支中继续使用。

```rust
fn describe_number(n: i32) {
    match n {
        1 => println!("One"),
        num @ 2..=5 => println!("Small number: {}", num),
        num => println!("Other number: {}", num),
    }
}
```

在此例中，`num @ 2..=5` 语法绑定了匹配范围 `2..=5` 的值，并将其命名为 `num`，这样可以在分支代码块中使用它。

#### 2.3 模式守卫

**模式守卫**是一个附加的 `if` 条件，用于进一步限制匹配的条件。

```rust
fn what_about(x: i32) {
    match x {
        n if n > 0 => println!("Positive"),
        n if n < 0 => println!("Negative"),
        _ => println!("Zero"),
    }
}
```

在这个例子中，`n if n > 0` 和 `n if n < 0` 是模式守卫，用来分别匹配正数和负数。

### 3. `if let` 和 `while let`

`if let` 和 `while let` 是 `match` 的简化形式，用于匹配特定模式，如果匹配成功则执行相应的代码块。

#### `if let`
适用于只关心一种模式的情况，通常和 `Option`、`Result` 一起使用。

```rust
fn main() {
    let favorite_color: Option<&str> = Some("blue");

    if let Some(color) = favorite_color {
        println!("Favorite color is {}", color);
    } else {
        println!("No favorite color specified.");
    }
}
```

在这个例子中，`if let` 解构 `Some(color)`，如果匹配成功就进入分支代码块。

#### `while let`
在循环中使用模式匹配，当模式匹配成功时进入循环体。

```rust
fn main() {
    let mut stack = vec![1, 2, 3];

    while let Some(top) = stack.pop() {
        println!("Popped: {}", top);
    }
}
```

在这个例子中，`while let` 每次从 `stack` 中 `pop` 出一个元素，直到 `stack` 为空。

### 4. 常见使用模式匹配的场景

#### 4.1 处理 `Option`

`Option` 表示一个可能存在或不存在的值，可以用 `match` 或 `if let` 轻松处理。

```rust
fn main() {
    let some_number = Some(5);

    match some_number {
        Some(num) => println!("The number is: {}", num),
        None => println!("No number"),
    }
}
```

#### 4.2 处理 `Result`

`Result` 用于错误处理，枚举的两个变体 `Ok` 和 `Err` 表示成功和失败。

```rust
fn divide(a: f64, b: f64) -> Result<f64, String> {
    if b == 0.0 {
        Err("Cannot divide by zero".to_string())
    } else {
        Ok(a / b)
    }
}

fn main() {
    match divide(10.0, 2.0) {
        Ok(result) => println!("Result: {}", result),
        Err(err) => println!("Error: {}", err),
    }
}
```

#### 4.3 配合枚举定义状态或事件

枚举和 `match` 配合使用非常适合状态机、事件流等需要不同分支逻辑的场景。

```rust
enum State {
    Start,
    Running,
    Stopped,
}

fn main() {
    let current_state = State::Running;

    match current_state {
        State::Start => println!("Starting..."),
        State::Running => println!("Running"),
        State::Stopped => println!("Stopped"),
    }
}
```

#### 4.4 解构嵌套数据

`match` 支持对结构体、元组等嵌套结构进行解构匹配，非常适合复杂数据结构。

```rust
enum Coordinate {
    Cartesian { x: f64, y: f64 },
    Polar { radius: f64, angle: f64 },
}

fn main() {
    let point = Coordinate::Cartesian { x: 3.0, y: 4.0 };

    match point {
        Coordinate::Cartesian { x, y } => println!("Point in Cartesian ({}, {})", x, y),
        Coordinate::Polar { radius, angle } => println!("Point in Polar (r={}, θ={})", radius, angle),
    }
}
```

### 5. `match` 和 `if let` 的选择

- **`match`**：适合需要处理多种情况的场景，支持穷尽性检查，确保所有可能情况都被考虑到。
- **`if let`**：适合处理单一情况的场景，代码简洁。通常用于 `Option` 和 `Result` 类型的简易匹配。

### 总结

- **`match` 表达式**：Rust 的核心模式匹配工具，支持解构、绑定、守卫等语法，可处理多种情况。
- **`if let` 和 `while let`**：用于简化处理单一模式的逻辑，使代码更简洁。
- **模式匹配的应用场景**：错误处理（`Result`）、选项类型（`Option`）、状态机、事件流等复杂逻辑处理场景。

Rust 的模式匹配不仅让代码更加清晰、结构化，而且通过穷尽性检查帮助开发者在编译期发现潜在的错误。