import { AI_CONFIG } from '../config/aiConfig';

export class OpenRouterProvider {
  constructor() {
    this.apiKey = import.meta.env.VITE_OPENROUTER_API_KEY?.trim();
    this.model = AI_CONFIG.models.openrouter;
    this.url = AI_CONFIG.urls.openrouter;
  }

  isConfigured() {
    return !!this.apiKey;
  }

  async fetchWithTimeout(url, options, timeout = AI_CONFIG.timeoutMs) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);
    try {
      const response = await fetch(url, {
        ...options,
        signal: controller.signal
      });
      clearTimeout(id);
      return response;
    } catch (error) {
      clearTimeout(id);
      throw error;
    }
  }

  async sendMessage(prompt, systemInstruction = '') {
    if (!this.isConfigured()) {
      return {
        success: false,
        message: null,
        error: 'OpenRouter API key is not configured.',
        timestamp: new Date().toISOString()
      };
    }

    const messages = [];
    if (systemInstruction) {
      messages.push({ role: 'system', content: systemInstruction });
    }
    messages.push({ role: 'user', content: prompt });

    const body = {
      model: this.model,
      messages: messages
    };

    try {
      const response = await this.fetchWithTimeout(this.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          // Optional but recommended for OpenRouter
          'HTTP-Referer': window.location.origin,
          'X-Title': 'CareerMind AI'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('OpenRouter Provider API Error Response:', errorText);

        let errorMsg = `OpenRouter API Error ${response.status}: ${response.statusText}`;
        try {
          const parsed = JSON.parse(errorText);
          if (parsed.error?.message) {
            errorMsg = parsed.error.message;
          }
        } catch (e) { }

        return {
          success: false,
          message: null,
          error: errorMsg,
          status: response.status,
          timestamp: new Date().toISOString()
        };
      }

      const data = await response.json();

      if (!data.choices || !data.choices[0]?.message?.content) {
        return {
          success: false,
          message: null,
          error: 'OpenRouter returned an empty or invalid response.',
          timestamp: new Date().toISOString()
        };
      }

      const resultText = data.choices[0].message.content.trim();
      return {
        success: true,
        message: resultText,
        error: null,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('OpenRouter Provider Exception:', error);
      let errorMsg = error.message || 'Network error connecting to OpenRouter.';
      if (error.name === 'AbortError') {
        errorMsg = 'Request timed out.';
      }
      return {
        success: false,
        message: null,
        error: errorMsg,
        timestamp: new Date().toISOString()
      };
    }
  }
}
