import { AI_CONFIG } from '../config/aiConfig';

export class GeminiProvider {
  constructor() {
    this.apiKey = import.meta.env.VITE_GEMINI_API_KEY?.trim();
    this.model = AI_CONFIG.models.gemini;
    this.baseUrl = AI_CONFIG.urls.gemini;
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
        error: 'Gemini API key is not configured.',
        timestamp: new Date().toISOString()
      };
    }

    const url = `${this.baseUrl}/${this.model}:generateContent?key=${this.apiKey}`;

    const body = {
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt }
          ]
        }
      ],
      ...(systemInstruction && {
        system_instruction: {
          parts: [{ text: systemInstruction }]
        }
      })
    };

    try {
      const response = await this.fetchWithTimeout(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Gemini Provider API Error Response:', errorText);

        let errorMsg = `Gemini API Error ${response.status}: ${response.statusText}`;
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

      if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
        return {
          success: false,
          message: null,
          error: 'Gemini returned an invalid or empty response.',
          timestamp: new Date().toISOString()
        };
      }

      const resultText = data.candidates[0].content.parts[0].text.trim();
      return {
        success: true,
        message: resultText,
        error: null,
        timestamp: new Date().toISOString()
      };

    } catch (error) {
      console.error('Gemini Provider Exception:', error);
      let errorMsg = error.message || 'Network error connecting to Gemini.';
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
