/**
 * Lightweight language detection for AI conversations.
 * Supports English and Roman Urdu only — no external translation APIs.
 */

const ROMAN_URDU_WORDS = new Set([
  'mujhe', 'mujhay', 'mujhy', 'main', 'mein', 'mera', 'meri', 'mere', 'meray',
  'kya', 'kaise', 'kaisa', 'kyun', 'kyunki', 'kyunke', 'kion',
  'agar', 'lekin', 'isliye', 'phir', 'pehle', 'baad', 'abhi', 'ab',
  'seekhna', 'seekhne', 'seekho', 'samajhna', 'samjhao', 'samjhay', 'samjh',
  'karna', 'karein', 'karun', 'karo', 'krta', 'karti', 'karte', 'karna',
  'chahiye', 'chahye', 'chahte', 'chahta', 'chahti', 'chahein',
  'batao', 'bataiye', 'batana', 'bata', 'bataen',
  'shuru', 'mazboot', 'tajweez', 'mashwara', 'thora', 'thori', 'zyada',
  'banne', 'banna', 'banana', 'banun', 'banaun', 'banao',
  'hain', 'hai', 'ho', 'hun', 'hoon', 'tha', 'thi', 'the',
  'ka', 'ki', 'ke', 'ko', 'se', 'par', 'aur', 'ya', 'bhi', 'toh', 'tu', 'tum',
  'ap', 'aap', 'apki', 'apka', 'apke', 'unka', 'unki', 'unke',
  'konsa', 'kaunsa', 'kaun', 'kis', 'kin', 'kahan', 'kab',
  'achha', 'theek', 'sahi', 'kam', 'zyada', 'behtar', 'behtareen',
  'rasta', 'raasta', 'tareeqa', 'tarika', 'madad', 'rehnumai',
])

const ROMAN_URDU_PHRASES = [
  'ke liye', 'ke baad', 'ka kya', 'kya karna', 'kya seekhna', 'kya chahiye',
  'detail se', 'detail me', 'detail mein', 'thora detail', 'poora roadmap', 'pura roadmap',
  'step by step', 'banne ke liye', 'seekhna shuru', 'roadmap chahiye', 'guide chahiye',
  'samjha den', 'samjha do', 'farq kya', 'konsa behtar', 'kaun sa behtar',
  'compare karo', 'mashwara do', 'tajweez do',
]

const ENGLISH_WORDS = new Set([
  'what', 'how', 'why', 'when', 'where', 'which', 'should', 'can', 'could',
  'would', 'will', 'the', 'and', 'for', 'with', 'from', 'about', 'need',
  'want', 'become', 'learn', 'explain', 'compare', 'guide', 'help',
  'my', 'your', 'their', 'this', 'that', 'these', 'those',
  'is', 'are', 'was', 'were', 'do', 'does', 'did', 'have', 'has',
  'recommend', 'suggest', 'advice', 'career', 'roadmap', 'skills',
])

export const DETAIL_REQUEST_PHRASES = [
  'detail se', 'detail me', 'detail mein', 'thora detail', 'thori detail',
  'step by step', 'complete roadmap', 'poora roadmap', 'pura roadmap', 'full roadmap',
  'explain in detail', 'in detail', 'guide me', 'teach me', 'walk me through',
  'samjhao', 'samjha den', 'samjha do', 'samjhayen', 'samjhana', 'poori detail',
]

/**
 * Detect whether the user explicitly wants a detailed response.
 * @param {string} text
 * @returns {boolean}
 */
export function isDetailRequested(text) {
  if (!text?.trim()) return false
  const lower = text.toLowerCase()
  return DETAIL_REQUEST_PHRASES.some((phrase) => lower.includes(phrase))
}

/**
 * Detect the dominant conversation language from user input.
 * @param {string} text
 * @returns {{ language: 'english' | 'roman_urdu', mixed: boolean, confidence: 'low' | 'medium' | 'high' }}
 */
export function detectConversationLanguage(text) {
  if (!text?.trim()) {
    return { language: 'english', mixed: false, confidence: 'low' }
  }

  const lower = text.toLowerCase()
  const words = lower.split(/\s+/).map((w) => w.replace(/[^\w]/g, '')).filter(Boolean)

  let romanUrduScore = 0
  let englishScore = 0

  for (const phrase of ROMAN_URDU_PHRASES) {
    if (lower.includes(phrase)) {
      romanUrduScore += 2
    }
  }

  for (const word of words) {
    if (ROMAN_URDU_WORDS.has(word)) romanUrduScore += 1
    if (ENGLISH_WORDS.has(word)) englishScore += 1
  }

  const mixed = romanUrduScore > 0 && englishScore > 0

  if (romanUrduScore > englishScore) {
    return {
      language: 'roman_urdu',
      mixed,
      confidence: romanUrduScore >= 3 ? 'high' : 'medium',
    }
  }

  if (englishScore > romanUrduScore) {
    return {
      language: 'english',
      mixed,
      confidence: englishScore >= 2 ? 'high' : 'medium',
    }
  }

  if (romanUrduScore > 0) {
    return { language: 'roman_urdu', mixed: false, confidence: 'medium' }
  }

  return { language: 'english', mixed: false, confidence: 'low' }
}

/**
 * Builds a short language hint injected into the Gemini prompt.
 * @param {{ language: string, mixed: boolean, confidence: string }} languageInfo
 * @param {boolean} wantsDetail
 * @returns {string}
 */
export function buildLanguagePromptHint(languageInfo, wantsDetail) {
  const { language, mixed } = languageInfo

  if (language === 'roman_urdu') {
    const mixedNote = mixed
      ? 'The message mixes English and Roman Urdu — respond in Roman Urdu as the dominant language.'
      : 'The user wrote in Roman Urdu — respond fully in natural Roman Urdu.'

    return `Language Context:
- ${mixedNote}
- Use conversational Roman Urdu like a Pakistani career mentor (Ap, Agar, Kyun, Lekin, Isliye, Seekhna, Samajhna, Shuru, Mazboot, Mashwara).
- Do NOT use Urdu script. Do NOT use machine-translated or overly formal Urdu.
- Keep technical terms in English: React, Node.js, MongoDB, API, JavaScript, Frontend, Backend, Git, GitHub, etc.
- Response length: ${wantsDetail ? 'DETAILED (user explicitly requested detail)' : 'CONCISE (short, to-the-point answer)'}.`
  }

  return `Language Context:
- The user wrote in English — respond in clear, professional English.
- Keep technical terms in English as usual.
- Response length: ${wantsDetail ? 'DETAILED (user explicitly requested detail)' : 'CONCISE (short, to-the-point answer)'}.`
}
