---
sidebar_position: 14
---

# Trait

Rust 中的 `trait` 是一种定义共享行为的方式，类似于其他语言中的接口（如 Java 的接口或 C++ 中的纯虚类）。`trait` 可以让我们定义一组方法，然后不同的类型可以实现这些方法来达到多态的效果。在 Rust 中，`trait` 是实现泛型编程和代码复用的重要工具。

### 1. 基本的 `trait` 定义

一个 `trait` 定义了一组方法，这些方法可以被实现该 `trait` 的类型所使用。以下是一个简单的 `trait` 定义示例：

```rust
trait Summary {
    fn summarize(&self) -> String;
}
```

这里的 `Summary` 是一个 `trait`，其中包含了一个方法 `summarize`。这个 `trait` 可以由其他类型实现，任何实现了 `Summary` 的类型都必须提供 `summarize` 方法的实现。

### 2. 实现 `trait` 

我们可以在结构体或枚举上实现 `trait`，如下所示：

```rust
struct NewsArticle {
    headline: String,
    content: String,
}

impl Summary for NewsArticle {
    fn summarize(&self) -> String {
        format!("{} - {}", self.headline, self.content)
    }
}
```

在这个例子中，`NewsArticle` 类型实现了 `Summary` trait，并为 `summarize` 方法提供了具体的实现。调用 `summarize` 方法时，Rust 会执行 `NewsArticle` 中定义的逻辑。

### 3. 默认实现

`trait` 允许为其中的方法提供默认实现。这样，所有实现该 `trait` 的类型将会自动拥有该方法的实现，而不需要重新定义。

```rust
trait Summary {
    fn summarize(&self) -> String {
        String::from("(Read more...)")
    }
}
```

此时，如果某个类型实现了 `Summary` trait 而没有自定义 `summarize` 方法，就会自动使用默认实现。

#### 自定义与覆盖默认实现

如果类型需要自定义实现，仍然可以覆盖默认行为。例如：

```rust
struct Tweet {
    username: String,
    content: String,
}

impl Summary for Tweet {
    fn summarize(&self) -> String {
        format!("@{}: {}", self.username, self.content)
    }
}
```

这里 `Tweet` 类型提供了自定义的 `summarize` 实现，覆盖了默认实现。

### 4. `trait` 作为参数

`trait` 可以作为函数参数，这样可以让函数接受任何实现了该 `trait` 的类型。用 `impl Trait` 语法可以简化泛型参数：

```rust
fn notify(item: &impl Summary) {
    println!("Breaking news: {}", item.summarize());
}
```

`notify` 函数接受任何实现了 `Summary` trait 的类型作为参数，并调用其 `summarize` 方法。

#### `impl Trait` 等价的泛型写法

`impl Trait` 是简化语法，等价于以下泛型写法：

```rust
fn notify<T: Summary>(item: &T) {
    println!("Breaking news: {}", item.summarize());
}
```

### 5. `trait` 约束

在泛型中，我们可以使用 `trait` 约束来限制泛型参数的类型，使其只能是实现了特定 `trait` 的类型。

```rust
fn notify<T: Summary>(item: &T) {
    println!("Breaking news: {}", item.summarize());
}
```

在这里，`T` 类型必须实现 `Summary` trait，否则编译器会报错。

#### 多个 `trait` 约束

可以使用 `+` 来添加多个 `trait` 约束：

```rust
fn notify<T: Summary + Display>(item: &T) {
    println!("Breaking news: {}", item.summarize());
}
```

#### `where` 子句简化多重约束

如果泛型参数的 `trait` 约束太多，可以使用 `where` 子句使代码更加清晰：

```rust
fn notify<T>(item: &T) 
where
    T: Summary + Display,
{
    println!("Breaking news: {}", item.summarize());
}
```

### 6. 返回 `impl Trait`

Rust 允许函数返回实现了某个 `trait` 的类型，而不具体指定返回的类型。这在隐藏具体类型信息的同时可以让函数更加灵活。

```rust
fn get_summary() -> impl Summary {
    Tweet {
        username: String::from("user"),
        content: String::from("This is a tweet"),
    }
}
```

在这个例子中，`get_summary` 返回一个实现了 `Summary` 的具体类型（`Tweet`），但调用者不需要知道具体类型是什么，只知道它实现了 `Summary`。

### 7. `trait` 继承

