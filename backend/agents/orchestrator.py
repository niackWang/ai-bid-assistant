"""
Multi-Agent 协同编排器 (Orchestrator)

职责：
- 接收招标文件，制定投标任务总计划
- 调度各子 Agent（BidParser → SkeletonPlanner → Writers → Reviewers）
- 维护全局项目摘要表（Shared State）
- 处理 Agent 失败回退与人工兜底
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Any
from enum import Enum
import uuid


class AgentStatus(Enum):
    IDLE = "idle"
    RUNNING = "running"
    DONE = "done"
    FAILED = "failed"
    WAITING_REVIEW = "waiting_review"


class BidStage(Enum):
    UPLOAD = "upload"          # 上传招标文件
    PARSING = "parsing"         # 招标解读中
    PLANNING = "planning"       # 标书骨架规划
    WRITING = "writing"         # 章节并行撰写
    REVIEWING = "reviewing"     # 智能审查
    DELIVERING = "delivering"   # 交付
    ARCHIVED = "archived"       # 已归档


@dataclass
class ProjectState:
    """全局共享项目摘要表 — 跨 Agent 一致性管控的核心"""
    project_id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    project_name: str = ""
    client_name: str = ""
    budget: float = 0.0
    bid_deadline: str = ""
    duration_months: int = 0
    bid_type: str = "政府采购"  # 政府采购 / 央企 / 金融 / 医疗 / 政务
    
    # 解析结果
    scoring_items: List[Dict] = field(default_factory=list)  # 打分项
    disqualify_rules: List[Dict] = field(default_factory=list)  # 废标红线
    required_docs: List[str] = field(default_factory=list)  # 必传文件
    
    # 标书结构
    chapter_outline: List[Dict] = field(default_factory=list)  # 章节大纲
    
    # 撰写进度
    chapter_status: Dict[str, AgentStatus] = field(default_factory=dict)
    
    # 审查结果
    review_scores: Dict[str, float] = field(default_factory=dict)
    risk_items: List[Dict] = field(default_factory=list)


@dataclass
class AgentTask:
    """单个 Agent 任务"""
    task_id: str
    agent_name: str
    action: str
    input_data: Dict[str, Any]
    status: AgentStatus = AgentStatus.IDLE
    result: Optional[Any] = None
    error: Optional[str] = None


class Orchestrator:
    """
    总编排器
    
    工作流：
    1. 接收招标文件 → 初始化 ProjectState
    2. 调度 BidParser → 解析招标文件
    3. 调度 SkeletonPlanner → 生成标书骨架
    4. 并行调度 Writer × 6 → 撰写各章节
    5. 调度 BidReviewer × 3 → 审查
    6. 调度 MetaReviewer → 二次检查
    7. 输出标书初稿 + 风险清单
    """
    
    def __init__(self):
        self.state = ProjectState()
        self.stage = BidStage.UPLOAD
        self.tasks: List[AgentTask] = []
        self.history: List[Dict] = []
    
    def start(self, project_name: str, client_name: str, bid_type: str = "政府采购"):
        """启动新的标书项目"""
        self.state.project_name = project_name
        self.state.client_name = client_name
        self.state.bid_type = bid_type
        self.stage = BidStage.PARSING
        self._log(f"项目启动: {project_name} - {client_name}")
        return {"project_id": self.state.project_id, "status": "started"}
    
    def plan_tasks(self) -> List[Dict]:
        """根据当前状态生成待执行任务列表"""
        tasks = []
        
        if self.stage == BidStage.PARSING:
            tasks.append(self._create_task("BidParser", "parse_tender_doc", {
                "project_id": self.state.project_id,
                "bid_type": self.state.bid_type
            }))
        
        elif self.stage == BidStage.PLANNING:
            tasks.append(self._create_task("SkeletonPlanner", "generate_outline", {
                "project_id": self.state.project_id,
                "scoring_items": self.state.scoring_items,
                "bid_type": self.state.bid_type
            }))
        
        elif self.stage == BidStage.WRITING:
            chapters = [
                {"name": "CompanyProfileWriter", "section": "公司简介与资质"},
                {"name": "TechSolutionWriter", "section": "技术方案与架构"},
                {"name": "ImplementationWriter", "section": "实施方案与进度"},
                {"name": "ProjectCaseWriter", "section": "类似项目案例"},
                {"name": "BidStrategyWriter", "section": "商务策略与应答"},
                {"name": "ContractClauseWriter", "section": "合同条款应答"},
            ]
            for ch in chapters:
                tasks.append(self._create_task(ch["name"], "write_section", {
                    "project_id": self.state.project_id,
                    "section": ch["section"],
                    "state_snapshot": self._get_state_snapshot()
                }))
        
        elif self.stage == BidStage.REVIEWING:
            reviewers = [
                "TechnicalReviewer", "CommercialReviewer", "MetaReviewer"
            ]
            for r in reviewers:
                tasks.append(self._create_task(r, "review_bid", {
                    "project_id": self.state.project_id,
                    "scoring_items": self.state.scoring_items,
                    "disqualify_rules": self.state.disqualify_rules
                }))
        
        self.tasks.extend(tasks)
        return [t.__dict__ for t in tasks]
    
    def mock_execute(self) -> Dict:
        """Mock 执行全流程（演示用）"""
        results = {
            "project_id": self.state.project_id,
            "stages": [
                {
                    "stage": "BidParser",
                    "status": "done",
                    "output": {
                        "project_name": "某市政务云平台建设项目",
                        "client_name": "某市大数据管理局",
                        "budget": 12800000,
                        "deadline": "2026-08-30",
                        "scoring_items": [
                            {"dimension": "技术方案", "weight": 35, "max_score": 35},
                            {"dimension": "项目案例", "weight": 20, "max_score": 20},
                            {"dimension": "实施能力", "weight": 15, "max_score": 15},
                            {"dimension": "商务报价", "weight": 20, "max_score": 20},
                            {"dimension": "资质信用", "weight": 10, "max_score": 10},
                        ],
                        "disqualify_rules": [
                            {"id": "D001", "rule": "报价超过预算", "risk": "high"},
                            {"id": "D002", "rule": "未提供CMMI三级证书", "risk": "high"},
                            {"id": "D003", "rule": "未响应安全等保要求", "risk": "critical"},
                            {"id": "D004", "rule": "联合体投标限制", "risk": "medium"},
                        ]
                    }
                },
                {
                    "stage": "SkeletonPlanner",
                    "status": "done",
                    "output": {
                        "outline": [
                            {"id": 1, "title": "投标函及投标函附录", "pages": 5, "word_count": 2000},
                            {"id": 2, "title": "法定代表人身份证明", "pages": 3, "word_count": 800},
                            {"id": 3, "title": "公司简介与资质证明", "pages": 20, "word_count": 8000},
                            {"id": 4, "title": "技术方案", "pages": 120, "word_count": 48000},
                            {"id": 5, "title": "实施方案与进度计划", "pages": 60, "word_count": 24000},
                            {"id": 6, "title": "类似项目案例", "pages": 40, "word_count": 16000},
                            {"id": 7, "title": "商务应答与报价", "pages": 30, "word_count": 12000},
                            {"id": 8, "title": "合同条款应答", "pages": 25, "word_count": 10000},
                        ],
                        "total_pages": 303,
                        "total_words": 120800
                    }
                },
                {
                    "stage": "WriterAgents",
                    "status": "running",
                    "agents": [
                        {"name": "CompanyProfileWriter", "section": "公司简介与资质", "progress": 100, "status": "done"},
                        {"name": "TechSolutionWriter", "section": "技术方案", "progress": 85, "status": "running"},
                        {"name": "ImplementationWriter", "section": "实施方案", "progress": 72, "status": "running"},
                        {"name": "ProjectCaseWriter", "section": "项目案例", "progress": 60, "status": "running"},
                        {"name": "BidStrategyWriter", "section": "商务应答", "progress": 100, "status": "done"},
                        {"name": "ContractClauseWriter", "section": "合同条款", "progress": 45, "status": "running"},
                    ]
                },
                {
                    "stage": "Reviewer",
                    "status": "running",
                    "output": {
                        "reviews": [
                            {"reviewer": "TechnicalReviewer", "score": 31.5, "max": 35, "issues": []},
                            {"reviewer": "CommercialReviewer", "score": 18.0, "max": 20, "issues": [
                                {"severity": "medium", "desc": "案例合同金额建议补充甲方联系方式"}
                            ]},
                            {"reviewer": "MetaReviewer", "score": "PASS", "issues": [
                                {"severity": "low", "desc": "图3-2编号格式需统一为'图 3-2'"}
                            ]},
                        ],
                        "total_score": 82.5,
                        "max_score": 100,
                        "risk_summary": {
                            "critical": 0,
                            "high": 0,
                            "medium": 1,
                            "low": 1
                        }
                    }
                }
            ]
        }
        return results
    
    def _create_task(self, agent_name: str, action: str, input_data: Dict) -> AgentTask:
        return AgentTask(
            task_id=f"{agent_name}_{self.state.project_id}_{len(self.tasks)}",
            agent_name=agent_name,
            action=action,
            input_data=input_data
        )
    
    def _get_state_snapshot(self) -> Dict:
        """获取当前项目状态快照（供并行 Agent 引用）"""
        return {
            "project_name": self.state.project_name,
            "client_name": self.state.client_name,
            "budget": self.state.budget,
            "bid_deadline": self.state.bid_deadline,
            "duration_months": self.state.duration_months,
            "scoring_items": self.state.scoring_items,
            "disqualify_rules": self.state.disqualify_rules,
        }
    
    def _log(self, message: str):
        self.history.append({"stage": self.stage.value, "message": message, "timestamp": "now"})


# 全局编排器实例
orchestrator = Orchestrator()