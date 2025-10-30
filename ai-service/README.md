# AI Service - Setup Guide

This service provides AI-powered code assistance using Google Gemini API for the PeerPrep collaboration platform.

## Features

- **Code Explanation**: AI analyzes and explains code from the editor
- **Debugging Help**: Suggests potential issues and fixes
- **Optimization Suggestions**: Recommends better coding practices
- **Conversational Interface**: Maintains context across multiple questions
- **Free Tier**: Uses Google Gemini's generous free tier

## Prerequisites

- Node.js 18+
- Google Gemini API Key (free tier available)

## Getting a Gemini API Key

1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Click "Create API Key"
4. Copy your API key

**Free Tier Limits:**
- 60 requests per minute
- 1,500 requests per day
- Perfect for development and student projects

## Installation

### 1. Install Dependencies

```bash
cd ai-service
npm install
```

### 2. Configure Environment Variables

Create a `.env` file (copy from `.env.sample`):

```bash
cp .env.sample .env
```

Edit `.env` and add your Gemini API key:

```env
PORT=8086
GEMINI_API_KEY=your_actual_gemini_api_key_here
```

⚠️ **Important**: Never commit your `.env` file to version control!

### 3. Start the Service

**Development mode (with hot reload):**
```bash
npm run dev
```

**Production mode:**
```bash
npm start
```

The service will run on `http://localhost:8086`

### 4. Verify Service is Running

```bash
curl http://localhost:8086/health
```

Expected response:
```json
{"status":"AI Service is running"}
```

## API Endpoints

### POST `/api/ai/chat`

Send a message to the AI assistant with optional code context.

**Request Body:**
```json
{
  "code": "function add(a, b) { return a + b; }",
  "language": "javascript",
  "message": "What does this function do?",
  "conversationHistory": [
    {
      "role": "user",
      "content": "Previous question",
      "timestamp": "2024-01-01T00:00:00Z"
    },
    {
      "role": "assistant",
      "content": "Previous answer",
      "timestamp": "2024-01-01T00:00:01Z"
    }
  ]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "response": "This function takes two parameters `a` and `b` and returns their sum...",
    "timestamp": "2024-01-01T00:00:02Z"
  }
}
```

**Error Response:**
```json
{
  "success": false,
  "error": "Error message"
}
```

### GET `/health`

Health check endpoint.

**Response:**
```json
{"status":"AI Service is running"}
```

## Testing the Service

### Using curl:

```bash
curl -X POST http://localhost:8086/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "code": "const arr = [1,2,3]; const doubled = arr.map(x => x * 2);",
    "language": "javascript",
    "message": "Explain this code"
  }'
```

### Using the Frontend:

1. Start the frontend service
2. Navigate to the collab page
3. Click "AI Assist" in the right panel
4. Type your question and press Enter

## Docker Deployment

Build the Docker image:

```bash
docker build -t peerprep-ai-service .
```

Run the container:

```bash
docker run -p 8086:8086 \
  -e GEMINI_API_KEY=your_key_here \
  peerprep-ai-service
```

## Architecture

```
Frontend (AiAssistPanel.tsx)
    ↓
API Service (aiServiceApi.ts)
    ↓ HTTP POST
AI Service Backend
    ├── Routes (aiRoutes.js)
    ├── Controller (aiController.js)
    └── Service (aiService.js)
         ↓
Google Gemini API
```

## Configuration

### Model Selection

The service uses `gemini-1.5-flash` by default for fast, free responses. To use a different model, edit `services/aiService.js`:

```javascript
const model = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
```

Available models:
- `gemini-1.5-flash` - Fast, efficient (recommended for free tier)
- `gemini-1.5-pro` - More capable, slower
- `gemini-1.0-pro` - Legacy model

### Request Size Limits

The service accepts up to 10MB of JSON data (configured for large code files). To adjust, edit `server.js`:

```javascript
app.use(express.json({ limit: "10mb" }));
```

## Troubleshooting

### API Key Invalid Error

```
Error: Invalid API key configuration
```

**Solution:** Verify your `GEMINI_API_KEY` in `.env` is correct and not expired.

### Rate Limit Exceeded

```
Error: AI service rate limit exceeded
```

**Solution:**
- Wait a minute and try again
- Free tier: 60 requests/minute, 1,500/day
- Consider implementing request caching or rate limiting on frontend

### Connection Refused

```
Failed to connect to AI service
```

**Solution:**
- Verify service is running: `curl http://localhost:8086/health`
- Check `NEXT_PUBLIC_AI_SERVICE_URL` in frontend `.env.local` matches the service port
- Ensure no firewall is blocking port 8086

### Empty/No Response

**Solution:**
- Check console logs for Gemini API errors
- Verify internet connection (service needs to reach Gemini API)
- Check if code is too large (>1M tokens)

## Security Considerations

1. **API Key Protection**: Never commit `.env` files or expose API keys in client code
2. **Rate Limiting**: Consider adding rate limiting per user to prevent abuse
3. **Code Privacy**: User code is sent to Google's servers - inform users in privacy policy
4. **Input Validation**: Service validates all inputs before sending to Gemini API
5. **Cost Monitoring**: Monitor API usage to stay within free tier limits

## Cost Management

**Free Tier is Sufficient For:**
- Personal/student projects
- Small team development
- Up to ~500 questions per day

**If You Exceed Free Tier:**
- Gemini API is very affordable (~$0.001 per request)
- Consider implementing:
  - User request limits (e.g., 10 questions per session)
  - Caching common questions
  - Response streaming for better UX

## Future Enhancements

- [ ] Add request caching with Redis
- [ ] Implement user-specific rate limiting
- [ ] Add streaming responses for real-time output
- [ ] Support file uploads for multi-file analysis
- [ ] Add code execution/testing capabilities
- [ ] Implement conversation summarization for long sessions

## Support

For issues or questions:
1. Check the troubleshooting section above
2. Review [Gemini API Documentation](https://ai.google.dev/docs)
3. Open an issue in the repository
