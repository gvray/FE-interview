---
sidebar_position: 14
---

# 泛型

Rust 的泛型（Generic）使得代码更加灵活、可复用，允许函数、结构体、枚举等使用不同的类型。泛型通过**参数化类型**的方式，让我们可以编写能够适用于多种类型的代码，而无需为每种类型分别实现逻辑。下面我们将详细介绍 Rust 泛型的用法、约束以及实现细节。

### 1. 泛型的基础用法

在 Rust 中，泛型通过 `<T>` 来表示，其中 `T` 是一个占位符，代表任何类型。泛型的基本使用场景包括函数、结构体、枚举等。

#### 泛型函数

我们可以在函数中使用泛型，创建一个函数适用于多种数据类型：

```rust
fn largest<T: PartialOrd + Copy>(x: T, y: T) -> T {
    if x > y {
        x
    } else {
        y
    }
}

fn main() {
    println!("Largest: {}", largest(10, 20));
    println!("Largest: {}", largest(3.14, 2.71));
}
```

在 `largest` 函数中，`T` 是一个泛型类型，并且使用 `PartialOrd` 和 `Copy` trait 作为约束，表示 `T` 类型必须支持比较和复制。这样 `largest` 函数可以接受整数和浮点数类型的参数。

#### 泛型结构体

我们可以使用泛型来定义结构体，使其可以存储不同的数据类型：

```rust
struct Point<T> {
    x: T,
    y: T,
}

fn main() {
    let integer_point = Point { x: 5, y: 10 };
    let float_point = Point { x: 1.0, y: 4.0 };

    println!("Integer Point: ({}, {})", integer_point.x, integer_point.y);
    println!("Float Point: ({}, {})", float_point.x, float_point.y);
}
```

上面的 `Point` 结构体可以存储任意类型的 `x` 和 `y` 值，适用于整数、浮点数等不同类型。

#### 多泛型参数

结构体或函数可以有多个泛型参数：

```rust
struct Point<T, U> {
    x: T,
    y: U,
}

fn main() {
    let integer_and_float = Point { x: 5, y: 4.0 };
    println!("Point: ({}, {})", integer_and_float.x, integer_and_float.y);
}
```

在这个 `Point` 结构体中，`x` 和 `y` 分别使用不同的泛型 `T` 和 `U`，这样它们可以是不同的类型。

### 2. 泛型与 Trait 约束

在某些情况下，泛型需要符合特定的条件，例如实现了某个 Trait 才能使用。这可以通过**Trait 约束**来实现。

#### Trait 约束示例

例如，我们可以为泛型函数添加 Trait 约束，使得函数能够使用特定 Trait 的方法：

```rust
use std::fmt::Display;

fn print_twice<T: Display>(item: T) {
    println!("{}", item);
    println!("{}", item);
}

fn main() {
    print_twice(42);
    print_twice("Hello, world!");
}
```

在这个例子中，`T: Display` 表示 `T` 必须实现 `Display` Trait，只有这样才能打印 `item`。

#### 多个 Trait 约束

我们可以通过 `+` 添加多个 Trait 约束：

```rust
fn compare_and_display<T: PartialOrd + Display>(a: T, b: T) {
    if a > b {
        println!("{} is larger", a);
    } else {
        println!("{} is larger", b);
    }
}
```

在这个例子中，`T` 类型必须实现 `PartialOrd` 和 `Display` 两个 Trait，才可以进行比较和打印。

#### 使用 `where` 关键字

如果约束过多，直接在函数签名中使用会显得冗长。`where` 关键字可以使代码更清晰：

```rust
fn compare_and_display<T, U>(a: T, b: U) 
where
    T: Display + PartialOrd,
    U: Display + PartialOrd,
{
    if a > b {
        println!("{} is larger", a);
    } else {
        println!("{} is larger", b);
    }
}
```

`where` 关键字使得约束的可读性更强，特别是在泛型类型和 Trait 较多的情况下。

### 3. 泛型与枚举

Rust 的枚举也可以使用泛型，例如 `Option` 和 `Result`：

