export const AI_CONFIG = {
  // Provider Priority List
  priority: ['openrouter', 'grok', 'gemini'],

  // Default models for each provider
  models: {
    openrouter: 'openrouter/free',
    grok: 'grok-2-1212',
    gemini: 'gemini-2.0-flash',
  },

  // API URLs for each provider
  urls: {
    openrouter: 'https://openrouter.ai/api/v1/chat/completions',
    grok: 'https://api.x.ai/v1/chat/completions',
    gemini: 'https://generativelanguage.googleapis.com/v1beta/models',
  },

  // Global request timeout in ms (60 seconds)
  timeoutMs: 60000,
};
