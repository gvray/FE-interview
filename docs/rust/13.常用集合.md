---
sidebar_position: 13
---

# 常用集合

Rust 中的标准库提供了几种常用的集合类型，适用于不同场景下的数据存储和操作。这些集合包括**Vector（动态数组）**、**String（字符串）**、**HashMap（哈希映射）**、**HashSet（哈希集合）**、**BTreeMap（有序映射）**等。每种集合都有不同的特点和用法。以下是这些集合的详细介绍：

### 1. Vector（动态数组）

**`Vec<T>`** 是 Rust 中最常用的集合类型，用于存储一系列相同类型的元素。`Vec` 的大小是可变的，可以动态增长或缩小。它类似于其他语言中的动态数组或列表。

#### 使用示例：

```rust
fn main() {
    // 创建一个空的 Vec
    let mut numbers: Vec<i32> = Vec::new();

    // 使用 `push` 方法添加元素
    numbers.push(1);
    numbers.push(2);
    numbers.push(3);

    // 访问元素
    println!("First element: {}", numbers[0]);

    // 使用 for 循环遍历 Vec
    for num in &numbers {
        println!("{}", num);
    }

    // Vec 还支持使用宏创建并初始化
    let numbers = vec![1, 2, 3];
    println!("{:?}", numbers);
}
```

#### 主要方法：
- `push`：在末尾添加元素。
- `pop`：移除并返回末尾的元素。
- `len`：获取 Vec 中的元素数量。
- `get`：获取指定索引的元素，返回 `Option<&T>`。
- `remove`：移除指定位置的元素。

### 2. String（字符串）

**`String`** 是 Rust 中用于存储可变的 UTF-8 编码字符串的集合。虽然 `String` 也属于集合类型，但它的元素是字符数据，并且专门设计用于存储文本数据。

#### 使用示例：

```rust
fn main() {
    // 创建一个空字符串
    let mut s = String::new();

    // 使用 `push_str` 添加字符串切片
    s.push_str("Hello, ");

    // 使用 `push` 添加单个字符
    s.push('R');
    s.push('u');
    s.push('s');
    s.push('t');

    // 使用 format! 宏创建字符串
    let language = format!("{}{}", s, " programming language");

    println!("{}", language);
}
```

#### 主要方法：
- `push_str`：将字符串切片追加到字符串末尾。
- `push`：将单个字符添加到字符串末尾。
- `len`：获取字符串长度（以字节为单位）。
- `replace`：替换字符串中的某些子串。
- `split_whitespace`：按空白字符分割字符串。

### 3. HashMap（哈希映射）

**`HashMap<K, V>`** 是 Rust 中的键值对集合，允许快速查找、插入和删除操作。`HashMap` 中的键值对的顺序不固定，因为它使用哈希算法来存储数据。

#### 使用示例：

```rust
use std::collections::HashMap;

fn main() {
    let mut scores = HashMap::new();

    // 插入键值对
    scores.insert("Alice", 50);
    scores.insert("Bob", 30);

    // 访问元素
    match scores.get("Alice") {
        Some(score) => println!("Alice's score: {}", score),
        None => println!("No score found for Alice"),
    }

    // 遍历 HashMap
    for (key, value) in &scores {
        println!("{}: {}", key, value);
    }
}
```

#### 主要方法：
- `insert`：插入或更新键值对。
- `get`：根据键获取值，返回 `Option<&V>`。
- `remove`：删除指定键的键值对。
- `contains_key`：检查是否包含指定键。
- `entry`：用于插入和修改默认值。

### 4. HashSet（哈希集合）

**`HashSet<T>`** 是一种集合类型，用于存储不重复的值。`HashSet` 只能存储唯一值，且存储顺序不固定。

#### 使用示例：

```rust
use std::collections::HashSet;

fn main() {
    let mut set = HashSet::new();

    // 插入元素
    set.insert(1);
    set.insert(2);
    set.insert(3);
    set.insert(2);  // 重复插入无效

    // 检查是否包含某个元素
    if set.contains(&2) {
        println!("Set contains 2");
    }

    // 遍历 HashSet
    for item in &set {
        println!("{}", item);
    }
}
```

#### 主要方法：
- `insert`：添加元素，若元素已存在，则不添加。
- `contains`：检查集合中是否包含某个元素。
- `remove`：删除指定元素。
- `len`：返回集合中元素的数量。

### 5. BTreeMap（有序映射）

**`BTreeMap<K, V>`** 是一种键值对集合，类似于 `HashMap`，但键值对是按键的顺序排序的。BTreeMap 使用的是 B 树数据结构，适合需要保持键有序的情况。

#### 使用示例：

```rust
use std::collections::BTreeMap;

fn main() {
    let mut scores = BTreeMap::new();

    // 插入键值对
    scores.insert("Alice", 50);
    scores.insert("Bob", 30);
    scores.insert("Charlie", 40);

    // BTreeMap 中的元素按键排序
    for (key, value) in &scores {
        println!("{}: {}", key, value);
    }
}
```

#### 主要方法：
- `insert`：插入或更新键值对。
- `get`：根据键获取值，返回 `Option<&V>`。
- `remove`：删除指定键的键值对。
- `contains_key`：检查是否包含指定键。
- `range`：可以通过范围遍历有序键值对。

### 6. BTreeSet（有序集合）

**`BTreeSet<T>`** 是一个有序集合，元素不重复且按排序顺序存储。它适合需要按顺序访问集合元素的场景。

#### 使用示例：

```rust
use std::collections::BTreeSet;

fn main() {
    let mut set = BTreeSet::new();

    set.insert(3);
    set.insert(1);
    set.insert(2);

    // BTreeSet 中元素按顺序存储
    for item in &set {
        println!("{}", item);
    }
}
```

#### 主要方法：
- `insert`：添加元素。
- `remove`：删除指定元素。
- `contains`：检查集合中是否包含某个元素。
- `range`：按范围遍历集合元素。

### 7. VecDeque（双端队列）

**`VecDeque<T>`** 是一种双端队列，支持在队列的头尾快速添加和删除元素。`VecDeque` 使用环形缓冲区，适合需要高效头尾操作的场景。

#### 使用示例：

```rust
use std::collections::VecDeque;

fn main() {
    let mut deque = VecDeque::new();

    deque.push_back(1);
    deque.push_front(2);

    while let Some(value) = deque.pop_front() {
        println!("{}", value);
    }
}
```

#### 主要方法：
- `push_back`：在队尾添加元素。
- `push_front`：在队头添加元素。
- `pop_back`：移除并返回队尾元素。
- `pop_front`：移除并返回队头元素。

### 总结

| 集合类型     | 特点和适用场景                                   |
|--------------|------------------------------------------------|
| `Vec<T>`     | 动态数组，适合存储有序数据且支持随机访问        |
| `String`     | 可变的 UTF-8 字符串                             |
| `HashMap<K, V>` | 无序键值对集合，适合快速查找数据                |
| `HashSet<T>` | 无序集合，不允许重复元素                         |
| `BTreeMap<K, V>` | 有序键值对集合，适合需要按键排序的数据       |
| `BTreeSet<T>` | 有序集合，不允许重复元素                         |
| `VecDeque<T>` | 双端队列，适合高效头尾插入或删除的场景         |

这些集合类型提供了丰富的方法，可以满足大部分数据存储和操作的需求，使用时应根据场景选择适合的集合类型。