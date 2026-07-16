/**
 * AI Service Integration Layer
 * Exposes clean methods to the frontend and routes AI queries through the ProviderManager.
 */

import {
  buildLanguagePromptHint,
  detectConversationLanguage,
  isDetailRequested,
} from '../../utils/languageDetection';
import { providerManager } from './ProviderManager';

/**
 * Handles errors for legacy compatibility.
 */
export const handleGeminiError = (error, type = 'network') => {
  let message = '⚠️ Something went wrong while connecting to the AI. Please try again in a moment.';

  if (type === 'missing_key') {
    message = '🔑 AI service is not configured. Please contact support.';
  } else if (type === 'rate_limit' || error?.status === 429) {
    message = '⏳ Your free AI tokens for today have been used up. Please wait a few minutes and try again, or come back tomorrow for a fresh quota.';
  } else if (type === 'quota_exceeded' || error?.status === 403) {
    message = '🚫 Your free daily AI tokens are finished. Please try again tomorrow — your quota resets every 24 hours.';
  } else if (type === 'timeout') {
    message = '⏱️ The AI is taking too long to respond. Please check your internet connection and try again.';
  } else if (type === 'invalid_response') {
    message = '🤖 The AI returned an unexpected response. Please rephrase your question and try again.';
  } else if (type === 'network') {
    const msg = (error?.message || '').toLowerCase();
    if (msg.includes('fetch') || msg.includes('network') || msg.includes('failed to fetch')) {
      message = '📶 No internet connection. Please check your network and try again.';
    } else if (msg.includes('429') || msg.includes('rate')) {
      message = '⏳ Your free AI tokens for today have been used up. Please wait a few minutes and try again.';
    } else if (msg.includes('403') || msg.includes('quota') || msg.includes('resource')) {
      message = '🚫 Your free daily AI tokens are finished. Please try again tomorrow.';
    } else if (msg.includes('401') || msg.includes('api key') || msg.includes('invalid')) {
      message = '🔑 AI service authentication failed. Please contact support.';
    } else if (msg.includes('500') || msg.includes('502') || msg.includes('503')) {
      message = '🛠️ The AI service is temporarily down. Please try again in a few minutes.';
    } else if (error?.message) {
      message = `⚠️ AI Error: ${error.message}`;
    }
  }

  return {
    success: false,
    message: null,
    error: message,
    timestamp: new Date().toISOString()
  };
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
    'roadmap chahiye',
    'rasta batao',
    'raasta batao',
    'banne ke liye',
    'kaise banun',
    'kaise banaun',
    'seekhna shuru',
    'guide chahiye',
    'poora roadmap',
    'pura roadmap',
    'complete roadmap',
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
    'compare karo',
    'farq kya',
    'konsa behtar',
    'kaun sa behtar',
    'kaunsa behtar',
    'difference kya',
    'kya behtar hai',
  ].some((t) => lower.includes(t));
  return hasVsOrOr || hasCompareTrigger;
};

const BILINGUAL_RULES = `
BILINGUAL COMMUNICATION (CRITICAL — AI CONVERSATION ONLY):
- Automatically detect whether the user is writing in English or Roman Urdu.
- ALWAYS reply in the SAME language the user used.
- If the message is primarily English → respond in English.
- If the message is primarily Roman Urdu → respond in natural, conversational Roman Urdu.
- If the message mixes both languages → use the dominant language while keeping technical terms in English.
- Roman Urdu style: sound like a friendly Pakistani career mentor. Use natural words like Ap, Agar, Kyun, Lekin, Isliye, Seekhna, Samajhna, Karna, Shuru, Mazboot, Tajweez, Mashwara.
- Do NOT use Urdu script (Arabic/Persian letters). Write Roman Urdu only.
- Do NOT use machine-translated, overly formal, or awkward literal Urdu.
- NEVER translate technical terms unnecessarily. Keep these in English: React, Node.js, MongoDB, API, Authentication, Frontend, Backend, Database, JavaScript, TypeScript, Git, GitHub, Express, MERN, etc.
- Be concise and to-the-point by DEFAULT. Do NOT write unnecessarily long answers.
- ONLY provide detailed, long, or step-by-step responses when the user explicitly asks (e.g. "detail se batao", "explain in detail", "step by step samjhao", "complete roadmap do", "MERN roadmap samjhao").
- Personality: friendly, professional, encouraging career mentor. Be helpful, simple, actionable, and beginner-friendly.
- Avoid: robotic tone, excessive emojis, long introductions, repeating information.
- Clarifying questions and profile proposals must also be in the user's language.`;

