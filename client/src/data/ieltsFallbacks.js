/** Used when the API on :5000 is an older build (404 on IELTS routes). */

export const DEFAULT_IELTS_PROGRESS = {
  targetBand: 6.5,
  overallBand: 0,
  skills: {
    listening: { band: 0 },
    reading: { band: 0 },
    writing: { band: 0 },
    speaking: { band: 0 },
  },
  attempts: [],
};

export const LISTENING_TESTS = [
  { testId: 'listen-1', title: 'University Library Orientation', questionCount: 8 },
  { testId: 'listen-2', title: 'Climate Research Fieldwork', questionCount: 8 },
  { testId: 'listen-3', title: 'Hotel Room Reservation', questionCount: 8 },
  { testId: 'listen-4', title: 'Sports Centre Membership', questionCount: 8 },
  { testId: 'listen-5', title: 'City Museum Guided Tour', questionCount: 8 },
  { testId: 'listen-6', title: 'Student Research Project Meeting', questionCount: 8 },
  { testId: 'listen-7', title: 'Career Skills Workshop', questionCount: 8 },
  { testId: 'listen-8', title: 'Wildlife Conservation Lecture', questionCount: 8 },
  { testId: 'listen-9', title: 'Car Rental Enquiry', questionCount: 8 },
  { testId: 'listen-10', title: 'Community Festival Announcement', questionCount: 8 },
];

export const LISTENING_TEST_DETAILS = {
  'listen-1': {
    testId: 'listen-1',
    title: 'University Library Tour',
    transcript:
      'Welcome to the central library. Opening hours are 8am to 10pm on weekdays.',
    questions: [
      { id: 1, question: 'Weekday closing time?', options: ['8pm', '9pm', '10pm', '11pm'], answer: 2 },
      { id: 2, question: 'Service mentioned first?', options: ['Café', 'Printing', 'Wi-Fi', 'Parking'], answer: 1 },
      { id: 3, question: 'Books can be borrowed for?', options: ['1 week', '2 weeks', '3 weeks', '4 weeks'], answer: 2 },
      { id: 4, question: 'Silent study is on floor?', options: ['1', '2', '3', '4'], answer: 2 },
      { id: 5, question: 'Membership requires?', options: ['Passport', 'Student ID', 'Letter', 'Fee only'], answer: 1 },
    ],
  },
  'listen-2': {
    testId: 'listen-2',
    title: 'Climate Research Project',
    transcript: 'Our team measured rainfall over twelve months in three coastal regions.',
    questions: [
      { id: 1, question: 'Duration of study?', options: ['6 months', '12 months', '18 months', '24 months'], answer: 1 },
      { id: 2, question: 'Regions studied?', options: ['Two', 'Three', 'Four', 'Five'], answer: 1 },
      { id: 3, question: 'Main variable measured?', options: ['Wind', 'Rainfall', 'Temperature', 'Humidity'], answer: 1 },
      { id: 4, question: 'Data was collected by?', options: ['Satellite only', 'Ground sensors', 'Interviews', 'Historical records'], answer: 1 },
      { id: 5, question: 'Report will be published in?', options: ['March', 'June', 'September', 'December'], answer: 2 },
    ],
  },
};

export const READING_TESTS = [
  { testId: 'read-1', title: 'Urban Green Spaces', questionCount: 8 },
  { testId: 'read-2', title: 'Renewable Energy Storage', questionCount: 8 },
  { testId: 'read-3', title: 'The Spread of Printing', questionCount: 8 },
  { testId: 'read-4', title: 'Sleep and Memory', questionCount: 8 },
  { testId: 'read-5', title: 'Ocean Plastic Pollution', questionCount: 8 },
  { testId: 'read-6', title: 'Remote Work After 2020', questionCount: 8 },
  { testId: 'read-7', title: 'Ancient Irrigation Systems', questionCount: 8 },
  { testId: 'read-8', title: 'Decline of Wild Bees', questionCount: 8 },
  { testId: 'read-9', title: 'Public Transport Investment', questionCount: 8 },
  { testId: 'read-10', title: 'Language Loss and Documentation', questionCount: 8 },
];

export const READING_TEST_DETAILS = {
  'read-1': {
    testId: 'read-1',
    title: 'Urban Green Spaces',
    passages: [
      {
        title: 'Passage 1',
        body: 'Cities worldwide are investing in parks and rooftop gardens to improve air quality and mental health. Studies show residents living within 500 metres of green space report lower stress levels.',
      },
    ],
    questions: [
      { id: 1, passageIndex: 0, question: 'Green spaces improve?', options: ['Traffic', 'Air quality', 'Noise only', 'Housing prices only'], answer: 1 },
      { id: 2, passageIndex: 0, question: 'Distance cited in study?', options: ['200m', '500m', '1km', '2km'], answer: 1 },
      { id: 3, passageIndex: 0, question: 'Residents report lower?', options: ['Income', 'Stress', 'Commute time', 'Tax'], answer: 1 },
      { id: 4, passageIndex: 0, question: 'Rooftop gardens are mentioned as?', options: ['Expensive', 'Part of investment', 'Illegal', 'Temporary'], answer: 1 },
      { id: 5, passageIndex: 0, question: 'Main subject is?', options: ['Rural farms', 'Urban green spaces', 'Ocean pollution', 'Mining'], answer: 1 },
    ],
  },
};

export const WRITING_PROMPTS = [
  { taskType: 'task1_academic', title: 'Bar chart — energy use', prompt: 'The chart shows household energy use in four countries in 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.' },
  { taskType: 'task1_general', title: 'Letter — complaint', prompt: 'You recently bought a product that was faulty. Write a letter to the shop manager. Explain what you bought, what the problem is, and what you want them to do.' },
  { taskType: 'task2', title: 'Essay — technology', prompt: 'Some people believe technology has made life more complicated. To what extent do you agree or disagree? Give reasons and examples.' },
  { taskType: 'task2', title: 'Essay — education', prompt: 'Many students now study online instead of in classrooms. Do the advantages outweigh the disadvantages?' },
];

export function scoreListeningLocally(testId, answers) {
  const test = LISTENING_TEST_DETAILS[testId];
  if (!test) return { correct: 0, total: 0, band: 0 };
  let correct = 0;
  for (const q of test.questions) {
    if (answers[q.id] === q.answer) correct += 1;
  }
  const total = test.questions.length;
  const pct = correct / total;
  const band = pct >= 0.9 ? 8.5 : pct >= 0.8 ? 7.5 : pct >= 0.7 ? 6.5 : pct >= 0.6 ? 5.5 : pct >= 0.5 ? 4.5 : 3.5;
  return { correct, total, band };
}

export function scoreReadingLocally(testId, answers) {
  return scoreListeningLocally(testId, answers);
}
