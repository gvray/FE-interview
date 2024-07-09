---
title: 大模型模型选择
description: 选择合适的大模型
sidebar_position: 2
---

# 大模型模型选择

| 大模型类别                                                 | 技术特性描述                                                 | 代表性模型                                                   |
| ---------------------------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| **通用语言模型（General LLM）**                            | 具备强泛化能力，可执行文本理解、逻辑推理、知识问答、文本生成、知识提炼等多类任务，是最常见、最具通用性的大模型形态。 | DeepSeek、Qwen、kimi-k2、MiniMax-M2、GPT-4.x、Claude 3 系列 等 |
| **多模态大模型（Multimodal LLM）**                         | 支持跨模态处理与推理，例如文本、图像、音频、视频等输入方式，并融合多源信息产出统一的理解和生成结果。 | GPT-4o、Qwen3-Omni、GLM-4.5V、Qwen3-VL 等                    |
| **文本向量嵌入模型（Text Embedding Model）**               | 将文本转换为计算机可处理的稠密向量表示，用于语义检索、向量数据库、相似度计算、RAG 检索增强等场景。 | BGE（small / base / large）、OpenAI Embedding、Qwen3-Embedding 等 |
| **多模态嵌入模型（Multimodal Embedding Model）**           | 同时对文本、图像、视频、音频等多模态数据进行向量化处理，将不同模态统一映射到同一语义空间，便于跨模态检索与对齐。 | GME-Qwen3-VL、OpenAI-CLIP、Chinese-CLIP 等                   |
| **多模态解析 /结构化模型（Multimodal Structuring / OCR）** | 对复杂非结构化内容进行理解、解析、字段抽取、结构化输出，适用于 OCR、表单识别、票据解析等文档理解场景。 | DeepSeek-OCR、Dolphin、Dots.OCR、MonkeyOCR、Unstructured 等  |
| **垂直行业大模型（Domain-Specific LLM）**                  | 针对医疗、法律、教育、安全、工业等特定领域进行专业语料训练，可解决高专业度任务并提供可控可靠结果。 | DeepMind AlphaFold、360 安全大模型、讯飞星火 4.0（医疗）等   |

# OpenAI 大模型选择

| 类型                                      | 核心特点                                                     | content / 输入                                               | 典型用途 / 案例                                         | 工程实现示例                                                 |
| ----------------------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------- | ------------------------------------------------------------ |
| **1. 文本（Text-only / 普通模型）**       | 只处理文本，最基础，messages.content 是字符串                | `"这是文本内容"`                                             | 问答、聊天、代码生成、文档解析                          | `ts messages: [{role:"user", content:"写一个 Rust 函数"}]`   |
| **2. 多模态（Text + Image/Audio/Video）** | content 是 block 数组，每个 block 指明类型；可理解文字、图片、音频、视频 | `[ {type:"text", text:"描述图片"}, {type:"image_url", image_url:{url:"..."}} ]` | 图片描述、OCR、视频分析、语音问答                       | `ts messages: [{role:"user", content:[{type:"text", text:"这张图内容"}, {type:"image_url", image_url:{url:"data:image/jpeg;base64,..."}}]}]` |
| **3. Tool / Function Calling**            | 推理中断 + 外部事实；模型提出动作，由程序执行再喂回          | tool 调用信息（函数名 + 参数）                               | Agent 自动调用 API / DB / 工具；结构化输出              | `ts assistant生成tool_calls -> 程序执行 getUserById -> messages.push({role:"tool", content:JSON.stringify(result)})` |
| **4. RAG / 文本增强**                     | 模型本身仍是文本/多模态，但注入外部知识库内容                | 文本或 block，包含检索结果                                   | 企业知识库问答、问答系统                                | `ts messages.push({role:"assistant", content:"从知识库查到的信息"})` |
| **5. 专用 / Fine-tuned**                  | 模型能力专化，垂直领域更精准                                 | 与文本或多模态一致                                           | Codex（代码生成）、Embeddings（向量表示）、垂直领域 Q&A | `ts messages: [{role:"user", content:"帮我写一个 Python 网络爬虫"}]` |
