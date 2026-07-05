import type { EmotionKey, EmotionFamily, EmotionPromptConfig } from './emotionTypes';
import { emotionKeywords } from './emotionKeywords';

const defineEmotion = (
  key: EmotionKey,
  label: string,
  family: EmotionFamily,
  promptOptions: [string, string, string]
): EmotionPromptConfig => ({
  key,
  label,
  family,
  keywords: emotionKeywords[key].keywords,
  phrases: emotionKeywords[key].phrases,
  promptOptions,
});

export const EMOTION_BANK: Record<EmotionKey, EmotionPromptConfig> = {
  elated: defineEmotion('elated', 'Elated', 'joy', [
    'What do you want to remember about this version of your life?',
    'What about this moment feels too rare to let pass unnoticed?',
    'If this feeling could leave you one lesson, what would it be?'
  ]),
  happy: defineEmotion('happy', 'Happy', 'joy', [
    'What made today feel genuinely good, not just okay?',
    'What part of today gave you more joy than you expected?',
    'What does this happiness reveal about what you need more of?'
  ]),
  content: defineEmotion('content', 'Content', 'joy', [
    'What feels like enough right now?',
    'What are you not chasing in this moment?',
    'What part of your life feels quietly right?'
  ]),
  grateful: defineEmotion('grateful', 'Grateful', 'joy', [
    'What deserved more appreciation than you gave it at the time?',
    'What did life give you recently that you could have easily missed?',
    'Who or what made your world feel a little less heavy?'
  ]),
  proud: defineEmotion('proud', 'Proud', 'joy', [
    'What did you do that proves you are becoming who you want to be?',
    'What part of yourself earned respect today?',
    'What would past you be proud to see you handling now?'
  ]),
  accomplished: defineEmotion('accomplished', 'Accomplished', 'joy', [
    'What part of this win came from effort no one saw?',
    'What did this achievement cost you in discipline, patience, or persistence?',
    'What does this accomplishment prove that doubt tried to hide?'
  ]),
  confident: defineEmotion('confident', 'Confident', 'joy', [
    'What evidence do you have that you can trust yourself more?',
    'Where did you act like someone who knows their worth?',
    'What part of you feels stronger because of what you have survived or built?'
  ]),
  excited: defineEmotion('excited', 'Excited', 'joy', [
    'What possibility are you most afraid to admit you want?',
    'What future suddenly feels more real?',
    'What does this excitement say about the life you are moving toward?'
  ]),
  hopeful: defineEmotion('hopeful', 'Hopeful', 'joy', [
    'What changed that made the future feel more open?',
    'What are you allowing yourself to believe again?',
    'What small sign made you feel like things can still turn out well?'
  ]),
  inspired: defineEmotion('inspired', 'Inspired', 'joy', [
    'What did this feeling wake up in you?',
    'What idea, dream, or version of yourself feels alive again?',
    'What did you see or feel that made you want to become better?'
  ]),
  motivated: defineEmotion('motivated', 'Motivated', 'joy', [
    'What are you trying to prove, and who are you proving it to?',
    'What goal feels worth becoming disciplined for?',
    'What would make this motivation survive after the emotion fades?'
  ]),
  determined: defineEmotion('determined', 'Determined', 'joy', [
    'What matters enough for you to keep going when the feeling fades?',
    'What are you refusing to quit on, and why?',
    'What part of your future depends on the effort you give now?'
  ]),
  peaceful: defineEmotion('peaceful', 'Peaceful', 'calm', [
    'What helped you feel safe enough to slow down?',
    'What did your mind finally stop fighting today?',
    'What kind of environment lets you feel most like yourself?'
  ]),
  calm: defineEmotion('calm', 'Calm', 'calm', [
    'What part of your life feels stable today?',
    'What is giving you quiet reassurance right now?',
    'What would it look like to protect this calm instead of rush past it?'
  ]),
  relieved: defineEmotion('relieved', 'Relieved', 'calm', [
    'What weight just left you, and what did carrying it teach you?',
    'What fear did not come true?',
    'What did this relief reveal about how much pressure you were under?'
  ]),
  loved: defineEmotion('loved', 'Loved', 'love', [
    'What made you feel seen instead of just noticed?',
    'What did someone do that reminded you that you matter?',
    'Where did you feel cared for without having to earn it?'
  ]),
  connected: defineEmotion('connected', 'Connected', 'love', [
    'Who or what made you feel less alone today?',
    'What conversation, moment, or presence brought you closer to yourself or someone else?',
    'What kind of connection did you experience that you want more of?'
  ]),
  accepted: defineEmotion('accepted', 'Accepted', 'love', [
    'Where did you feel like you did not have to perform?',
    'Who allows you to exist without proving anything?',
    'What part of yourself felt welcome today?'
  ]),
  safe: defineEmotion('safe', 'Safe', 'love', [
    'What allowed your body or mind to finally lower its guard?',
    'What made this moment feel emotionally non-threatening?',
    'What would help you create more safety in your daily life?'
  ]),
  playful: defineEmotion('playful', 'Playful', 'joy', [
    'What part of you came back to life today?',
    'Where did you let yourself be unserious without guilt?',
    'What did this playfulness remind you that adulthood can make you forget?'
  ]),
  curious: defineEmotion('curious', 'Curious', 'growth', [
    'What question keeps pulling at your attention?',
    'What do you want to understand more deeply right now?',
    'What are you drawn to before you even know why?'
  ]),
  amazed: defineEmotion('amazed', 'Amazed', 'growth', [
    'What did this moment reveal about life that you usually forget?',
    'What felt bigger, stranger, or more beautiful than your normal routine?',
    'What reminded you that there is still more to experience?'
  ]),
  surprised: defineEmotion('surprised', 'Surprised', 'growth', [
    'What assumption did today challenge?',
    'What happened that forced you to update how you see someone, something, or yourself?',
    'What did reality show you that your expectations did not prepare you for?'
  ]),
  nostalgic: defineEmotion('nostalgic', 'Nostalgic', 'growth', [
    'What are you missing from that time, and why does it still matter?',
    'What version of yourself are you remembering right now?',
    'What did the past have that your present may be asking for?'
  ]),
  tender: defineEmotion('tender', 'Tender', 'love', [
    'What part of you feels softer than usual right now?',
    'What emotion are you holding carefully because it feels delicate?',
    'What needs gentleness instead of analysis?'
  ]),
  compassionate: defineEmotion('compassionate', 'Compassionate', 'love', [
    'Who needs your understanding right now, including yourself?',
    'Where could you replace judgment with a more honest kind of care?',
    'What pain becomes easier to understand when you look beneath the behavior?'
  ]),
  sad: defineEmotion('sad', 'Sad', 'sadness', [
    'What do you need right now that you have not been giving yourself?',
    'What feels heavier than you expected it to?',
    'What are you grieving, even if it seems too small to name?'
  ]),
  hurt: defineEmotion('hurt', 'Hurt', 'sadness', [
    'What did this make you believe about yourself, and is that belief fair?',
    'What part of this pain feels personal?',
    'What did you need from someone that you did not receive?'
  ]),
  disappointed: defineEmotion('disappointed', 'Disappointed', 'sadness', [
    'What expectation did reality fail to meet?',
    'What did you hope would happen instead?',
    'What does this disappointment reveal about what you truly wanted?'
  ]),
  heartbroken: defineEmotion('heartbroken', 'Heartbroken', 'sadness', [
    'What did you lose that you are still trying to make sense of?',
    'What part of this ending still does not feel real?',
    'What love, hope, or future are you mourning?'
  ]),
  grieving: defineEmotion('grieving', 'Grieving', 'sadness', [
    'What do you miss most, and what does that say about what mattered?',
    'What memory keeps returning because it still needs space?',
    'What are you learning to carry instead of fix?'
  ]),
  lonely: defineEmotion('lonely', 'Lonely', 'sadness', [
    'What kind of connection are you missing most right now?',
    'Do you feel alone because no one is around, or because no one really understands you?',
    'What part of yourself are you tired of keeping to yourself?'
  ]),
  rejected: defineEmotion('rejected', 'Rejected', 'sadness', [
    'What did this rejection make you question about your worth?',
    'What story are you telling yourself because someone did not choose you?',
    'What would still be true about you even if this rejection never changes?'
  ]),
  abandoned: defineEmotion('abandoned', 'Abandoned', 'sadness', [
    'Where did you need someone to stay, but they did not?',
    'What absence is hurting more than you expected?',
    'What part of you still waits for someone to show up differently?'
  ]),
  longing: defineEmotion('longing', 'Longing', 'sadness', [
    'What are you reaching for that still feels out of reach?',
    'What desire keeps returning no matter how much you try to quiet it?',
    'What does this longing reveal about what your life is missing?'
  ]),
  regretful: defineEmotion('regretful', 'Regretful', 'guilt', [
    'What can this regret teach you without becoming a punishment?',
    'What would you do differently if you could return with what you know now?',
    'What lesson deserves to stay, and what guilt deserves to leave?'
  ]),
  guilty: defineEmotion('guilty', 'Guilty', 'guilt', [
    'Is this guilt asking you to repair something, or are you using it to punish yourself?',
    'What value did you feel like you violated?',
    'What would accountability look like without self-hatred?'
  ]),
  ashamed: defineEmotion('ashamed', 'Ashamed', 'shame', [
    'What part of yourself are you judging the harshest right now?',
    'What are you afraid this moment says about who you are?',
    'What would you want someone you love to understand if they felt this shame?'
  ]),
  embarrassed: defineEmotion('embarrassed', 'Embarrassed', 'shame', [
    'What are you afraid people now think about you?',
    'What are you making this moment mean about your identity?',
    'How much of this embarrassment comes from reality, and how much comes from imagined judgment?'
  ]),
  insecure: defineEmotion('insecure', 'Insecure', 'fear', [
    'Who or what are you letting define whether you are enough?',
    'What standard are you silently trying to meet?',
    'What part of you is asking for evidence, and what part is asking for compassion?'
  ]),
  inferior: defineEmotion('inferior', 'Inferior', 'fear', [
    'What standard are you measuring yourself against, and is it even yours?',
    'Who are you comparing yourself to, and what are you ignoring about your own path?',
    'What would change if you stopped treating comparison as truth?'
  ]),
  jealous: defineEmotion('jealous', 'Jealous', 'fear', [
    'What are you afraid someone else has that you do not?',
    'What reassurance are you looking for underneath this jealousy?',
    'What fear of loss, replacement, or inadequacy is being triggered?'
  ]),
  envious: defineEmotion('envious', 'Envious', 'fear', [
    'What does their life reveal about something you want for your own?',
    'What exactly are you envious of: the result, freedom, attention, confidence, or identity?',
    'How could this envy become direction instead of self-attack?'
  ]),
  anxious: defineEmotion('anxious', 'Anxious', 'fear', [
    'What are you trying to control that may not fully be yours to control?',
    'What is the difference between what you know and what you are assuming?',
    'What outcome are you mentally rehearsing, and what would help you return to the present?'
  ]),
  worried: defineEmotion('worried', 'Worried', 'fear', [
    'What outcome are you afraid of, and what evidence do you actually have?',
    'What are you preparing for emotionally before it has happened?',
    'What would you tell yourself if you had to be honest, not fearful?'
  ]),
  afraid: defineEmotion('afraid', 'Afraid', 'fear', [
    'What feels unsafe right now, and what would help you feel even slightly safer?',
    'What is this fear trying to protect you from?',
    'Is this danger immediate, possible, remembered, or imagined?'
  ]),
  panicked: defineEmotion('panicked', 'Panicked', 'fear', [
    'What is the immediate next thing that would help you return to the present?',
    'What does your body need before your mind tries to solve anything?',
    'What is one fact you can hold onto right now?'
  ]),
  dreadful: defineEmotion('dreadful', 'Dreadful', 'fear', [
    'What future are you already suffering through before it has happened?',
    'What are you assuming will go wrong?',
    'What would change if you prepared without emotionally living in the worst-case scenario?'
  ]),
  overwhelmed: defineEmotion('overwhelmed', 'Overwhelmed', 'fear', [
    'What is asking more from you than you currently have to give?',
    'What needs to be reduced, delayed, delegated, or dropped?',
    'What would make today manageable instead of perfect?'
  ]),
  stressed: defineEmotion('stressed', 'Stressed', 'fear', [
    'What feels urgent, and what is actually important?',
    'What pressure is real, and what pressure are you adding yourself?',
    'What would become lighter if you stopped trying to handle everything at once?'
  ]),
  burned_out: defineEmotion('burned_out', 'Burned out', 'numbness', [
    'Where have you been performing strength while quietly running out of fuel?',
    'What have you been forcing yourself to care about?',
    'What part of you needs recovery, not discipline?'
  ]),
  exhausted: defineEmotion('exhausted', 'Exhausted', 'numbness', [
    'What part of you needs recovery, not more discipline?',
    'What are you asking from yourself that you currently do not have the capacity to give?',
    'What kind of rest would actually restore you instead of just distract you?'
  ]),
  numb: defineEmotion('numb', 'Numb', 'numbness', [
    'If numbness could speak, what would it be protecting you from feeling?',
    'When did you first notice yourself emotionally shutting down?',
    'What feeling might be underneath the absence of feeling?'
  ]),
  empty: defineEmotion('empty', 'Empty', 'numbness', [
    'What used to fill you that no longer does?',
    'What part of your life feels hollow, even if it looks fine from the outside?',
    'What are you missing that achievement, distraction, or routine cannot replace?'
  ]),
  detached: defineEmotion('detached', 'Detached', 'numbness', [
    'What have you been distancing yourself from emotionally?',
    'What feels easier to observe than to feel?',
    'What connection, responsibility, or pain are you keeping at arm’s length?'
  ]),
  apathetic: defineEmotion('apathetic', 'Apathetic', 'numbness', [
    'What have you stopped caring about because caring felt too costly?',
    'What would matter to you again if you had more energy?',
    'Is this apathy protecting you from disappointment?'
  ]),
  angry: defineEmotion('angry', 'Angry', 'anger', [
    'What boundary feels crossed?',
    'What did this anger protect you from feeling first?',
    'What truth are you trying not to soften?'
  ]),
  furious: defineEmotion('furious', 'Furious', 'anger', [
    'What truth are you afraid you might express too harshly?',
    'What has been building inside you longer than this moment?',
    'What would your anger say if it could speak clearly instead of destructively?'
  ]),
  irritated: defineEmotion('irritated', 'Irritated', 'anger', [
    'What small thing is bothering you because it represents something bigger?',
    'What pattern are you tired of tolerating?',
    'What is this irritation pointing to that you have not addressed?'
  ]),
  frustrated: defineEmotion('frustrated', 'Frustrated', 'anger', [
    'What feels harder than it should be right now?',
    'What outcome are you trying to force that keeps resisting you?',
    'Is this frustration about the situation, another person, or yourself?'
  ]),
  resentful: defineEmotion('resentful', 'Resentful', 'anger', [
    'What have you been giving that you secretly wish someone would notice?',
    'Where have you said yes while feeling no?',
    'What unspoken expectation is turning into resentment?'
  ]),
  bitter: defineEmotion('bitter', 'Bitter', 'anger', [
    'What pain has gone unspoken for too long?',
    'What do you feel life, someone else, or the past still owes you?',
    'What hurt hardened into judgment because it never got resolved?'
  ]),
  betrayed: defineEmotion('betrayed', 'Betrayed', 'anger', [
    'What trust was broken, and what did that trust mean to you?',
    'What did you believe was safe that no longer feels safe?',
    'What part of the betrayal hurts more: the action, the lie, or what it revealed?'
  ]),
  disgusted: defineEmotion('disgusted', 'Disgusted', 'anger', [
    'What value or standard did this violate for you?',
    'What made this feel unacceptable?',
    'What do you need distance from, and why?'
  ]),
  contemptuous: defineEmotion('contemptuous', 'Contemptuous', 'anger', [
    'What are you judging in them that you refuse to tolerate in your own life?',
    'What does their behavior represent to you?',
    'Is this contempt protecting a value, or blocking understanding?'
  ]),
  confused: defineEmotion('confused', 'Confused', 'confusion', [
    'What are the two strongest truths pulling you in different directions?',
    'What do you know for sure, even if the full answer is unclear?',
    'What answer are you secretly hoping is true?'
  ]),
  conflicted: defineEmotion('conflicted', 'Conflicted', 'confusion', [
    'What does each side of you want, and what is each side trying to protect?',
    'What value is competing with another value right now?',
    'What choice would feel honest, even if it is not easy?'
  ]),
  indecisive: defineEmotion('indecisive', 'Indecisive', 'confusion', [
    'What are you afraid this decision will say about you?',
    'What consequence are you most afraid to live with?',
    'Are you choosing between options, or avoiding the responsibility of choosing?'
  ]),
  uncertain: defineEmotion('uncertain', 'Uncertain', 'confusion', [
    'What do you know for sure, even if everything else feels unclear?',
    'What information are you missing, and what fear are you adding?',
    'What would you do next if you did not need complete certainty?'
  ]),
  doubtful: defineEmotion('doubtful', 'Doubtful', 'confusion', [
    'What belief are you questioning, and why now?',
    'What once felt solid but now feels unstable?',
    'Is this doubt warning you, testing you, or protecting you from risk?'
  ]),
  skeptical: defineEmotion('skeptical', 'Skeptical', 'confusion', [
    'What part of this situation has not earned your trust yet?',
    'What pattern are you noticing that deserves attention?',
    'What would need to be true for you to feel more certain?'
  ]),
  bored: defineEmotion('bored', 'Bored', 'numbness', [
    'Does life feel quiet because it is stable, or quiet because you are avoiding something?',
    'What are you craving more of: novelty, challenge, connection, or meaning?',
    'What have you outgrown that you keep repeating?'
  ]),
  tame: defineEmotion('tame', 'Tame', 'neutral', [
    'What part of today would you normally overlook, but probably should not?',
    'What ordinary moment quietly shaped your mood today?',
    'What would you notice if you believed even an average day mattered?'
  ]),
  neutral: defineEmotion('neutral', 'Neutral', 'neutral', [
    'What small signal did your life give you today?',
    'What felt neither good nor bad, but still worth noticing?',
    'What does your mood say when it is not trying to be dramatic?'
  ]),
  restless: defineEmotion('restless', 'Restless', 'growth', [
    'What part of your life feels too small for who you are becoming?',
    'What are you craving that your current routine does not give you?',
    'Are you restless because you need change, or because you are avoiding stillness?'
  ]),
  stuck: defineEmotion('stuck', 'Stuck', 'growth', [
    'What is one part of this situation that is still within your control?',
    'What keeps repeating, and what role do you play in the loop?',
    'What would a 1% shift look like?'
  ]),
  trapped: defineEmotion('trapped', 'Trapped', 'growth', [
    'What would freedom look like in this situation, even in a small form?',
    'What choice do you still have, even if it is limited?',
    'What belief is making this situation feel more permanent than it may be?'
  ]),
  impatient: defineEmotion('impatient', 'Impatient', 'growth', [
    'What are you rushing toward, and what are you afraid will happen if you wait?',
    'What timeline are you forcing yourself to meet?',
    'What would patience give you that urgency cannot?'
  ]),
  discouraged: defineEmotion('discouraged', 'Discouraged', 'growth', [
    'What made progress feel less possible today?',
    'What evidence are you ignoring that you have moved forward before?',
    'What would help you continue without needing to feel inspired?'
  ]),
  defeated: defineEmotion('defeated', 'Defeated', 'growth', [
    'What are you treating as final that may only be temporary?',
    'What part of you still wants to try, even quietly?',
    'What would you say to yourself if this was a setback, not a verdict?'
  ]),
  powerless: defineEmotion('powerless', 'Powerless', 'growth', [
    'Where do you still have agency, even if it is smaller than you want?',
    'What choice remains available to you right now?',
    'What can you influence, even if you cannot control the whole outcome?'
  ]),
  vulnerable: defineEmotion('vulnerable', 'Vulnerable', 'fear', [
    'What truth are you scared someone would mishandle if they saw it?',
    'What part of you wants to be known but fears being judged?',
    'What would make vulnerability feel safer?'
  ]),
  exposed: defineEmotion('exposed', 'Exposed', 'fear', [
    'What part of you feels too visible right now?',
    'What are you afraid people can see through?',
    'What would help you feel protected without hiding completely?'
  ]),
  misunderstood: defineEmotion('misunderstood', 'Misunderstood', 'confusion', [
    'What do you wish someone could understand without you having to explain it perfectly?',
    'What part of your experience feels impossible to translate?',
    'What are people missing when they judge this from the outside?'
  ]),
  invisible: defineEmotion('invisible', 'Invisible', 'growth', [
    'Where do you feel unseen, and what would being seen actually look like?',
    'What effort, pain, or growth do you wish someone noticed?',
    'What part of you has been present but unrecognized?'
  ]),
  unappreciated: defineEmotion('unappreciated', 'Unappreciated', 'growth', [
    'What effort are you tired of having ignored?',
    'Where are you giving more than people realize?',
    'What would genuine appreciation look like to you?'
  ]),
  pressured: defineEmotion('pressured', 'Pressured', 'growth', [
    'What expectation are you carrying that may not belong to you?',
    'Who or what are you trying not to disappoint?',
    'What would you choose if approval was not part of the equation?'
  ]),
  guilty_pleasure: defineEmotion('guilty_pleasure', 'Guilty pleasure', 'guilt', [
    'What part of this joy are you afraid to fully own?',
    'Why does enjoying this feel like something you need to justify?',
    'What would change if you let yourself like what you like without apology?'
  ]),
  awkward: defineEmotion('awkward', 'Awkward', 'shame', [
    'What are you making this moment mean about yourself?',
    'What would you think if someone else had handled the same moment this way?',
    'What part of this awkwardness is real, and what part is overthinking?'
  ]),
  resigned: defineEmotion('resigned', 'Resigned', 'growth', [
    'What have you accepted that you may actually need to challenge?',
    'Where have you confused peace with giving up?',
    'What would you want if you believed change was still possible?'
  ]),
  courageous: defineEmotion('courageous', 'Courageous', 'growth', [
    'What did you do despite fear being present?',
    'What part of today required more bravery than people would realize?',
    'What does this courage prove about what you are capable of facing?'
  ]),
  humbled: defineEmotion('humbled', 'Humbled', 'growth', [
    'What did today remind you that you still need to learn?',
    'Where did life correct your ego without destroying your worth?',
    'What did this moment teach you about growth, limits, or perspective?'
  ]),
  trusting: defineEmotion('trusting', 'Trusting', 'love', [
    'What allowed you to let your guard down?',
    'What made this person, moment, or choice feel safe enough to believe in?',
    'What does trust feel like when it is earned, not forced?'
  ]),
  suspicious: defineEmotion('suspicious', 'Suspicious', 'fear', [
    'What pattern are you noticing that you do not want to ignore?',
    'What feels off, even if you cannot fully explain it yet?',
    'What would you need to see before you could trust this?'
  ]),
  optimistic: defineEmotion('optimistic', 'Optimistic', 'joy', [
    'What possibility feels worth believing in right now?',
    'What future feels more possible than it did before?',
    'What are you choosing to see as evidence that things can improve?'
  ]),
  melancholic: defineEmotion('melancholic', 'Melancholic', 'sadness', [
    'What beauty and sadness are existing together in you right now?',
    'What feels meaningful precisely because it cannot last forever?',
    'What are you holding that is both painful and precious?'
  ])
};
