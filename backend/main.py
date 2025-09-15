"""
BoringAI Consultation Bot Backend
FastAPI server with LangGraph for AI business consultation
"""

import os
import logging
from typing import List, Dict, Any
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

from ai_consultant import BoringAIConsultant

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(
    title="BoringAI Consultation API",
    description="AI-powered business consultation and automation advisory",
    version="1.0.0"
)

# Configure CORS for local development
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://127.0.0.1:5500", "*"],  # Add your frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize AI consultant
consultant = BoringAIConsultant()

class ChatMessage(BaseModel):
    role: str  # "user" or "assistant"
    content: str

class ChatRequest(BaseModel):
    message: str
    conversation_history: List[ChatMessage] = []
    user_context: Dict[str, Any] = {}

class ChatResponse(BaseModel):
    response: str
    conversation_state: str
    suggested_actions: List[str] = []
    confidence_score: float

@app.get("/")
async def root():
    """Health check endpoint"""
    return {
        "message": "BoringAI Consultation API is running",
        "status": "healthy",
        "version": "1.0.0"
    }

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    """
    Main chat endpoint for AI consultation
    """
    try:
        logger.info(f"Received chat request: {request.message[:100]}...")

        # Process message through LangGraph workflow
        result = await consultant.process_message(
            message=request.message,
            conversation_history=request.conversation_history,
            user_context=request.user_context
        )

        logger.info(f"Generated response: {result['response'][:100]}...")

        return ChatResponse(
            response=result["response"],
            conversation_state=result["state"],
            suggested_actions=result.get("suggested_actions", []),
            confidence_score=result.get("confidence_score", 0.8)
        )

    except Exception as e:
        logger.error(f"Error processing chat request: {str(e)}")
        raise HTTPException(
            status_code=500,
            detail="Sorry, I'm experiencing technical difficulties. Please try again."
        )

@app.get("/health")
async def health_check():
    """Health check for monitoring"""
    return {"status": "healthy", "timestamp": "2025-01-15T10:00:00Z"}

if __name__ == "__main__":
    import uvicorn

    port = int(os.getenv("PORT", 8000))
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=port,
        reload=True,
        log_level="info"
    )