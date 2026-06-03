import express from 'express';
import GrammarLesson from '../models/GrammarLesson.js';
import { GRAMMAR_EXTRAS } from '../data/grammarExtras.js';

const router = express.Router();

async function ensureGrammarSeeded() {
  let count = await GrammarLesson.countDocuments();
  if (count === 0) {
    await GrammarLesson.insertMany(INITIAL_GRAMMAR_SYLLABUS);
    count = await GrammarLesson.countDocuments();
  }
  for (const extra of GRAMMAR_EXTRAS) {
    const exists = await GrammarLesson.findOne({ id: extra.id });
    if (!exists) await GrammarLesson.create(extra);
  }
}

// The 25 lessons to seed the database if it is empty
const INITIAL_GRAMMAR_SYLLABUS = [
  {
    id: "introduction-numbers",
    letter: "A",
    title: "Introduction and the Numbers",
    explanation: "English Grammar is the set of structural rules governing the composition of clauses, phrases, and words. \n\nবাংলায়: ইংরেজি ব্যাকরণ (English Grammar) হলো এমন কিছু নিয়মাবলী যা সঠিক ও সুন্দরভাবে ইংরেজি লিখতে, পড়তে ও বলতে সাহায্য করে।\n\nNumber (বচন) বলতে কোনো ব্যক্তি, বস্তু বা প্রাণীর সংখ্যাকে বোঝায়। এটি মূলত ২ প্রকার:\n1. Singular Number (একবচন): যা দ্বারা একটিমাত্র ব্যক্তি, বস্তু বা প্রাণীকে বোঝায়।\n2. Plural Number (বহুবচন): যা দ্বারা একের অধিক ব্যক্তি, বস্তু বা প্রাণীকে বোঝায়।\n\nসাধারণত Singular Noun-এর শেষে s/es যোগ করে Plural করা হয়। যেমন: Boy -> Boys, Pen -> Pens.",
    examples: [
      "Singular: The boy plays football. (বালকটি ফুটবল খেলে - একজন)",
      "Plural: The boys play football. (বালকেরা ফুটবল খেলে - একাধিক)",
      "Singular: She has a book. (তার একটি বই আছে)",
      "Plural: She has three books. (তার তিনটি বই আছে)"
    ],
    quiz: [
      {
        question: "What is the plural form of the word 'Knife'?",
        options: ["Knifes", "Knives", "Knifess"],
        answer: 1,
        explanation: "যেসব Noun-এর শেষে f বা fe থাকে, তাদের Plural করতে f/fe বাদ দিয়ে ves যোগ করতে হয়। যেমন: Knife -> Knives, Life -> Lives."
      },
      {
        question: "Which of the following is always used as plural?",
        options: ["Furniture", "People", "Information"],
        answer: 1,
        explanation: "'People' শব্দটি সমষ্টিবাচক এবং এটি সর্বদা বহুবচন (Plural) হিসেবে ব্যবহৃত হয়। অন্যদিকে Furniture ও Information আনকাউন্টেবল নাউন।"
      }
    ]
  },
  {
    id: "gender",
    letter: "B",
    title: "Gender (লিঙ্গ)",
    explanation: "Gender indicates whether a noun or pronoun is male, female, both, or inanimate. \n\nবাংলায়: যে শব্দ (Noun বা Pronoun) দ্বারা কোনো ব্যক্তি, বস্তু বা প্রাণীর পুরুষ, স্ত্রী, ক্লীব বা উভয় লিঙ্গকে নির্দেশ করা হয়, তাকে Gender বা লিঙ্গ বলে।\n\nGender মূলত ৪ প্রকার:\n1. Masculine Gender (পুংলিঙ্গ): যা পুরুষ জাতিকে বোঝায়। যেমন: Father, King, Boy.\n2. Feminine Gender (স্ত্রীলিঙ্গ): যা স্ত্রী জাতিকে বোঝায়। যেমন: Mother, Queen, Girl.\n3. Common Gender (উভয়লিঙ্গ): যা পুরুষ ও স্ত্রী উভয়কেই বোঝাতে পারে। যেমন: Baby, Friend, Doctor, Teacher.\n4. Neuter Gender (ক্লীবলিঙ্গ): যা জড় বস্তু বা অচেতন্য পদার্থকে বোঝায়। যেমন: Book, Pen, Table, Chair.",
    examples: [
      "Masculine: He is a gentleman. (তিনি একজন ভদ্রলোক)",
      "Feminine: She is a polite lady. (তিনি একজন ভদ্রমহিলা)",
      "Common: The baby is crying. (শিশু বা বাচ্চাটি কাঁদছে - ছেলে নাকি মেয়ে নির্দিষ্ট নয়)",
      "Neuter: The computer is very fast. (কম্পিউটারটি অনেক দ্রুতগতির - জড় বস্তু)"
    ],
    quiz: [
      {
        question: "What is the feminine gender of 'Uncle'?",
        options: ["Aunt", "Sister", "Niece"],
        answer: 0,
        explanation: "'Uncle'-এর স্ত্রীলিঙ্গ (Feminine) হলো 'Aunt' (চাচী/মামী/ফুফু)।"
      },
      {
        question: "Identify the Neuter Gender from the options below:",
        options: ["Parent", "Host", "Mobile Phone"],
        answer: 2,
        explanation: "'Parent' হলো Common Gender, 'Host' হলো Masculine, এবং 'Mobile Phone' হলো একটি জড় বস্তু বা Neuter Gender।"
      }
    ]
  },
  {
    id: "person",
    letter: "C",
    title: "Person (ব্যক্তি)",
    explanation: "Person shows the relationship between the speaker, the audience, and others mentioned in a sentence. \n\nবাংলায়: সেন্টেন্সে যে সকল Noun বা Pronoun-কে আশ্রয় করে ক্রিয়া (Verb) সম্পন্ন হয়, তাদের Person বা পুরুষ বলে।\n\nPerson মূলত ৩ প্রকার:\n1. First Person (উত্তম পুরুষ): বক্তা যখন নিজের বা নিজেদের সম্পর্কে বলে। যেমন: I, We, Me, Us, My, Our.\n2. Second Person (মধ্যম পুরুষ): বক্তা যখন সামনে উপস্থিত শ্রোতাকে উদ্দেশ্য করে কিছু বলে। যেমন: You, Your, Yours.\n3. Third Person (প্রথম পুরুষ): বক্তা ও শ্রোতা ছাড়া অন্য কোনো ব্যক্তি বা বস্তু সম্পর্কে বলা হলে। যেমন: He, She, They, It, Shishir, Book, Pen.",
    examples: [
      "First Person: I want to learn English. (আমি ইংরেজি শিখতে চাই)",
      "Second Person: You should join the class. (তোমার ক্লাসে যোগ দেওয়া উচিত)",
      "Third Person: She plays the violin beautifully. (সে খুব সুন্দর ভায়োলিন বাজায়)"
    ],
    quiz: [
      {
        question: "Which category does 'They' belong to?",
        options: ["First Person", "Second Person", "Third Person"],
        answer: 2,
        explanation: "'They' (তারা) হলো Third Person Plural Number, কারণ এটি বক্তা বা শ্রোতা নিজেরা নয়, বরং অন্য কোনো তৃতীয় পক্ষের কথা বলছে।"
      },
      {
        question: "If the subject is Third Person Singular (e.g. He/She/It), what must be added to a present simple verb?",
        options: ["s or es", "ing", "ed"],
        answer: 0,
        explanation: "Present Simple Tense-এ সাবজেক্ট যদি Third Person Singular Number হয়, তবে মূল ভার্বের শেষে 's' বা 'es' যোগ করতে হয়। যেমন: He runs, She goes."
      }
    ]
  },
  {
    id: "tense",
    letter: "D",
    title: "Tense (কাল)",
    explanation: "Tense is the form taken by a verb to show the time of an action or state of being. \n\nবাংলায়: কোনো কাজ বা অ্যাকশন কখন সংঘটিত হচ্ছে বা হয়েছে বা হবে, তার সময়কে Tense বা কাল বলে। Tense মূলত ৩ প্রকার, এবং প্রত্যেকটি আবার ৪ ভাগে বিভক্ত (মোট ১২ প্রকার):\n\n1. Present Tense (বর্তমান কাল): Indefinite (করি), Continuous (করছি), Perfect (করেছি), Perfect Continuous (ধরে করছি)।\n2. Past Tense (অতীত কাল): Indefinite (করেছিলাম), Continuous (করছিলাম), Perfect (করেছিলাম পূর্বে), Perfect Continuous (ধরে করছিলাম)।\n3. Future Tense (ভবিষ্যত কাল): Indefinite (করব), Continuous (করতে থাকব), Perfect (করে থাকব), Perfect Continuous (ধরে করতে থাকব)।",
    examples: [
      "Present Simple: I eat rice. (আমি ভাত খাই)",
      "Present Continuous: I am eating rice. (আমি ভাত খাচ্ছি)",
      "Present Perfect: I have eaten rice. (আমি ভাত খেয়েছি)",
      "Past Simple: I ate rice. (আমি ভাত খেয়েছিলাম)",
      "Future Simple: I will eat rice. (আমি ভাত খাব)"
    ],
    quiz: [
      {
        question: "Identify the tense: 'She has been writing a letter for two hours.'",
        options: ["Present Perfect", "Present Perfect Continuous", "Past Continuous"],
        answer: 1,
        explanation: "কাজটি অতীতে শুরু হয়ে বর্তমানেও চলছে (have/has + been + verb-ing + for/since), তাই এটি Present Perfect Continuous Tense."
      },
      {
        question: "Complete the sentence with correct past form: 'We ___ (visit) Cox's Bazar last year.'",
        options: ["visited", "have visited", "had visited"],
        answer: 0,
        explanation: "বাক্যে 'last year' থাকার কারণে এটি অতীতে নির্দিষ্ট সময় বোঝায়, তাই Past Simple Tense (visited) ব্যবহার করতে হবে।"
      }
    ]
  },
  {
    id: "rewrite-verb",
    letter: "E",
    title: "Re-write Verb (Right Form of Verbs)",
    explanation: "Re-write Verb (Right Form of Verbs) refers to using the correct grammatical form of a verb based on subject, tense, and contextual structures. \n\nবাংলায়: রাইট ফর্ম অফ ভার্বস (Right Form of Verbs) বলতে বোঝায় সাবজেক্টের সংখ্যা ও পুরুষ (Subject-Verb Agreement), টেন্সের নিয়মাবলী ও সেন্টেন্সের বিশেষ কাঠামোর ওপর ভিত্তি করে ভার্বের সঠিক রূপ ব্যবহার করা।\n\nপ্রয়োজনীয় নিয়মাবলী:\n1. Universal Truth (চিরন্তন সত্য) বা Habitual Fact (অভ্যাসগত কাজ) হলে বাক্যটি সর্বদাই Present Simple Tense হবে।\n2. Modal Auxiliaries (can, could, may, might, must, should, would, will, shall) এর পরে সবসময় ভার্বের Base Form (মূল রূপ) বসে।\n3. Just, just now, already, recently, lately থাকলে সাধারণত Present Perfect Tense হয়।",
    examples: [
      "Incorrect: The sun rise in the east. -> Correct: The sun rises in the east. (চিরন্তন সত্য)",
      "Incorrect: You should to study now. -> Correct: You should study now. (মডালের পর to বসে না)",
      "Incorrect: He has already went. -> Correct: He has already gone. (has এর পর past participle)"
    ],
    quiz: [
      {
        question: "Identify the correct sentence:",
        options: [
          "Neither he nor I is responsible.",
          "Neither he nor I am responsible.",
          "Neither he nor I are responsible."
        ],
        answer: 1,
        explanation: "Neither... nor বা Either... or দ্বারা দুটি ভিন্ন Person এর সাবজেক্ট যুক্ত হলে ভার্বটি তার সবচেয়ে কাছের সাবজেক্ট অনুযায়ী বসে। এখানে 'I' এর সাথে 'am' বসবে।"
      },
      {
        question: "Fill in the blank: 'It is high time we ___ (start) the project.'",
        options: ["start", "started", "starting"],
        answer: 1,
        explanation: "It is time / It is high time এর পরে নতুন ক্লজ শুরু হলে ভার্বটি সবসময় Past Simple (V2) হয়।"
      }
    ]
  },
  {
    id: "case",
    letter: "F",
    title: "Case (কারক)",
    explanation: "Case is the grammatical relation of a noun or pronoun to other words in a sentence. \n\nবাংলায়: বাক্যের অন্তর্গত Noun বা Pronoun-এর সাথে অন্যান্য পদের (বিশেষ করে ক্রিয়াপদের) যে সম্পর্ক তৈরি হয়, তাকে Case বা কারক বলে।\n\nCase মূলত ৪ প্রকার:\n1. Nominative Case (কর্তৃকারক): যখন কোনো Noun বা Pronoun বাক্যের সাবজেক্ট বা কর্তা হিসেবে কাজ করে। যেমন: Shishir is studying.\n2. Objective Case (कर्मकारक): যখন Noun/Pronoun ক্রিয়া বা প্রিপজিশন এর অবজেক্ট বা কর্ম হিসেবে কাজ করে। যেমন: I like him.\n3. Possessive Case (সম্বন্ধ পদ): যা অধিকার বা মালিকানা নির্দেশ করে। যেমন: Shishir's book, His pen.\n4. Vocative Case (সম্বোধন পদ): কাউকে সম্বোধন করে ডাকার জন্য ব্যবহৃত শব্দ। যেমন: Listen to me, Rohit.",
    examples: [
      "Nominative: The teacher explained the rule. (শিক্ষক বুঝিয়ে দিলেন - এখানে 'Teacher' কর্তা)",
      "Objective: She gave me a beautiful gift. ('Me' এবং 'Gift' কর্ম)",
      "Possessive: This is Gaziur's project. (এটি গাজীউরের প্রজেক্ট - মালিকানা)",
      "Vocative: Boys, play quietly. (বালকেরা, শান্তভাবে খেলো - সম্বোধন)"
    ],
    quiz: [
      {
        question: "In the sentence 'This is my brother's laptop', 'brother's' represents which case?",
        options: ["Nominative Case", "Objective Case", "Possessive Case"],
        answer: 2,
        explanation: "'brother's' শব্দটি মালিকানা নির্দেশ করছে (ভাইয়ের ল্যাপটপ), তাই এটি Possessive Case।"
      },
      {
        question: "What is the Objective form of the pronoun 'Who'?",
        options: ["Whose", "Whom", "Who"],
        answer: 1,
        explanation: "Who হলো Nominative Form, Whom হলো Objective Form এবং Whose হলো Possessive Form।"
      }
    ]
  },
  {
    id: "sentence-mood",
    letter: "G",
    title: "Kind of Sentence and Mood",
    explanation: "Sentences express thoughts in 5 functions, while Mood represents the verb's manner of expressing attitude. \n\nবাংলায়: বাক্য বা Sentence অর্থানুসারে ৫ প্রকার:\n1. Assertive (বিবৃতিমূলক): সাধারণ বক্তব্য।\n2. Interrogative (প্রশ্নবোধক): প্রশ্ন জিজ্ঞাসা।\n3. Imperative (আদেশ/অনুরোধ/উপদেশ): আদেশ বা উপদেশ।\n4. Optative (ইচ্ছা/প্রার্থনাসূচক): মনস্কামনা বা দোয়া।\n5. Exclamatory (আবেগসূচক): তীব্র দুঃখ বা আনন্দ প্রকাশ।\n\nMood (ক্রিয়ার ভাব) ক্রিয়া সম্পন্ন হওয়ার ধরণ বা বক্তার দৃষ্টিভঙ্গি প্রকাশ করে:\n- Indicative Mood (বাস্তব নির্দেশক): He goes to school.\n- Imperative Mood (আদেশসূচক): Do it now!\n- Subjunctive Mood (কাল্পনিক বা শর্তসাপেক্ষ): I wish I were a king.",
    examples: [
      "Assertive: The sky is blue. (আকাশটি নীল)",
      "Interrogative: Where are you from? (তোমার বাড়ি কোথায়?)",
      "Imperative: Please shut the door. (দয়া করে দরজাটি বন্ধ করো)",
      "Subjunctive Mood: If he were here, he would help. (সে এখানে থাকলে সাহায্য করতো - অসম্ভব কল্পনা)"
    ],
    quiz: [
      {
        question: "What kind of sentence is: 'May Almighty bless you with good health'?",
        options: ["Imperative", "Optative", "Exclamatory"],
        answer: 1,
        explanation: "যে বাক্য দ্বারা মনের ইচ্ছা, প্রার্থনা, বা আশীর্বাদ প্রকাশ করা হয়, তাকে Optative Sentence বলে।"
      },
      {
        question: "Identify the Subjunctive Mood sentence from the options below:",
        options: [
          "He plays cricket on Sundays.",
          "I suggest that he study tonight.",
          "Close the window immediately."
        ],
        answer: 1,
        explanation: "'I suggest that he study' সেন্টেন্সে 'study' হলো Subjunctive (Base Form), কারণ এটি কোনো জোরালো পরামর্শ বা প্রস্তাব বোঝাচ্ছে।"
      }
    ]
  },
  {
    id: "voice",
    letter: "H",
    title: "Voice (বাচ্য)",
    explanation: "Voice is the form of a verb indicating whether the subject performs the action or receives it. \n\nবাংলায়: ভয়েস (Voice) বা বাচ্য হলো ভার্বের এমন রূপ যা দ্বারা সাবজেক্ট নিজে কাজটি সম্পন্ন করছে নাকি অন্যের কাজের ফল ভোগ করছে তা প্রকাশ পায়। এটি ২ প্রকার:\n\n1. Active Voice (কর্তৃবাচ্য): কর্তা বা সাবজেক্ট নিজেই সক্রিয়ভাবে কাজটি করে।\n   গঠন: Subject + Verb + Object.\n2. Passive Voice (কর্মবাচ্য): অবজেক্টকে প্রাধান্য দিয়ে কর্তার কাজটি অন্যের দ্বারা সম্পন্ন হওয়া বোঝায়।\n   গঠন: Object as Subject + Auxiliary Verb (Tense অনুযায়ী) + V3 (Past Participle) + by + Subject as Object.",
    examples: [
      "Active: She writes a poem. (সে একটি কবিতা লেখে)",
      "Passive: A poem is written by her. (একটি কবিতা তার দ্বারা লিখিত হয়)",
      "Active: They were building a house. (তারা একটি বাড়ি বানাচ্ছিল)",
      "Passive: A house was being built by them. (তাদের দ্বারা একটি বাড়ি তৈরি করা হচ্ছিল)"
    ],
    quiz: [
      {
        question: "Convert to passive: 'Who broke this glass?'",
        options: [
          "By whom was this glass broken?",
          "Who was this glass broken by?",
          "By whom did this glass break?"
        ],
        answer: 0,
        explanation: "'Who' যুক্ত Active বাক্যকে Passive করার সময় প্রথমে 'By whom' বসে, এরপর Tense অনুযায়ী Auxiliary Verb বসে এবং মূল ভার্বের Past Participle হয়।"
      },
      {
        question: "Identify the correct passive voice of: 'She has completed the tasks.'",
        options: [
          "The tasks were completed by her.",
          "The tasks have been completed by her.",
          "The tasks has been completed by her."
        ],
        answer: 1,
        explanation: "Present Perfect-এর Passive করতে have/has + been বসে। যেহেতু 'Tasks' প্লুরাল, তাই 'have been completed' সঠিক রূপ।"
      }
    ]
  },
  {
    id: "narration",
    letter: "I",
    title: "Narration (উক্তি পরিবর্তন)",
    explanation: "Narration is the act of reporting the words of a speaker. \n\nবাংলায়: কোনো বক্তার বক্তব্য প্রকাশ করার প্রক্রিয়াকে Narration বা উক্তি পরিবর্তন বলে। এটি ২ প্রকার:\n\n1. Direct Narration (প্রত্যক্ষ উক্তি): বক্তার নিজের মুখের হুবহু কথা ইনভার্টেড কমা (' ') এর মধ্যে লেখা হয়। যেমন: He said, 'I am ill.'\n2. Indirect Narration (পরোক্ষ উক্তি): বক্তার কথা নিজের মতো করে পরিবর্তন করে অন্যের কাছে প্রকাশ করা হয়। যেমন: He said that he was ill.\n\nপরিবর্তনের মূল নিয়মাবলী:\n- Reporting Verb যদি Past Tense-এ থাকে, তবে Report Speech এর Tense অনুরূপ Past Tense-এ পরিবর্তিত হবে (যেমন: Present Simple -> Past Simple)।\n- চিরন্তন সত্য (Universal Truth) থাকলে টেন্সের কোনো পরিবর্তন হয় না।",
    examples: [
      "Direct: The teacher said, 'The earth moves round the sun.'",
      "Indirect: The teacher said that the earth moves round the sun. (চিরন্তন সত্য - নো টেন্স পরিবর্তন)",
      "Direct: Father said to me, 'Go home at once.' (আদেশ)",
      "Indirect: Father ordered me to go home at once."
    ],
    quiz: [
      {
        question: "Convert to Indirect: Shishir said to me, 'I will help you tomorrow.'",
        options: [
          "Shishir told me that he will help me tomorrow.",
          "Shishir told me that he would help me the next day.",
          "Shishir asked me if he would help me tomorrow."
        ],
        answer: 1,
        explanation: "Reporting Verb অতীত কাল হলে, 'will' পরিবর্তিত হয়ে 'would' হয়, এবং 'tomorrow' পরিবর্তিত হয়ে 'the next day' বা 'the following day' হয়।"
      },
      {
        question: "What does direct speech 'I am busy today' convert to when reported?",
        options: [
          "He said that he was busy today.",
          "He said that he was busy that day.",
          "He said that he is busy that day."
        ],
        answer: 1,
        explanation: "ইনডিরেক্ট স্পিচে 'today' পরিবর্তিত হয়ে 'that day' হয়ে যায় এবং টেন্সটি past tense-এ রূপান্তরিত হয়।"
      }
    ]
  },
  {
    id: "nouns",
    letter: "J",
    title: "Nouns (বিশেষ্য)",
    explanation: "A Noun is a word used to identify any of a class of people, places, or things, or to name a particular one. \n\nবাংলায়: যে শব্দ দ্বারা কোনো ব্যক্তি, বস্তু, স্থান, গুণ, কাজ বা সমষ্টির নাম বোঝায়, তাকে Noun বা বিশেষ্য বলে।\n\nপ্রধান প্রকারভেদ:\n1. Proper Noun (নামবাচক): সুনির্দিষ্ট নাম। যেমন: Shishir, Bangladesh, London.\n2. Common Noun (জাতিবাচক): সাধারণ বা সাধারণ শ্রেণীর নাম। যেমন: Boy, Country, River.\n3. Collective Noun (সমষ্টিবাচক): একজাতীয় দল বা সমষ্টি। যেমন: Class, Team, Crowd, Army.\n4. Material Noun (বস্তুবাচক): কোনো পদার্থের নাম যা গণনা করা যায় না কিন্তু ওজন করা যায়। যেমন: Gold, Water, Milk.\n5. Abstract Noun (গুণবাচক): কোনো ব্যক্তি বা বস্তুর অদৃশ্য গুণ, অবস্থা বা অনুভূতির নাম যা স্পর্শ করা যায় না, শুধু অনুভব করা যায়। যেমন: Honesty, Kindness, Beauty, Love.",
    examples: [
      "Proper Noun: Dhaka is a busy city. (ঢাকা একটি নির্দিষ্ট স্থানের নাম)",
      "Collective Noun: Our class has thirty students. ('Class' হলো শিক্ষার্থীদের একটি দল)",
      "Abstract Noun: Honesty is the best policy. ('Honesty' একটি মানবিক গুণের নাম)"
    ],
    quiz: [
      {
        question: "What type of Noun is the word 'Family'?",
        options: ["Common Noun", "Collective Noun", "Abstract Noun"],
        answer: 1,
        explanation: "'Family' বলতে পরিবারের সকল সদস্যের একটি সমষ্টিগত দলকে নির্দেশ করে, তাই এটি Collective Noun।"
      },
      {
        question: "Which of the following is an Abstract Noun?",
        options: ["Silver", "Teacher", "Childhood"],
        answer: 2,
        explanation: "'Childhood' (শৈশব) হলো মানুষের জীবনের একটি অবস্থা, যা স্পর্শ করা যায় না বা খালি চোখে দেখা যায় না, শুধু অনুভব করা যায়।"
      }
    ]
  },
  {
    id: "pronouns",
    letter: "K",
    title: "Pronouns (সর্বনাম)",
    explanation: "A Pronoun is a word that is used instead of a noun or noun phrase to avoid repetition. \n\nবাংলায়: নাউনের বারবার পুনরাবৃত্তি এড়াতে নাউনের পরিবর্তে যে সকল শব্দ ব্যবহৃত হয়, তাদের Pronoun বা সর্বনাম বলে।\n\nশ্রেণীবিভাগ:\n1. Personal Pronoun (ব্যক্তিবাচক): I, We, He, She, They, Me, Him.\n2. Relative Pronoun (সম্পর্কবাচক): Who, Which, That, Whose, Whom (দুটি বাক্যকে যুক্ত করে)।\n3. Demonstrative Pronoun (নির্দেশক): This, That, These, Those.\n4. Reflexive Pronoun (আত্মবাচক): Myself, Yourself, Himself, Themselves.\n5. Indefinite Pronoun (অনির্দিষ্ট): Everyone, Someone, Nobody, Anyone, Many.",
    examples: [
      "Personal: Shishir is a student. He studies hard. (এখানে 'He' সর্বনাম)",
      "Relative: I know the man who came here. (যে লোকটি এখানে এসেছিল - 'Who')",
      "Reflexive: He cut himself while cooking. (সে নিজেই নিজের হাত কেটে ফেলেছে)"
    ],
    quiz: [
      {
        question: "In the sentence 'These are my books', 'These' is what type of pronoun?",
        options: ["Relative Pronoun", "Demonstrative Pronoun", "Reflexive Pronoun"],
        answer: 1,
        explanation: "'These' (এইগুলো) শব্দটি কোনো কিছুকে নির্দেশ করতে ব্যবহৃত হয়েছে, তাই এটি Demonstrative Pronoun।"
      },
      {
        question: "Which of the following represents a Reflexive Pronoun?",
        options: ["Yourself", "Whom", "Somebody"],
        answer: 0,
        explanation: "যেসব প্রোনাউনের শেষে 'self' বা 'selves' যুক্ত থাকে এবং যা কর্তার নিজের উপর কাজের প্রভাব বোঝায়, তাদের Reflexive Pronoun বলে।"
      }
    ]
  },
  {
    id: "adjectives",
    letter: "L",
    title: "Adjectives (বিশেষণ)",
    explanation: "An Adjective is a word that modifies or describes a noun or pronoun, indicating its quality, quantity, state, or quantity. \n\nবাংলায়: যে শব্দ দ্বারা কোনো Noun বা Pronoun-এর দোষ, গুণ, অবস্থা, পরিমাণ, সংখ্যা ইত্যাদি প্রকাশ করা হয়, তাকে Adjective বা বিশেষণ বলে।\n\nপ্রধান শ্রেণীবিভাগ:\n1. Adjective of Quality (গুণবাচক): কেমন? বোঝায়। যেমন: Good, Bad, Nice, Clever.\n2. Adjective of Quantity (পরিমাণবাচক): কতটুকু? বোঝায়। যেমন: Much, Little, Some, Enough.\n3. Adjective of Number (সংখ্যাবাচক): কতগুলো? বা কোন স্থান? যেমন: One, Two, First, Second, Many, Few.\n4. Pronominal Adjective (সর্বনামজাত): প্রোনাউন যখন নাউনের পূর্বে বসে অ্যাডজেক্টিভের কাজ করে। যেমন: My car, Which book.",
    examples: [
      "Quality: He is an honest man. (তিনি একজন সৎ মানুষ)",
      "Quantity: I need some water. (আমার কিছু জল বা পানি প্রয়োজন)",
      "Number: The first boy got a prize. (প্রথম বালকটি পুরস্কার পেল)"
    ],
    quiz: [
      {
        question: "Find the Adjective of Quantity in the sentence: 'There is little milk in the cup.'",
        options: ["Milk", "Little", "Cup"],
        answer: 1,
        explanation: "'Little' শব্দটি দ্বারা দুধের পরিমাপ বা পরিমাণ নির্দেশ করা হচ্ছে (অল্প বা নেই বললেই চলে), তাই এটি Adjective of Quantity।"
      },
      {
        question: "Which word is an Adjective in: 'She wore a beautiful red dress'?",
        options: ["Beautiful & Red", "Wore", "Dress"],
        answer: 0,
        explanation: "'Beautiful' (সৌন্দর্য) এবং 'Red' (লাল রঙ) দুটি শব্দই 'Dress' নামক Noun টিকে মডিফাই করছে, তাই দুটিই Adjective।"
      }
    ]
  },
  {
    id: "comparison",
    letter: "M",
    title: "The Rules of Comparison (Degree)",
    explanation: "Comparison of Adjectives (Degrees of Comparison) shows how qualities of nouns are compared. \n\nবাংলায়: একের সাথে অন্যের দোষ, গুণ বা অবস্থার তুলনা করার জন্য Adjective-এর যে রূপের পরিবর্তন ঘটে, তাকে Degrees of Comparison বলে। এটি ৩ প্রকার:\n\n1. Positive Degree (সাধারণ অবস্থা): কোনো তুলনা না করে সাধারণভাবে দোষ-গুণ প্রকাশ। যেমন: He is a tall boy.\n2. Comparative Degree (দ্বি-পক্ষীয় তুলনা): দুজনের মধ্যে তুলনা বোঝাতে ব্যবহৃত হয়। সাধারণত Adjective-এর শেষে 'er' বসে বা পূর্বে 'more' বসে। যেমন: He is taller than Robin.\n3. Superlative Degree (বহুপক্ষীয় তুলনা): অনেকের মধ্যে সর্বশ্রেষ্ঠ বা সর্বনিম্ন তুলনা। সাধারণত Adjective-এর শেষে 'est' বা পূর্বে 'most' বসে এবং এর আগে 'the' বসে। যেমন: He is the tallest boy in the class.",
    examples: [
      "Positive: No other boy is as clever as him. (কোনো বালকই তার মতো চালাক নয়)",
      "Comparative: He is cleverer than any other boy. (সে অন্য যেকোনো বালকের চেয়ে চালাক)",
      "Superlative: He is the cleverest boy in the village. (সে গ্রামের সবচেয়ে চালাক ছেলে)"
    ],
    quiz: [
      {
        question: "What is the comparative form of the adjective 'Good'?",
        options: ["Gooder", "Better", "Best"],
        answer: 1,
        explanation: "'Good' একটি অনিয়মিত বিশেষণ (Irregular Adjective)। এর রূপগুলো হলো: Positive = Good, Comparative = Better, Superlative = Best।"
      },
      {
        question: "Choose the correct Superlative sentence:",
        options: [
          "Mount Everest is the most highest peak.",
          "Mount Everest is the highest peak.",
          "Mount Everest is higher than any other peak."
        ],
        answer: 1,
        explanation: "'Highest' নিজেই Superlative Form, তাই এর আগে আবার 'most' যোগ করা ব্যাকরণগতভাবে ভুল (Double Superlative)। সঠিক হলো: 'the highest peak'।"
      }
    ]
  },
  {
    id: "kind-auxiliary",
    letter: "N",
    title: "Kind of Verb and Auxiliary Verb",
    explanation: "Verbs denote actions or states. Auxiliary verbs support the main verb to form tenses, aspects, or moods. \n\nবাংলায়: যে শব্দ দ্বারা কোনো কিছু করা, হওয়া, খাওয়া, যাওয়া ইত্যাদি কাজ সম্পন্ন করা বোঝায়, তাকে Verb বা ক্রিয়া বলে।\n\nসাহায্যকারী ক্রিয়া (Auxiliary Verb) মূল ভার্বকে টেন্স, ভয়েস বা মুড গঠনে সাহায্য করে। এরা ২ প্রকার:\n1. Primary Auxiliaries: Be (am, is, are, was, were), Do (do, does, did), Have (have, has, had).\n2. Modal Auxiliaries: Can, Could, May, Might, Shall, Should, Will, Would, Must, Ought to, Need, Dare.",
    examples: [
      "Primary Auxiliary: They are playing cricket. (এখানে 'are' সাহায্যকারী এবং 'playing' মূল ভার্ব)",
      "Modal Auxiliary: You must respect your parents. (এখানে 'must' মডাল এবং 'respect' মূল ভার্ব)",
      "State of Being: He is a doctor. ('Is' এখানে প্রধান ভার্ব হিসেবে ভূমিকা রাখছে)"
    ],
    quiz: [
      {
        question: "Which of the following is a Modal Auxiliary Verb?",
        options: ["Have", "Should", "Does"],
        answer: 1,
        explanation: "'Should' হলো একটি Modal Auxiliary Verb যা সাধারণত কোনো নৈতিক দায়িত্ব বা উপদেশ বোঝাতে ব্যবহৃত হয়।"
      },
      {
        question: "Identify the auxiliary verb in: 'She has already finished her studies.'",
        options: ["has", "finished", "studies"],
        answer: 0,
        explanation: "'Has' হলো এখানে Present Perfect Tense গঠনে ব্যবহৃত Primary Auxiliary Verb।"
      }
    ]
  },
  {
    id: "finite-principal",
    letter: "O",
    title: "Finite Verb and Principal Verb",
    explanation: "A Finite verb changes form according to subject and tense. A Principal verb expresses the main action. \n\nবাংলায়: সমাপিকা ক্রিয়া (Finite Verb) সাবজেক্টের পারসন, নাম্বার ও সেন্টেন্সের টেন্স অনুযায়ী তার রূপ পরিবর্তন করে। যেমন: He goes, They go, I went.\n\nপ্রধান ক্রিয়া (Principal / Main Verb) বাক্যে স্বাধীনভাবে সম্পূর্ণ অর্থ প্রকাশ করতে পারে, অন্য কোনো ভার্বের সাহায্যের প্রয়োজন হয় না। যেমন: I read a book. এখানে 'read' প্রধান ক্রিয়া। \n\nএর বিপরীতে অসমাপিকা ক্রিয়া (Non-finite Verb) সাবজেক্টের নাম্বার, পারসন বা টেন্স দ্বারা পরিবর্তিত হয় না। যেমন: To see, Seeing, Having done.",
    examples: [
      "Finite: He wants to learn English. ('wants' সমাপিকা বা Finite, কারণ সাবজেক্ট ও টেন্স অনুযায়ী পরিবর্তিত হয়)",
      "Non-finite: He wants to learn English. ('to learn' অসমাপিকা বা Non-finite, যা অপরিবর্তিত থাকে)",
      "Principal Verb: The child runs in the park. ('runs' হলো মূল অ্যাকশন বা প্রধান ভার্ব)"
    ],
    quiz: [
      {
        question: "In the sentence 'Running in the morning is healthy', 'Running' is what kind of verb?",
        options: ["Finite Verb", "Non-finite Verb", "Principal Verb"],
        answer: 1,
        explanation: "'Running' শব্দটি এখানে একটি Gerund এবং এটি সাবজেক্ট বা টেন্সের সাথে পরিবর্তিত হয় না, তাই এটি Non-finite Verb।"
      },
      {
        question: "Choose the sentence containing only a Finite Verb without auxiliary:",
        options: [
          "He has eaten lunch.",
          "He ate lunch.",
          "He is eating lunch."
        ],
        answer: 1,
        explanation: "'He ate lunch' বাক্যে কেবল একটিই সমাপিকা ক্রিয়া 'ate' আছে, এখানে কোনো সাহায্যকারী ভার্ব নেই।"
      }
    ]
  },
  {
    id: "participle",
    letter: "P",
    title: "Participle (পার্টিসিপল)",
    explanation: "A Participle is a verb form that functions as an adjective or to construct tenses. \n\nবাংলায়: পার্টিসিপল (Participle) হলো ভার্বের এমন একটি রূপ যা একই সাথে ভার্ব এবং অ্যাডজেক্টিভ (Adjective) এর কাজ সম্পন্ন করে। এটি মূলত ৩ প্রকার:\n\n1. Present Participle (চলমান অবস্থা): Verb + ing (যা অ্যাডজেক্টিভের কাজ করে)। যেমন: A drowning man catches at a straw.\n2. Past Participle (সম্পন্ন অবস্থা): Verb-এর ৩য় রূপ (V3)। যেমন: I found a broken chair.\n3. Perfect Participle (একটি কাজের পর আরেকটি): Having + Past Participle (V3)। যেমন: Having finished the task, we went home.",
    examples: [
      "Present Participle: Don't get off a running train. (চলন্ত ট্রেন - এখানে 'running' এডজেক্টিভ)",
      "Past Participle: This is a written document. (লিখিত দলিল - 'written')",
      "Perfect Participle: Having forgotten the way, she called us. (পথ ভুলে গিয়ে সে আমাদের ফোন করলো)"
    ],
    quiz: [
      {
        question: "In 'I saw a flying bird', what is the word 'flying'?",
        options: ["Gerund", "Present Participle", "Infinitive"],
        answer: 1,
        explanation: "'flying' শব্দটি 'bird' নামক Noun টির অবস্থা (উড়ন্ত) বর্ণনা করছে এবং এটি Verb+ing রূপ, তাই এটি Present Participle।"
      },
      {
        question: "Choose the correct Perfect Participle clause:",
        options: [
          "To finish the work, he slept.",
          "Having finished the work, he slept.",
          "Finished the work, he slept."
        ],
        answer: 1,
        explanation: "Perfect Participle-এর গঠন হলো: Having + Past Participle (Having finished...)।"
      }
    ]
  },
  {
    id: "gerund-infinitive",
    letter: "Q",
    title: "Gerund and Kind of Infinitive",
    explanation: "A Gerund is a verb ending in -ing acting as a noun. An Infinitive is 'to + verb' acting as a noun, adjective, or adverb. \n\nবাংলায়: জেরান্ড (Gerund) হলো Verb + ing যা বাক্যে একই সাথে Noun এবং Verb-এর কাজ সম্পন্ন করে। এটি স্থির অবস্থা বা কাজের নাম নির্দেশ করে। যেমন: Walking is good for health.\n\nইনফিনিটিভ (Infinitive) হলো to + Verb (Base Form) যা বাক্যে Noun, Adjective বা Adverb এর কাজ করে। \n- Bare Infinitive (উহ্য to): কিছু ভার্ব (make, let, see, hear) এর পর 'to' বসে না। যেমন: Let him go (নট: to go).\n- Split Infinitive (বিভক্ত): 'to' এবং ভার্বের মাঝখানে Adverb বসানো। যেমন: to quickly read.",
    examples: [
      "Gerund: I enjoy swimming in the pool. ('swimming' হলো সাঁতার কাটা নামক কাজের নাম)",
      "Infinitive: I want to read this book. (আমি বইটি পড়তে চাই)",
      "Bare Infinitive: She made me cry. (সে আমাকে কাঁদালো - এখানে cry এর আগে to উহ্য)"
    ],
    quiz: [
      {
        question: "Which of the following contains a Gerund?",
        options: [
          "The boy is swimming in the pond.",
          "Swimming is a good exercise.",
          "I saw him swimming."
        ],
        answer: 1,
        explanation: "২য় বাক্যে 'Swimming' শব্দটি বাক্যের সাবজেক্ট (Noun) হিসেবে কাজ করছে, তাই এটি Gerund। ১ম বাক্যে এটি Continuous Tense-এর অংশ এবং ৩য় বাক্যে এটি Participle।"
      },
      {
        question: "Identify the Bare Infinitive in this sentence: 'Let us discuss the matter.'",
        options: ["Let", "discuss", "matter"],
        answer: 1,
        explanation: "'Let' ভার্বটির পর 'to' ছাড়াই বেস ফর্ম 'discuss' বসেছে, যা একটি Bare Infinitive।"
      }
    ]
  },
  {
    id: "adverbs",
    letter: "R",
    title: "Adverbs (ক্রিয়া বিশেষণ)",
    explanation: "An Adverb modifies a verb, adjective, or another adverb, indicating how, when, where, or why an action occurs. \n\nবাংলায়: যে শব্দ দ্বারা কোনো Verb (ক্রিয়া), Adjective (বিশেষণ) অথবা অন্য কোনো Adverb-কে মডিফাই করা হয় বা বিশেষায়িত করা হয়, তাকে Adverb বা ক্রিয়া বিশেষণ বলে।\n\nপ্রধান প্রকারভেদ:\n1. Adverb of Time (সময় নির্দেশক): কখন? যেমন: Today, Yesterday, Now, Soon.\n2. Adverb of Place (স্থান নির্দেশক): কোথায়? যেমন: Here, There, Everywhere, Inside.\n3. Adverb of Manner (ধরণ বা পদ্ধতি): কীভাবে? যেমন: Quickly, Slowly, Beautifully, Hard.\n4. Adverb of Frequency (বারংবারতা): কতবার? যেমন: Always, Often, Seldom, Never.",
    examples: [
      "Manner: She runs quickly to catch the bus. (সে দ্রুত দৌড়ায় - কীভাবে দৌড়ায়?)",
      "Time: We will start the meeting now. (আমরা এখনই মিটিং শুরু করব - কখন?)",
      "Degree: He is very intelligent. ('very' শব্দটি 'intelligent' নামক Adjective টিকে বিশেষায়িত করছে)"
    ],
    quiz: [
      {
        question: "Find the Adverb of Frequency in the sentence: 'He always speaks the truth.'",
        options: ["speaks", "truth", "always"],
        answer: 2,
        explanation: "'always' (সর্বদা) শব্দটি কাজটি কত ঘন ঘন বা কতবার করা হয় তা নির্দেশ করে, তাই এটি Adverb of Frequency।"
      },
      {
        question: "In the sentence 'The train arrived extremely late', 'extremely' is what?",
        options: [
          "Adjective",
          "Adverb modifying another adverb",
          "Noun"
        ],
        answer: 1,
        explanation: "'extremely' (অত্যন্ত) শব্দটি 'late' নামক অন্য একটি Adverb-কে মডিফাই করছে, তাই এটি একটি Adverb of Degree।"
      }
    ]
  },
  {
    id: "preposition",
    letter: "S",
    title: "Preposition (পদান্বয়ী অব্যয়)",
    explanation: "A Preposition shows the spatial, temporal, or logical relationship between a noun/pronoun and other words. \n\nবাংলায়: প্রিপজিশন (Preposition) হলো এমন কিছু শব্দ যা সাধারণত Noun বা Pronoun-এর পূর্বে বসে সেন্টেন্সের অন্য কোনো শব্দের সাথে তার সম্পর্ক স্থাপন করে।\n\nশ্রেণীবিভাগ:\n1. Simple Preposition: In, On, At, To, For, From, By, With.\n2. Double Preposition (দুটি মিলে এক): Into (In + To), Onto (On + To), Without.\n3. Compound Preposition: Behind, Between, Among, Above.\n4. Appropriate Preposition (বিশেষ নিয়মে জোড়া): যেমন- abide by (মেনে চলা), consist of (গঠিত), depend on (নির্ভর করা)।",
    examples: [
      "Spatial: The cat is under the table. (বিড়ালটি টেবিলের নিচে)",
      "Temporal: The train arrives at 10 AM. (ট্রেনটি সকাল ১০টায় পৌঁছাবে)",
      "Appropriate: You must abide by the rules. (তোমাকে নিয়মগুলো মেনে চলতে হবে)"
    ],
    quiz: [
      {
        question: "Fill in the blank with the correct preposition: 'He is proficient ___ English.'",
        options: ["in", "at", "with"],
        answer: 0,
        explanation: "কোনো বিষয়ে দক্ষ বোঝাতে 'proficient'-এর পরে 'in' প্রিপজিশনটি এপ্রোপ্রিয়েট হিসেবে বসে।"
      },
      {
        question: "Which preposition fits best: 'Divide the apples ___ the ten children.'",
        options: ["between", "among", "through"],
        answer: 1,
        explanation: "দুজনের মধ্যে ভাগ করতে 'between' বসে, কিন্তু দুইয়ের অধিক ব্যক্তির মধ্যে ভাগ করতে 'among' প্রিপজিশনটি বসে।"
      }
    ]
  },
  {
    id: "conjunctions",
    letter: "T",
    title: "Conjunctions (সংযোজক অব্যয়)",
    explanation: "A Conjunction joins words, phrases, or clauses together. \n\nবাংলায়: যে শব্দ দুই বা ততোধিক শব্দ, শব্দগুচ্ছ (Phrases) বা বাক্যকে (Clauses) একত্রিত বা সংযুক্ত করে, তাকে Conjunction বলে।\n\nconjunction মূলত ৩ প্রকার:\n1. Coordinating Conjunction: সমান পদের দুটি বাক্য যুক্ত করে (FANBOYS: For, And, Nor, But, Or, Yet, So)। যেমন: He is poor but honest.\n2. Subordinating Conjunction: প্রধান বাক্যের সাথে নির্ভরশীল বাক্য যুক্ত করে। যেমন: Because, Although, Since, If, Unless, Before, After. যেমন: Although it rained, we went out.\n3. Correlative Conjunction (জোড়ায় জোড়ায় বসে): Either... or, Neither... nor, Not only... but also.",
    examples: [
      "Coordinating: Shishir and Rohit are friends. (শিসির এবং রোহিত বন্ধু)",
      "Subordinating: I went to bed after I had finished my study. (পড়া শেষ করার পর ঘুমাতে গেলাম)",
      "Correlative: Not only he but also his brother attended the event."
    ],
    quiz: [
      {
        question: "Choose the correct conjunction: 'Walk fast ___ you will miss the train.'",
        options: ["or", "but", "although"],
        answer: 0,
        explanation: "এখানে একটি বিকল্প বা সতর্কবার্তা দেওয়া হচ্ছে: দ্রুত হাঁটো 'অথবা' (or) তুমি ট্রেনটি মিস করবে।"
      },
      {
        question: "Identify the subordinating conjunction in: 'We will stay indoors if it rains.'",
        options: ["will", "if", "indoors"],
        answer: 1,
        explanation: "'if' (যদি) একটি নির্ভরশীল বা শর্তাধীন ক্লজ তৈরি করে, তাই এটি Subordinating Conjunction।"
      }
    ]
  },
  {
    id: "interjection-phrase",
    letter: "U",
    title: "Interjection and Phrase (Exceptional)",
    explanation: "An Interjection expresses sudden or strong emotions. An Exceptional Phrase is a set of words without a finite verb acting as a single parts of speech. \n\nবাংলায়: ইন্টারজেকশন (Interjection) হলো এমন শব্দ যা মনের আকস্মিক অনুভূতি, আনন্দ, দুঃখ, বিস্ময় বা ক্ষোভ প্রকাশ করতে ব্যবহৃত হয়। এদের শেষে বিস্ময়সূচক চিহ্ন (!) বসে। যেমন: Alas! Hurrah! Oh!\n\nশব্দগুচ্ছ (Phrase) হলো এমন কিছু শব্দের সমষ্টি যাতে কোনো Finite Verb (সমাপিকা ক্রিয়া) এবং Subject থাকে না, কিন্তু তারা সেন্টেন্সে একটিমাত্র Parts of Speech হিসেবে কাজ করে। যেমন: On the table, In spite of, By dint of.",
    examples: [
      "Interjection: Hurrah! We have won the match. (কী আনন্দ! আমরা খেলায় জিতেছি)",
      "Alas! He is no more. (হায়! তিনি আর বেঁচে নেই)",
      "Phrase: She succeeded by dint of hard work. (সে কঠোর পরিশ্রমের মাধ্যমে সফল হয়েছে - 'by dint of' Phrase)"
    ],
    quiz: [
      {
        question: "What emotion does the interjection 'Alas!' convey?",
        options: ["Joy", "Sorrow", "Anger"],
        answer: 1,
        explanation: "'Alas!' (হায়!) শব্দটি গভীর দুঃখ, শোক বা হতাশা প্রকাশ করতে ব্যবহৃত হয়।"
      },
      {
        question: "In the sentence 'He is a man of letters', what does the phrase 'man of letters' mean?",
        options: ["A postman", "A scholar/literary person", "A letter writer"],
        answer: 1,
        explanation: "'Man of letters' একটি বিশেষ ফ্রেজ যার অর্থ হলো পণ্ডিত বা বিদ্বান ব্যক্তি (Scholar)।"
      }
    ]
  },
  {
    id: "phrase-idioms",
    letter: "V",
    title: "Phrase and Idioms (বাগধারা)",
    explanation: "Phrases and Idioms are groups of words that have a special figurative meaning different from their literal definitions. \n\nবাংলায়: ফ্রেজ (Phrase) এবং ইডিয়মস (Idioms) হলো এমন কিছু শব্দগুচ্ছ যা সাধারণ বা আক্ষরিক অর্থ প্রকাশ না করে একটি বিশেষ রূপক বা অন্তর্নিহিত অর্থ প্রকাশ করে। এদের বাংলায় 'বাগধারা' বলা হয়।\n\nপ্রয়োজনীয় ইডিয়মসমূহ:\n- A rainy day (দুর্দিন): We should save money for a rainy day.\n- Cats and dogs (মুশলধারে): It is raining cats and dogs.\n- At the eleventh hour (শেষ মুহূর্তে): He arrived at the eleventh hour.",
    examples: [
      "Idiom: It is raining cats and dogs. (আক্ষরিক অর্থ বিড়াল-কুকুর বৃষ্টি নয়, বরং মুশলধারে বৃষ্টি হচ্ছে)",
      "Idiom: Learning English is a piece of cake. ('Piece of cake' অর্থ অত্যন্ত সহজ কাজ)",
      "Phrase: In spite of his illness, he went to work. ('In spite of' অর্থ সত্ত্বেও)"
    ],
    quiz: [
      {
        question: "What does the idiom 'Burning the midnight oil' mean?",
        options: [
          "Wasting electricity",
          "Working or studying late into the night",
          "Cooking food at midnight"
        ],
        answer: 1,
        explanation: "'Burning the midnight oil' বাগধারাটির অর্থ হলো কঠোর পরিশ্রম বা পড়াশোনার জন্য গভীর রাত পর্যন্ত জেগে থাকা।"
      },
      {
        question: "Choose the correct meaning of 'Black sheep':",
        options: ["A rare black sheep", "An unworthy/bad family member", "A rich businessman"],
        answer: 1,
        explanation: "'Black sheep' (কুলাঙ্গার) বলতে কোনো পরিবার বা দলের এমন কোনো সদস্যকে বোঝায় যে নিজের খারাপ কর্মের মাধ্যমে অপবাদ ডেকে আনে।"
      }
    ]
  },
  {
    id: "collective-sentences",
    letter: "W",
    title: "Collective Group of Sentences",
    explanation: "A Collective Group of Sentences (Paragraph/Composition) is a structured set of sentences combined coherently using transition signals to present a single idea. \n\nবাংলায়: বাক্যের সমষ্টি বা কালেক্টিভ গ্রুপ অফ সেন্টেন্সেস (প্যারাগ্রাফ/রচনা) হলো কিছু সুসংগঠিত বাক্য যা নির্দিষ্ট একটি ধারণাকে কেন্দ্র করে cohesive devices বা রূপান্তর সংযোগকারী শব্দের মাধ্যমে যুক্ত হয়ে সুন্দর অর্থ প্রকাশ করে।\n\nসঠিক বাক্য সমষ্টির শর্তসমূহ:\n1. Unity (একতা): প্রতিটি বাক্য কেবল মূল ধারণাকে ঘিরেই আবর্তিত হবে।\n2. Coherence (সঙ্গতি বা ধারাবাহিকতা): বাক্যের ধারাগুলো যৌক্তিক ক্রমে সাজানো থাকবে।\n3. Transition words (যোগসূত্র): Furthermore, However, For instance, In conclusion এর মতো শব্দের সঠিক ব্যবহার।",
    examples: [
      "Weak Group: English is a global language. I like eating apples. Dhaka is the capital. (যৌক্তিক সম্পর্কহীন বাক্য সমষ্টি)",
      "Strong Group: English is a global language. Therefore, learning it is highly crucial for career growth. Furthermore, it opens up international opportunities."
    ],
    quiz: [
      {
        question: "Which linking word is best to show contrast between two sentences in a group?",
        options: ["Furthermore", "However", "Consequently"],
        answer: 1,
        explanation: "'However' (যাইহোক/তবুও) পূর্ববর্তী ধারণার সাথে বৈপরীত্য বা বৈসাদৃশ্য দেখাতে ব্যবহৃত হয়।"
      },
      {
        question: "What is the primary sentence of a paragraph that contains its main idea called?",
        options: ["Concluding Sentence", "Topic Sentence", "Supporting Sentence"],
        answer: 1,
        explanation: "প্যারাগ্রাফের প্রথম বা প্রধান বাক্য যা তার মূল ধারণাকে স্পষ্ট করে, তাকে Topic Sentence বলা হয়।"
      }
    ]
  },
  {
    id: "transformation",
    letter: "X",
    title: "Transformation of Sentences",
    explanation: "Transformation of Sentences is changing the grammatical form of a sentence without altering its original meaning. \n\nবাংলায়: ট্রান্সফরমেশন অফ সেন্টেন্স (Transformation of Sentences) বলতে বোঝায় বাক্যের মূল অর্থ বা ভাব পুরোপুরি অপরিবর্তিত রেখে কেবল তার বাহ্যিক ব্যাকরণগত কাঠামোর পরিবর্তন করা।\n\nযেমন:\n- Simple to Complex: He is too weak to walk -> He is so weak that he cannot walk.\n- Active to Passive: I did the work -> The work was done by me.\n- Positive to Negative: Only God can help us -> None but God can help us.",
    examples: [
      "Assertive: Health is wealth. (স্বাস্থ্যই সম্পদ)",
      "Negative (Transformed): Health is nothing but wealth. (অপরিবর্তিত অর্থ)",
      "Simple: In spite of working hard, he failed.",
      "Complex: Though he worked hard, he failed. (অর্থ এক কিন্তু রূপ আলাদা)"
    ],
    quiz: [
      {
        question: "Transform to Negative without changing meaning: 'Every mother loves her child.'",
        options: [
          "Mother does not love her child.",
          "There is no mother but loves her child.",
          "Every mother hates her child."
        ],
        answer: 1,
        explanation: "'Every' যুক্ত বাক্যকে অর্থ ঠিক রেখে নেগেটিভ করতে 'There is no... but' বা 'There is no... who does not' ব্যবহার করতে হয়।"
      },
      {
        question: "What is the complex form of: 'Tell me your address'?",
        options: [
          "Tell me where you live.",
          "Tell me address of you.",
          "Show me your home."
        ],
        answer: 0,
        explanation: "'Tell me your address' (Simple) বাক্যটিকে সাব-অর্ডিনেট ক্লজ যুক্ত করে 'Tell me where you live' (Complex) এ রূপান্তর করা সঠিক।"
      }
    ]
  },
  {
    id: "conversion",
    letter: "Y",
    title: "Conversion of Sentences",
    explanation: "Conversion of Sentences refers to changing the form of a sentence along with a change in its meaning. \n\nবাংলায়: কনভার্শন অফ সেন্টেন্স (Conversion of Sentences) বলতে বোঝায় বাক্যের বাহ্যিক রূপ পরিবর্তনের সাথে সাথে এর মূল ভাব বা অর্থের পরিবর্তন ঘটানো।\n\nএটি ট্রান্সফরমেশন থেকে আলাদা, কারণ এখানে অর্থ অক্ষুণ্ন রাখার প্রয়োজন নেই। যেমন:\n- Assertive to Negative (অর্থ পরিবর্তনসহ): He is a good boy -> He is not a good boy.\n- Affirmative to Interrogative (প্রশ্নকরণ): He is reading a book -> Is he reading a book?",
    examples: [
      "Affirmative: Shishir is present today. (শিসির আজ উপস্থিত)",
      "Negative (Converted): Shishir is not present today. (শিসির আজ উপস্থিত নয় - অর্থ পরিবর্তিত হয়েছে)",
      "Assertive: You go to school.",
      "Imperative (Converted): Go to school! (আদেশ - অর্থের ধরণ পরিবর্তন)"
    ],
    quiz: [
      {
        question: "Convert this positive sentence to negative (Conversion mode): 'He can run fast.'",
        options: [
          "He cannot run slowly.",
          "He cannot run fast.",
          "None but he can run fast."
        ],
        answer: 1,
        explanation: "কনভার্শনে সরাসরি বিপরীত রূপ বসাতে হয়। তাই 'He can run fast' এর সরাসরি নেগেটিভ হলো 'He cannot run fast' (অর্থের পরিবর্তন ঘটেছে)।"
      },
      {
        question: "Convert to Interrogative: 'They have finished their dinner.'",
        options: [
          "Have they finished their dinner?",
          "Haven't they finished their dinner?",
          "Did they finish dinner?"
        ],
        answer: 0,
        explanation: "প্রশ্নবোধক রূপান্তরে (Conversion) সরাসরি সাহায্যকারী ভার্বটিকে বাক্যের শুরুতে এনে প্রশ্ন তৈরি করতে হয়: 'Have they finished their dinner?'।"
      }
    ]
  }
];

// Helper to seed the database with lessons if empty
async function seedDatabase() {
  try {
    const count = await GrammarLesson.countDocuments();
    if (count === 0) {
      console.log('🌱 Seeding initial grammar lessons into MongoDB...');
      await GrammarLesson.insertMany(INITIAL_GRAMMAR_SYLLABUS);
      console.log('✓ Seeding complete! 25 bilingual lessons loaded.');
    } else {
      console.log(`ℹ️ Grammar lessons already seeded (${count} documents).`);
    }
  } catch (err) {
    console.error('⚠️ Failed to seed grammar database:', err.message);
  }
}

// Perform database check and seed
seedDatabase();

// GET /api/grammar/lessons - fetch all from MongoDB
router.get('/lessons', async (req, res) => {
  try {
    await ensureGrammarSeeded();
    const lessons = await GrammarLesson.find().sort({ letter: 1, title: 1 });
    res.json(lessons);
  } catch (err) {
    console.error('Database fetch error, falling back to static array.', err.message);
    res.json([...INITIAL_GRAMMAR_SYLLABUS, ...GRAMMAR_EXTRAS]);
  }
});

export default router;