/**
 * Sends a career-related question to the active AI provider.
 * @param {string} question - The user's question.
 * @param {string} context - Optional context (e.g., previous chat history or user profile data).
 * @param {Object} userProfile - User's current career profile.
 * @returns {Promise<Object>}
 */
export const sendCareerQuestion = async (question, context = '', userProfile = null) => {
  const isRoadmap = isRoadmapRequest(question);
  const isComparison = !isRoadmap && isComparisonRequest(question);
  const languageInfo = detectConversationLanguage(question);
  const wantsDetail = isDetailRequested(question);
  const languageHint = buildLanguagePromptHint(languageInfo, wantsDetail);

  let systemInstruction;

  const clarificationRules = `
CLARIFICATION RULES (CRITICAL):
- Avoid making assumptions when the user's question is vague or lacks context.
- If (and ONLY if) you cannot answer accurately without more context, ask EXACTLY ONE short, conversational clarifying question (under 20 words). 
  * Example User: "Which degree is better?" -> AI: "Better for which career goal: Software Engineering, AI, Cybersecurity, Data Science, Business, or another field?"
  * Example User: "Which programming language should I learn?" -> AI: "What is your goal: Web Development, Mobile Development, AI, Data Science, Cybersecurity, or Game Development?"
  * Example User: "I want to work remotely." -> AI: "Which field are you interested in: Software Development, UI/UX Design, Digital Marketing, Content Writing, or another profession?"
  * Example User: "I want a roadmap." -> AI: "What career would you like the roadmap for?"
  * Example User (Roman Urdu): "Mujhe konsi degree leni chahiye?" -> AI: "Apka career goal kya hai: Software Engineering, AI, Cyber Security, Data Science, ya koi aur field?"
  * Example User (Roman Urdu): "Mujhe roadmap chahiye." -> AI: "Kis career ke liye roadmap chahiye?"
- Clarifying questions must be in the SAME language as the user's message.
- DO NOT use robotic phrases like "I require more context" or "Your query is ambiguous." Use natural language.
- If the user provides enough info (e.g., "I want to become a React Developer" or "Compare BSCS and Software Engineering"), answer IMMEDIATELY without asking questions.
- If you ask a clarifying question, ONLY output the question. Do NOT output any other structured sections, headings, or markdown tables.
- Once the user replies to your clarification, provide the complete answer naturally without further questions.`;

  const memoryRules = `
CONVERSATION MEMORY & CONTEXT:
- You will be provided with previous messages of the current conversation (if any) as context.
- Treat this context as the active conversation history.
- When the user asks a follow-up question (e.g., "What should I learn next?" or "Which one has better job opportunities?"), assume they refer to the topic discussed in the provided context, unless they explicitly change the subject.
- Do NOT repeat information that was already covered in the context.
- Keep answers concise by default. Only provide detailed responses when explicitly requested.
- If context is insufficient to answer a follow-up, refer to the CLARIFICATION RULES and ask a concise clarification question.`;

  const profileRules = `
AI PROFILE ASSISTANT (CRITICAL):
- You will be provided with the user's current 'Career Profile' if available.
- Use this profile context naturally to personalize your advice, but DO NOT repeat the profile back to them or expose the raw data.
- Detect if the user reveals new career data in their question (e.g., "I started learning React", "My goal is AI Engineer").
- If they reveal new information that is NOT already in their profile, DO NOT save it automatically.
- Instead, output a special markdown block asking for their permission to save it to their profile.
- You MUST use this exact format on a new line at the end of your response:
  [PROFILE_PROPOSAL]{"field": "current_learning", "value": "React", "message": "I noticed you're learning React. Would you like me to add it to your Career Profile?"}[/PROFILE_PROPOSAL]
- The "message" field inside the JSON must be in the SAME language as the user's message (English or Roman Urdu).
- Valid fields are: "education", "career_goal", "current_skills", "interests", "preferred_work", "current_learning".`;

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
- Mention when salaries or market conditions vary by country.
${BILINGUAL_RULES}
${clarificationRules}
${memoryRules}
${profileRules}`;
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
- End with a clear, actionable Final Recommendation.
${BILINGUAL_RULES}
${clarificationRules}
${memoryRules}
${profileRules}`;
  } else {
    systemInstruction = `You are a professional AI Career Counselor and Tech Industry Advisor.
Your primary specialization covers: Career Guidance, Degree Selection, University Advice, Skills Roadmaps, Programming Languages, Software Development, AI & Machine Learning, Cyber Security, Cloud Computing, Data Science, UI/UX Design, Freelancing, Remote Jobs, Resume Writing, Interview Preparation, Salary Insights, Future Industry Trends, and Career Switching.

INTENT DETECTION & RESPONSE LENGTH RULES:
Analyze the user's request to determine if they want a quick answer, detailed explanation, comparison, roadmap, career advice, or learning resources. Adjust your response length accordingly.

1. QUICK ANSWER (DEFAULT BEHAVIOR): 
If the user asks a simple or direct question (e.g., "What is React?", "Is BSCS better than Software Engineering?", "Should I learn Python?"):
- Provide a CONCISE answer.
- Length: 2–5 short paragraphs or 3–8 bullet points.
- Structure: Direct answer -> Optional short explanation -> Optional one practical tip.
- Avoid unnecessary explanations. If a short answer completely answers the question, stop there. Do not add unnecessary sections.

2. DETAILED ANSWER:
ONLY if the user explicitly asks for guidance, planning, comparison, or uses phrases like "Explain in detail", "Guide me", "Create a roadmap", "Compare", "Step by step", "Teach me", "How can I become...", "detail se batao", "step by step samjhao", "thora detail me samjhao", "complete roadmap do", or "samjhao":
- Provide a detailed, structured response.
- Use headings and bullet points.
- Include only relevant sections and avoid filler text.

FOLLOW-UP FRIENDLY:
If a concise answer is given, end naturally with a short follow-up suggestion when appropriate.
Example (English): "If you'd like, I can also provide a detailed roadmap or explanation."
Example (Roman Urdu): "Agar chahein to main detail me roadmap ya explanation bhi de sakta hoon."
Do not automatically generate the detailed version. Wait for the user's request.

QUALITY RULES:
- Avoid repetitive content, generic introductions, and unnecessary conclusions.
- Stay focused on the user's exact question. Answer only what was asked.
- Explain concepts in beginner-friendly language.
- DO NOT invent facts or fake statistics.
${BILINGUAL_RULES}
${clarificationRules}
${memoryRules}
${profileRules}`;
  }

  let profileContextStr = '';
  if (userProfile) {
    profileContextStr = `User Career Profile Context:\n`;
    if (userProfile.education) profileContextStr += `- Education: ${userProfile.education}\n`;
    if (userProfile.degree) profileContextStr += `- Degree: ${userProfile.degree}\n`;
    if (userProfile.semester) profileContextStr += `- Semester: ${userProfile.semester}\n`;
    if (userProfile.career_goal) profileContextStr += `- Goal: ${userProfile.career_goal}\n`;
    if (userProfile.current_skills?.length) profileContextStr += `- Skills: ${userProfile.current_skills.join(', ')}\n`;
    if (userProfile.current_learning?.length) profileContextStr += `- Current Learning: ${userProfile.current_learning.join(', ')}\n`;
    if (userProfile.interests?.length) profileContextStr += `- Interests: ${userProfile.interests.join(', ')}\n`;
    if (userProfile.preferred_work?.length) profileContextStr += `- Preferred Work: ${userProfile.preferred_work.join(', ')}\n`;
    profileContextStr += '\n';
  }

  const prompt = `${languageHint}\n\n${profileContextStr}${context ? `Conversation History (for context):\n${context}\n\n` : ''}User Question:\n${question}`;

  const result = await providerManager.sendMessageWithFallback(prompt, systemInstruction);

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

  return await providerManager.sendMessageWithFallback(prompt, systemInstruction);
};

