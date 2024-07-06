---
title: 深度学习入门
description: 神经网络基础与深度学习架构
---

# 深度学习入门

## 神经网络基础

### 生物神经元启发

#### 结构类比
```
生物神经元 → 人工神经元
树突      → 输入连接
细胞体    → 求和与激活
轴突      → 输出连接
突触      → 权重参数
```

#### 数学模型
```python
# 基本神经元计算
z = Σ(wi × xi) + b
a = activation(z)

其中：
- xi: 输入特征
- wi: 连接权重
- b: 偏置项
- activation: 激活函数
```

### 激活函数

#### Sigmoid 函数
```python
σ(x) = 1 / (1 + e^(-x))

特点：
- 输出范围：(0, 1)
- 平滑可导
- 梯度消失问题
```

#### Tanh 函数
```python
tanh(x) = (e^x - e^(-x)) / (e^x + e^(-x))

特点：
- 输出范围：(-1, 1)
- 零中心化
- 仍有梯度消失
```

#### ReLU 函数
```python
ReLU(x) = max(0, x)

特点：
- 计算简单
- 缓解梯度消失
- Dead ReLU 问题
```

#### Leaky ReLU
```python
LeakyReLU(x) = max(αx, x), α << 1

特点：
- 解决 Dead ReLU
- 保持稀疏激活
```

## 网络架构

### 前馈神经网络

#### 多层感知机（MLP）
```
输入层 → 隐藏层1 → 隐藏层2 → ... → 输出层
```

#### 通用近似定理
- 单隐藏层网络可近似任意连续函数
- 隐藏层神经元数量决定表达能力
- 深度网络更高效

### 卷积神经网络（CNN）

#### 核心组件

**卷积层**
```python
# 卷积运算
output[i, j] = Σ Σ input[m, n] × kernel[i-m, j-n]

特点：
- 局部连接
- 权重共享
- 平移不变性
```

**池化层**
```python
# 最大池化
output[i, j] = max(input[2i:2i+2, 2j:2j+2])

# 平均池化
output[i, j] = mean(input[2i:2i+2, 2j:2j+2])
```

#### 经典架构

**LeNet-5（1998）**
- 输入层：32×32 图像
- 卷积层：6个 5×5 卷积核
- 池化层：2×2 平均池化
- 全连接层：120 + 84 + 10

**AlexNet（2012）**
- 更深网络：8层
- ReLU 激活函数
- Dropout 正则化
- 数据增强

**VGG（2014）**
- 统一 3×3 卷积核
- 16-19 层深度
- 简单有效的设计

**ResNet（2015）**
```python
# 残差连接
output = F(x) + x

特点：
- 解决梯度消失
- 支持极深网络
- 易于优化
```

### 循环神经网络（RNN）

#### 基础 RNN
```python
# 隐藏状态更新
ht = tanh(Wx × xt + Wh × h(t-1) + bh)

# 输出计算
yt = Wy × ht + by
```

#### LSTM（长短期记忆网络）
```python
# 遗忘门
ft = σ(Wf × [ht-1, xt] + bf)

# 输入门
it = σ(Wi × [ht-1, xt] + bi)
C̃t = tanh(WC × [ht-1, xt] + bC)

# 候选记忆
Ct = ft × Ct-1 + it × C̃t

# 输出门
ot = σ(Wo × [ht-1, xt] + bo)
ht = ot × tanh(Ct)
```

#### GRU（门控循环单元）
```python
# 更新门
zt = σ(Wz × [ht-1, xt])

# 重置门
rt = σ(Wr × [ht-1, xt])

# 候选隐藏状态
h̃t = tanh(W × [rt × ht-1, xt])

# 新隐藏状态
ht = (1 - zt) × ht-1 + zt × h̃t
```

## 训练技术

### 反向传播算法

#### 链式法则
```python
# 梯度计算
∂L/∂w = ∂L/∂a × ∂a/∂z × ∂z/∂w

其中：
- L: 损失函数
- a: 激活输出
- z: 加权输入
- w: 权重参数
```

#### 计算图
- 前向传播：计算输出
- 反向传播：计算梯度
- 参数更新：梯度下降

### 优化算法

#### 梯度下降变体

**SGD（随机梯度下降）**
```python
w = w - η × ∇L(w)

特点：
- 每次更新一个样本
- 噪声较大
- 收敛不稳定
```

**Momentum**
```python
v = β × v - η × ∇L(w)
w = w + v

特点：
- 加速收敛
- 减少震荡
- 惯性效应
```

**Adam（自适应矩估计）**
```python
m = β1 × m + (1-β1) × ∇L(w)
v = β2 × v + (1-β2) × (∇L(w))²
w = w - η × m / (√v + ε)

特点：
- 自适应学习率
- 一阶和二阶矩估计
- 收敛快速稳定
```

### 正则化技术

#### L1/L2 正则化
```python
# L2 正则化
L = L_original + λ × Σw²

# L1 正则化
L = L_original + λ × Σ|w|
```

