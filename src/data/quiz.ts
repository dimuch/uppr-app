/**
 * Email level quiz. These are original sample questions written for the app.
 * Replace or extend with the official UPPR test content (same shape).
 */
export type QuizQuestion = {
  id: string;
  prompt: string;
  /** Optional email snippet shown under the prompt. */
  context?: string;
  options: string[];
  correct: number;
  explanation: string;
};

export const quiz: QuizQuestion[] = [
  {
    id: 'subject',
    prompt: 'Which subject line works best?',
    context: 'You need design feedback on the new checkout flow by Thursday.',
    options: ['Question', 'Feedback needed', 'Checkout flow: your feedback by Thu?', 'URGENT!!! Please read'],
    correct: 2,
    explanation: 'Хороша тема каже, про що імейл і що потрібно від читача. Конкретика + дедлайн.',
  },
  {
    id: 'opening',
    prompt: 'Pick the strongest first line for a project update.',
    options: [
      'I hope this email finds you well.',
      'I am writing to inform you about the project.',
      'The release moved to May 12 — here is why.',
      'Just a quick update, as you may know…',
    ],
    correct: 2,
    explanation: 'Одразу до суті. Перше речення — головна новина, а не ритуальні фрази.',
  },
  {
    id: 'attachment',
    prompt: 'How do you best mention an attachment?',
    options: [
      'Please find attached the file.',
      'Attached is the Q3 budget — see tab 2 for the changes.',
      'Please kindly find the attachment enclosed herewith.',
      'I attached something, check it.',
    ],
    correct: 1,
    explanation: 'Скажіть, що саме у вкладенні і куди дивитися. Так читачу не треба гадати.',
  },
  {
    id: 'followup',
    prompt: 'No reply for a week. Which follow-up is most professional?',
    options: [
      'Not sure if you saw my last email…',
      'Just bumping this to the top of your inbox.',
      'As per my previous email, please reply.',
      'Could you confirm the vendor by Friday so we can sign on Monday?',
    ],
    correct: 3,
    explanation: 'Без натяків і пасивної агресії: чітке прохання, дедлайн і причина.',
  },
  {
    id: 'very',
    prompt: 'Replace “very important” with a stronger word.',
    options: ['really important', 'crucial', 'so important', 'super important'],
    correct: 1,
    explanation: 'Одне сильне слово краще, ніж «very» + слабке слово.',
  },
  {
    id: 'thanks',
    prompt: 'Which closing line sounds respectful, not pushy?',
    options: [
      'Thanks in advance!',
      'Thanks for considering this.',
      'Waiting for your quick reply.',
      'Thank you for your prompt action.',
    ],
    correct: 1,
    explanation: '«Thanks in advance» часто звучить як «я вже вирішив за вас». Дякуйте за увагу.',
  },
  {
    id: 'length',
    prompt: 'Your email is 400 words. What should you do first?',
    options: [
      'Add bold to key phrases',
      'Split it into two emails',
      'Put the request in the first two lines and cut the rest',
      'Send it — details show effort',
    ],
    correct: 2,
    explanation: 'KISS: головне — вгору, решту скорочуйте. Довгий імейл відкладають «на потім».',
  },
  {
    id: 'asap',
    prompt: 'What is better than “ASAP”?',
    options: ['At your earliest convenience', 'By 3 pm today', 'Urgently', 'Whenever you can, but fast'],
    correct: 1,
    explanation: 'Конкретний час знімає тиск і непорозуміння. «ASAP» кожен розуміє по-своєму.',
  },
];

export type QuizLevel = { min: number; title: string; description: string };

export const levels: QuizLevel[] = [
  { min: 0, title: 'Starter', description: 'Почніть зі статей KISS — вони дадуть швидкий результат.' },
  { min: 4, title: 'Confident', description: 'Сильна база. Прокачайте фолоапи та теми листів.' },
  { min: 7, title: 'KISS Pro', description: 'Ваші імейли читають і відповідають. Так тримати!' },
];

export const levelFor = (score: number) => [...levels].reverse().find((l) => score >= l.min)!;
