---
sidebar_position: 2
---
# FAQ?

## npm ci 和 install 区别

`npm ci` 和 `npm install` 是两个用于安装 Node.js 项目依赖的 npm 命令，它们在一些方面有所不同。以下是它们之间的主要区别：

1. **目的：**
   - `npm install`：通常用于在开发过程中安装依赖，可以用于安装生产依赖和开发依赖。
   - `npm ci`（Continuous Integration）：主要用于持续集成（CI）环境中，在构建过程中快速安装项目的依赖。它的主要目标是确保在 CI 构建中使用与 `package-lock.json` 文件中完全匹配的依赖版本，以保持一致性和可复现性。

2. **安装速度：**
   - `npm install`：可能会比 `npm ci` 更慢，因为它会根据 `package.json` 文件中的版本范围解析依赖并进行一些额外的操作，如生成 `node_modules` 目录。
   - `npm ci`：为了获得更快的安装速度，`npm ci` 将忽略 `package.json` 中的版本范围，直接使用 `package-lock.json` 中的确切依赖版本，从而跳过了解析和处理步骤。

3. **缓存利用：**
   - `npm install`：可能会使用本地缓存，尤其是如果依赖项在之前已经安装过的话。
   - `npm ci`：通常会忽略本地缓存，以确保使用的依赖版本与 `package-lock.json` 完全一致。

4. **文件变更：**
   - `npm install`：可以根据 `package.json` 中的依赖范围重新解析依赖项，适应 `package.json` 的变化。
   - `npm ci`：如果 `package.json` 或 `package-lock.json` 有变化，可能需要重新生成 `node_modules` 目录，因此它通常用于在构建前确保依赖项的一致性。

综上所述，`npm ci` 更适合用于持续集成环境，以确保构建的可重现性和稳定性。`npm install` 则在开发过程中更常用，可以处理依赖范围解析，并根据需要使用本地缓存。

## package-lock.json "resolved" 字段

在 `package-lock.json` 文件中，`"resolved"` 字段的存在与否取决于几个因素，包括 npm 的版本、依赖项的来源以及项目的配置。以下是一些可能导致 `"resolved"` 字段出现或缺失的情况：

1. **npm 版本：** 较早的 npm 版本可能在生成 `package-lock.json` 文件时未始终包含 `"resolved"` 字段。更新 npm 到最新版本可能会解决这个问题。

2. **依赖来源：** 如果依赖项的来源是 npm 公共仓库（`https://registry.npmjs.org`），通常会自动生成 `"resolved"` 字段，以确保软件包的完整性和可复现性。但是，如果依赖项是来自其他私有或自定义的仓库，可能不会自动添加 `"resolved"` 字段。

3. **本地缓存：** 如果你已经下载过某个软件包，npm 可能会使用本地缓存，而不会在 `package-lock.json` 中包含 `"resolved"` 字段。这是为了加快后续的安装速度。

4. **npm 配置：** 项目中的 `.npmrc` 文件或全局 npm 配置可能会影响 `"resolved"` 字段的生成。一些配置选项可能会导致 npm 在生成 `package-lock.json` 时不包含 `"resolved"` 字段。

5. **手动修改：** 如果你手动编辑了 `package-lock.json` 文件，可能会意外地删除了某些字段，包括 `"resolved"` 字段。注意，在手动编辑 `package-lock.json` 时要谨慎，以免破坏依赖项的完整性。

综上所述，确保使用最新版本的 npm，并确保依赖项来自于 npm 公共仓库，通常可以确保 `"resolved"` 字段在 `package-lock.json` 中正确地生成和保存。如果你仍然遇到问题，可以尝试删除 `node_modules` 和 `package-lock.json` 文件，然后重新运行 `npm install`。

## 了解package-lock.json

```json
{
  "name": "my-project",
  "version": "1.0.0",
  "lockfileVersion": 2,
  "requires": true,
  "dependencies": {
    "axios": {
      "version": "0.21.4",
      "resolved": "https://registry.npmjs.org/axios/-/axios-0.21.4.tgz",
      "integrity": "sha512-...",
      "dev": true
    },
    "lodash": {
      "version": "4.17.21",
      "resolved": "https://registry.npmjs.org/lodash/-/lodash-4.17.21.tgz",
      "integrity": "sha512-..."
    }
  }
}
```

以下是各个字段的解释：

- **name:** 项目的名称。

- **version:** 项目的版本号。

- **lockfileVersion:** 锁定文件的版本。在这个示例中是 2，表示使用了 `package-lock.json` 格式的第二个版本。

- **requires:** 这个字段指示是否记录项目所需的最低 Node.js 和 npm 版本。

- **dependencies:** 一个包含依赖项的对象。

  - **[package_name]:** 依赖项的名称，如 "axios" 和 "lodash"。

    - **version:** 使用的软件包版本。

    - **resolved:** 软件包的下载地址。

    - **integrity:** 用于验证软件包完整性的哈希值。

    - **dev:** 表示这个依赖项是开发依赖。

请注意，这个示例只是一个简化的 `package-lock.json` 文件，实际的文件可能会更复杂，因为它还可以包含其他字段、子依赖项、元信息等。同时，具体的软件包版本、哈希值等信息在实际应用中会有所不同。

最重要的是，`package-lock.json` 的目的是确保在不同环境中使用相同版本的依赖，以及保证软件包的完整性和安全性。如果你使用的是较新版本的 npm，它应该会自动生成和维护这些字段，无需手动编辑。
