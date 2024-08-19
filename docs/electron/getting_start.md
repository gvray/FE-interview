# 入门教程

## 技术架构

- Chromium 支持最新特性的浏览器
- Nodejs javascript运行时，可实现文件的读写等
- NativeAPI 提供统一的原生界面能力

## 生命周期

```js
const { app, BrowserWindow } = require('electron');
const path = require('path');

let mainWindow;

// 创建窗口的函数
function createWindow () {
  // 创建一个新的浏览器窗口
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js') // 预加载脚本的路径
    }
  });

  // 加载应用的 HTML 文件
  mainWindow.loadFile('index.html');

  // 当窗口准备显示时触发
  mainWindow.on('ready-to-show', () => {
    mainWindow.show(); // 显示窗口
  });

  // 当窗口被关闭时触发
  mainWindow.on('closed', () => {
    mainWindow = null; // 取消对窗口对象的引用
  });
}

// 应用准备好时触发
app.whenReady().then(() => {
  createWindow(); // 创建主窗口

  // 在 macOS 上，当应用被激活且没有打开的窗口时重新创建一个窗口
  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

// 当所有窗口被关闭时触发
app.on('window-all-closed', function () {
  // 在 macOS 上，通常应用会保持活动状态，直到用户通过菜单栏退出
  if (process.platform !== 'darwin') {
    app.quit(); // 退出应用
  }
});

// 应用退出前触发
app.on('before-quit', (event) => {
  console.log('Application is about to quit');
  // 可以在这里进行一些清理操作
});

// 应用即将退出时触发
app.on('will-quit', (event) => {
  console.log('Application will quit');
  // 可以在这里进行一些同步清理操作
});

// 应用退出时触发
app.on('quit', () => {
  console.log('Application has quit');
  // 可以在这里记录日志或进行最后的清理
});

```

## 窗口

```js

  const mainWindow = new BrowserWindow({
    // 窗口宽度（像素）
    width: 1200,
    // 窗口高度（像素）
    height: 800,
    // 窗口最小宽度（像素）
    minWidth: 800,
    // 窗口最小高度（像素）
    minHeight: 600,
    // 窗口最大宽度（像素）
    maxWidth: 1600,
    // 窗口最大高度（像素）
    maxHeight: 1200,
    // 是否可以调整窗口大小
    resizable: true,
    // 是否可以移动窗口（仅限 macOS）
    movable: true,
    // 是否可以最小化窗口
    minimizable: true,
    // 是否可以最大化窗口
    maximizable: true,
    // 是否可以关闭窗口
    closable: true,
    // 是否可以获得焦点
    focusable: true,
    // 是否始终在其他窗口之上
    alwaysOnTop: false,
    // 窗口标题
    title: "My Electron App",
    // 窗口图标路径
    icon: path.join(__dirname, 'assets/icon.png'),
    // 是否全屏显示窗口
    fullscreen: false,
    // 窗口是否可以进入全屏模式
    fullscreenable: true,
    // 是否进入 kiosk 模式（全屏，不允许退出）
    kiosk: false,
    // 窗口背景色（十六进制颜色值）
    backgroundColor: '#ffffff',
    // 窗口是否有阴影（仅限 macOS）
    hasShadow: true,
    // 窗口在创建时是否显示
    show: true,
    // 是否显示窗口边框和标题栏
    frame: true,
    // 窗口的父窗口（用于创建子窗口）
    parent: null,
    // 窗口是否为模态窗口（与 parent 一起使用）
    modal: false,
    // 是否允许使用第一次单击激活窗口（仅限 macOS）
    acceptFirstMouse: true,
    // 是否禁用自动隐藏光标
    disableAutoHideCursor: false,
    // 是否自动隐藏菜单栏
    autoHideMenuBar: false,
    // 窗口是否为透明
    transparent: false,
    // 网页内容相关的设置
    webPreferences: {
      // 预加载脚本的路径
      preload: path.join(__dirname, 'preload.js'),
      // 启用 Node.js 集成
      nodeIntegration: true,
      // 禁用上下文隔离
      contextIsolation: false,
      // 启用 remote 模块
      enableRemoteModule: true,
      // 启用开发者工具
      devTools: true
    }
  });

  ```
## 数据持久化方案

- JSON 文件, 可以使用electron-store库来管理JSON文件
- SQLite 数据库, SQLite 是一个轻量级的嵌入式 SQL 数据库，适合存储结构化数据。 可以使用electron-db-manager库来管理SQLite数据库
- LocalStorage 和 IndexedDB。对于较小的数据量，可以使用浏览器自带的 LocalStorage 或 IndexedDB，这些 API 可以直接在 Electron 的渲染进程中使用。
- NoSQL 数据库，NeDB 是一个嵌入式的 NoSQL 数据库，具有类似 MongoDB 的 API。适用于中小型应用的数据存储需求。