/**
 * Generates a concise title for a saved roadmap (e.g. "React Developer Roadmap").
 * @param {string} userQuery - The user's roadmap request.
 * @returns {Promise<Object>}
 */
export const generateRoadmapTitle = async (userQuery) => {
  const systemInstruction = 'You are a helpful assistant. Generate a concise 3-6 word title for a career roadmap based on the user\'s request. Example: "React Developer Roadmap". Respond ONLY with the title.';
  const prompt = `Generate a roadmap title for: ${userQuery}`;
  return await providerManager.sendMessageWithFallback(prompt, systemInstruction);
};

/**
 * Generates a concise title for a saved degree comparison.
 * @param {string} userQuery - The user's comparison request.
 * @returns {Promise<Object>}
 */
export const generateComparisonTitle = async (userQuery) => {
  const systemInstruction = 'You are a helpful assistant. Generate a concise 3-6 word title for a degree/career comparison based on the user\'s request. Example: "BSCS vs Software Engineering". Respond ONLY with the title.';
  const prompt = `Generate a comparison title for: ${userQuery}`;
  return await providerManager.sendMessageWithFallback(prompt, systemInstruction);
};

/**
 * Generates a single personalized career recommendation for the Dashboard.
 * @param {string[]} recentTitles - Array of recent conversation titles.
 * @returns {Promise<Object>}
 */
