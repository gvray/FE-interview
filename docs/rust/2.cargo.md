---
sidebar_position: 2
---

# cargo

cargo 是 Rust 的包管理工具，它允许您管理 Rust 项目的依赖项、构建和测试。

- 构建代码，下载依赖的库、构建这些库。

:::tip
- 安装rust的时候会自动安装cargo。
- Rust开发者在创建新的项目时，cargo 会自动初始化一个Git存储库（如果系统中安装了Git），以便开发者可以立即开始使用版本控制。
- 代码的包称作crate。   
:::

## 常用命令

当使用 Cargo 进行 Rust 项目管理时，以下是一些常用的 Cargo 命令及其详细解释：

1. **cargo new**：
   - 创建一个新的 Rust 项目。
   - 语法：`cargo new <project_name>`
   - 这个命令会创建一个新的目录，其中包含了一个 Rust 项目的基本结构，包括 `Cargo.toml` 文件和 `src/main.rs` 文件。

:::tip

- `cargo new my_project` 的时候会自动生成git版本控制系统。
- 可以通过 --vcs none 取消版本控制。默认值是git。

:::

1. **cargo build**：
   - 构建 Rust 项目，生成可执行文件或库文件。
   - 语法：`cargo build`
   - 默认情况下，它将生成可执行文件，并将其放在项目的 `target/debug` 目录下。

   - **--release**：
     - 生成优化后的 release 版本可执行文件。
     - 语法：`cargo build --release`
     - 该命令会在 `target/release` 目录下生成优化后的可执行文件。这个版本的可执行文件通常比调试版本更快，但编译时间会更长。

2. **cargo run**：
   - 编译构建+执行结果。
   - 语法：`cargo run`
   - 这个命令会先执行 `cargo build`，然后运行生成的可执行文件。
   - 如果之前编译成功过的话，并且源代码没有改变的，那么就会直接运行二进制文件。

3. **cargo test**：
   - 运行 Rust 项目中的测试。
   - 语法：`cargo test`
   - Cargo 会自动查找项目中的测试函数并运行它们。测试函数可以在 `src` 目录中的任何文件中以 `#[cfg(test)]` 属性标记。

4. **cargo doc**：
   - 生成 Rust 项目的文档。
   - 语法：`cargo doc`
   - 这个命令会生成项目的文档并保存到 `target/doc` 目录中。您可以在本地浏览器中打开生成的 HTML 文档。

5. **cargo clean**：
   - 清理 Rust 项目的构建产物。
   - 语法：`cargo clean`
   - 这个命令会删除 `target` 目录，其中包含了编译生成的所有文件，包括可执行文件、库文件以及文档。

6. **cargo check**：
   - 检查代码，确保能编译通过，但不生成可执行文件。
   - 语法：`cargo check`
   - 这个命令会检查代码的语法和类型错误，但不会进行代码生成或优化，因此比 `cargo build` 更快。
   - 编写代码的时候可以连续反复的使用检查代码提高效率。

7. **cargo update**：
   - 更新项目依赖库的 锁定版本。通过 cargo update，你可以让 Cargo 检查是否有新的可用版本，并更新 Cargo.lock 中的记录。
   - 更新特定依赖 `cargo update -p serde`。