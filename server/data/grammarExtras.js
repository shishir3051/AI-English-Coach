/** Additional grammar lessons (Z + IELTS-focused topics) merged on seed */

export const GRAMMAR_EXTRAS = [
  {
    id: 'articles',
    letter: '—',
    title: 'Articles (A, An, The)',
    tags: ['ielts-writing', 'ielts-speaking', 'general'],
    explanation:
      'Articles define whether a noun is specific or general.\n\nবাংলায়: A/An অনির্দিষ্ট (any one), The নির্দিষ্ট (that one only). A + consonant sound, An + vowel sound.',
    examples: [
      'I need a pen. (any pen)',
      'She is an honest person. (vowel sound)',
      'The book on the table is mine. (specific)',
      'Education is important. (zero article – abstract)',
    ],
    quiz: [
      {
        question: 'Choose the correct article: ___ university student',
        options: ['A', 'An', 'The', 'No article'],
        answer: 0,
        explanation: 'University starts with /juː/ consonant sound → a.',
      },
      {
        question: '___ sun rises in the east.',
        options: ['A', 'An', 'The', 'No article'],
        answer: 2,
        explanation: 'Only one sun → definite the.',
      },
      {
        question: 'He bought ___ hour ago.',
        options: ['a', 'an', 'the', '—'],
        answer: 1,
        explanation: 'Hour starts with silent h, vowel sound → an.',
      },
      {
        question: 'IELTS tip: overuse of "the" is a common L1 error.',
        options: ['True', 'False'],
        answer: 0,
        explanation: 'Many learners add the where English uses zero article.',
      },
    ],
  },
  {
    id: 'conditionals',
    letter: '—',
    title: 'Conditionals (If clauses)',
    tags: ['ielts-writing', 'ielts-speaking'],
    explanation:
      'Zero: facts. First: real future. Second: unreal present. Third: unreal past.\n\nবাংলায়: If + clause → result clause. Tense changes show probability.',
    examples: [
      'Zero: If you heat ice, it melts.',
      'First: If I pass IELTS, I will study abroad.',
      'Second: If I had time, I would practise more.',
      'Third: If I had studied, I would have scored higher.',
    ],
    quiz: [
      {
        question: 'If I ___ rich, I would travel.',
        options: ['am', 'was/were', 'will be', 'have been'],
        answer: 1,
        explanation: 'Second conditional → past form were/was.',
      },
      {
        question: 'If she ___ harder, she will improve.',
        options: ['studied', 'studies', 'had studied', 'would study'],
        answer: 1,
        explanation: 'First conditional → present simple in if-clause.',
      },
      {
        question: 'Mixed: If I had known, I ___ you.',
        options: ['will help', 'would help', 'would have helped', 'help'],
        answer: 2,
        explanation: 'Past unreal condition → would have + past participle.',
      },
      {
        question: 'Which is zero conditional?',
        options: ['If it rains, cancel', 'If water boils, it evaporates', 'If I were you', 'If I had seen'],
        answer: 1,
        explanation: 'General scientific fact.',
      },
    ],
  },
  {
    id: 'relative-clauses',
    letter: '—',
    title: 'Relative Clauses (who/which/that)',
    tags: ['ielts-writing'],
    explanation:
      'Defining clauses identify the noun; non-defining add extra info with commas.\n\nবাংলায়: who (people), which (things), that (defining), where/when.',
    examples: [
      'The student who studies daily improves fast.',
      'My hometown, which is near the coast, is quiet.',
      '2020, when the pandemic started, changed education.',
      'The book that I bought is useful for IELTS.',
    ],
    quiz: [
      {
        question: 'My brother, ___ lives in Dhaka, is a doctor.',
        options: ['who', 'which', 'that', 'where'],
        answer: 0,
        explanation: 'Non-defining clause for people → who + commas.',
      },
      {
        question: 'The phone ___ I lost was expensive.',
        options: ['who', 'which/that', 'where', 'when'],
        answer: 1,
        explanation: 'Defining clause for things.',
      },
      {
        question: 'Non-defining clauses use:',
        options: ['No commas', 'Commas', 'Only that', 'Only who'],
        answer: 1,
        explanation: 'Extra information is separated by commas.',
      },
      {
        question: 'IELTS Writing: relative clauses help ___',
        options: ['shorten simple ideas only', 'add complex sentence variety', 'avoid cohesion', 'replace all verbs'],
        answer: 1,
        explanation: 'They raise grammatical range score.',
      },
    ],
  },
  {
    id: 'zero-quantifiers',
    letter: 'Z',
    title: 'Zero, Quantifiers & Agreement',
    tags: ['ielts-writing', 'general'],
    explanation:
      'Much/many, few/little, subject-verb agreement, and countable vs uncountable nouns.\n\nবাংলায়: Many + countable plural; much + uncountable. Few vs a few differ in meaning.',
    examples: [
      'Many students need much practice.',
      'There is little time left. (almost none)',
      'A few mistakes can lower your band.',
      'Neither the teacher nor the students were late.',
    ],
    quiz: [
      {
        question: 'How ___ information did you get?',
        options: ['many', 'much', 'few', 'a few'],
        answer: 1,
        explanation: 'Information is uncountable → much.',
      },
      {
        question: 'A few problems means:',
        options: ['almost no problems', 'some problems (positive)', 'too many', 'no problems'],
        answer: 1,
        explanation: 'A few = some (not negative).',
      },
      {
        question: 'Each of the candidates ___ ready.',
        options: ['are', 'is', 'were', 'have been'],
        answer: 1,
        explanation: 'Each → singular verb is.',
      },
      {
        question: 'Complete A–Z: Z covers quantifiers and ___',
        options: ['only spelling', 'subject-verb agreement', 'only punctuation', 'phonetics only'],
        answer: 1,
        explanation: 'Z lesson closes the alphabet with agreement rules.',
      },
    ],
  },
];
