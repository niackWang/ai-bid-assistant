"""
RAG 检索器 — 为 Writer Agent 提供精准素材引用
"""

from typing import Dict, List, Optional
from .vector_store import VectorStore


class Retriever:
    """企业知识库检索器"""
    
    def __init__(self, vector_store: Optional[VectorStore] = None):
        self.store = vector_store or VectorStore()
    
    def search_solutions(self, query: str, top_k: int = 3) -> List[Dict]:
        """检索历史中标方案"""
        return self.store.search(query, top_k)
    
    def search_certificates(self, query: str) -> List[Dict]:
        """检索资质证书"""
        return self.store.search(query, 3)
    
    def search_cases(self, industry: str, top_k: int = 3) -> List[Dict]:
        """检索类似项目案例"""
        return self.store.search(industry, top_k)
    
    def search_personnel(self, role: str) -> List[Dict]:
        """检索人员资质"""
        return self.store.search(role, 2)
    
    def search_financial(self) -> List[Dict]:
        """检索财务报表"""
        return self.store.search("审计报告 财务报表", 3)