export const generateDashboardRecommendation = async (recentTitles) => {
  const systemInstruction = `You are an expert AI Career Counselor. Based on the user's recent conversation topics, generate ONE single, highly personalized, and actionable career recommendation.

RULES:
- Respond with EXACTLY ONE sentence (maximum 25 words).
- Be specific, encouraging, and practical.
- Reference the topics the user has been exploring.
- Do NOT use bullet points, headings, or markdown formatting.
- Start with "Since you've been exploring..." or "Based on your interest in..." or similar.`;

  const topicsText = recentTitles.length > 0
    ? recentTitles.slice(0, 5).join(', ')
    : 'general career guidance';

  const prompt = `The user's recent conversation topics are: ${topicsText}. Generate one personalized career recommendation.`;

  return await providerManager.sendMessageWithFallback(prompt, systemInstruction);
};

/**
 * Generates a detailed Skill Gap Analysis report for a target career.
 * @param {string} career - The user's target career (e.g. "Frontend React Developer").
 * @param {string} skills - The user's current skills.
 * @param {string} education - Optional education level.
 * @param {string} experience - Optional experience level.
 * @returns {Promise<Object>}
 */
export const generateSkillGapAnalysis = async (career, skills, education = '', experience = '') => {
  const systemInstruction = `You are a professional AI Career Coach and Skill Gap Analyst.
The user wants to become a "${career}". Based on their current skills and background, generate a comprehensive, honest, and actionable Skill Gap Analysis Report.

Use EXACTLY these numbered sections in markdown:

### 🎯 Career Overview
### 📊 Current Skill Assessment
### ❌ Missing Skills
### ⚡ Priority Skills (Learn These First)
### 📚 Recommended Learning Order
### ⏱️ Estimated Learning Timeline
### 🧪 Suggested Projects
### 🎤 Interview Preparation Tips
### 🏆 Recommended Certifications
### 🌐 Freelancing Opportunities
### 💼 Job Opportunities
### 🚀 Final Advice

RULES:
- Be honest about skill gaps. Do NOT sugarcoat missing skills.
- Be encouraging but realistic about timelines.
- Use bullet points and numbered steps throughout.
- Keep explanations beginner-friendly.
- Mention when information depends on country or market.
- In the "Current Skill Assessment" section, list each of the user's provided skills and briefly assess how relevant it is to the target career.
- In the "Missing Skills" section, list ALL skills needed for the career that the user has NOT mentioned.
- In "Priority Skills", pick the 3-5 most critical missing skills to focus on first.`;

  const contextLines = [
    `Target Career: ${career}`,
    `Current Skills: ${skills}`,
    education ? `Education Level: ${education}` : null,
    experience ? `Experience Level: ${experience}` : null,
  ].filter(Boolean).join('\n');

  const prompt = `Please generate a Skill Gap Analysis Report for the following user:\n\n${contextLines}`;

  return await providerManager.sendMessageWithFallback(prompt, systemInstruction);
};
