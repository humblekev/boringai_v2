# BoringAI Backend - AI Business Consultant

LangGraph-powered AI consultation bot for business automation advisory.

## Features

- **LangGraph Workflow**: Multi-stage conversation flow (consultation → recommendation → qualification)
- **GPT-4o-mini Integration**: Latest OpenAI model for business conversations
- **Business-Focused**: Talks business value, not technical details
- **FastAPI**: Modern, fast API with automatic documentation
- **CORS Enabled**: Works with frontend during development

## Quick Start

### 1. Setup Environment

```bash
cd backend
python3 setup.py
```

### 2. Start the Server

```bash
source venv/bin/activate  # On Windows: venv\Scripts\activate
python main.py
```

The API will be available at: http://localhost:8000

### 3. Test the API

Visit http://localhost:8000/docs for interactive API documentation.

## API Endpoints

### `POST /chat`
Main consultation endpoint

**Request:**
```json
{
  "message": "We spend too much time on manual data entry",
  "conversation_history": [],
  "user_context": {}
}
```

**Response:**
```json
{
  "response": "That sounds like a common challenge...",
  "conversation_state": "consultation",
  "suggested_actions": [],
  "confidence_score": 0.8
}
```

### `GET /health`
Health check endpoint

## LangGraph Workflow

1. **Intent Analysis**: Determines conversation stage
2. **Business Consultation**: Understands challenges and needs
3. **Solution Recommendation**: Provides specific automation advice
4. **Qualification Assessment**: Evaluates fit for BoringAI services

## Configuration

Environment variables in `.env`:
- `OPENAI_API_KEY`: Your OpenAI API key
- `PORT`: Server port (default: 8000)

## Development

The API includes:
- Automatic reloading during development
- Comprehensive error handling
- Logging for debugging
- CORS for frontend integration