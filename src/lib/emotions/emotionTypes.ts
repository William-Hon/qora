export type EmotionFamily =
  | "joy"
  | "calm"
  | "love"
  | "sadness"
  | "fear"
  | "anger"
  | "shame"
  | "guilt"
  | "confusion"
  | "numbness"
  | "neutral"
  | "growth"
  | "trust";

export type EmotionKey =
  | "elated" | "happy" | "content" | "grateful" | "proud" | "accomplished" | "confident" | "excited" | "hopeful" | "inspired" | "motivated" | "determined"
  | "peaceful" | "calm" | "relieved"
  | "loved" | "connected" | "accepted" | "safe" | "playful" | "curious" | "amazed" | "surprised" | "nostalgic" | "tender" | "compassionate"
  | "sad" | "hurt" | "disappointed" | "heartbroken" | "grieving" | "lonely" | "rejected" | "abandoned" | "longing"
  | "regretful" | "guilty" | "ashamed" | "embarrassed" | "insecure" | "inferior" | "jealous" | "envious"
  | "anxious" | "worried" | "afraid" | "panicked" | "dreadful" | "overwhelmed" | "stressed" | "burned_out" | "exhausted"
  | "numb" | "empty" | "detached" | "apathetic"
  | "angry" | "furious" | "irritated" | "frustrated" | "resentful" | "bitter" | "betrayed" | "disgusted" | "contemptuous"
  | "confused" | "conflicted" | "indecisive" | "uncertain" | "doubtful" | "skeptical"
  | "bored" | "tame" | "neutral"
  | "restless" | "stuck" | "trapped" | "impatient" | "discouraged" | "defeated" | "powerless"
  | "vulnerable" | "exposed" | "misunderstood" | "invisible" | "unappreciated" | "pressured"
  | "guilty_pleasure" | "awkward" | "resigned"
  | "courageous" | "humbled" | "trusting" | "suspicious" | "optimistic" | "melancholic";

export type EmotionPromptConfig = {
  key: EmotionKey;
  label: string;
  family: EmotionFamily;
  keywords: string[];
  phrases: string[];
  promptOptions: [string, string, string];
};