一个 `trait` 可以继承另一个 `trait`，这样实现子 `trait` 的类型也必须实现父 `trait` 中的所有方法。

```rust
trait DisplaySummary: Summary {
    fn display_summary(&self);
}

impl DisplaySummary for Tweet {
    fn display_summary(&self) {
        println!("{}", self.summarize());
    }
}
```

在这个例子中，`DisplaySummary` 继承了 `Summary`，任何实现了 `DisplaySummary` 的类型也必须实现 `Summary`。

### 8. 使用 `Self` 关联类型和方法

`Self` 关键字可以引用实现 `trait` 的具体类型，从而实现关联方法。我们可以用 `Self` 来引用实现 `trait` 的具体类型。

```rust
trait Creator {
    fn create() -> Self;
}

struct MyStruct;

impl Creator for MyStruct {
    fn create() -> Self {
        MyStruct
    }
}
```

这里 `Creator` trait 的 `create` 方法返回类型为 `Self`，表示返回实现 `Creator` 的类型。

### 9. 关联类型（Associated Types）

`trait` 可以包含**关联类型**，这是一种在 `trait` 中定义类型占位符的方式。关联类型让我们能够更清晰地表示类型与 `trait` 的关系，避免复杂的泛型语法。

```rust
trait Container {
    type Item;

    fn contains(&self, item: &Self::Item) -> bool;
}
```

实现 `Container` trait 的类型必须指定 `Item` 类型，并实现 `contains` 方法。

```rust
struct MyContainer {
    items: Vec<i32>,
}

impl Container for MyContainer {
    type Item = i32;

    fn contains(&self, item: &Self::Item) -> bool {
        self.items.contains(item)
    }
}
```

在这个例子中，`MyContainer` 实现了 `Container` trait，并指定了 `Item` 为 `i32` 类型。

### 10. 静态分发与动态分发

Rust 提供了两种分发方式：静态分发和动态分发。

#### 静态分发

静态分发是通过泛型或 `impl Trait` 实现的，所有类型信息在编译时确定。静态分发更快，但会增大二进制文件的大小。

```rust
fn print_summary(item: &impl Summary) {
    println!("{}", item.summarize());
}
```

#### 动态分发

动态分发是通过 `trait` 对象实现的，可以使用 `&dyn Trait` 或 `Box<dyn Trait>`。使用动态分发时，编译器在运行时查找方法实现。这带来了一定的运行时开销，但使代码更加灵活。

```rust
fn print_summary(item: &dyn Summary) {
    println!("{}", item.summarize());
}
```

在使用动态分发时，`Summary` 是 `trait` 对象。任何实现了 `Summary` trait 的类型都可以被传递给 `print_summary`。

### 11. 完整示例

结合以上知识，以下是一个完整示例，展示了 `trait` 的定义、实现、关联类型和多态性：

```rust
use std::fmt::Display;

trait Summary {
    fn summarize(&self) -> String;
}

trait DisplaySummary: Summary + Display {
    fn display_summary(&self) {
        println!("{}", self.summarize());
    }
}

struct NewsArticle {
    headline: String,
    content: String,
}

impl Summary for NewsArticle {
    fn summarize(&self) -> String {
        format!("{} - {}", self.headline, self.content)
    }
}

impl Display for NewsArticle {
    fn fmt(&self, f: &mut std::fmt::Formatter) -> std::fmt::Result {
        write!(f, "Headline: {}", self.headline)
    }
}

impl DisplaySummary for NewsArticle {}

fn main() {
    let article = NewsArticle {
        headline: String::from("New Rust Release!"),
        content: String::from("Rust 1.60 is now available."),
    };

    article.display_summary();
}
```

在这个例子中，`NewsArticle` 类型实现了 `Summary` 和 `Display`，并通过 `DisplaySummary` trait 提供了 `display_summary` 方法。调用 `display_summary` 时，Rust 会使用 `summarize` 方法获取内容并打印出来。

### 总结

- **定义和实现 `trait`**：用于定义共享行为，让不同类型实现相同的方法。
- **默认实现**：让

 `trait` 的方法有默认行为。
- **`trait` 作为参数**：函数参数可以使用 `impl Trait`，实现泛型化。
- **关联类型**：关联类型简化了泛型参数的书写。
- **静态和动态分发**：通过静态分发（泛型）或动态分发（`trait` 对象）实现多态性。