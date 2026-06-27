/**
 * Gemini Service Integration Layer
 * Handles all communication with the Google Gemini API.
 */

const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY?.trim();
const GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent";
/**
 * Handles errors and returns a consistent response structure.
 * @param {Error|Object} error - The error object or null.
 * @param {string} type - The type of error (network, missing_key, timeout, etc.).
 * @returns {Object} Consistent error response format.
 */
export const handleGeminiError = (error, type = 'network') => {
  let message = 'An unexpected error occurred while communicating with the AI.';

  if (type === 'missing_key') {
    message = 'Gemini API key is missing. Please check your environment variables.';
  } else if (type === 'timeout') {
    message = 'The request to Gemini API timed out. Please try again.';
  } else if (error?.status === 429) {
    message = 'Rate limit exceeded. Please wait a moment before trying again.';
  } else if (type === 'invalid_response') {
    message = 'Received an invalid or incomplete response from the AI.';
  } else if (error?.message) {
    message = error.message;
  }

  return {
    success: false,
    message: null,
    error: message,
    timestamp: new Date().toISOString()
  };
};

/**
 * Formats a successful response into a consistent structure.
 * @param {string} message - The response message from Gemini.
 * @returns {Object} Consistent success response format.
 */
const formatResponse = (message) => {
  return {
    success: true,
    message: message,
    error: null,
    timestamp: new Date().toISOString()
  };
};

/**
 * Utility function to fetch with a timeout.
 * @param {string} url - API Endpoint
 * @param {Object} options - Fetch options
 * @param {number} timeout - Timeout in milliseconds
 * @returns {Promise<Response>}
 */
const fetchWithTimeout = async (url, options, timeout = 60000) => {
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
};

/**
 * Core function to communicate with Gemini API.
 * @param {string} prompt - The user's input prompt.
 * @param {string} systemInstruction - Optional system instructions to guide the model.
 * @returns {Promise<Object>} The standardized response object.
 */
const callGeminiAPI = async (prompt, systemInstruction = '') => {
  if (!GEMINI_API_KEY) {
    return handleGeminiError(null, 'missing_key');
  }

  const url = `${GEMINI_API_URL}?key=${GEMINI_API_KEY}`;

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
    const response = await fetchWithTimeout(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Gemini API Error Response:', errorText);

      if (response.status === 429) {
        return handleGeminiError({ status: 429 }, 'rate_limit');
      }

      let errorMsg = `API Error: ${response.status} ${response.statusText}`;
      try {
        const parsed = JSON.parse(errorText);
        if (parsed.error && parsed.error.message) {
          errorMsg = `API Error ${response.status}: ${parsed.error.message}`;
        }
      } catch (e) { }

      throw new Error(errorMsg);
    }

    const data = await response.json();

    // Check if the response contains valid text
    if (!data.candidates || !data.candidates[0]?.content?.parts?.[0]?.text) {
      return handleGeminiError(null, 'invalid_response');
    }

    const resultText = data.candidates[0].content.parts[0].text.trim();
    return formatResponse(resultText);

  } catch (error) {
    if (error.name === 'AbortError') {
      return handleGeminiError(error, 'timeout');
    }
    return handleGeminiError(error, 'network');
  }
};

/**
 * Detects if the user is requesting a career roadmap.
 * @param {string} text - The user's input.
 * @returns {boolean}
 */
export const isRoadmapRequest = (text) => {
  const lower = text.toLowerCase();
  const triggers = [
    'i want to become',
    'how do i become',
    'how to become',
    'roadmap for',
    'career roadmap',
    'learning path for',
    'path to become',
    'steps to become',
    'guide to become',
  ];
  return triggers.some((t) => lower.includes(t));
};

/**
 * Detects if the user is requesting a degree/program comparison.
 * @param {string} text - The user's input.
 * @returns {boolean}
 */
export const isComparisonRequest = (text) => {
  const lower = text.toLowerCase();
  // Matches: "X vs Y", "X or Y", "compare X and Y", "difference between X and Y"
  const hasVsOrOr = /\bvs\.?\b|\bvs\b| or | versus /i.test(text);
  const hasCompareTrigger = [
    'compare',
    'difference between',
    'which is better',
    'should i choose',
    'which degree',
    'which course',
    'which field',
    'what should i study',
    'what should i choose',
    'after fsc',
    'after matric',
    'after intermediate',
  ].some((t) => lower.includes(t));
  return hasVsOrOr || hasCompareTrigger;
};

/**
 * Sends a career-related question to Gemini.
 * @param {string} question - The user's question.
 * @param {string} context - Optional context (e.g., previous chat history or user profile data).
 * @returns {Promise<Object>}
 */
