import type { EmotionKey } from './emotionTypes';
import { EMOTION_BANK } from './emotionPromptBank';

export type DetectionResult = {
  emotionKey: EmotionKey | null;
  emotionLabel: string | null;
  confidence: number;
  selectedPrompt: string | null;
  promptIndex: number | null;
  scores: Partial<Record<EmotionKey, number>>;
  needsFallback: boolean;
  isSafetyRisk: boolean;
};

const SAFETY_KEYWORDS = [
  'kill myself', 'end my life', 'hurt myself', 'suicide', 'not safe', 'abuse', 'danger', 'someone is hurting me'
];

const NEGATION_WORDS = ['not', 'never', 'no', 'barely', 'hardly', "don't", 'dont', "doesn't", 'doesnt', "didn't", 'didnt', "wasn't", 'wasnt', "isn't", 'isnt', "aren't", 'arent'];
const INTENSIFY_WORDS = ['very', 'really', 'so', 'extremely', 'deeply', 'super', 'incredibly', 'absolutely', 'completely', 'totally', 'insanely', 'hella'];
const REDUCE_WORDS = ['kind of', 'kinda', 'slightly', 'a little', 'lowkey', 'somewhat', 'mildly'];
const CONTRAST_WORDS = ['but', 'however', 'though', 'even though'];

