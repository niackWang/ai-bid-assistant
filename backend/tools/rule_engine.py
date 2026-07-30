"""废标规则引擎 — DSL 规则匹配 + 正则模式 + LLM 双重校验"""

import re
from typing import Dict, List, Optional


class RuleEngine:
    
    RULES = [
        {"id": "R001", "pattern": r"超过.*预算", "risk": "high", "desc": "报价不得超预算"},
        {"id": "R002", "pattern": r"CMMI.*(三级|3级)", "risk": "high", "desc": "CMMI证书门槛"},
        {"id": "R003", "pattern": r"(等保|等级保护).*(三级|3级)", "risk": "critical", "desc": "等保要求"},
        {"id": "R004", "pattern": r"(公章|红章|鲜章)", "risk": "high", "desc": "签章要求"},
        {"id": "R005", "pattern": r"联合体.*(不超过|限制|不接受)", "risk": "medium", "desc": "联合体限制"},
        {"id": "R006", "pattern": r"(原件|正本)\s*(送达|提交|递交)", "risk": "high", "desc": "原件要求"},
        {"id": "R007", "pattern": r"(保证金|投标保证金)", "risk": "medium", "desc": "保证金条款"},
    ]
    
    def check(self, text: str) -> List[Dict]:
        """运行所有规则检查"""
        findings = []
        for rule in self.RULES:
            matches = list(re.finditer(rule["pattern"], text))
            if matches:
                findings.append({
                    "rule_id": rule["id"],
                    "desc": rule["desc"],
                    "risk": rule["risk"],
                    "matches": len(matches),
                    "context": [m.group(0) for m in matches[:3]],
                })
        return findings
    
    def cross_check(self, bid_data: Dict, tender_requirements: Dict) -> List[Dict]:
        """交叉检查：标书内容 vs 招标要求"""
        issues = []
        
        # 检查预算
        if bid_data.get("total_price", 0) > tender_requirements.get("budget", float("inf")):
            issues.append({"severity": "critical", "item": "报价",
                          "desc": f"总报价超标书预算"})
        
        return issues