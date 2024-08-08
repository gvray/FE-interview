---
sidebar_position: 2
---
# FAQ?

## res.json 和 res.send 的区别

1. **类型支持**：
   - `res.send`：支持字符串、Buffer、对象等多种类型。
   - `res.json`：仅支持对象或数组，会将其转换为 JSON。

2. **Content-Type**：
   - `res.send`：根据传递的参数自动设置适当的 Content-Type。
   - `res.json`：始终设置 Content-Type 为 `application/json`。

3. **自动转义**：
   - `res.send`：不对输出内容进行自动转义。
   - `res.json`：会自动转义响应中的某些字符，以增强安全性。

**实际使用场景**

- 使用 `res.send` 发送简单的文本、HTML 内容、Buffer 或者 JSON。
- 使用 `res.json` 专门发送 JSON 格式的响应，确保 Content-Type 为 `application/json`。
