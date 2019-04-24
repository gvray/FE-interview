---
sidebar_position: 6
---

# 控制流

## 1. `if` 语句

`if` 语句用于条件判断，其语法类似于其他编程语言：

```rust
fn main() {
    let number = 5;

    if number < 10 {
        println!("Condition was true");
    } else {
        println!("Condition was false");
    }
}
```

- 条件必须是布尔类型（`bool`），不能像 C 或其他语言中那样使用非布尔类型的值作为条件。
- `if` 语句也可以作为表达式使用：

```rust
fn main() {
    let number = 3;
    let result = if number % 2 == 0 { "even" } else { "odd" };
    println!("The number is {}", result);
}
```

## 2. `loop` 循环

`loop` 是 Rust 的无限循环控制结构，直到使用 `break` 退出：

```rust
fn main() {
    let mut count = 0;

    loop {
        count += 1;
        if count == 3 {
            break;
        }
        println!("Count: {}", count);
    }
}
```

- 可以通过 `break` 直接退出循环。
- `loop` 也可以返回值：

```rust
fn main() {
    let result = loop {
        let mut x = 0;
        x += 1;
        if x == 5 {
            break x * 2;
        }
    };
    println!("The result is {}", result);
}
```

## 3. `while` 循环

`while` 循环用于在条件为真时反复执行代码块：

```rust
fn main() {
    let mut number = 3;

    while number != 0 {
        println!("{}!", number);
        number -= 1;
    }

    println!("LIFTOFF!!!");
}
```

这里，循环会持续运行，直到 `number` 为 0。

## 4. `for` 循环

`for` 循环非常常用，特别是在遍历集合或范围时。Rust 提供了简洁的语法：

```rust
fn main() {
    let a = [10, 20, 30, 40, 50];

    for element in a.iter() {
        println!("The value is: {}", element);
    }
}
```

- `for` 循环可以与范围（`Range`）一起使用：

```rust
fn main() {
    for number in 1..4 {
        println!("{}", number);
    }
}
```

- 这里的 `1..4` 表示从 1 到 3，左闭右开区间。如果希望包括 4，可以使用 `1..=4`。

## 5. `match` 模式匹配

`match` 是 Rust 中非常强大的控制流工具，类似于其他语言中的 `switch` 语句，但功能更丰富：

```rust
fn main() {
    let number = 6;

    match number {
        1 => println!("One"),
        2 => println!("Two"),
        3..=5 => println!("Three through Five"),
        _ => println!("Something else"),
    }
}
```

- `match` 可以匹配具体值、范围或模式。
- `_` 是通配符，表示匹配任何值。

### 匹配枚举

`match` 非常适合处理枚举类型：

```rust
enum Coin {
    Penny,
    Nickel,
    Dime,
    Quarter,
}

fn value_in_cents(coin: Coin) -> u32 {
    match coin {
        Coin::Penny => 1,
        Coin::Nickel => 5,
        Coin::Dime => 10,
        Coin::Quarter => 25,
    }
}

fn main() {
    let coin = Coin::Quarter;
    println!("Value in cents: {}", value_in_cents(coin));
}
```

## 6. `if let` 简化匹配

对于只关心某一种模式的情况，`if let` 是 `match` 的简化形式：

```rust
fn main() {
    let some_option = Some(5);

    if let Some(value) = some_option {
        println!("The value is: {}", value);
    }
}
```

## 7. `while let` 用于条件循环

当你需要在某个条件下循环，类似于 `if let`，`while let` 可以用于不断匹配条件并执行操作：

```rust
fn main() {
    let mut stack = Vec::new();
    stack.push(1);
    stack.push(2);
    stack.push(3);

    while let Some(top) = stack.pop() {
        println!("{}", top);
    }
}
```

## 总结

Rust 提供了多种控制流工具，包括经典的 `if`、`while`、`for` 循环，以及强大的 `match` 语句，支持模式匹配和多种灵活的结构。
