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
