---
title: AI 应用开发入门
description: Prompt、Agent、MCP 与 Function Calling 核心概念
sidebar_position: 1
---

# AI 应用开发入门

## Prompt Engineering（提示词工程）

### 什么是 Prompt？
Prompt 是与 AI 模型交互的输入文本，它指导 AI 模型生成期望的输出。好的 Prompt 设计可以显著提升 AI 模型的表现。

### Prompt 设计原则

#### 1. 明确性
```plaintext
❌ 模糊的 Prompt：
"写一个函数"

✅ 明确的 Prompt：
"请用 JavaScript 写一个函数，接收一个数字数组作为参数，返回数组中的最大值。函数应该包含错误处理和类型检查。"
```

#### 2. 上下文丰富
```plaintext
❌ 缺少上下文：
"优化这段代码"

✅ 提供上下文：
"这是一个 React 组件的性能优化问题。当前组件在大量数据渲染时出现卡顿，请优化以下代码，重点考虑渲染性能和内存使用："
```

#### 3. 结构化格式
```plaintext
✅ 使用结构化格式：
## 任务描述
请实现一个用户认证系统

## 技术要求
- 使用 JWT 进行身份验证
- 支持登录、注册、密码重置功能
- 前端使用 React，后端使用 Node.js

## 输出格式
请提供完整的代码实现，包括：
1. 后端 API 接口
2. 前端组件代码
3. 数据库设计
```

#### 4. 示例引导
```plaintext
✅ 提供示例：
请按照以下格式生成产品描述：

示例：
产品名称：智能手表 Pro
核心卖点：健康监测、运动追踪、智能提醒
目标用户：健身爱好者、商务人士
产品描述：这款智能手表集成了先进的健康监测功能...

现在请为以下产品生成描述：
产品名称：无线降噪耳机
核心卖点：主动降噪、高音质、长续航
目标用户：音乐爱好者、通勤族
```

### 高级 Prompt 技巧

#### Chain of Thought（思维链）
```plaintext
请逐步解决以下数学问题：

问题：一个商店的苹果价格是每斤5元，香蕉价格是每斤3元。如果小明买了2斤苹果和3斤香蕉，总共需要支付多少钱？

请按照以下步骤思考：
1. 计算苹果的总价
2. 计算香蕉的总价  
3. 将两者相加得到总价
4. 给出最终答案
```

#### Few-shot Learning（少样本学习）
```plaintext
以下是一些情感分类的例子：

文本："这个产品太棒了，我很满意！" → 情感：正面
文本："服务态度很差，不推荐。" → 情感：负面
文本："还可以，没有特别的惊喜。" → 情感：中性

现在请分类以下文本：
文本："包装精美，物流快速，产品质量超出预期。" → 情感：
```

## Agent 代理系统

### 什么是 AI Agent？
AI Agent 是能够自主感知环境、做出决策并执行动作的智能系统，通常包含以下组件：

#### 核心组件
1. **感知模块**：获取环境信息
2. **决策模块**：基于信息做出决策
3. **执行模块**：执行具体动作
4. **记忆模块**：存储历史信息

### Agent 架构模式

#### 1. ReAct 模式
```typescript
// Reasoning + Acting
async function* agentLoop(query: string): AsyncGenerator<string, void, unknown> {
    let currentState = '';
    let taskComplete = false;
    
    while (!taskComplete) {
        // 思考阶段
        const thought = await llm(`分析当前情况并制定下一步计划：${currentState}`);
        
        // 行动阶段  
        const action = selectAction(thought);
        const result = await executeAction(action);
        
        // 观察阶段
        const observation = observeResult(result);
        currentState = updateState(observation);
        
        yield `思考：${thought}\n行动：${action}\n结果：${result}`;
        
        if (currentState.includes('任务完成')) {
            taskComplete = true;
        }
    }
}
```

#### 2. Plan-and-Execute 模式
```typescript
// 先规划后执行
interface Plan {
    steps: string[];
    requirements: string[];
}

async function planExecuteAgent(goal: string): Promise<void> {
    // 规划阶段
    const plan: Plan = await llm(`为以下目标制定详细执行计划：${goal}`);
    
    // 执行阶段
    for (const step of plan.steps) {
        const result = await executeStep(step);
        if (!result.success) {
            // 重新规划
            plan = await adjustPlan(plan, result.error);
        }
    }
}
```

### 实际应用场景

#### 1. 客服 Agent
```typescript
class CustomerServiceAgent {
    private knowledgeBase: Map<string, string>;
    private conversationHistory: string[];
    
    constructor() {
        this.knowledgeBase = loadKnowledgeBase();
        this.conversationHistory = [];
    }
    
    async handleQuery(userQuery: string): Promise<string> {
        // 意图识别
        const intent = await classifyIntent(userQuery);
        
        // 信息检索
        let response: string;
        switch (intent) {
            case 'product_info':
                response = await searchProductInfo(userQuery);
                break;
            case 'order_status':
                response = await checkOrderStatus(userQuery);
                break;
            default:
                response = await generateHelpfulResponse(userQuery);
        }
        
        return response;
    }
}
```

