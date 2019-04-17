---
title: 大语言模型基础
description: Transformer架构与大规模预训练模型
---

# 大语言模型基础

## Transformer 架构

### 注意力机制

#### 自注意力原理
```python
# 查询、键、值计算
Q = X × WQ
K = X × WK  
V = X × WV

# 注意力权重
Attention(Q, K, V) = softmax(QK^T / √dk) V

其中：
- dk: 键向量维度
- softmax: 归一化函数
```

#### 多头注意力
```python
# 多头计算
MultiHead(Q, K, V) = Concat(head1, ..., headh)WO
where headi = Attention(QWQi, KWKi, VWVi)

特点：
- 并行计算多个注意力
- 捕获不同类型关系
- 提升模型表达能力
```

### 位置编码

#### 正弦位置编码
```python
PE(pos, 2i) = sin(pos / 10000^(2i/dmodel))
PE(pos, 2i+1) = cos(pos / 10000^(2i/dmodel))

特点：
- 绝对位置信息
- 周期性函数
- 外推性有限
```

#### 可学习位置编码
```python
# 参数化位置嵌入
position_embeddings = Embedding(max_seq_len, dmodel)

特点：
- 灵活学习位置关系
- 需要大量训练数据
- 可能过拟合
```

### 编码器-解码器结构

#### 编码器层
```python
class EncoderLayer:
    def __init__(self):
        self.self_attn = MultiHeadAttention()
        self.ffn = FeedForward()
        self.norm1 = LayerNorm()
        self.norm2 = LayerNorm()
    
    def forward(self, x):
        # 自注意力 + 残差连接
        x = self.norm1(x + self.self_attn(x, x, x))
        # 前馈网络 + 残差连接  
        x = self.norm2(x + self.ffn(x))
        return x
```

#### 解码器层
```python
class DecoderLayer:
    def __init__(self):
        self.self_attn = MultiHeadAttention()
        self.cross_attn = MultiHeadAttention()
        self.ffn = FeedForward()
        self.norm1 = LayerNorm()
        self.norm2 = LayerNorm()
        self.norm3 = LayerNorm()
    
    def forward(self, x, encoder_output):
        # 掩码自注意力
        x = self.norm1(x + self.self_attn(x, x, x, mask=True))
        # 编码器-解码器注意力
        x = self.norm2(x + self.cross_attn(x, encoder_output, encoder_output))
        # 前馈网络
        x = self.norm3(x + self.ffn(x))
        return x
```

## 预训练技术

### 语言模型目标

#### 因果语言模型（Causal LM）
```python
# 自回归预测
P(wt | w1, w2, ..., w(t-1)) = softmax(W × ht)

损失函数：
L = -Σt log P(wt | w<t)

特点：
- 从左到右生成
- 适合文本生成
- GPT 系列使用
```

#### 掩码语言模型（Masked LM）
```python
# 掩码预测
P(wi | context) = softmax(W × hi)

损失函数：
L = -Σi∈masked log P(wi | context)

特点：
- 双向上下文
- 适合理解任务
- BERT 系列使用
```

#### 序列到序列（Seq2Seq）
```python
# 编码器-解码器架构
P(y | x) = Πt P(yt | y<t, x)

损失函数：
L = -Σt log P(yt | y<t, x)

特点：
- 输入输出不同长度
- 适合翻译任务
- T5、BART 使用
```

### 大规模训练

#### 数据处理
```python
# 数据清洗
- 去重处理
- 质量过滤
- 格式标准化
- 敏感信息去除

# 分词策略
- BPE（字节对编码）
- WordPiece
- SentencePiece
```

#### 训练策略
```python
# 混合精度训练
with autocast():
    logits = model(inputs)
    loss = loss_fn(logits, targets)

# 梯度累积
for i, batch in enumerate(dataloader):
    loss = model(batch) / accumulation_steps
    loss.backward()
    if (i + 1) % accumulation_steps == 0:
        optimizer.step()
        optimizer.zero_grad()

# 学习率调度
def lr_schedule(step):
    if step < warmup_steps:
        return lr_max * step / warmup_steps
    else:
        return lr_max * 0.5 * (1 + cos(π * (step - warmup_steps) / (total_steps - warmup_steps)))
```

## 经典模型架构

### GPT 系列

