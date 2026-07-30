"""
API 路由定义

暴露 6 大模块对应的 RESTful 接口：
- /api/v1/bid/parse      招标解读
- /api/v1/bid/outline    标书骨架规划
- /api/v1/bid/write      章节撰写
- /api/v1/bid/review     智能审查
- /api/v1/bid/deliver    交付
- /api/v1/rag/*          RAG 检索
- /api/v1/agents/status   Agent 状态
"""

from fastapi import APIRouter, UploadFile, HTTPException
from pydantic import BaseModel
from typing import List, Dict, Optional, Any
import time

from ..agents.orchestrator import orchestrator
from ..agents.state_manager import StateManager
from ..agents.writers import WriterAgentFactory
from ..agents.reviewers import ReviewerFactory
from ..rag.retriever import Retriever

router = APIRouter(prefix="/api/v1")
state = StateManager()
retriever = Retriever()


# --- Request Models ---

class ParseRequest(BaseModel):
    file_content: Optional[str] = None
    bid_type: str = "政府采购"

class WriteRequest(BaseModel):
    project_id: str
    agent_name: str

class ReviewRequest(BaseModel):
    project_id: str

class ProjectRequest(BaseModel):
    project_name: str
    client_name: str
    bid_type: str = "政府采购"
    budget: float = 0.0
    deadline: str = ""

class SearchRequest(BaseModel):
    query: str
    top_k: int = 5


# --- Bid Pipeline ---

@router.post("/bid/project")
def create_project(req: ProjectRequest):
    """创建标书项目"""
    project = state.create_project(
        project_name=req.project_name,
        client_name=req.client_name,
        bid_type=req.bid_type,
        budget=req.budget,
        deadline=req.deadline,
    )
    return {"project_id": project.project_id, "status": "created"}


@router.get("/bid/projects")
def list_projects():
    """列出所有项目"""
    return {"projects": state.list_projects()}


@router.post("/bid/parse")
def parse_tender(req: ParseRequest):
    """模拟招标文件解读"""
    result = orchestrator.mock_execute()
    parser_result = result["stages"][0]
    
    # 更新状态
    project = state.get_current()
    if project:
        output = parser_result["output"]
        project.scoring_items = output.get("scoring_items", [])
        project.disqualify_rules = output.get("disqualify_rules", [])
        project.required_docs = output.get("required_docs", [])
    
    return parser_result


@router.get("/bid/outline")
def get_outline():
    """获取标书骨架"""
    result = orchestrator.mock_execute()
    return result["stages"][1]


@router.post("/bid/write")
def write_section(req: WriteRequest):
    """撰写单个章节"""
    agent = WriterAgentFactory.create(req.agent_name)
    snapshot = state.get_state_snapshot()
    result = agent.write(snapshot)
    time.sleep(0.3)  # 模拟撰写耗时
    state.update_chapter_status(req.agent_name, "done")
    return result


@router.get("/bid/write/progress")
def get_write_progress():
    """获取所有 Writer Agent 的进度"""
    agents = WriterAgentFactory.create_all()
    return {
        "agents": [
            {
                "name": name,
                "section": agent.section,
                "progress": (30 + (i * 15) + i * 3) % 101,
                "status": "done" if i < 3 else "running",
            }
            for i, (name, agent) in enumerate(agents.items())
        ]
    }


@router.get("/bid/review")
def review_bid():
    """执行智能审查"""
    result = orchestrator.mock_execute()
    return result["stages"][3]


@router.get("/bid/deliver")
def deliver_bid():
    """模拟交付"""
    return {
        "status": "ready",
        "files": [
            {"name": "投标文件-技术标.docx", "pages": 303, "size": "12.8 MB"},
            {"name": "投标文件-商务标.docx", "pages": 55, "size": "3.2 MB"},
            {"name": "审查报告.html", "pages": 1, "size": "256 KB"},
        ],
        "risk_checklist": [
            {"item": "法人签字确认", "status": "待确认"},
            {"item": "公章加盖", "status": "待确认"},
            {"item": "CMMI证书原件", "status": "已准备"},
        ]
    }


# --- RAG ---

@router.post("/rag/search")
def search_knowledge(req: SearchRequest):
    """检索企业知识库"""
    results = retriever.store.search(req.query, req.top_k)
    return {"query": req.query, "results": results}


# --- Agent Status ---

@router.get("/agents/status")
def get_agent_status():
    """获取所有 Agent 状态"""
    writers = WriterAgentFactory.list_all()
    reviewers = ReviewerFactory.list_all()
    
    return {
        "orchestrator": {"status": "idle", "current_stage": orchestrator.stage.value},
        "writers": [{"name": w, "status": "idle"} for w in writers],
        "reviewers": [{"name": r, "status": "idle"} for r in reviewers],
        "tools": ["DocParser", "RuleEngine", "VectorStore", "Retriever"],
    }


@router.get("/health")
def health_check():
    return {"status": "healthy", "service": "AI Bid Assistant", "version": "1.0.0"}