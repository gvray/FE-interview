---
sidebar_position: 1
---
# 小程序

小程序是国内移动端业务的高频考点，尤其在腾讯、字节、阿里等 C 端业务岗几乎必问。它涵盖微信、支付宝、百度、字节等多家小程序生态，核心是"双线程模型"——视图层（WebView）与逻辑层（JS 引擎）物理隔离、通过 JSBridge 通信。开发形态上有原生（WXML/WXSS/JS）、跨端框架（Taro/uni-app）与各平台增强能力（云开发、原生组件）。

## 子主题

- **双线程模型**：视图层运行在 WebView，逻辑层运行在独立 JS 引擎（V8/JSCore），二者通过 Native 的 JSBridge 通信，setData 是唯一的数据通道。
- **开发框架**：原生开发（WXML/WXSS/JS）与跨端框架（Taro 编译时、uni-app 运行时）的选型与差异。
- **生命周期与分包**：App/Page/Component 生命周期、分包加载、独立分包、分包预下载。

## 学习路径建议

- **先理解双线程**：从"为什么不能用 DOM"切入，讲清双线程模型与 setData 的通信成本，这是小程序所有性能问题的根因。
- **掌握生命周期**：App/Page/Component 三层生命周期，结合路由栈与 onLoad/onShow/onReady 理解页面渲染节奏。
- **横向对比**：对比原生与 Taro/uni-app 的编译机制与运行时差异，能讲清"编译时转换 vs 运行时适配"的选型取舍。

[FAQ](./FAQ.md)
