---
sidebar_position: 17
---

# 测试

Rust 的测试工具集成在标准库中，开发者可以轻松地编写单元测试、集成测试和文档测试，确保代码质量和正确性。以下是 Rust 测试相关的完整解析：

---

### 1. **基础概念**

Rust 的测试基于 `#[test]` 属性，通过 `cargo test` 命令运行。测试代码可以与主代码共存，也可以单独组织为测试模块或测试文件。

#### 测试的种类：

1. **单元测试**（Unit Tests）：针对单个模块或函数，通常与实现代码在同一文件中。
2. **集成测试**（Integration Tests）：测试多个模块的交互，位于 `tests` 目录中。
3. **文档测试**（Documentation Tests）：从代码注释中的文档示例自动生成并运行测试。

---

### 2. **单元测试**

#### 编写单元测试

单元测试通常定义在实现代码的同一文件中，并位于 `mod tests` 模块内。`#[cfg(test)]` 属性表示测试模块仅在测试模式下编译。

```rust
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}

#[cfg(test)]
mod tests {
    use super::*;

    #[test]
    fn test_add() {
        assert_eq!(add(2, 3), 5);
    }

    #[test]
    fn test_add_negative() {
        assert_eq!(add(-2, -3), -5);
    }
}
```

#### 运行测试

执行以下命令运行测试：

```bash
cargo test
```

#### 测试断言

- `assert!`: 测试一个条件是否为 `true`。
- `assert_eq!` 和 `assert_ne!`: 测试两个值是否相等或不相等。
- `panic!`: 用于手动触发测试失败。

```rust
#[test]
fn test_example() {
    assert!(1 + 1 == 2);
    assert_eq!(2 * 2, 4);
    assert_ne!(3 + 2, 6);
}
```

---

### 3. **处理测试失败**

测试失败时，Rust 会打印具体的断言失败信息：

```text
thread 'main' panicked at 'assertion failed: `(left == right)`
  left: `4`,
 right: `5`', src/lib.rs:4:5
```

为了调试测试失败，可以使用 `dbg!` 打印调试信息：

```rust
#[test]
fn test_debug() {
    let result = dbg!(2 * 2);
    assert_eq!(result, 5);
}
```

---

### 4. **设置测试期望**

- **忽略测试**：用 `#[ignore]` 标记暂时不运行的测试。
- **运行特定测试**：可以通过名字筛选测试，例如运行名称包含 `example` 的测试：

```bash
cargo test example
```

#### 忽略测试：

```rust
#[test]
#[ignore]
fn test_ignored() {
    assert_eq!(1 + 1, 3);
}
```

运行忽略的测试：

```bash
cargo test -- --ignored
```

---

### 5. **测试结果的管理**

- **成功测试**：Rust 输出 `ok`。
- **失败测试**：Rust 输出 `FAILED`，并显示详细的失败原因。
- **并行测试**：默认情况下，Rust 测试是并行运行的。可以使用 `--test-threads` 控制并行线程数：

```bash
cargo test -- --test-threads=1
```

---

### 6. **集成测试**

#### 集成测试的组织

集成测试位于项目的 `tests` 目录中，`cargo test` 会自动识别和运行该目录下的文件。每个文件都是一个单独的测试 crate，与项目的私有实现隔离。

目录结构示例：

```
my_project/
├── src/
│   └── lib.rs
└── tests/
    ├── test_integration.rs
    └── another_test.rs
```

#### 集成测试示例

在 `tests/test_integration.rs` 文件中：

```rust
use my_project::add;

#[test]
fn test_add() {
    assert_eq!(add(2, 2), 4);
}
```

运行所有测试：

```bash
cargo test
```

---

### 7. **文档测试**

Rust 支持在文档注释中嵌入代码示例，并自动将其作为测试运行。文档测试确保文档中的代码是正确的。

#### 文档测试示例

在 `src/lib.rs` 中：

```rust
/// Adds two numbers.
///
/// # Examples
///
/// ```
/// let result = my_project::add(2, 3);
/// assert_eq!(result, 5);
/// ```
pub fn add(a: i32, b: i32) -> i32 {
    a + b
}
```

运行文档测试：

```bash
cargo test
```

#### 文档测试的失败示例

如果文档中的示例代码错误，测试会失败。例如：

```
/// ```
/// let result = 2 + 2;
/// assert_eq!(result, 5); // 错误的断言
/// ```
```

运行 `cargo test` 时会显示失败信息。

---

### 8. **测试环境变量**

在测试中，可以通过环境变量控制测试行为，例如设置日志级别：

```rust
#[test]
fn test_with_env() {
    std::env::set_var("RUST_LOG", "debug");
    // 测试逻辑
}
```

---

### 9. **测试基准（Benchmarking）**

Rust 提供 `bench` 属性用于基准测试，但需要启用 nightly 版本。

#### 示例：

```rust
#![feature(test)]

extern crate test;

#[cfg(test)]
mod tests {
    use super::*;
    use test::Bencher;

    #[bench]
    fn bench_example(b: &mut Bencher) {
        b.iter(|| {
            let x = 2 * 2;
            assert_eq!(x, 4);
        });
    }
}
```

运行基准测试：

```bash
cargo +nightly bench
```

---

### 10. **测试工具与库**

#### 断言库

- **`assert_approx_eq`**：用于浮点数比较。
- **`mockall`**：实现依赖注入和函数的模拟。
- **`proptest`**：基于属性的测试。

#### 示例：`proptest`

`proptest` 可以生成随机测试数据，覆盖更多测试场景：

```rust
use proptest::prelude::*;

fn add(a: i32, b: i32) -> i32 {
    a + b
}

proptest! {
    #[test]
    fn test_add(a in 0..1000, b in 0..1000) {
        assert!(add(a, b) >= a);
    }
}
```

---

### 11. **测试最佳实践**

1. **小而明确的测试用例**：每个测试应测试一个功能，易于排查问题。
2. **覆盖常见与极端情况**：确保边界值、异常输入等都有测试覆盖。
3. **使用断言库**：提升断言的可读性和表达力。
4. **文档测试**：保持代码示例和实际行为的一致性。
5. **测试隔离**：避免测试之间互相依赖或共享状态。
6. **自动化测试**：在 CI/CD 流水线中运行测试。

---

### 总结

Rust 提供了强大且高效的测试工具，通过单元测试、集成测试和文档测试，开发者可以全面验证代码的正确性和健壮性。配合 `cargo` 的便捷命令和社区丰富的测试库，Rust 的测试体系能够帮助开发者快速定位问题，持续提升代码质量。