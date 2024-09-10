---
sidebar_position: 9
---

# 结构体

在 Rust 中，**结构体**（struct）是一种自定义的数据类型，用于将相关的变量组合成一个整体。结构体可以定义不同字段，字段类型可以不同。Rust 的结构体类似于其他编程语言中的对象，但更接近数据容器，没有对象方法（不过我们可以通过 `impl` 块为结构体添加方法）。Rust 的结构体主要有三种类型：

1. **常规结构体**（Classic Struct）
2. **元组结构体**（Tuple Struct）
3. **单元结构体**（Unit Struct）

### 1. 常规结构体
常规结构体最常见，它允许我们定义带有命名字段的结构体，每个字段都可以有不同的数据类型。

#### 例子：
```rust
struct Rectangle {
    width: u32,
    height: u32,
}

fn main() {
    let rect = Rectangle {
        width: 30,
        height: 50,
    };

    println!("Width: {}, Height: {}", rect.width, rect.height);
}
```

在这个例子中：
- `Rectangle` 是一个常规结构体，有 `width` 和 `height` 两个字段。
- 我们创建了一个 `rect` 实例，通过字段名访问结构体的属性（如 `rect.width`）。

### 2. 元组结构体
元组结构体类似于元组，但带有结构体名称。它可以用于简单的、没有命名字段的结构体，这样可以实现类似类型别名的功能。

#### 例子：
```rust
struct Color(i32, i32, i32); // 元组结构体，用于存储 RGB 颜色值
struct Point(f32, f32, f32); // 元组结构体，用于存储三维坐标

fn main() {
    let red = Color(255, 0, 0); // RGB 颜色
    let origin = Point(0.0, 0.0, 0.0); // 三维空间的原点

    println!("Red: {}, {}, {}", red.0, red.1, red.2);
    println!("Origin: ({}, {}, {})", origin.0, origin.1, origin.2);
}
```

在这里：
- `Color` 和 `Point` 是元组结构体，它们没有字段名称，只通过索引（如 `red.0`）访问。
- 这种结构体类型适合简单数据的打包，不需要字段名。

### 3. 单元结构体
单元结构体没有任何字段，可以用作标记，表示某个特定的状态或类型。

#### 例子：
```rust
struct Marker;

fn main() {
    let _m = Marker;
}
```

在这个例子中，`Marker` 是一个单元结构体，没有字段和数据，只用来标记或作为占位符。

### 4. 实例化和更新语法
创建结构体实例时，必须给所有字段赋值。可以使用 `..` 语法从其他结构体实例中复制字段的值。

#### 例子：
```rust
struct User {
    username: String,
    email: String,
    sign_in_count: u64,
    active: bool,
}

fn main() {
    let user1 = User {
        username: String::from("user1"),
        email: String::from("user1@example.com"),
        sign_in_count: 1,
        active: true,
    };

    // 使用结构体更新语法
    let user2 = User {
        email: String::from("user2@example.com"),
        ..user1 // 继承 user1 的其他字段
    };

    println!("User2: {} - {}", user2.username, user2.email);
}
```

在这里：
- `user2` 继承了 `user1` 的 `username`、`sign_in_count` 和 `active` 字段，但使用了新值 `user2@example.com` 作为 `email`。

### 5. 方法与关联函数
Rust 通过 `impl` 块为结构体定义方法和关联函数。

- **方法**：方法定义在结构体的 `impl` 块中，使用 `&self` 或 `&mut self` 来访问实例的字段。
- **关联函数**：用 `impl` 定义的函数，但没有 `self` 参数，通常用于构造函数（例如 `new` 函数）。

#### 例子：
```rust
struct Rectangle {
    width: u32,
    height: u32,
}

impl Rectangle {
    // 计算矩形的面积，self 是方法的所有者
    fn area(&self) -> u32 {
        self.width * self.height
    }

    // 关联函数，用于创建一个新的 Rectangle
    fn square(size: u32) -> Rectangle {
        Rectangle { width: size, height: size }
    }
}

fn main() {
    let rect = Rectangle {
        width: 30,
        height: 50,
    };

    println!("Area of rectangle: {}", rect.area());

    let sq = Rectangle::square(20); // 使用关联函数创建正方形
    println!("Square - Width: {}, Height: {}", sq.width, sq.height);
}
```

在这个例子中：
- `area` 是 `Rectangle` 的方法，使用 `&self` 访问字段。
- `square` 是一个关联函数，用于创建一个特定大小的正方形。

### 6. 结构体的解构
可以在模式匹配中对结构体进行解构，以访问或使用其内部字段。

#### 例子：
```rust
struct Point {
    x: i32,
    y: i32,
}

fn main() {
    let point = Point { x: 10, y: 20 };

    // 解构结构体
    let Point { x, y } = point;
    println!("x: {}, y: {}", x, y);

    // 部分解构
    match point {
        Point { x, .. } => println!("x: {}", x),
    }
}
```

在这里：
- `let Point { x, y } = point;` 解构 `Point` 实例 `point`，将其字段赋值给变量 `x` 和 `y`。
- `match` 表达式中使用 `..` 表示忽略 `y` 字段，仅匹配 `x` 字段。

### 7. 结构体的字段可见性
在 Rust 中，结构体和字段默认是私有的，只能在定义它们的模块中访问。可以使用 `pub` 关键字将结构体和字段设为公有。

#### 例子：
```rust
mod shapes {
    pub struct Rectangle {
        pub width: u32,
        pub height: u32,
    }

    impl Rectangle {
        pub fn area(&self) -> u32 {
            self.width * self.height
        }
    }
}

fn main() {
    let rect = shapes::Rectangle {
        width: 30,
        height: 50,
    };

    println!("Area of rectangle: {}", rect.area());
}
```

在这里：
- `shapes::Rectangle` 和它的字段 `width`、`height` 以及 `area` 方法都使用 `pub` 声明，变成公有，可以在模块外访问。

### 总结
- **常规结构体**：带有命名字段，适合表示多种不同数据。
- **元组结构体**：没有命名字段，适合简单的、无命名的数据组合。
- **单元结构体**：没有字段，用作标记。
- **方法和关联函数**：`impl` 块中定义方法和关联函数，提供结构体的功能性。
- **解构与可见性**：结构体支持解构，字段和结构体默认私有，用 `pub` 设置为公有。 

Rust 的结构体结合所有权和生命周期系统，保证了内存安全和线程安全。