---
id: ai-concepts
title: Prompt、Agent、MCP 与 Function Calling
sidebar_label: Prompt、Agent、MCP 与 Function Calling
sidebar_position: 5
---

# AI 核心概念详解：Prompt、Agent、MCP 与 Function Calling

## Prompt Engineering（提示词工程）

### 什么是 Prompt？
Prompt 是与 AI 模型交互的输入文本，它指导 AI 模型生成期望的输出。好的 Prompt 设计可以显著提升 AI 模型的表现。

### Prompt 设计原则

1. **明确性**
```plaintext
❌ 模糊的 Prompt：
"写一个函数"

✅ 明确的 Prompt：
"用 TypeScript 写一个函数，接收一个字符串数组参数，返回数组中最长的字符串，如果数组为空则返回空字符串"
```

2. **结构化**
```plaintext
角色：你是一位资深前端开发工程师
任务：审查以下代码中的性能问题
上下文：这是一个 React 组件，用于显示大量数据
约束：需要考虑内存泄漏和重复渲染的问题
输出格式：请按严重程度排序列出问题
```

3. **示例驱动**
```plaintext
输入示例：
const user = { name: "张三", age: 25 }
期望输出：
interface User {
    name: string;
    age: number;
}
任务：根据以上示例，为下面的对象生成 TypeScript 接口...
```

## Agent（智能代理）

Agent 是一个能够自主执行任务的 AI 系统，它具有以下特点：

### 1. 自主决策
- 理解任务目标
- 制定执行计划
- 选择合适的工具
- 处理异常情况

### 2. 工具使用
```typescript
interface Tool {
    name: string;
    description: string;
    execute: (params: any) => Promise<any>;
}

class Agent {
    private tools: Tool[];
    
    async solve(task: string) {
        // 1. 分析任务
        const plan = this.analyzePlan(task);
        
        // 2. 选择工具
        const selectedTools = this.selectTools(plan);
        
        // 3. 执行步骤
        for (const step of plan) {
            await this.executeStep(step, selectedTools);
        }
    }
}
```

### 3. 反馈循环
- 执行操作
- 观察结果
- 调整策略
- 持续优化

## MCP (Model-Control-Prompt)

MCP 是一种 AI 应用架构模式，类似于传统的 MVC 模式。

### 架构组成

1. **Model（模型层）**
```typescript
interface AIModel {
    // 底层模型接口
    generate(input: string): Promise<string>;
    embed(text: string): Promise<number[]>;
    classify(text: string): Promise<string>;
}
```

2. **Control（控制层）**
```typescript
class AIController {
    constructor(private model: AIModel) {}
    
    async process(prompt: string, context: Context) {
        // 1. 预处理
        const enhancedPrompt = this.enhancePrompt(prompt, context);
        
        // 2. 调用模型
        const response = await this.model.generate(enhancedPrompt);
        
        // 3. 后处理
        return this.postProcess(response);
    }
}
```

3. **Prompt（提示层）**
```typescript
interface PromptTemplate {
    name: string;
    template: string;
    variables: string[];
    
    format(values: Record<string, string>): string;
}
```

## Function Calling（函数调用）

Function Calling 是 AI 模型调用预定义函数的能力，使 AI 能够与外部系统交互。

### 1. 函数定义
```typescript
interface FunctionDefinition {
    name: string;
    description: string;
    parameters: {
        type: "object";
        properties: Record<string, {
            type: string;
            description: string;
        }>;
        required: string[];
    };
}

const searchFunction: FunctionDefinition = {
    name: "search_database",
    description: "搜索数据库中的信息",
    parameters: {
        type: "object",
        properties: {
            query: {
                type: "string",
                description: "搜索关键词"
            },
            limit: {
                type: "number",
                description: "返回结果数量"
            }
        },
        required: ["query"]
    }
};
```

### 2. 调用流程
```typescript
class FunctionCaller {
    private functions: Map<string, Function>;
    
    async call(name: string, args: any) {
        if (!this.functions.has(name)) {
            throw new Error(`Function ${name} not found`);
        }
        
        const func = this.functions.get(name)!;
        return await func(args);
    }
}
```

### 3. 最佳实践

1. **参数验证**
```typescript
function validateArgs(args: any, definition: FunctionDefinition) {
    // 检查必需参数
    for (const required of definition.parameters.required) {
        if (!(required in args)) {
            throw new Error(`Missing required parameter: ${required}`);
        }
    }
    
    // 类型检查
    for (const [key, value] of Object.entries(args)) {
        const paramDef = definition.parameters.properties[key];
        if (typeof value !== paramDef.type) {
            throw new Error(
                `Invalid type for ${key}: expected ${paramDef.type}, got ${typeof value}`
            );
        }
    }
}
```

2. **错误处理**
```typescript
async function safeFunctionCall(
    func: Function,
    args: any,
    definition: FunctionDefinition
) {
    try {
        validateArgs(args, definition);
        const result = await func(args);
        return { success: true, data: result };
    } catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Unknown error"
        };
    }
}
```

## 实践应用

### 1. 智能代码生成
```typescript
const prompt = `
生成一个 React 组件，要求：
1. 使用 TypeScript
2. 实现一个待办事项列表
3. 包含添加、删除、标记完成功能
4. 使用 localStorage 持久化数据
`;

const response = await agent.generateCode(prompt);
```

### 2. 自动化测试生成
```typescript
const codeToTest = `
function add(a: number, b: number): number {
    return a + b;
}
`;

const testCases = await agent.generateTests(codeToTest);
```

### 3. 代码重构建议
```typescript
const code = `
function processData(data) {
    let result = [];
    for(let i = 0; i < data.length; i++) {
        if(data[i].value > 10) {
            result.push(data[i]);
        }
    }
    return result;
}
`;

const refactoringAdvice = await agent.suggestRefactoring(code);
```

## 总结

- Prompt Engineering 是与 AI 模型有效沟通的基础
- Agent 提供了自主决策和执行的能力
- MCP 架构提供了构建 AI 应用的清晰框架
- Function Calling 使 AI 能够与外部系统交互

这些概念相互配合，共同构建了现代 AI 应用的基础架构。理解和掌握这些概念，对于开发高质量的 AI 驱动应用至关重要。 