#### GPT-1（2018）
- **参数量**：117M
- **架构**：12层解码器
- **训练数据**：BooksCorpus
- **创新点**：生成式预训练

#### GPT-2（2019）
- **参数量**：1.5B（最大）
- **架构**：48层解码器
- **训练数据**：WebText（40GB）
- **创新点**：零样本能力

#### GPT-3（2020）
- **参数量**：175B（最大）
- **架构**：96层解码器
- **训练数据**：Common Crawl（570GB）
- **创新点**：上下文学习

#### ChatGPT/GPT-4（2022-2023）
- **参数量**：未公开（估计>1T）
- **架构**：多模态支持
- **训练数据**：人类反馈强化学习
- **创新点**：对话能力、安全性

### BERT 系列

#### BERT-Base（2018）
- **参数量**：110M
- **架构**：12层编码器
- **隐藏层**：768维
- **注意力头**：12个

#### BERT-Large（2018）
- **参数量**：340M
- **架构**：24层编码器
- **隐藏层**：1024维
- **注意力头**：16个

#### RoBERTa（2019）
- **改进点**：
  - 更长训练时间
  - 更大数据集
  - 移除下一句预测
  - 动态掩码策略

#### ALBERT（2019）
- **改进点**：
  - 参数共享
  - 句子顺序预测
  - 因子分解嵌入

### T5 系列

#### T5-Base（2019）
- **参数量**：220M
- **架构**：12层编码器-解码器
- **统一框架**：Text-to-Text
- **多任务预训练**

#### T5-XXL（2019）
- **参数量**：11B
- **架构**：24层编码器-解码器
- **性能**：多个SOTA结果

## 微调技术

### 参数高效微调

#### LoRA（低秩适应）
```python
# 低秩分解
W = W0 + BA

其中：
- W0: 预训练权重（冻结）
- B: (d × r) 矩阵
- A: (r × k) 矩阵
- r << min(d, k): 低秩维度

特点：
- 参数量大幅减少
- 保持预训练知识
- 易于部署和切换
```

#### Prefix Tuning
```python
# 前缀优化
只优化输入前缀参数：
[PREFIX] x1 x2 ... xn [OUTPUT]

特点：
- 优化少量前缀token
- 保持模型主体不变
- 适应生成任务
```

#### Adapter
```python
# 适配器插入
x → LayerNorm → Linear → Nonlinear → Linear → LayerNorm → y

特点：
- 每层插入小型网络
- 参数量增加很少
- 保持原有架构
```

### 指令微调

#### 数据构造
```python
# 指令格式
{
    "instruction": "任务描述",
    "input": "输入内容", 
    "output": "期望输出"
}

# 多样性保证
- 不同任务类型
- 不同表达方式
- 不同难度级别
```

#### 训练策略
```python
# 多任务学习
for batch in dataloader:
    tasks = batch['tasks']
    inputs = batch['inputs']
    targets = batch['targets']
    
    losses = []
    for task in tasks:
        loss = model(inputs[task], targets[task])
        losses.append(loss)
    
    total_loss = sum(losses) / len(losses)
    total_loss.backward()
```

## 推理优化

### 解码策略

#### 贪婪搜索
```python
# 每步选择概率最大的词
token = argmax(P(wt | w<t))

特点：
- 速度快
- 确定性输出
- 可能陷入局部最优
```

#### 束搜索（Beam Search）
```python
# 保持top-k个候选序列
beams = [(sequence, score)]
for step in range(max_length):
    new_beams = []
    for seq, score in beams:
        next_tokens = get_top_k(seq, k)
        for token, prob in next_tokens:
            new_beams.append((seq + [token], score + log(prob)))
    beams = sorted(new_beams, key=lambda x: x[1])[:beam_size]
```

#### 采样方法
```python
# 温度采样
probs = softmax(logits / T)
token = sample(probs)

# Top-k 采样
probs = softmax(logits)
top_k_probs, top_k_indices = topk(probs, k)
token = sample(top_k_probs)

# Nucleus 采样
sorted_probs, sorted_indices = sort(probs)
cumsum_probs = cumsum(sorted_probs)
nucleus_indices = sorted_indices[cumsum_probs <= p]
```

### 性能优化

