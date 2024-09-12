---
sidebar_position: 1
---
# 安全与鉴权

Web 安全与鉴权是中高级前端面试的高频考点，尤其在海淘、金融、社交、SaaS 等业务向岗位几乎必问。它考察候选人是否理解浏览器同源策略、传输层加密、身份认证链路，以及能否在工程中正确使用 Cookie/Session/Token、配置 CSP、防御 XSS/CSRF。本分类将分散的"Web 安全""HTTPS 加密""鉴权"三大主题集中梳理，便于体系化复习。

## 三大主题

| 主题 | 范围 | 关键考点 |
| --- | --- | --- |
| **Web 安全** | XSS / CSRF / CSP | 反射型/存储型/DOM 型 XSS、CSRF 攻击链、CSP 策略、HttpOnly/Secure/SameSite |
| **HTTPS 与加密** | TLS 握手、对称/非对称加密、证书 | RSA/ECDHE 握手、数字签名与证书链、中间人攻击、TLS 1.3 改进 |
| **鉴权** | Cookie / Session / Token / SSO / OAuth | 有状态 vs 无状态、JWT 结构与风险、单点登录、OAuth 2.0 授权码流程 |

## 详细 FAQ

本分类的 26 道高频问答全部收录在下方 FAQ 中，按主题分组，可直接作为系统复习与面试速查的入口：

- [安全与鉴权 FAQ](./FAQ.md) — 涵盖 Web 安全、HTTPS 加密、鉴权三大块共 26 题。

## 学习路径建议

- **先攻 Web 安全**：理解 XSS 的三种类型与 CSRF 的攻击链，掌握 Cookie 属性（HttpOnly/Secure/SameSite）与 CSP 的实战配置。
- **再啃 HTTPS**：从对称/非对称加密出发，走通 TLS 握手全过程，能讲清证书链校验与中间人攻击防御，这是面试的"硬骨头"。
- **收口鉴权**：对比 Cookie/Session（有状态）与 Token/JWT（无状态）的取舍，延伸到 SSO 单点登录与 OAuth 2.0 授权码流程，理解企业级登录体系。
- **结合实践**：每个机制都回到"在自己项目里怎么落地"——例如给一个 SPA 配置 CORS + CSRF Token + JWT 刷新，能讲清完整链路。
