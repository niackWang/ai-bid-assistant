"""
全局状态管理器 (State Manager)

维护跨 Agent 共享的项目摘要表，确保：
1. 所有 Writer Agent 引用同一份项目上下文
2. 关键字段变更可追溯
3. 防止并行撰写时的数据竞争
"""

from dataclasses import dataclass, field
from typing import Dict, List, Any, Optional
import uuid
from datetime import datetime


@dataclass
class BidProject:
    project_id: str = field(default_factory=lambda: str(uuid.uuid4())[:8])
    project_name: str = ""
    client_name: str = ""
    bid_type: str = "政府采购"
    budget: float = 0.0
    deadline: str = ""
    created_at: str = field(default_factory=lambda: datetime.now().isoformat())
    
    # 解析结果
    scoring_items: List[Dict] = field(default_factory=list)
    disqualify_rules: List[Dict] = field(default_factory=list)
    required_docs: List[str] = field(default_factory=list)
    
    # 标书结构
    chapter_outline: List[Dict] = field(default_factory=list)
    
    # 章节状态
    chapter_status: Dict[str, str] = field(default_factory=dict)
    
    # 审查结果
    review_score: float = 0.0
    risk_items: List[Dict] = field(default_factory=list)
    
    # 核心团队
    core_team: List[Dict] = field(default_factory=list)
    
    # 技术栈（用于技术方案引用）
    tech_stack: List[str] = field(default_factory=list)


class StateManager:
    """全局状态管理器（单例）"""
    
    _instance = None
    _projects: Dict[str, BidProject] = {}
    _current_project: Optional[BidProject] = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def create_project(self, **kwargs) -> BidProject:
        project = BidProject(**kwargs)
        self._projects[project.project_id] = project
        self._current_project = project
        return project
    
    def get_project(self, project_id: str) -> Optional[BidProject]:
        return self._projects.get(project_id)
    
    def get_current(self) -> Optional[BidProject]:
        return self._current_project
    
    def get_state_snapshot(self) -> Dict[str, Any]:
        """返回当前项目状态快照（供并行 Agent 引用）"""
        if not self._current_project:
            return {}
        p = self._current_project
        return {
            "project_name": p.project_name,
            "client_name": p.client_name,
            "budget": p.budget,
            "deadline": p.deadline,
            "bid_type": p.bid_type,
            "scoring_items": p.scoring_items,
            "disqualify_rules": p.disqualify_rules,
            "core_team": p.core_team,
            "tech_stack": p.tech_stack,
        }
    
    def update_chapter_status(self, chapter_name: str, status: str):
        if self._current_project:
            self._current_project.chapter_status[chapter_name] = status
    
    def list_projects(self) -> List[Dict]:
        return [
            {"project_id": p.project_id, "project_name": p.project_name,
             "client_name": p.client_name, "created_at": p.created_at}
            for p in self._projects.values()
        ]