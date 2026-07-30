"""向量存储 — Mock 实现（生产使用 Milvus/Qdrant/Chroma）"""

from typing import List, Dict, Any, Optional


class VectorStore:
    """向量数据库抽象"""
    
    def __init__(self, collection_name: str = "bid_knowledge"):
        self.collection_name = collection_name
        self._docs: List[Dict] = []
    
    def add(self, docs: List[Dict], embeddings: Optional[List] = None):
        self._docs.extend(docs)
        return len(docs)
    
    def search(self, query: str, top_k: int = 5) -> List[Dict]:
        """Mock 向量检索"""
        return [
            {"doc_id": "RAG-001", "title": "XX市政务云-技术方案",
             "score": 0.95, "type": "历史方案"},
            {"doc_id": "RAG-002", "title": "企业营业执照 + CMMI三级证书",
             "score": 0.92, "type": "资质证书"},
            {"doc_id": "RAG-003", "title": "2024年度审计报告",
             "score": 0.88, "type": "财务报表"},
            {"doc_id": "RAG-004", "title": "XX省大数据平台-中标通知书",
             "score": 0.85, "type": "项目案例"},
            {"doc_id": "RAG-005", "title": "项目经理张三 - PMP证书",
             "score": 0.82, "type": "人员资质"},
        ][:top_k]
    
    def count(self) -> int:
        return len(self._docs)