---
sidebar_position: 14
---

# 错误处理

Rust 的错误处理系统提供了一种安全、显式的方式来处理程序中的错误。主要的错误处理机制有两种：**Result 类型**和**panic! 宏**。

### 1. `Result` 类型：可恢复的错误

`Result` 类型用于处理**可恢复的错误**。它是一个枚举，用于表示操作可能会成功，也可能会失败。`Result` 的定义如下：

```rust
enum Result<T, E> {
    Ok(T),
    Err(E),
}
```

- `Ok(T)`：表示操作成功，并返回一个成功值 `T`。
- `Err(E)`：表示操作失败，并返回一个错误值 `E`。

#### 使用 `Result` 类型示例

例如，文件操作可能会失败（文件不存在、权限不足等），我们可以使用 `Result` 类型来捕获这些错误：

```rust
use std::fs::File;
use std::io::Error;

fn main() -> Result<(), Error> {
    let file = File::open("hello.txt");

    match file {
        Ok(f) => {
            println!("File opened successfully: {:?}", f);
            Ok(())
        },
        Err(e) => {
            println!("Failed to open file: {}", e);
            Err(e)
        }
    }
}
```

在这个例子中，我们尝试打开一个文件，如果成功，返回 `Ok(())`；如果失败，返回 `Err(e)` 并打印错误信息。

#### 常用 `Result` 方法

- **`unwrap`**：直接获取 `Ok` 中的值，如果是 `Err` 则引发 panic。
- **`expect`**：类似于 `unwrap`，但允许自定义 panic 消息。
- **`unwrap_or`**：提供一个默认值，如果是 `Err` 则返回默认值。
- **`unwrap_or_else`**：传递一个闭包来处理 `Err` 情况。
- **`map`** 和 **`map_err`**：对 `Ok` 或 `Err` 中的值进行转换。

例如，使用 `unwrap_or` 提供默认值：

```rust
use std::fs::File;

fn main() {
    let file = File::open("hello.txt").unwrap_or_else(|_| {
        println!("File not found, creating a new one.");
        File::create("hello.txt").expect("Failed to create file")
    });
}
```

### 2. `?` 操作符：简化错误处理

Rust 提供了 `?` 操作符来简化错误传播。`?` 会检查 `Result` 的值，如果是 `Ok`，则提取其值并返回；如果是 `Err`，则将错误向上传播。

#### 使用 `?` 的示例

上面的文件操作可以简化为：

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_file() -> Result<String, io::Error> {
    let mut file = File::open("hello.txt")?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    Ok(contents)
}

fn main() {
    match read_file() {
        Ok(contents) => println!("File contents: {}", contents),
        Err(e) => eprintln!("Error reading file: {}", e),
    }
}
```

在 `read_file` 函数中，使用 `?` 处理 `Result` 值，可以减少 `match` 或 `unwrap` 的使用，使代码更简洁。

### 3. 自定义错误类型

在实际项目中，我们可能需要自定义错误类型来表示特定的错误情况。可以通过实现标准库中的 `std::error::Error` 和 `Debug`、`Display` trait，创建自己的错误类型。

#### 自定义错误类型示例

下面创建一个自定义错误类型，并实现 `std::error::Error` 和 `fmt::Display`：

```rust
use std::fmt;

// 定义自定义错误类型
#[derive(Debug)]
enum MyError {
    NotFound,
    PermissionDenied,
}

// 实现 Display trait
impl fmt::Display for MyError {
    fn fmt(&self, f: &mut fmt::Formatter) -> fmt::Result {
        match *self {
            MyError::NotFound => write!(f, "Resource not found"),
            MyError::PermissionDenied => write!(f, "Permission denied"),
        }
    }
}

// 实现 std::error::Error trait
impl std::error::Error for MyError {}

fn do_something() -> Result<(), MyError> {
    Err(MyError::NotFound)
}

fn main() {
    match do_something() {
        Ok(_) => println!("Operation successful"),
        Err(e) => eprintln!("Operation failed: {}", e),
    }
}
```

在这个例子中，我们定义了一个 `MyError` 枚举来表示特定错误类型。

### 4. `panic!` 宏：不可恢复的错误

当发生**不可恢复的错误**时，Rust 提供了 `panic!` 宏来终止程序。`panic!` 会打印错误信息、展开调用栈并退出程序。

#### 典型使用场景
- 非预期的情况下，例如数组越界访问。
- 程序的某些部分不应该出错。

#### `panic!` 使用示例

```rust
fn main() {
    let v = vec![1, 2, 3];
    
    // 访问越界，导致 panic
    println!("{}", v[10]); // This will panic
}
```

使用 `RUST_BACKTRACE` 环境变量，可以在 `panic!` 时显示调用栈信息：

```sh
RUST_BACKTRACE=1 cargo run
```

### 5. `Option` 类型：处理可能为空的值

Rust 中的**`Option` 类型**用于表示可能为空的值，类似于其他语言中的 null 值。

`Option` 的定义如下：

```rust
enum Option<T> {
    Some(T),
    None,
}
```

- `Some(T)` 表示存在值 `T`。
- `None` 表示无值。

#### 使用示例

```rust
fn divide(a: i32, b: i32) -> Option<i32> {
    if b == 0 {
        None
    } else {
        Some(a / b)
    }
}

fn main() {
    match divide(10, 2) {
        Some(result) => println!("Result: {}", result),
        None => println!("Cannot divide by zero"),
    }
}
```

### 6. `Result` 和 `Option` 的组合使用

`Result` 和 `Option` 类型常常可以组合使用。例如，`Option` 可以用于表示 `Result` 的成功状态中存在或缺少某个值。

```rust
fn find_user(id: u32) -> Result<Option<String>, String> {
    if id == 0 {
        Err("Invalid ID".to_string())
    } else if id == 1 {
        Ok(Some("Alice".to_string()))
    } else {
        Ok(None)
    }
}

fn main() {
    match find_user(1) {
        Ok(Some(name)) => println!("Found user: {}", name),
        Ok(None) => println!("User not found"),
        Err(e) => println!("Error: {}", e),
    }
}
```

在这个例子中，`find_user` 函数返回 `Result<Option<String>, String>`，以此来表示用户查找成功但可能为空的情况。

### 7. 常见的错误处理模式

- **链式处理**：利用 `and_then`、`map` 等组合函数链式处理错误。
- **提前返回**：使用 `?` 操作符简化错误传播。
- **匹配 `match`**：使用 `match` 或 `if let` 解构 `Result` 和 `Option`。

#### 链式处理示例

```rust
use std::fs::File;
use std::io::{self, Read};

fn read_username_from_file() -> Result<String, io::Error> {
    File::open("username.txt")
        .and_then(|mut file| {
            let mut s = String::new();
            file.read_to_string(&mut s).map(|_| s)
        })
}
```

在这个例子中，`and_then` 方法用于链式调用，避免使用嵌套的 `match` 结构。

### 总结

Rust 的错误处理提供了安全、显式的手段，强调编译期的错误检查与清晰的错误传播方式：

1. **Result 类型**：用于处理可恢复错误，提供丰富的链式处理和传播机制。
2. **Option 类型**：用于处理可能为空的值，常用于返回类型中。
3. **panic! 宏**：用于不可恢复的错误，适用于程序的极端情况。
4. **自定义错误**：可以通过实现 `std::error::Error` trait 定义特定的错误类型。

通过 `Result` 和 `Option` 的组合使用以及丰富的链式处理函数，Rust 的错误处理系统不仅帮助开发者编写安全可靠的代码，还使得代码结构清晰简洁。