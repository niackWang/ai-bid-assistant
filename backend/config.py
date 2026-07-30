# AI Bid Assistant - Backend Configuration
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    APP_NAME: str = "AI Bid Assistant"
    API_VERSION: str = "v1"
    DEBUG: bool = True
    
    # LLM Configuration (for future real integration)
    LLM_PROVIDER: str = "deepseek"  # deepseek | qwen | zhipu | ollama
    LLM_MODEL: str = "deepseek-chat"
    LLM_API_KEY: str = ""
    LLM_BASE_URL: str = "https://api.deepseek.com/v1"
    
    # RAG Configuration
    VECTOR_DB_TYPE: str = "chroma"  # chroma | milvus | qdrant
    VECTOR_DB_PATH: str = "./data/vector_store"
    EMBEDDING_MODEL: str = "BAAI/bge-m3"
    
    # Document Storage
    DOC_STORAGE_PATH: str = "./data/documents"
    
    class Config:
        env_file = ".env"

settings = Settings()