function normalizeText(text: string): string {
  let lower = text.toLowerCase().trim();
  // Remove punctuation except apostrophes
  lower = lower.replace(/[^\w\s']/g, ' ');
  // Collapse 3+ repeated characters down to 1 (handles soooo -> so, loool -> lol)
  lower = lower.replace(/([a-z])\1{2,}/g, '$1');
  // Collapse double spaces
  return lower.replace(/\s+/g, ' ');
}

// Generate stable deterministic prompt index
function getDeterministicPromptIndex(emotionKey: string, p1: string, p2: string, date: string): number {
  const str = `${emotionKey}-${p1}-${p2}-${date}`;
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash) % 3;
}

export function detectStrongestEmotion({
  promptOneAnswer,
  promptTwoAnswer,
}: {
  promptOneAnswer: string;
  promptTwoAnswer: string;
}): DetectionResult {
  const p1Raw = promptOneAnswer.toLowerCase();
  const p2Raw = promptTwoAnswer.toLowerCase();
  
  // 1. Safety Check
  const combinedRaw = `${p1Raw} ${p2Raw}`;
  const isSafetyRisk = SAFETY_KEYWORDS.some(kw => combinedRaw.includes(kw));
  if (isSafetyRisk) {
    return {
      emotionKey: null,
      emotionLabel: null,
      confidence: 100,
      selectedPrompt: "Are you safe right now? If not, pause journaling and contact someone you trust or emergency support immediately.",
      promptIndex: null,
      scores: {},
      needsFallback: false,
      isSafetyRisk: true
    };
  }

  // 2. Normalize Text
  const p1Norm = normalizeText(promptOneAnswer);
  const p2Norm = normalizeText(promptTwoAnswer);
  
  // Helper to split into tokens
  const tokenize = (str: string) => str.split(' ').filter(Boolean);
  const p1Tokens = tokenize(p1Norm);
  const p2Tokens = tokenize(p2Norm);

  // Initialize scores
  const scores: Partial<Record<EmotionKey, number>> = {};
  const emotionKeys = Object.keys(EMOTION_BANK) as EmotionKey[];
  emotionKeys.forEach(k => scores[k] = 0);

  const getWordContextMultiplier = (tokens: string[], index: number): number => {
    // Look back up to 3 words
    const start = Math.max(0, index - 3);
    const context = tokens.slice(start, index).join(' ');
    
    // Check negation first
    if (NEGATION_WORDS.some(neg => context.includes(neg) || (tokens[index-1] === neg))) {
      return 0.1; // heavily penalize negated emotion
    }
    
    // Check intensifiers
    if (INTENSIFY_WORDS.some(w => context.includes(w) || (tokens[index-1] === w))) {
      return 1.35;
    }
    
    // Check reducers
    if (REDUCE_WORDS.some(w => context.includes(w) || (tokens[index-1] === w))) {
      return 0.75;
    }
    
    return 1.0;
  };

  const checkContrastMultiplier = (fullString: string, matchIndex: number): number => {
    // If the match occurs after a contrast word, slightly boost it
    const beforeMatch = fullString.substring(0, matchIndex);
    if (CONTRAST_WORDS.some(cw => beforeMatch.includes(cw))) {
      return 1.2;
    }
    return 1.0;
  };

  const evaluateText = (text: string, tokens: string[], isPrompt1: boolean) => {
    const labelScore = isPrompt1 ? 10 : 5;
    const keywordScore = isPrompt1 ? 6 : 3;
    const phraseScore = isPrompt1 ? 8 : 4;
    const familyScore = isPrompt1 ? 2 : 1;

    emotionKeys.forEach(key => {
      const config = EMOTION_BANK[key];
      const labelLower = config.label.toLowerCase();

      // Check Exact Label
      const labelIndex = tokens.indexOf(labelLower);
      if (labelIndex !== -1) {
        const mult = getWordContextMultiplier(tokens, labelIndex) * checkContrastMultiplier(text, text.indexOf(labelLower));
        scores[key]! += labelScore * mult;
      }

      // Check Keywords
      config.keywords.forEach(kw => {
        const kwIndex = tokens.indexOf(kw.toLowerCase());
        if (kwIndex !== -1) {
          const mult = getWordContextMultiplier(tokens, kwIndex) * checkContrastMultiplier(text, text.indexOf(kw));
          scores[key]! += keywordScore * mult;
        }
      });

      // Check Phrases
      config.phrases.forEach(phrase => {
        const phraseLower = phrase.toLowerCase();
        if (text.includes(phraseLower)) {
          const phraseMatchIndex = text.indexOf(phraseLower);
          // approximation: finding context multiplier based on start of phrase
          const pseudoTokenIndex = text.substring(0, phraseMatchIndex).split(' ').length - 1;
          const mult = getWordContextMultiplier(tokens, Math.max(0, pseudoTokenIndex)) * checkContrastMultiplier(text, phraseMatchIndex);
          scores[key]! += phraseScore * mult;
        }
      });

      // Check Family
      if (tokens.includes(config.family)) {
        scores[key]! += familyScore;
      }
    });
  };

  evaluateText(p1Norm, p1Tokens, true);
  evaluateText(p2Norm, p2Tokens, false);

  // Determine strongest emotion
  let highestScore = 0;
  let secondHighestScore = 0;
  let topEmotion: EmotionKey | null = null;
  let secondEmotion: EmotionKey | null = null;

  for (const key of emotionKeys) {
    const s = scores[key]!;
    if (s > highestScore) {
      secondHighestScore = highestScore;
      secondEmotion = topEmotion;
      highestScore = s;
      topEmotion = key;
    } else if (s > secondHighestScore) {
      secondHighestScore = s;
      secondEmotion = key;
    }
  }

  // Tame / Neutral overrides
  const combinedNorm = `${p1Norm} ${p2Norm}`;
  const tameNeutralTriggers = ['fine', 'normal', 'tame', 'okay', 'nothing special', 'meh'];
  const isBoring = tameNeutralTriggers.some(t => combinedNorm.includes(t)) && combinedNorm.length < 50;

  // Threshold Checks
  let needsFallback = false;

  if (highestScore < 6) {
    if (isBoring) {
      // Allowed to be neutral/tame
      topEmotion = combinedNorm.includes('fine') ? 'neutral' : 'tame';
      needsFallback = false;
    } else {
      needsFallback = true;
    }
  } else if (secondHighestScore > 0 && topEmotion && secondEmotion) {
    const diffRatio = (highestScore - secondHighestScore) / highestScore;
    if (diffRatio < 0.15) {
      // Too close, check tie-breakers
      const p1HasTopLabel = p1Tokens.includes(EMOTION_BANK[topEmotion].label.toLowerCase());
      const p1HasSecondLabel = p1Tokens.includes(EMOTION_BANK[secondEmotion].label.toLowerCase());
      
      if (p1HasTopLabel && !p1HasSecondLabel) {
        needsFallback = false;
      } else if (!p1HasTopLabel && p1HasSecondLabel) {
        topEmotion = secondEmotion;
        needsFallback = false;
      } else {
        needsFallback = true;
      }
    }
  }

  // If both prompts are practically empty or gibberish
  if (p1Tokens.length === 0 && p2Tokens.length === 0) {
    needsFallback = true;
  }

  if (needsFallback || !topEmotion) {
    return {
      emotionKey: null,
      emotionLabel: null,
      confidence: highestScore,
      selectedPrompt: null,
      promptIndex: null,
      scores,
      needsFallback: true,
      isSafetyRisk: false
    };
  }

  const dateStr = new Date().toDateString();
  const promptIdx = getDeterministicPromptIndex(topEmotion, promptOneAnswer, promptTwoAnswer, dateStr);

  return {
    emotionKey: topEmotion,
    emotionLabel: EMOTION_BANK[topEmotion].label,
    confidence: highestScore,
    selectedPrompt: EMOTION_BANK[topEmotion].promptOptions[promptIdx],
    promptIndex: promptIdx,
    scores,
    needsFallback: false,
    isSafetyRisk: false
  };
}
