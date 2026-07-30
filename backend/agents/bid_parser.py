"""
招标解读 Agent (Bid Parser)

功能：
- 解析 PDF/Word 招标文件，输出结构化 JSON
- 提取关键要素：项目名、预算、工期、保证金、付款方式
- 识别综合评标法的评分维度、权重、得分规则
- 废标红线关键词匹配 + LLM 双重识别
- 合同履约风险扫描
- 输出"投标任务书"
"""

from typing import Dict, List, Any
import re


class BidParser:
    """
    招标文件智能解析 Agent
    
    输入：招标文件（PDF/Word 路径或文本内容）
    输出：结构化投标任务书
    """
    
    DISQUALIFY_PATTERNS = [
        re.compile(r'(废标|无效投标|否决投标)'),
        re.compile(r'(不得|禁止|不允许|取消.*资格)'),
        re.compile(r'(必须.*否则|否则.*无效)'),
        re.compile(r'(原件|正本|红章|鲜章)'),
        re.compile(r'(联合体.*不超过|不得.*联合体)'),
    ]
    
    RISK_PATTERNS = [
        (re.compile(r'(违约金|罚款|赔偿).*?(\d+%|\d+万元|\d+元)'), "high"),
        (re.compile(r'(不可抗力|免责)'), "medium"),
        (re.compile(r'(知识产权|专利|著作权).*?(归属|归.*所有)'), "medium"),
    ]
    
    def __init__(self):
        self.name = "BidParser"
    
    def parse(self, doc_content: str, bid_type: str = "政府采购") -> Dict[str, Any]:
        """Mock 解析（实际接入 LLM 时替换为真实调用）"""
        return {
            "agent": self.name,
            "status": "done",
            "result": {
                "basic_info": {
                    "project_name": "某市政务云平台建设项目",
                    "client_name": "某市大数据管理局",
                    "budget": 12800000,
                    "deadline": "2026-08-30",
                    "bid_type": bid_type,
                    "duration": "12个月",
                },
                "scoring_items": [
                    {"id": "S1", "dimension": "技术方案完整性", "weight": 35, "max_score": 35,
                     "criteria": "方案先进性、可行性、安全性"},
                    {"id": "S2", "dimension": "类似项目案例", "weight": 20, "max_score": 20,
                     "criteria": "近3年同类型项目经验"},
                    {"id": "S3", "dimension": "项目实施能力", "weight": 15, "max_score": 15,
                     "criteria": "项目管理、团队配置"},
                    {"id": "S4", "dimension": "报价合理性", "weight": 20, "max_score": 20,
                     "criteria": "满足预算下的最优报价"},
                    {"id": "S5", "dimension": "企业资质信用", "weight": 10, "max_score": 10,
                     "criteria": "ISO/CMMI等资质"},
                ],
                "disqualify_rules": [
                    {"id": "D001", "rule": "投标报价不得超过预算1280万元", "risk": "high",
                     "source_page": 12},
                    {"id": "D002", "rule": "须提供CMMI三级及以上证书", "risk": "high",
                     "source_page": 15},
                    {"id": "D003", "rule": "须响应等保三级安全要求", "risk": "critical",
                     "source_page": 18},
                    {"id": "D004", "rule": "不接受联合体投标", "risk": "medium",
                     "source_page": 5},
                    {"id": "D005", "rule": "投标文件须加盖公章并法人签字", "risk": "high",
                     "source_page": 3},
                ],
                "required_documents": [
                    "投标函", "法定代表人身份证明", "营业执照副本",
                    "CMMI三级证书", "ISO27001证书", "等保三级证明",
                    "近3年审计报告", "项目经理PMP证书", "类似项目合同复印件"
                ],
                "contract_risks": [
                    {"clause": "逾期违约金每日0.05%", "risk": "high",
                     "comment": "工期紧张，需预留缓冲"},
                    {"clause": "知识产权归甲方所有", "risk": "medium",
                     "comment": "涉及定制化代码归属"},
                    {"clause": "12个月免费运维期", "risk": "low",
                     "comment": "成本测算需计入"},
                ],
                "checklist": [
                    "确认CMMI三级证书在有效期内",
                    "确认等保三级资质覆盖范围满足要求",
                    "核对财务审计报告数据准确性",
                    "确认项目经理PMP证书原件可提供",
                ]
            }
        }
    
    def extract_scoring(self, text: str) -> List[Dict]:
        """从文本中提取打分项（规则匹配）"""
        items = []
        # 匹配 "评分项: 权重% 分值" 模式
        pattern = re.compile(
            r'(技术方案|项目案例|报价|资质|实施|服务|售后|培训|人员).*?'
            r'(\d+)%.*?(\d+)\s*分',
            re.DOTALL
        )
        for match in pattern.finditer(text):
            items.append({
                "dimension": match.group(1),
                "weight": int(match.group(2)),
                "max_score": int(match.group(3)),
            })
        return items
    
    def detect_disqualify(self, text: str) -> List[Dict]:
        """检测废标红线"""
        warnings = []
        for line in text.split('\n'):
            for pattern in self.DISQUALIFY_PATTERNS:
                if pattern.search(line):
                    warnings.append({
                        "rule": line.strip()[:100],
                        "pattern": pattern.pattern,
                    })
                    break
        return warnings