import { AI_CONFIG } from './config/aiConfig';
import { OpenRouterProvider } from './providers/OpenRouterProvider';
import { GrokProvider } from './providers/GrokProvider';
import { GeminiProvider } from './providers/GeminiProvider';

class ProviderManager {
  constructor() {
    this.providers = {};
  }

  /**
   * Lazily initializes and returns the specified provider.
   * @param {string} name - Name of the provider
   * @returns {Object|null} Provider instance or null
   */
  getProvider(name) {
    if (this.providers[name]) {
      return this.providers[name];
    }

    switch (name) {
      case 'openrouter':
        this.providers[name] = new OpenRouterProvider();
        break;
      case 'grok':
        this.providers[name] = new GrokProvider();
        break;
      case 'gemini':
        this.providers[name] = new GeminiProvider();
        break;
      default:
        console.warn(`[AI ProviderManager] Unknown provider requested: ${name}`);
        return null;
    }

    return this.providers[name];
  }

  /**
   * Gets a list of configured and available providers in priority order.
   * @returns {string[]} Ordered list of available provider names
   */
  getAvailableProviders() {
    return AI_CONFIG.priority.filter(name => {
      const provider = this.getProvider(name);
      return provider && provider.isConfigured();
    });
  }

  /**
   * Sends a message with automatic priority, timeout, and fallback logic.
   * @param {string} prompt 
   * @param {string} systemInstruction 
   * @returns {Promise<Object>} The unified response format
   */
  async sendMessageWithFallback(prompt, systemInstruction = '') {
    const available = this.getAvailableProviders();

    if (available.length === 0) {
      return {
        success: false,
        message: null,
        error: '🔑 AI service is not configured. Please contact support.',
        timestamp: new Date().toISOString()
      };
    }

    const isDev = import.meta.env.DEV;

    for (let i = 0; i < available.length; i++) {
      const providerName = available[i];
      const provider = this.getProvider(providerName);

      if (isDev) {
        console.log(`[AI ProviderManager] Attempting request using provider: ${providerName.toUpperCase()}`);
      }

      const result = await provider.sendMessage(prompt, systemInstruction);

      if (result.success) {
        if (isDev) {
          console.log(`[AI ProviderManager] Success using provider: ${providerName.toUpperCase()}`);
        }
        return {
          ...result,
          provider: providerName
        };
      }

      // Check if it's the last provider in the fallback chain
      const isLast = (i === available.length - 1);

      if (isDev) {
        console.warn(
          `[AI ProviderManager] Failure using provider ${providerName.toUpperCase()}: ${result.error}. ` +
          (isLast ? 'No more providers left in fallback chain.' : 'Switching/Falling back to next provider...')
        );
      }

      // If this was the last provider, return a user-friendly error response
      if (isLast) {
        let friendlyMessage = '⚠️ Something went wrong while connecting to the AI. Please try again in a moment.';
        const status = result.status;
        const msg = (result.error || '').toLowerCase();

        if (status === 429 || msg.includes('429') || msg.includes('rate limit')) {
          friendlyMessage = '⏳ Your free AI tokens for today have been used up. Please wait a few minutes and try again.';
        } else if (status === 403 || msg.includes('403') || msg.includes('quota') || msg.includes('resource_exhausted')) {
          friendlyMessage = '🚫 Your free daily AI tokens are finished. Please try again tomorrow — your quota resets every 24 hours.';
        } else if (msg.includes('timeout') || msg.includes('abort')) {
          friendlyMessage = '⏱️ The AI is taking too long to respond. Please check your internet connection and try again.';
        } else if (msg.includes('network') || msg.includes('fetch')) {
          friendlyMessage = '📶 No internet connection. Please check your network and try again.';
        }

        return {
          success: false,
          message: null,
          error: friendlyMessage,
          timestamp: new Date().toISOString()
        };
      }
    }
  }
}

export const providerManager = new ProviderManager();