#### 2. 代码助手 Agent
```typescript
class CodeAssistantAgent {
    async generateCode(requirements: string): Promise<string> {
        // 分析需求
        const analysis = await analyzeRequirement(requirements);
        
        // 生成代码
        let code = await generateCodeSnippet(analysis);
        
        // 代码审查
        const review = await reviewCode(code);
        
        if (review.issues.length > 0) {
            // 修复问题
            code = await fixIssues(code, review.issues);
        }
        
        return code;
    }
}
```

## MCP（Model Context Protocol）

### 什么是 MCP？
MCP 是一种标准化的协议，用于 AI 模型与外部工具和数据源的交互，提供统一的接口规范。

### MCP 核心特性

#### 1. 标准化接口
```typescript
// MCP 标准接口定义
interface MCPTool {
    name: string;
    description: string;
    parameters: MCPParameters;
    execute: (params: MCPParameters) => Promise<MCPResult>;
}

interface MCPParameters {
    [key: string]: MCPParameter;
}

interface MCPParameter {
    type: 'string' | 'number' | 'boolean' | 'object';
    description: string;
    required?: boolean;
}
```

#### 2. 工具注册机制
```typescript
class MCPRegistry {
    private tools: Map<string, MCPTool> = new Map();
    
    registerTool(tool: MCPTool): void {
        this.tools.set(tool.name, tool);
    }
    
    getTool(name: string): MCPTool | undefined {
        return this.tools.get(name);
    }
    
    listTools(): string[] {
        return Array.from(this.tools.keys());
    }
}
```

### MCP 实现示例

#### 数据库查询工具
```typescript
class DatabaseQueryTool implements MCPTool {
    name = 'database_query';
    description = '执行数据库查询操作';
    parameters: MCPParameters = {
        query: {
            type: 'string',
            description: 'SQL 查询语句',
            required: true
        },
        limit: {
            type: 'number', 
            description: '返回结果数量限制',
            required: false
        }
    };
    
    private database: Database;
    
    constructor(database: Database) {
        this.database = database;
    }
    
    async execute(params: MCPParameters): Promise<MCPResult> {
        const query = params.query as string;
        const limit = (params.limit as number) || 100;
        
        // 执行查询
        const result = await this.database.execute(query, limit);
        
        return {
            success: true,
            data: result,
            count: result.length
        };
    }
}
```

## Function Calling（函数调用）

### 什么是 Function Calling？
Function Calling 允许 AI 模型调用外部函数来获取信息或执行操作，扩展了模型的能力边界。

### Function Calling 流程

#### 1. 函数定义
```typescript
// 示例：通过注释生成代码
// 创建一个函数，接收一个数组，返回数组中的最大值
function findMax(arr: number[]): number | null {
    if (!arr || arr.length === 0) return null;
    return Math.max(...arr);
}
```

#### 2. 模型推理
```typescript
// 模型推理和函数调用
async function handleWeatherQuery(query: string): Promise<string> {
    // 模型决定是否调用函数
    const response = await openai.chat.completions.create({
        model: 'gpt-4',
        messages: [{ role: 'user', content: query }],
        functions,
        function_call: 'auto'
    });
    
    const message = response.choices[0].message;
    
    // 检查是否需要调用函数
    if (message.function_call) {
        const functionName = message.function_call.name;
        const functionArgs = JSON.parse(message.function_call.arguments);
        
        // 执行函数
        const result = await callFunction(functionName, functionArgs);
        
        // 将结果返回给模型
        const finalResponse = await openai.chat.completions.create({
            model: 'gpt-4',
            messages: [
                { role: 'user', content: query },
                message,
                { 
                    role: 'function', 
                    name: functionName, 
                    content: JSON.stringify(result) 
                }
            ]
        });
        
        return finalResponse.choices[0].message.content || '';
    }
    
    return message.content || '';
}
```

### 实际应用案例

#### 1. 智能客服系统
```typescript
// 智能客服系统
async function handleCustomerQuery(query: string): Promise<string> {
    // 定义可用函数
    const availableFunctions = [
        getOrderStatus,
        getProductInfo,
        processReturn,
        scheduleDelivery
    ];
    
    // AI 分析并调用相应函数
    const response = await aiModel.analyze(query, availableFunctions);
    
    if (response.functionCall) {
        const result = await executeFunction(response.functionCall);
        return formatResponse(result);
    } else {
        return response.text;
    }
}
```

#### 2. 代码生成助手
```typescript
// 代码生成助手
async function generateCodeWithValidation(requirement: string): Promise<string> {
    const validationFunctions = [
        validateSyntax,
        checkSecurity,
        testCoverage,
        optimizePerformance
    ];
    
    // 生成代码
    let code = await aiModel.generateCode(requirement);
    
    // 验证和优化
    for (const func of validationFunctions) {
        code = await func(code);
    }
    
    return code;
}
```

## 最佳实践

### 1. Prompt 优化
- 使用清晰、具体的语言
- 提供充分的上下文信息
- 使用结构化格式
- 包含相关示例

### 2. Agent 设计
- 明确定义 Agent 的职责范围
- 设计合理的决策流程
- 实现错误处理和恢复机制
- 添加监控和日志功能

### 3. MCP 集成
- 遵循 MCP 标准规范
- 实现完善的错误处理
- 提供详细的工具文档
- 考虑安全性和权限控制

### 4. Function Calling
- 定义清晰的函数接口
- 实现参数验证和类型检查
- 处理异常情况和错误
- 优化函数调用性能
