// Mock 数据 — AI 标书助手演示版

export const mockProject = {
  id: "PROJ-2026-001",
  name: "某市政务云平台建设项目",
  client: "某市大数据管理局",
  budget: 12800000,
  deadline: "2026-08-30",
  bidType: "政府采购",
  status: "writing" as const,
  progress: 68,
  createdAt: "2026-07-25",
};

export const mockScoringItems = [
  { id: "S1", dimension: "技术方案完整性", weight: 35, maxScore: 35 },
  { id: "S2", dimension: "类似项目案例", weight: 20, maxScore: 20 },
  { id: "S3", dimension: "项目实施能力", weight: 15, maxScore: 15 },
  { id: "S4", dimension: "报价合理性", weight: 20, maxScore: 20 },
  { id: "S5", dimension: "企业资质信用", weight: 10, maxScore: 10 },
];

export const mockDisqualifyRules = [
  { id: "D001", rule: "投标报价不得超过预算1280万元", risk: "high", sourcePage: 12 },
  { id: "D002", rule: "须提供CMMI三级及以上证书", risk: "high", sourcePage: 15 },
  { id: "D003", rule: "须响应等保三级安全要求", risk: "critical", sourcePage: 18 },
  { id: "D004", rule: "不接受联合体投标", risk: "medium", sourcePage: 5 },
  { id: "D005", rule: "投标文件须加盖公章并法人签字", risk: "high", sourcePage: 3 },
];

export const mockContractRisks = [
  { clause: "逾期违约金每日0.05%", risk: "high", comment: "工期紧张，需预留缓冲" },
  { clause: "知识产权归甲方所有", risk: "medium", comment: "涉及定制化代码归属" },
  { clause: "12个月免费运维期", risk: "low", comment: "成本测算需计入" },
];

export const mockRequiredDocs = [
  "投标函", "法定代表人身份证明", "营业执照副本",
  "CMMI三级证书", "ISO27001证书", "等保三级证明",
  "近3年审计报告", "项目经理PMP证书", "类似项目合同复印件"
];

export const mockChapterOutline = [
  { id: 1, title: "投标函及投标函附录", pages: 5, wordCount: 2000, status: "done" },
  { id: 2, title: "法定代表人身份证明", pages: 3, wordCount: 800, status: "done" },
  { id: 3, title: "公司简介与资质证明", pages: 20, wordCount: 8000, status: "done" },
  { id: 4, title: "技术方案", pages: 120, wordCount: 48000, status: "running" },
  { id: 5, title: "实施方案与进度计划", pages: 60, wordCount: 24000, status: "running" },
  { id: 6, title: "类似项目案例", pages: 40, wordCount: 16000, status: "running" },
  { id: 7, title: "商务应答与报价", pages: 30, wordCount: 12000, status: "pending" },
  { id: 8, title: "合同条款应答", pages: 25, wordCount: 10000, status: "pending" },
];

export const mockWriters = [
  { name: "CompanyProfileWriter", section: "公司简介与资质", progress: 100, status: "done", wordCount: 8200 },
  { name: "TechSolutionWriter", section: "技术方案", progress: 85, status: "running", wordCount: 41200 },
  { name: "ImplementationWriter", section: "实施方案", progress: 72, status: "running", wordCount: 17400 },
  { name: "ProjectCaseWriter", section: "项目案例", progress: 60, status: "running", wordCount: 9600 },
  { name: "BidStrategyWriter", section: "商务应答", progress: 100, status: "done", wordCount: 11800 },
  { name: "ContractClauseWriter", section: "合同条款", progress: 45, status: "running", wordCount: 4400 },
];

export const mockRAGResults = [
  { id: "RAG-001", title: "XX市政务云-技术方案", score: 0.95, type: "历史方案" },
  { id: "RAG-002", title: "企业营业执照 + CMMI三级证书", score: 0.92, type: "资质证书" },
  { id: "RAG-003", title: "2024年度审计报告", score: 0.88, type: "财务报表" },
  { id: "RAG-004", title: "XX省大数据平台-中标通知书", score: 0.85, type: "项目案例" },
  { id: "RAG-005", title: "项目经理张三 - PMP证书", score: 0.82, type: "人员资质" },
];

export const mockRAGStats = {
  totalDocs: 1247,
  solutions: 86,
  certificates: 42,
  personnel: 156,
  cases: 63,
  financial: 12,
};

export const mockReviews = {
  technicalReview: {
    score: 31, max: 35,
    items: [
      { item: "技术方案完整性", score: 31, max: 35, comment: "架构设计清晰，安全方案需补充等保三级细节" },
    ]
  },
  commercialReview: {
    score: 46.5, max: 50,
    items: [
      { item: "类似项目案例", score: 18, max: 20, comment: "3个案例关联度高，建议补充甲方联系方式" },
      { item: "企业资质信用", score: 10, max: 10, comment: "资质齐全" },
      { item: "报价合理性", score: 18.5, max: 20, comment: "报价在合理区间" },
    ]
  },
  metaReview: {
    score: 5, max: 5,
    issues: [
      { severity: "low", item: "图表编号", desc: "图3-2编号格式需统一为'图 3-2'" },
    ],
    verdict: "PASS"
  },
  totalScore: 82.5,
  maxScore: 100,
};

export const mockRiskSummary = [
  { level: "critical", count: 0, label: "致命" },
  { level: "high", count: 0, label: "高风险" },
  { level: "medium", count: 1, label: "中风险" },
  { level: "low", count: 1, label: "低风险" },
];

export const mockDeliveryFiles = [
  { name: "投标文件-技术标.docx", pages: 303, size: "12.8 MB" },
  { name: "投标文件-商务标.docx", pages: 55, size: "3.2 MB" },
  { name: "审查报告.html", pages: 1, size: "256 KB" },
  { name: "投标任务书.pdf", pages: 8, size: "512 KB" },
];

export const mockDeliveryChecklist = [
  { item: "法人签字确认", status: "pending" as const },
  { item: "公章加盖", status: "pending" as const },
  { item: "CMMI证书原件确认", status: "done" as const },
  { item: "投标保证金缴纳", status: "done" as const },
  { item: "封标时间确认", status: "pending" as const },
];

export const mockBidHistory = [
  { id: 1, project: "XX省大数据平台", client: "XX省数据局", budget: 860, result: "中标", score: 94.2, date: "2026-03" },
  { id: 2, project: "XX市智慧城管", client: "XX市城管局", budget: 520, result: "中标", score: 91.8, date: "2025-11" },
  { id: 3, project: "XX部委信息化升级", client: "XX部委", budget: 1560, result: "未中标", score: 85.6, date: "2025-08" },
  { id: 4, project: "XX区政务服务中心", client: "XX区行政审批局", budget: 380, result: "中标", score: 93.1, date: "2025-05" },
];