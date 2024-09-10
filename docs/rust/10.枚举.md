---
sidebar_position: 10
---

# 枚举

在 Rust 中，**枚举**（`enum`）是一种定义一组**有限的可能值**的自定义类型。它可以用来表示数据的不同状态和类型。Rust 的枚举非常灵活，支持为每个变体（variant）关联不同的数据，使其在复杂数据表达上具备更高的表现力。

### 1. 定义枚举

定义枚举时使用 `enum` 关键字，枚举的每个**变体**是可能的值。

#### 例子
```rust
enum Direction {
    North,
    South,
    East,
    West,
}

fn main() {
    let dir = Direction::North;
    println!("{:?}", dir);
}
```

在这个例子中：
- `Direction` 是一个枚举，代表四个可能的方向。
- 每个方向（`North`、`South`、`East`、`West`）是 `Direction` 的一个变体。
- 枚举变体通过 `::` 语法来引用。

### 2. 枚举变体关联数据

Rust 的枚举不仅支持单纯的值，还可以为每个变体关联不同的数据类型。这在许多情况下非常有用。

#### 例子：定义包含不同类型数据的枚举
```rust
enum Message {
    Quit,                        // 不包含数据
    Move { x: i32, y: i32 },     // 包含匿名结构体数据
    Write(String),               // 包含单个 String 类型数据
    ChangeColor(i32, i32, i32),  // 包含三个 i32 数据
}

fn main() {
    let msg1 = Message::Quit;
    let msg2 = Message::Move { x: 10, y: 20 };
    let msg3 = Message::Write(String::from("Hello"));
    let msg4 = Message::ChangeColor(255, 0, 0);

    // 通过 match 模式匹配不同变体
    match msg2 {
        Message::Quit => println!("Quit"),
        Message::Move { x, y } => println!("Move to x: {}, y: {}", x, y),
        Message::Write(text) => println!("Text message: {}", text),
        Message::ChangeColor(r, g, b) => println!("Change color to R:{}, G:{}, B:{}", r, g, b),
    }
}
```

在这里：
- `Message` 枚举包含四种不同的变体。
- `Quit` 变体没有关联数据。
- `Move` 变体包含一个匿名结构体 `{ x: i32, y: i32 }`。
- `Write` 变体包含一个 `String`。
- `ChangeColor` 变体包含三个 `i32` 类型的数据，表示 RGB 颜色值。
- `match` 表达式可以根据变体来访问不同的数据。

### 3. 枚举的使用场景

枚举在 Rust 中的用途非常广泛，常用于以下几种场景：

- **状态管理**：表示一种状态机的状态或系统的多种状态。
- **错误处理**：用于表达不同的错误类型（Rust 标准库中的 `Result` 和 `Option` 是枚举类型）。
- **封装复杂数据结构**：对不同种类的数据进行统一的包装。

### 4. `Option` 枚举

`Option` 枚举用于表示一个值可能存在或不存在的情况，避免了 `null` 的问题。它被广泛用于表示返回值可能为空的情况。

#### `Option` 的定义
```rust
enum Option<T> {
    Some(T),
    None,
}
```

- `Option` 是一个泛型枚举。
- `Some(T)` 包含一个值。
- `None` 表示没有值。

#### 使用 `Option`
```rust
fn main() {
    let some_number = Some(5);
    let no_number: Option<i32> = None;

    if let Some(num) = some_number {
        println!("Found a number: {}", num);
    } else {
        println!("No number found");
    }
}
```

在这个例子中：
- `some_number` 是 `Option<i32>` 类型，包含 `Some(5)`。
- `no_number` 是 `Option<i32>` 类型，包含 `None`。
- 使用 `if let` 匹配 `Some` 或 `None`，并执行不同的逻辑。

### 5. `Result` 枚举

`Result` 枚举用于错误处理，表示操作可能成功也可能失败的结果。常用于函数返回值表示是否出错。

#### `Result` 的定义
```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

- `Result` 是一个泛型枚举。
- `Ok(T)` 表示成功，并包含成功的值。
- `Err(E)` 表示失败，并包含错误信息。

#### 使用 `Result`
```rust
fn divide(x: f64, y: f64) -> Result<f64, String> {
    if y == 0.0 {
        Err(String::from("Cannot divide by zero"))
    } else {
        Ok(x / y)
    }
}

fn main() {
    match divide(10.0, 2.0) {
        Ok(result) => println!("Result: {}", result),
        Err(err) => println!("Error: {}", err),
    }
}
```

在这个例子中：
- `divide` 函数返回 `Result<f64, String>` 类型。
- 当除数为 `0` 时，返回 `Err` 表示错误，否则返回 `Ok` 表示成功。

### 6. 枚举方法

我们可以为枚举定义方法，方便操作枚举的逻辑。

#### 例子
```rust
enum TrafficLight {
    Red,
    Yellow,
    Green,
}

impl TrafficLight {
    fn duration(&self) -> u8 {
        match self {
            TrafficLight::Red => 60,
            TrafficLight::Yellow => 3,
            TrafficLight::Green => 30,
        }
    }
}

fn main() {
    let light = TrafficLight::Red;
    println!("Duration: {} seconds", light.duration());
}
```

在这里：
- `TrafficLight` 枚举有 `Red`、`Yellow` 和 `Green` 三种变体。
- 我们定义了一个 `duration` 方法，通过匹配不同的灯光颜色返回相应的持续时间。

### 7. 组合枚举和结构体

我们可以将结构体嵌套在枚举中，或使用结构体字段作为枚举变体的数据。

#### 例子
```rust
struct Point {
    x: f64,
    y: f64,
}

enum Shape {
    Circle { radius: f64 },
    Rectangle { width: f64, height: f64 },
    Triangle(Point, Point, Point),
}

fn main() {
    let circle = Shape::Circle { radius: 5.0 };
    let triangle = Shape::Triangle(
        Point { x: 0.0, y: 0.0 },
        Point { x: 3.0, y: 0.0 },
        Point { x: 3.0, y: 4.0 },
    );

    match circle {
        Shape::Circle { radius } => println!("Circle with radius: {}", radius),
        Shape::Rectangle { width, height } => println!("Rectangle with width: {}, height: {}", width, height),
        Shape::Triangle(p1, p2, p3) => println!("Triangle with vertices: ({}, {}), ({}, {}), ({}, {})", p1.x, p1.y, p2.x, p2.y, p3.x, p3.y),
    }
}
```

在这里：
- `Shape` 是一个枚举，每个变体都可以关联不同的数据结构。
- `Circle` 和 `Rectangle` 使用匿名结构体来存储数据，`Triangle` 使用三个 `Point` 结构体来存储顶点坐标。

### 总结
- **定义变体**：使用 `enum` 定义枚举，每个变体代表一种可能的状态或类型。
- **关联数据**：枚举的变体可以携带不同的数据类型，适合复杂的状态管理。
- **模式匹配**：通过 `match` 表达式处理不同的枚举变体。
- **内置枚举**：如 `Option` 和 `Result`，广泛应用于 Rust 的错误处理和空值处理。
- **方法实现**：可以为枚举实现方法，扩展枚举的功能。