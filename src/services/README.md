# 🧠 Services Layer

This directory handles external API integrations and business logic.

## Key Services

### `gemini.ts`
The core intelligence engine. It interfaces with the Google Gemini API to perform:
1.  **Forensic Auditing**: Analyzing URL metadata and tech stack.
2.  **Architect Chat**: Powering the "Ask the Architect" conversational agent.

#### Configuration
It uses `import.meta.env.VITE_GOOGLE_API_KEY` to securely access the API key.

> **Note**: This service includes a caching mechanism (`analysisCache`) to optimize API usage and prevent duplicate requests for the same URL.