export const sendCareerQuestion = async (question, context = '') => {
  const isRoadmap = isRoadmapRequest(question);
  const isComparison = !isRoadmap && isComparisonRequest(question);

  let systemInstruction;

  if (isRoadmap) {
    systemInstruction = `You are a professional AI Career Counselor and Tech Industry Advisor.
The user is requesting a full career roadmap. Generate a comprehensive, beginner-friendly roadmap using EXACTLY these numbered sections in markdown:

### 🎯 Career Goal
### ⏱️ Estimated Timeline
### ✅ Prerequisites
### 🛠️ Skills to Learn
### 💻 Recommended Technologies
### 📚 Learning Order
### 🧪 Practice Projects
### 🗂️ Portfolio Ideas
### 🏆 Certifications
### 🎤 Interview Preparation
### 💼 Job Opportunities
### 🌐 Freelancing Opportunities
### ⚠️ Common Mistakes to Avoid
### 🚀 Next Steps

RULES:
- Use bullet points and numbered steps throughout.
- Keep explanations beginner-friendly.
- Be encouraging and practical.
- DO NOT invent fake statistics.
- Mention when salaries or market conditions vary by country.`;
  } else if (isComparison) {
    systemInstruction = `You are a professional AI Career Counselor and Tech Industry Advisor specializing in degree and career comparisons.
The user is asking for a structured comparison. Generate a comprehensive, beginner-friendly comparison using EXACTLY these sections in markdown:

### 📋 Overview
### ⚖️ Side-by-Side Comparison
### 📚 Core Subjects
### 🛠️ Skills Required
### 💼 Career Opportunities
### 💰 Salary Expectations
### 🔮 Future Scope
### 📊 Difficulty Level
### 🎯 Best For (Who Should Choose Which?)
### ✅ Pros & Cons
### 🏆 Final Recommendation
### 📖 Suggested Learning Resources

RULES:
- For the "Side-by-Side Comparison" section, use a markdown table with columns for the compared options.
- Use bullet points and numbered steps throughout.
- Keep explanations beginner-friendly and unbiased.
- Be encouraging and practical.
- DO NOT invent fake statistics.
- Mention when salaries or market conditions vary by country or region.
- End with a clear, actionable Final Recommendation.`;
  } else {
    systemInstruction = `You are a professional AI Career Counselor and Tech Industry Advisor.
Your primary specialization covers: Career Guidance, Degree Selection, University Advice, Skills Roadmaps, Programming Languages, Software Development, AI & Machine Learning, Cyber Security, Cloud Computing, Data Science, UI/UX Design, Freelancing, Remote Jobs, Resume Writing, Interview Preparation, Salary Insights, Future Industry Trends, and Career Switching.

RESPONSE RULES:
- Provide highly structured, practical, and encouraging answers.
- Explain concepts in beginner-friendly language.
- ALWAYS use markdown formatting: headings, bullet points, and numbered steps.
- DO NOT invent facts or fake statistics.
- Clearly mention when information (especially salary or scope) depends on country, university, or market conditions.
- Encourage users with realistic guidance.

STANDARD RESPONSE STRUCTURE:
Whenever appropriate, structure your response using these exact headings:
### 1. Overview
### 2. Career Scope
### 3. Required Skills
### 4. Learning Roadmap
### 5. Salary Expectations
### 6. Future Demand
### 7. Recommended Resources
### 8. Final Advice

SPECIAL BEHAVIORS:
- If asked about a "Programming Career": Explain the learning path, technologies, projects, interview preparation, freelancing opportunities, job opportunities, and estimated learning timeline.
- If asked about a "Resume": Provide actionable resume improvement suggestions.
- If asked about an "Interview": Provide interview preparation guidance and common questions.`;
  }

  const prompt = context
    ? `Conversation History (for context):\n${context}\n\nUser Question:\n${question}`
    : `User Question:\n${question}`;

  const result = await callGeminiAPI(prompt, systemInstruction);

  if (result.success && isRoadmap) {
    result.isRoadmap = true;
    result.roadmapTitle = question;
  }
  if (result.success && isComparison) {
    result.isComparison = true;
    result.comparisonTitle = question;
  }
  return result;
};

/**
 * Generates a short title for a conversation based on the first message.
 * @param {string} firstMessage - The initial message from the user.
 * @returns {Promise<Object>}
 */
export const generateConversationTitle = async (firstMessage) => {
  const systemInstruction = 'You are a helpful assistant that generates a short, concise 3-5 word title for a conversation based on the user\'s first message. Respond ONLY with the title.';
  const prompt = `Generate a short title for this message:\n\n${firstMessage}`;

  return await callGeminiAPI(prompt, systemInstruction);
};

/**
 * Generates a concise title for a saved roadmap (e.g. "React Developer Roadmap").
 * @param {string} userQuery - The user's roadmap request.
 * @returns {Promise<Object>}
 */
export const generateRoadmapTitle = async (userQuery) => {
  const systemInstruction = 'You are a helpful assistant. Generate a concise 3-6 word title for a career roadmap based on the user\'s request. Example: "React Developer Roadmap". Respond ONLY with the title.';
  const prompt = `Generate a roadmap title for: ${userQuery}`;
  return await callGeminiAPI(prompt, systemInstruction);
};

/**
 * Generates a concise title for a saved degree comparison.
 * @param {string} userQuery - The user's comparison request.
 * @returns {Promise<Object>}
 */
export const generateComparisonTitle = async (userQuery) => {
  const systemInstruction = 'You are a helpful assistant. Generate a concise 3-6 word title for a degree/career comparison based on the user\'s request. Example: "BSCS vs Software Engineering". Respond ONLY with the title.';
  const prompt = `Generate a comparison title for: ${userQuery}`;
  return await callGeminiAPI(prompt, systemInstruction);
};
