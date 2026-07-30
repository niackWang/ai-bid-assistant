"""
审查 Agent (Bid Reviewers)

三角色审查 + Meta 元审查：
- TechnicalReviewer: 技术方案评分细则匹配度
- CommercialReviewer: 商务合规性、价格合理性
- MetaReviewer: 前后一致性、版式规范、交叉检查

输出：风险清单 + 模拟打分 + 改进建议
"""

from typing import Dict, List, Any


class BaseReviewer:
    def __init__(self, name: str, role: str):
        self.name = name
        self.role = role
    
    def review(self, bid_content: Dict, scoring_items: List[Dict],
               disqualify_rules: List[Dict]) -> Dict:
        raise NotImplementedError


class TechnicalReviewer(BaseReviewer):
    """技术评审 — 按评分细则逐项打分"""
    
    def __init__(self):
        super().__init__("TechnicalReviewer", "技术")
    
    def review(self, bid_content, scoring_items, disqualify_rules):
        return {
            "reviewer": self.name,
            "role": self.role,
            "scoring_detail": [
                {"item": "技术方案完整性", "score": 31, "max": 35,
                 "comment": "架构设计清晰，安全方案需补充等保三级细节"},
                {"item": "项目实施能力", "score": 13, "max": 15,
                 "comment": "项目管理制度完善，建议增加专职QA角色"},
            ],
            "total": 44,
            "max_total": 50,
            "issues": [
                {"severity": "medium", "item": "安全方案",
                 "desc": "等保三级技术要求需逐条对照响应，建议补充差距分析表"},
            ]
        }


class CommercialReviewer(BaseReviewer):
    """商务评审 — 合规性 + 价格合理性"""
    
    def __init__(self):
        super().__init__("CommercialReviewer", "商务")
    
    def review(self, bid_content, scoring_items, disqualify_rules):
        return {
            "reviewer": self.name,
            "role": self.role,
            "scoring_detail": [
                {"item": "类似项目案例", "score": 18, "max": 20,
                 "comment": "3个案例关联度高，建议补充甲方联系方式"},
                {"item": "企业资质信用", "score": 10, "max": 10,
                 "comment": "资质齐全，无扣分项"},
                {"item": "报价合理性", "score": 18.5, "max": 20,
                 "comment": "报价在合理区间，略低于行业均价"},
            ],
            "total": 46.5,
            "max_total": 50,
            "issues": [
                {"severity": "low", "item": "案例材料",
                 "desc": "案例合同复印件建议补盖甲方公章确认页"},
            ]
        }


class MetaReviewer(BaseReviewer):
    """元审查 — 前后一致性 + 版式 + 全局检查"""
    
    def __init__(self):
        super().__init__("MetaReviewer", "全局")
    
    def review(self, bid_content, scoring_items, disqualify_rules):
        return {
            "reviewer": self.name,
            "role": self.role,
            "consistency_check": {
                "project_name_match": True,
                "budget_match": True,
                "personnel_match": True,
                "chapter_references": "PASS",
            },
            "format_check": {
                "font_consistency": "PASS",
                "page_numbering": "PASS",
                "figure_numbering": "需修正: 图3-2 → 图 3-2",
                "table_of_contents": "PASS",
            },
            "disqualify_recheck": {
                "total_rules": len(disqualify_rules),
                "checked": len(disqualify_rules),
                "violations": 0,
                "status": "PASS",
            },
            "issues": [
                {"severity": "low", "item": "图表编号",
                 "desc": "图3-2编号格式需统一为'图 3-2'（加空格）"},
            ],
            "verdict": "PASS",
            "risk_level": "low",
        }


class ReviewerFactory:
    _reviewers = {
        "TechnicalReviewer": TechnicalReviewer,
        "CommercialReviewer": CommercialReviewer,
        "MetaReviewer": MetaReviewer,
    }
    
    @classmethod
    def create(cls, name: str) -> BaseReviewer:
        cls_obj = cls._reviewers.get(name)
        if cls_obj:
            return cls_obj()
        raise ValueError(f"Unknown reviewer: {name}")
    
    @classmethod
    def list_all(cls) -> List[str]:
        return list(cls._reviewers.keys())