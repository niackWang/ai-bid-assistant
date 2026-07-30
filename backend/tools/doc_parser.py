"""
文档解析工具

负责解析 PDF/Word 招标文件，提取结构化内容。
生产环境接入 PyMuPDF + Unstructured + 阿里云 OCR。
"""

from typing import Dict, List, Optional


class DocParser:
    
    def parse(self, file_path: str) -> Dict:
        """Mock 文档解析"""
        return {
            "file": file_path,
            "pages": 156,
            "format": "PDF",
            "sections": [
                {"title": "招标公告", "page_start": 1, "page_end": 5},
                {"title": "投标人须知", "page_start": 6, "page_end": 25},
                {"title": "评标办法", "page_start": 26, "page_end": 35},
                {"title": "项目需求", "page_start": 36, "page_end": 80},
                {"title": "合同条款", "page_start": 81, "page_end": 120},
                {"title": "投标文件格式", "page_start": 121, "page_end": 156},
            ],
            "tables_found": 42,
            "status": "ok",
        }
    
    def extract_tables(self, file_path: str) -> List[Dict]:
        """提取所有表格"""
        return [{"page": 12, "content": "预算明细表", "rows": 15, "cols": 6}]
    
    def extract_text(self, file_path: str) -> str:
        """提取纯文本"""
        return "[Mock 招标文件文本内容]"


class DocGenerator:
    """标书文档生成器 — 输出 Word/PDF"""
    
    @staticmethod
    def generate(bid_data: Dict, format: str = "docx") -> str:
        """Mock 生成标书文档"""
        return f"/outputs/bid_{bid_data.get('project_name', 'unknown')}.{format}"
    
    @staticmethod
    def generate_toc(chapters: List[Dict]) -> str:
        """生成目录"""
        return "\n".join(
            f"{ch['id']}. {ch['title']} ...... {ch.get('pages', '')}页"
            for ch in chapters
        )