#### Dropout
```python
# 训练时随机丢弃神经元
mask = Bernoulli(p)  # p 为保留概率
h = activation(W × x) × mask / p

# 测试时使用完整网络
h = activation(W × x)
```

#### 批量归一化（BatchNorm）
```python
# 训练时
μ_batch = mean(x)
σ²_batch = var(x)
x̂ = (x - μ_batch) / √(σ²_batch + ε)
y = γ × x̂ + β

# 测试时
x̂ = (x - μ_running) / √(σ²_running + ε)
y = γ × x̂ + β
```

## 实际应用

### 计算机视觉

#### 图像分类
```python
# 典型 CNN 架构
model = Sequential([
    Conv2D(32, (3, 3), activation='relu'),
    MaxPooling2D((2, 2)),
    Conv2D(64, (3, 3), activation='relu'),
    MaxPooling2D((2, 2)),
    Conv2D(128, (3, 3), activation='relu'),
    GlobalAveragePooling2D(),
    Dense(10, activation='softmax')
])
```

#### 目标检测
- **R-CNN 系列**：区域提议 + 分类
- **YOLO 系列**：单阶段检测
- **SSD**：多尺度检测

#### 图像分割
- **FCN**：全卷积网络
- **U-Net**：编码器-解码器
- **Mask R-CNN**：实例分割

### 自然语言处理

#### 词嵌入
```python
# Word2Vec Skip-gram
maximize Σ log P(wO | wI)

其中：
- wI: 输入词
- wO: 上下文词
- P(wO | wI): 条件概率
```

#### 注意力机制
```python
# 注意力权重
αij = exp(eij) / Σk exp(eik)

# 注意力分数
eij = a(si-1, hj)

# 上下文向量
ci = Σj αij × hj
```

#### Transformer
```python
# 自注意力
Attention(Q, K, V) = softmax(QK^T / √dk) V

# 多头注意力
MultiHead(Q, K, V) = Concat(head1, ..., headh)WO
where headi = Attention(QWQi, KWKi, VWVi)
```

### 语音识别

#### 声学模型
- **CTC 损失**：处理序列对齐
- **RNN-T**：流式识别
- **Conformer**：CNN + Transformer

#### 语言模型
- **N-gram**：传统统计方法
- **LSTM-LM**：神经网络语言模型
- **Transformer-LM**：大规模预训练

## 实践技巧

### 数据预处理

#### 标准化
```python
# Z-score 标准化
x̂ = (x - μ) / σ

# Min-Max 标准化
x̂ = (x - xmin) / (xmax - xmin)
```

#### 数据增强
```python
# 图像增强
- 随机裁剪
- 水平翻转
- 颜色抖动
- 旋转缩放

# 文本增强
- 同义词替换
- 随机插入
- 随机删除
- 回译
```

### 超参数调优

#### 学习率调度
```python
# 学习率衰减
lr = lr0 × decay^epoch

# 余弦退火
lr = lr_min + 0.5 × (lr_max - lr_min) × (1 + cos(π × epoch / T))

# Warmup + Cosine
if epoch < warmup_epochs:
    lr = lr_max × epoch / warmup_epochs
else:
    lr = lr_min + 0.5 × (lr_max - lr_min) × (1 + cos(π × (epoch-warmup_epochs) / (T-warmup_epochs)))
```

#### 批次大小选择
- **大批次**：训练速度快，泛化可能差
- **小批次**：噪声有益，泛化好
- **动态调整**：线性缩放规则

### 模型部署

#### 模型压缩
```python
# 剪枝
# 移除不重要的连接或神经元

# 量化
# FP32 → INT8/FP16

# 知识蒸馏
# 大模型 → 小模型
```

#### 推理优化
- **TensorRT**：GPU 推理加速
- **ONNX**：跨平台格式
- **Core ML**：苹果设备优化

## 发展趋势

### 架构创新

#### Vision Transformer
- 将 Transformer 应用于视觉
- 全局注意力机制
- 可扩展性强

#### 神经架构搜索（NAS）
- 自动设计网络架构
- 强化学习搜索
- 效率与性能平衡

### 训练技术

#### 自监督学习
- 对比学习
- 掩码建模
- 生成式预训练

#### 少样本学习
- 元学习
- 度量学习
- 数据增强

### 应用前沿

#### 多模态学习
- 视觉-语言模型
- 跨模态理解
- 统一表示学习

#### 边缘计算
- 模型压缩
- 神经网络加速器
- 实时推理

## 学习资源

### 理论基础
1. **深度学习**：Ian Goodfellow 等
2. **模式识别与机器学习**：Christopher Bishop
3. **统计学习方法**：李航

### 实践框架
1. **PyTorch**：动态图框架
2. **TensorFlow**：生产级框架
3. **JAX**：函数式编程

### 在线课程
1. **CS231n**：斯坦福计算机视觉
2. **CS224n**：斯坦福 NLP
3. **DeepLearning.ai**：吴恩达系列

---

**下一节**：[大语言模型基础](04-large-language-models.md)
