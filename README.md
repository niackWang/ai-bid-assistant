# AI 标书助手 (AI Bid Assistant)

> 基于多智能体协同的"招标解读 → 标书生成 → 审查交付"全链路自动化平台

[![Demo](https://img.shields.io/badge/Demo-GitHub%20Pages-blue)](https://github.com)
[![Python 3.11+](https://img.shields.io/badge/python-3.11+-blue.svg)](https://python.org)
[![React 18](https://img.shields.io/badge/react-18-61dafb.svg)](https://react.dev)

## 项目简介

AI 标书助手面向政企大客户招投标场景，借助本地私有化大模型（DeepSeek）+ 多智能体协同架构，解决传统标书编制四大痛点：

| 痛点 | AI 方案 |
|------|---------|
| 招标解析漏项 | 自动提取核心要素、打分项、废标红线 |
| 废标红线踩雷 | 规则引擎 + LLM 双重校验 |
| 长文方案耗时费力 | 6 个 Writer Agent 并行撰写 700+ 页 |
| 上下文不一致 | 共享项目摘要表 + Meta Reviewer |

## 功能全景（6 大模块 / 26 功能点）

```
┌───────┬───────┬───────┬───────┬───────┬───────┐
│①招标  │②资产  │③方案  │④商务  │⑤审查  │⑥交付  │
│解读   │库     │撰写   │报价   │校核   │编排   │
├───────┼───────┼───────┼───────┼───────┼───────┤
│PDF解析│方案索引│骨架规划│报价引擎│一致性检│一键导出│
│要素提取│资质证书│6×Writer│历史参考│合规排查│档案归档│
│打分项 │人员资质│图表生成│最优报价│模拟打分│复盘分析│
│废标红线│财务报表│上下文管│风险平衡│图表编号│协同编辑│
│风险扫描│案例库 │超长文  │        │版式对齐│        │
│任务书 │知识图谱│润色接口│        │风险清单│        │
└───────┴───────┴───────┴───────┴───────┴───────┘
```

## 技术架构（5 层）

```
L1 用户交互层 → React + Ant Design 工作台
L2 任务编排层 → Orchestrator (Planner/Dispatcher/StateManager)
L3 Agent 角色层 → BidParser + SkeletonPlanner + Writer×6 + Reviewer×3
L4 能力工具层 → RAG + 文档解析 + 图表生成 + 废标规则引擎
L5 模型层     → DeepSeek 67B + Qwen2.5-14B + BGE-M3
```

## 快速开始

### 前端（演示版）

```bash
cd frontend
npm install
npm run dev
```

浏览器打开 http://localhost:5173

### 后端（骨架代码）

```bash
cd backend
pip install -r requirements.txt
python main.py
```

API 文档：http://localhost:8000/docs

## 项目结构

```
ai-bid-assistant/
├── frontend/           # React + Vite 前端工作台
│   ├── src/
│   │   ├── pages/      # 6 大模块页面
│   │   ├── components/ # 公共组件
│   │   └── mock/       # Mock 数据
├── backend/            # FastAPI + LangGraph 后端
│   ├── agents/         # 智能体定义
│   ├── tools/          # 工具层
│   ├── rag/            # 检索增强
│   └── api/            # API 路由
└── .github/workflows/  # CI/CD 自动部署
```

## 路线图

- [x] MVP 功能规划（6 模块 26 功能点）
- [x] Multi-Agent 架构设计
- [x] 前端工作台演示
- [x] 后端骨架代码
- [ ] 接入真实 LLM（DeepSeek API）
- [ ] 企业级私有化部署

## License

MIT