#### 模型压缩
```python
# 量化
FP32 → INT8: 4倍压缩
FP32 → FP16: 2倍压缩

# 剪枝
importance_scores = calculate_importance(weights)
pruned_weights = prune(weights, importance_scores, ratio=0.9)

# 蒸馏
teacher_logits = teacher_model(inputs)
student_logits = student_model(inputs)
loss = α * CE(student_logits, targets) + β * KL(student_logits, teacher_logits)
```

#### 推理加速
```python
# KV缓存
cache = {}
def generate_with_cache(input_ids):
    if input_ids not in cache:
        cache[input_ids] = model.get_kv_cache(input_ids)
    return model.generate_with_cache(input_ids, cache[input_ids])

# 批处理推理
batch_inputs = prepare_batch(inputs)
batch_outputs = model.generate_batch(batch_inputs)

# 流式推理
for token in model.generate_stream(input):
    yield token
```

## 应用场景

### 文本生成

#### 对话系统
```python
# 对话模板
prompt = f"""
系统: {system_prompt}
用户: {user_input}
助手: """

# 生成回复
response = model.generate(prompt, max_length=512, temperature=0.7)
```

#### 内容创作
```python
# 写作辅助
prompt = f"""
主题: {topic}
风格: {style}
长度: {length}

请生成{style}风格的{topic}文章，约{length}字：
"""

# 代码生成
prompt = f"""
# {description}
def {function_name}():
    # 请实现这个函数
"""
```

### 文本理解

#### 分类任务
```python
# 情感分析
prompt = f"""
文本: {text}
情感: [正面/负面/中性]

请分析上述文本的情感倾向：
"""

# 意图识别
prompt = f"""
用户输入: {user_input}
意图: [查询/预订/投诉/其他]

请识别用户意图：
"""
```

#### 信息抽取
```python
# 命名实体识别
prompt = f"""
文本: {text}
实体: [人名/地名/机构名/时间]

请提取文本中的命名实体：
"""

# 关系抽取
prompt = f"""
文本: {text}
关系类型: [雇佣/创始/位于/其他]

请提取实体间的关系：
"""
```

## 评估方法

### 自动评估

#### 困惑度（Perplexity）
```python
# 计算困惑度
perplexity = exp(-1/N * Σi log P(wi | context))

特点：
- 衡量语言模型质量
- 值越小越好
- 评估生成质量
```

#### BLEU 分数
```python
# BLEU 计算
BLEU = BP × exp(Σn wn log pn)

其中：
- BP: 长度惩罚因子
- pn: n-gram 精确度
- wn: 权重（通常为1/n）
```

#### ROUGE 分数
```python
# ROUGE-L（最长公共子序列）
ROUGE-L = LCS(reference, candidate) / len(reference)

# ROUGE-N（n-gram召回）
ROUGE-N = match_ngrams / total_ngrams_reference
```

### 人工评估

#### 评估维度
- **流畅性**：语言是否自然流畅
- **连贯性**：内容是否逻辑连贯
- **相关性**：是否回答了问题
- **准确性**：信息是否准确无误
- **安全性**：是否包含有害内容

#### 评估方法
- **绝对评分**：1-5分直接评分
- **相对比较**：两个版本对比
- **排序评估**：多个版本排序
- **A/B测试**：用户偏好测试

## 发展趋势

### 架构创新

#### 稀疏注意力
```python
# 局部注意力
只关注邻近token的注意力

# 全局注意力  
部分token关注全局，其他关注局部

# 随机注意力
随机选择注意力模式
```

#### 混合专家模型（MoE）
```python
# 专家路由
router_output = router(input)
expert_weights = softmax(router_output)
final_output = Σ expert_weights[i] × expert_i(input)

特点：
- 参数量巨大
- 计算量可控
- 专业化分工
```

### 训练技术

#### 自监督学习
- **对比学习**：SimCLR、MoCo
- **掩码建模**：MAE、BEiT
- **生成式预训练**：GPT风格

#### 多模态学习
- **视觉-语言**：CLIP、ALIGN
- **音频-语言**：Whisper
- **多模态统一**：Flamingo

### 应用方向

#### 个性化
- **用户适配**：微调适应特定用户
- **领域适配**：专业领域优化
- **风格适配**：写作风格学习

#### 可控性
- **属性控制**：情感、主题、长度
- **内容过滤**：安全、合规性
- **事实性**：减少幻觉

---

**学习路径完成！** 🎉

接下来可以学习：
- [大模型应用开发](../app-development/introduction.md)