```rust
enum Option<T> {
    Some(T),
    None,
}

enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

`Option` 和 `Result` 是标准库中最常用的泛型枚举，用于表示可选值和错误处理情况。

### 4. 泛型在方法中的应用

我们可以在结构体的方法中使用泛型，还可以定义与结构体不同的泛型类型。

#### 在方法中使用泛型

定义在结构体中的泛型可以直接用于方法中：

```rust
struct Point<T> {
    x: T,
    y: T,
}

impl<T> Point<T> {
    fn x(&self) -> &T {
        &self.x
    }
}

fn main() {
    let p = Point { x: 5, y: 10 };
    println!("p.x = {}", p.x());
}
```

#### 不同的泛型类型

结构体的实现块可以包含不同的泛型类型：

```rust
impl<T> Point<T> {
    fn mixup<U>(self, other: Point<U>) -> Point<T, U> {
        Point { x: self.x, y: other.y }
    }
}
```

在这个例子中，`mixup` 方法使用了一个新的泛型类型 `U`，允许混合两个不同类型的 `Point`，生成一个新的 `Point<T, U>`。

### 5. 泛型的性能

Rust 的泛型并不会影响性能。Rust 使用了**单态化（Monomorphization）**，在编译时将泛型代码生成具体类型的代码，从而在运行时没有性能损失。

单态化过程会将泛型代码根据传入的类型具体化：

```rust
fn add<T: std::ops::Add<Output = T>>(a: T, b: T) -> T {
    a + b
}

fn main() {
    let int_sum = add(1, 2);       // 编译时生成 `add(i32, i32) -> i32`
    let float_sum = add(1.0, 2.0); // 编译时生成 `add(f64, f64) -> f64`
}
```

### 6. 泛型与生命周期

当泛型类型与引用一起使用时，我们通常需要使用生命周期来确保引用的有效性。

#### 结合生命周期的泛型

```rust
struct ImportantExcerpt<'a> {
    part: &'a str,
}

impl<'a> ImportantExcerpt<'a> {
    fn level(&self) -> i32 {
        3
    }
    
    fn announce_and_return_part(&self, announcement: &str) -> &str {
        println!("Attention please: {}", announcement);
        self.part
    }
}

fn main() {
    let text = String::from("Call me Ishmael.");
    let excerpt = ImportantExcerpt {
        part: text.split('.').next().unwrap(),
    };

    println!("Excerpt: {}", excerpt.part);
    println!("Level: {}", excerpt.level());
    println!("Announcement: {}", excerpt.announce_and_return_part("Hello"));
}
```

在这个例子中，结构体 `ImportantExcerpt` 持有一个生命周期 `'a` 的引用。方法中使用生命周期确保 `self` 引用和返回值的生命周期关系。

### 7. 泛型和动态分发

在 Rust 中，Trait 对象（如 `Box<dyn Trait>`）提供了一种**动态分发**的方法，可以在编译时不知道具体类型的情况下使用不同的类型。动态分发带来了灵活性，但与泛型的静态分发不同。

```rust
trait Shape {
    fn area(&self) -> f64;
}

struct Circle {
    radius: f64,
}

impl Shape for Circle {
    fn area(&self) -> f64 {
        3.14 * self.radius * self.radius
    }
}

fn print_area(shape: &dyn Shape) {
    println!("Area: {}", shape.area());
}

fn main() {
    let circle = Circle { radius: 2.0 };
    print_area(&circle);
}
```

这里的 `&dyn Shape` 是一个 Trait 对象，允许使用不同的类型（如 `Circle`）实现 `Shape`。与泛型相比，Trait 对象带来了运行时成本，但提供了灵活的动态分发。

### 总结

泛型在 Rust 中扮演了重要角色，提供了强大而灵活的代码复用能力，并且在 Rust 中经过单态化优化，几乎没有性能损失。使用泛型时需要考虑：

1. **基本使用**：泛型函数、结构体、枚举，带

来了代码复用。
2. **Trait 约束**：为泛型添加约束，限制类型的行为。
3. **方法与生命周期**：在方法中使用泛型和生命周期，确保类型和生命周期的安全性。
4. **性能优化**：Rust 的单态化编译将泛型优化为具体类型，保证性能。

泛型是 Rust 实现类型安全、提高代码复用的重要特性，能帮助我们在类型安全的同时编写灵活、高效的代码。