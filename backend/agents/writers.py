"""
并行章节撰写 Agent 工厂

6 个 Writer Agent（可并行执行）：
- CompanyProfileWriter: 公司简介、资质证书、人员
- TechSolutionWriter: 技术方案、架构设计（长文本 + 图表）
- ImplementationWriter: 实施方案、进度计划（强逻辑 + 甘特图）
- ProjectCaseWriter: 类似项目案例（强依赖 RAG）
- BidStrategyWriter: 商务策略、报价说明（规则性引用）
- ContractClauseWriter: 合同条款应答（风险敏感，人工复核）
"""

from typing import Dict, List, Any, Callable
import time
import random


class BaseWriter:
    """Writer Agent 基类"""
    
    def __init__(self, name: str, section: str):
        self.name = name
        self.section = section
    
    def write(self, state_snapshot: Dict[str, Any]) -> Dict[str, Any]:
        """Mock 撰写（实际接入 LLM + RAG）"""
        return {
            "agent": self.name,
            "section": self.section,
            "status": "done",
            "content_preview": f"[{self.section}] 已基于项目 '{state_snapshot.get('project_name', '')}' 生成章节初稿",
            "word_count": 0,
            "rag_citations": [],
        }
    
    def mock_progress(self) -> Dict:
        """Mock 实时进度"""
        return {
            "agent": self.name,
            "section": self.section,
            "progress": random.randint(30, 95),
            "status": "running",
            "current_task": "正在撰写...",
        }


class CompanyProfileWriter(BaseWriter):
    """公司简介与资质章节"""
    def __init__(self):
        super().__init__("CompanyProfileWriter", "公司简介与资质证明")
    
    def write(self, state_snapshot: Dict) -> Dict:
        result = super().write(state_snapshot)
        result.update({
            "word_count": 8200,
            "rag_citations": [
                "企业营业执照 (RAG-001)",
                "CMMI三级证书 (RAG-002)",
                "ISO27001信息安全管理 (RAG-003)",
                "2023-2025审计报告 (RAG-004)",
            ],
            "sections": ["企业概况", "资质证书", "荣誉奖项", "组织架构与核心团队"]
        })
        return result


class TechSolutionWriter(BaseWriter):
    """技术方案章节"""
    def __init__(self):
        super().__init__("TechSolutionWriter", "技术方案")
    
    def write(self, state_snapshot: Dict) -> Dict:
        result = super().write(state_snapshot)
        result.update({
            "word_count": 48500,
            "charts_generated": ["总体架构图", "网络拓扑图", "部署架构图", "安全架构图"],
            "sections": ["需求分析", "架构设计", "技术路线", "安全方案", "运维方案"],
        })
        return result


class ImplementationWriter(BaseWriter):
    """实施方案章节"""
    def __init__(self):
        super().__init__("ImplementationWriter", "实施方案与进度计划")
    
    def write(self, state_snapshot: Dict) -> Dict:
        result = super().write(state_snapshot)
        result.update({
            "word_count": 24200,
            "gantt_chart": True,
            "sections": ["项目管理方法", "实施步骤", "里程碑计划", "风险预案"],
        })
        return result


class ProjectCaseWriter(BaseWriter):
    """项目案例章节"""
    def __init__(self):
        super().__init__("ProjectCaseWriter", "类似项目案例")
    
    def write(self, state_snapshot: Dict) -> Dict:
        result = super().write(state_snapshot)
        result.update({
            "word_count": 15800,
            "rag_citations": [
                "XX市政务云项目案例 (CASE-001)",
                "XX省大数据平台案例 (CASE-002)",
                "XX部委信息化项目 (CASE-003)",
            ],
            "sections": ["案例一: XX市政务云平台", "案例二: XX省数据平台", "案例三: XX部委信息化项目"],
        })
        return result


class BidStrategyWriter(BaseWriter):
    """商务策略章节"""
    def __init__(self):
        super().__init__("BidStrategyWriter", "商务应答与报价")
    
    def write(self, state_snapshot: Dict) -> Dict:
        result = super().write(state_snapshot)
        result.update({
            "word_count": 11800,
            "sections": ["商务条款逐条应答", "分项报价表", "综合报价"],
        })
        return result


class ContractClauseWriter(BaseWriter):
    """合同条款应答（敏感：必须人工复核）"""
    def __init__(self):
        super().__init__("ContractClauseWriter", "合同条款应答")
    
    def write(self, state_snapshot: Dict) -> Dict:
        result = super().write(state_snapshot)
        result.update({
            "word_count": 9800,
            "requires_human_review": True,
            "flag": "⚠️ 合同条款涉及法律风险，必须人工复核",
        })
        return result


class WriterAgentFactory:
    """Writer Agent 工厂"""
    
    _agents = {
        "CompanyProfileWriter": CompanyProfileWriter,
        "TechSolutionWriter": TechSolutionWriter,
        "ImplementationWriter": ImplementationWriter,
        "ProjectCaseWriter": ProjectCaseWriter,
        "BidStrategyWriter": BidStrategyWriter,
        "ContractClauseWriter": ContractClauseWriter,
    }
    
    @classmethod
    def create(cls, agent_name: str) -> BaseWriter:
        agent_cls = cls._agents.get(agent_name)
        if agent_cls:
            return agent_cls()
        raise ValueError(f"Unknown writer agent: {agent_name}")
    
    @classmethod
    def list_all(cls) -> List[str]:
        return list(cls._agents.keys())
    
    @classmethod
    def create_all(cls) -> Dict[str, BaseWriter]:
        return {name: cls.create(name) for name in cls._agents}