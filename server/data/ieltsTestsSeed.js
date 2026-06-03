/**
 * Original IELTS-style practice content for Lumina (not copied from copyrighted exam papers).
 * Topics follow common IELTS section patterns: social dialogue, monologue, academic discussion, lecture.
 */

export const LISTENING_SEED = [
  {
    testId: 'listen-1',
    title: 'University Library Orientation',
    audioUrl: '',
    transcript:
      'Welcome to Riverside Central Library. We are open from eight in the morning until ten at night on weekdays, and from nine until six on Saturdays. New members must show a student ID or a passport. You may borrow up to eight books for three weeks. Printing costs ten pence per page. The silent study zone is on the third floor, next to the reference section. Free Wi-Fi is available throughout the building, but you must register your laptop at the front desk.',
    questions: [
      { id: 1, type: 'mcq', question: 'Weekday closing time?', options: ['8pm', '9pm', '10pm', '11pm'], answer: 2 },
      { id: 2, type: 'mcq', question: 'Saturday opening time?', options: ['8am', '9am', '10am', '11am'], answer: 1 },
      { id: 3, type: 'mcq', question: 'Maximum loan period?', options: ['1 week', '2 weeks', '3 weeks', '4 weeks'], answer: 2 },
      { id: 4, type: 'mcq', question: 'Silent study is on which floor?', options: ['1st', '2nd', '3rd', '4th'], answer: 2 },
      { id: 5, type: 'mcq', question: 'Printing cost per page?', options: ['5p', '10p', '15p', '20p'], answer: 1 },
      { id: 6, type: 'mcq', question: 'ID required for membership?', options: ['Driving licence only', 'Student ID or passport', 'Letter from employer', 'No ID'], answer: 1 },
      { id: 7, type: 'mcq', question: 'Maximum books allowed?', options: ['4', '6', '8', '10'], answer: 2 },
      { id: 8, type: 'mcq', question: 'Wi-Fi requirement?', options: ['Pay daily fee', 'Register laptop at desk', 'Use library computers only', 'No Wi-Fi'], answer: 1 },
    ],
  },
  {
    testId: 'listen-2',
    title: 'Climate Research Fieldwork',
    audioUrl: '',
    transcript:
      'Our coastal research team recorded rainfall, wind speed, and temperature at three sites for twelve months. Data came from ground sensors checked every fortnight, not from satellites alone. The heaviest rainfall was in November, with over 180 millimetres in the northern region. The final report will be published in September and shared with local councils. Funding was provided by the National Science Foundation.',
    questions: [
      { id: 1, type: 'mcq', question: 'How long did the study last?', options: ['6 months', '12 months', '18 months', '24 months'], answer: 1 },
      { id: 2, type: 'mcq', question: 'How many coastal sites?', options: ['Two', 'Three', 'Four', 'Five'], answer: 1 },
      { id: 3, type: 'mcq', question: 'Main rainfall month?', options: ['July', 'September', 'November', 'January'], answer: 2 },
      { id: 4, type: 'mcq', question: 'Data collected mainly by?', options: ['Interviews', 'Ground sensors', 'Satellites only', 'Historical records'], answer: 1 },
      { id: 5, type: 'mcq', question: 'Sensor check frequency?', options: ['Weekly', 'Fortnightly', 'Monthly', 'Quarterly'], answer: 1 },
      { id: 6, type: 'mcq', question: 'Report publication month?', options: ['June', 'July', 'September', 'December'], answer: 2 },
      { id: 7, type: 'mcq', question: 'Who funded the project?', options: ['Local council', 'Private company', 'National Science Foundation', 'University only'], answer: 2 },
      { id: 8, type: 'mcq', question: 'Rainfall in north exceeded?', options: ['120mm', '150mm', '180mm', '200mm'], answer: 2 },
    ],
  },
  {
    testId: 'listen-3',
    title: 'Hotel Room Reservation',
    audioUrl: '',
    transcript:
      'Receptionist: Good afternoon, Grand View Hotel. Customer: I would like a double room with a sea view, please. My name is Sarah Symonds, S-Y-M-O-N-D-S. Receptionist: Certainly. Arrival on the 22nd of August for four nights. Customer: Yes, and my contact number is 07789 645 523. Receptionist: Breakfast is included, but parking costs twelve pounds per day.',
    questions: [
      { id: 1, type: 'mcq', question: 'Room type requested?', options: ['Single', 'Double', 'Twin', 'Suite'], answer: 1 },
      { id: 2, type: 'mcq', question: 'Preferred view?', options: ['Garden', 'City', 'Sea', 'Mountain'], answer: 2 },
      { id: 3, type: 'mcq', question: 'Arrival date?', options: ['12 August', '22 August', '22 September', '2 August'], answer: 1 },
      { id: 4, type: 'mcq', question: 'Length of stay?', options: ['2 nights', '3 nights', '4 nights', '5 nights'], answer: 2 },
      { id: 5, type: 'mcq', question: 'Customer surname spelling starts with?', options: ['C', 'S', 'S-Y', 'S-H'], answer: 1 },
      { id: 6, type: 'mcq', question: 'Is breakfast included?', options: ['No', 'Yes', 'Only weekends', 'Only children'], answer: 1 },
      { id: 7, type: 'mcq', question: 'Daily parking cost?', options: ['£8', '£10', '£12', '£15'], answer: 2 },
      { id: 8, type: 'mcq', question: 'Contact number area code?', options: ['077', '078', '079', '080'], answer: 0 },
    ],
  },
  {
    testId: 'listen-4',
    title: 'Sports Centre Membership',
    audioUrl: '',
    transcript:
      'Welcome to FitZone Sports Centre. Our annual membership is two hundred and forty pounds, or you can pay monthly at twenty-two pounds. The pool opens at six am and closes at nine pm. Personal trainers are available on Tuesdays and Thursdays. Children under twelve must be accompanied by an adult in the gym. The new yoga studio opens on the first floor next Monday.',
    questions: [
      { id: 1, type: 'mcq', question: 'Annual membership fee?', options: ['£200', '£220', '£240', '£260'], answer: 2 },
      { id: 2, type: 'mcq', question: 'Monthly payment option?', options: ['£18', '£20', '£22', '£24'], answer: 2 },
      { id: 3, type: 'mcq', question: 'Pool closing time?', options: ['8pm', '9pm', '10pm', '11pm'], answer: 1 },
      { id: 4, type: 'mcq', question: 'Pool opening time?', options: ['5am', '6am', '7am', '8am'], answer: 1 },
      { id: 5, type: 'mcq', question: 'Personal trainer days?', options: ['Mon & Wed', 'Tue & Thu', 'Wed & Fri', 'Sat & Sun'], answer: 1 },
      { id: 6, type: 'mcq', question: 'Children under 12 in gym?', options: ['Not allowed', 'Adult required', 'Separate room', 'Morning only'], answer: 1 },
      { id: 7, type: 'mcq', question: 'Yoga studio location?', options: ['Ground floor', 'First floor', 'Second floor', 'Basement'], answer: 1 },
      { id: 8, type: 'mcq', question: 'Yoga studio opens?', options: ['This Friday', 'Next Monday', 'Next month', 'Already open'], answer: 1 },
    ],
  },
  {
    testId: 'listen-5',
    title: 'City Museum Guided Tour',
    audioUrl: '',
    transcript:
      'The museum opens at ten and the last entry is at four thirty. Adult tickets are fifteen pounds, but students pay ten. The Roman gallery is on the ground floor; medieval art is upstairs. Please leave large bags in the free locker room near the café. Photography is allowed without flash. The guided tour of the new exhibition starts at eleven fifteen at the main hall.',
    questions: [
      { id: 1, type: 'mcq', question: 'Museum opening time?', options: ['9am', '10am', '11am', '12pm'], answer: 1 },
      { id: 2, type: 'mcq', question: 'Last entry time?', options: ['4:00', '4:30', '5:00', '5:30'], answer: 1 },
      { id: 3, type: 'mcq', question: 'Adult ticket price?', options: ['£10', '£12', '£15', '£18'], answer: 2 },
      { id: 4, type: 'mcq', question: 'Student ticket price?', options: ['£8', '£10', '£12', '£15'], answer: 1 },
      { id: 5, type: 'mcq', question: 'Roman gallery location?', options: ['Basement', 'Ground floor', 'First floor', 'Second floor'], answer: 1 },
      { id: 6, type: 'mcq', question: 'Where to leave bags?', options: ['Reception', 'Locker room near café', 'Gift shop', 'Not allowed'], answer: 1 },
      { id: 7, type: 'mcq', question: 'Photography rule?', options: ['Not allowed', 'Flash only', 'No flash', 'Video only'], answer: 2 },
      { id: 8, type: 'mcq', question: 'Guided tour starts at?', options: ['10:45', '11:00', '11:15', '11:30'], answer: 2 },
    ],
  },
  {
    testId: 'listen-6',
    title: 'Student Research Project Meeting',
    audioUrl: '',
    transcript:
      'Tutor: Have you chosen a topic yet? Student A: We are comparing online learning and classroom teaching for science subjects. Student B: Our survey needs at least fifty responses by Friday. Tutor: Submit a draft bibliography next Wednesday. Use the university database, not only websites. Student A: We will present on the 30th of March, not the 23rd.',
    questions: [
      { id: 1, type: 'mcq', question: 'Research topic compares?', options: ['Two cities', 'Online vs classroom learning', 'Two teachers', 'Exam formats'], answer: 1 },
      { id: 2, type: 'mcq', question: 'Subject focus?', options: ['History', 'Science', 'Art', 'Law'], answer: 1 },
      { id: 3, type: 'mcq', question: 'Minimum survey responses?', options: ['30', '40', '50', '60'], answer: 2 },
      { id: 4, type: 'mcq', question: 'Survey deadline?', options: ['Monday', 'Wednesday', 'Friday', 'Sunday'], answer: 2 },
      { id: 5, type: 'mcq', question: 'Bibliography due?', options: ['This Monday', 'Next Wednesday', 'Next Friday', 'End of month'], answer: 1 },
      { id: 6, type: 'mcq', question: 'Recommended source?', options: ['Social media', 'University database', 'Newspapers only', 'Personal blogs'], answer: 1 },
      { id: 7, type: 'mcq', question: 'Presentation date?', options: ['23 March', '30 March', '6 April', '15 March'], answer: 1 },
      { id: 8, type: 'mcq', question: 'Number of students in discussion?', options: ['One', 'Two', 'Three', 'Four'], answer: 2 },
    ],
  },
  {
    testId: 'listen-7',
    title: 'Career Skills Workshop',
    audioUrl: '',
    transcript:
      'This evening\'s workshop on interview skills begins at six thirty in Room 12, not Room 10 as printed in the old schedule. Bring a printed CV. The speaker is a human resources manager from a technology company. Registration is free for university students; graduates pay five pounds. The session lasts ninety minutes including a fifteen-minute Q&A.',
    questions: [
      { id: 1, type: 'mcq', question: 'Workshop topic?', options: ['CV design', 'Interview skills', 'Salary negotiation', 'Networking'], answer: 1 },
      { id: 2, type: 'mcq', question: 'Start time?', options: ['6:00', '6:30', '7:00', '7:30'], answer: 1 },
      { id: 3, type: 'mcq', question: 'Correct room?', options: ['Room 10', 'Room 12', 'Room 14', 'Main hall'], answer: 1 },
      { id: 4, type: 'mcq', question: 'What to bring?', options: ['Laptop', 'Printed CV', 'Reference letter', 'Portfolio'], answer: 1 },
      { id: 5, type: 'mcq', question: 'Speaker background?', options: ['Teacher', 'HR manager', 'Lawyer', 'Journalist'], answer: 1 },
      { id: 6, type: 'mcq', question: 'Student registration fee?', options: ['£5', '£10', 'Free', '£15'], answer: 2 },
      { id: 7, type: 'mcq', question: 'Graduate fee?', options: ['£3', '£5', '£8', 'Free'], answer: 1 },
      { id: 8, type: 'mcq', question: 'Total duration?', options: ['60 min', '75 min', '90 min', '120 min'], answer: 2 },
    ],
  },
  {
    testId: 'listen-8',
    title: 'Wildlife Conservation Lecture',
    audioUrl: '',
    transcript:
      'Today\'s lecture examines how protected corridors help large mammals move between forests. Camera traps recorded movement over eighteen months. The most frequent species was deer, followed by foxes. Highway underpasses reduced road deaths by nearly forty percent. Future work will study birds and small reptiles in the same region.',
    questions: [
      { id: 1, type: 'mcq', question: 'Main topic?', options: ['Ocean pollution', 'Wildlife corridors', 'Urban farming', 'Weather patterns'], answer: 1 },
      { id: 2, type: 'mcq', question: 'Monitoring method?', options: ['Radio collars only', 'Camera traps', 'Drone surveys', 'Interviews'], answer: 1 },
      { id: 3, type: 'mcq', question: 'Study duration?', options: ['6 months', '12 months', '18 months', '24 months'], answer: 2 },
      { id: 4, type: 'mcq', question: 'Most frequent species?', options: ['Fox', 'Deer', 'Bear', 'Wolf'], answer: 1 },
      { id: 5, type: 'mcq', question: 'Second species mentioned?', options: ['Deer', 'Foxes', 'Birds', 'Reptiles'], answer: 1 },
      { id: 6, type: 'mcq', question: 'Underpass effect on road deaths?', options: ['Reduced ~20%', 'Reduced ~40%', 'Increased', 'No change'], answer: 1 },
      { id: 7, type: 'mcq', question: 'Future research will include?', options: ['Fish', 'Birds and reptiles', 'Insects only', 'Plants'], answer: 1 },
      { id: 8, type: 'mcq', question: 'Lecture type?', options: ['Panel debate', 'Academic monologue', 'Student presentation', 'Interview'], answer: 1 },
    ],
  },
  {
    testId: 'listen-9',
    title: 'Car Rental Enquiry',
    audioUrl: '',
    transcript:
      'Customer: I need a compact car from the 5th to the 12th of July. Agent: The daily rate is thirty-five pounds including basic insurance. A GPS costs five pounds extra per day. Pick-up is at the airport terminal, drop-off downtown. You must be twenty-five or older and hold a credit card. Mileage is unlimited within the country.',
    questions: [
      { id: 1, type: 'mcq', question: 'Vehicle type?', options: ['SUV', 'Compact', 'Van', 'Luxury'], answer: 1 },
      { id: 2, type: 'mcq', question: 'Rental start date?', options: ['5 July', '12 July', '5 June', '15 July'], answer: 0 },
      { id: 3, type: 'mcq', question: 'Return date?', options: ['5 July', '12 July', '19 July', '12 June'], answer: 1 },
      { id: 4, type: 'mcq', question: 'Daily rate?', options: ['£25', '£30', '£35', '£40'], answer: 2 },
      { id: 5, type: 'mcq', question: 'GPS daily cost?', options: ['£3', '£5', '£7', 'Included'], answer: 1 },
      { id: 6, type: 'mcq', question: 'Pick-up location?', options: ['Downtown', 'Airport terminal', 'Train station', 'Hotel'], answer: 1 },
      { id: 7, type: 'mcq', question: 'Minimum age?', options: ['21', '23', '25', '30'], answer: 2 },
      { id: 8, type: 'mcq', question: 'Mileage policy?', options: ['200 km/day', 'Unlimited in country', 'No motorway', 'City only'], answer: 1 },
    ],
  },
  {
    testId: 'listen-10',
    title: 'Community Festival Announcement',
    audioUrl: '',
    transcript:
      'The Riverside Summer Festival runs from Friday the 14th to Sunday the 16th of June in Central Park. Gates open at noon. Adult weekend passes are twenty pounds; children under ten enter free. Local food stalls will support charity projects. The fireworks display starts at nine forty-five pm on Sunday. Parking is available at the north entrance only.',
    questions: [
      { id: 1, type: 'mcq', question: 'Festival location?', options: ['City Hall', 'Central Park', 'Sports stadium', 'Harbour'], answer: 1 },
      { id: 2, type: 'mcq', question: 'First day date?', options: ['14 June', '16 June', '14 July', '10 June'], answer: 0 },
      { id: 3, type: 'mcq', question: 'Festival length?', options: ['1 day', '2 days', '3 days', '4 days'], answer: 2 },
      { id: 4, type: 'mcq', question: 'Gate opening time?', options: ['10am', 'Noon', '2pm', '4pm'], answer: 1 },
      { id: 5, type: 'mcq', question: 'Adult weekend pass?', options: ['£15', '£20', '£25', '£30'], answer: 1 },
      { id: 6, type: 'mcq', question: 'Free entry age?', options: ['Under 5', 'Under 10', 'Under 12', 'Under 16'], answer: 1 },
      { id: 7, type: 'mcq', question: 'Fireworks time Sunday?', options: ['9:15 pm', '9:30 pm', '9:45 pm', '10:00 pm'], answer: 2 },
      { id: 8, type: 'mcq', question: 'Parking location?', options: ['South entrance', 'North entrance', 'Underground', 'No parking'], answer: 1 },
    ],
  },
];

export const READING_SEED = [
  {
    testId: 'read-1',
    title: 'Urban Green Spaces',
    passages: [
      {
        title: 'Passage 1 — Cities and wellbeing',
        body: 'Cities worldwide are investing in parks, street trees, and rooftop gardens to improve air quality and mental health. A 2019 study found that residents living within 500 metres of accessible green space reported lower stress and visited doctors less often for anxiety-related complaints. However, maintenance costs remain a barrier for smaller municipalities. Some planners now require new housing developments to include shared gardens or green roofs.',
      },
    ],
    questions: [
      { id: 1, passageIndex: 0, question: 'Green spaces can improve?', options: ['Traffic flow', 'Air quality', 'House prices only', 'Industrial output'], answer: 1 },
      { id: 2, passageIndex: 0, question: 'Study distance from green space?', options: ['200m', '500m', '1km', '2km'], answer: 1 },
      { id: 3, passageIndex: 0, question: 'Residents reported lower?', options: ['Income', 'Stress', 'Commute time', 'Tax bills'], answer: 1 },
      { id: 4, passageIndex: 0, question: 'Barrier for small towns?', options: ['Lack of land', 'Maintenance costs', 'Public opposition', 'Climate'], answer: 1 },
      { id: 5, passageIndex: 0, question: 'New housing may require?', options: ['Underground parking', 'Shared gardens or green roofs', 'Solar panels only', 'Larger kitchens'], answer: 1 },
      { id: 6, passageIndex: 0, question: 'Rooftop gardens are part of?', options: ['Industrial zones', 'Urban green investment', 'Airport planning', 'Mining areas'], answer: 1 },
      { id: 7, passageIndex: 0, question: 'Doctor visits decreased for?', options: ['Heart surgery', 'Anxiety-related complaints', 'Dental care', 'Eye tests'], answer: 1 },
      { id: 8, passageIndex: 0, question: 'Main idea of passage?', options: ['Rural farming', 'Benefits and challenges of urban green space', 'Ocean pollution', 'Road building'], answer: 1 },
    ],
  },
  {
    testId: 'read-2',
    title: 'Renewable Energy Storage',
    passages: [
      {
        title: 'Passage 1 — Batteries and the grid',
        body: 'Solar and wind power output varies with weather, so modern grids need storage. Lithium-ion batteries dominate small-scale systems because of falling costs, but large utility projects increasingly test flow batteries that can discharge for eight hours or more. Engineers warn that mining raw materials must become more transparent. Governments in several countries now subsidise home battery packs paired with rooftop solar.',
      },
    ],
    questions: [
      { id: 1, passageIndex: 0, question: 'Why is storage needed?', options: ['Higher taxes', 'Variable renewable output', 'Older power plants', 'Population decline'], answer: 1 },
      { id: 2, passageIndex: 0, question: 'Dominant small-scale technology?', options: ['Coal', 'Lithium-ion batteries', 'Hydrogen only', 'Nuclear'], answer: 1 },
      { id: 3, passageIndex: 0, question: 'Flow batteries can discharge for?', options: ['1 hour', '4 hours', '8+ hours', '24 hours only'], answer: 2 },
      { id: 4, passageIndex: 0, question: 'Engineers want more transparency in?', options: ['Advertising', 'Mining raw materials', 'Air travel', 'Food labels'], answer: 1 },
      { id: 5, passageIndex: 0, question: 'Government subsidies often pair batteries with?', options: ['Rooftop solar', 'Diesel generators', 'Gas heating', 'Electric cars only'], answer: 0 },
      { id: 6, passageIndex: 0, question: 'Lithium-ion success partly due to?', options: ['Falling costs', 'Heavier weight', 'Shorter life', 'Noise'], answer: 0 },
      { id: 7, passageIndex: 0, question: 'Large projects test?', options: ['Flow batteries', 'Steam engines', 'Wood stoves', 'Kerosene'], answer: 0 },
      { id: 8, passageIndex: 0, question: 'Topic of passage?', options: ['Fashion trends', 'Energy storage for renewables', 'Space travel', 'Ancient history'], answer: 1 },
    ],
  },
  {
    testId: 'read-3',
    title: 'The Spread of Printing',
    passages: [
      {
        title: 'Passage 1 — From manuscript to mass text',
        body: 'Movable-type printing spread through Europe in the fifteenth century, sharply reducing the cost of books. Literacy rates rose over the following two centuries, though women in rural areas often remained excluded from formal schooling. Printers in cities such as Venice exported texts in Latin and vernacular languages. Critics at the time feared that uncontrolled pamphlets would spread rebellion, yet printing also accelerated scientific communication.',
      },
    ],
    questions: [
      { id: 1, passageIndex: 0, question: 'Printing spread in Europe when?', options: ['10th century', '15th century', '18th century', '20th century'], answer: 1 },
      { id: 2, passageIndex: 0, question: 'Effect on book cost?', options: ['Increased sharply', 'Reduced', 'Unchanged', 'Unknown'], answer: 1 },
      { id: 3, passageIndex: 0, question: 'Literacy rose over?', options: ['Two centuries', 'Five years', 'One decade', 'One year'], answer: 0 },
      { id: 4, passageIndex: 0, question: 'Who often lacked schooling?', options: ['Urban men', 'Rural women', 'Merchants', 'Printers'], answer: 1 },
      { id: 5, passageIndex: 0, question: 'Venice printers used?', options: ['Latin and vernacular', 'Arabic only', 'Chinese only', 'No translation'], answer: 0 },
      { id: 6, passageIndex: 0, question: 'Critics feared pamphlets would spread?', options: ['Disease', 'Rebellion', 'Famine', 'Silence'], answer: 1 },
      { id: 7, passageIndex: 0, question: 'Positive effect on science?', options: ['Slowed progress', 'Accelerated communication', 'Ended experiments', 'Banned journals'], answer: 1 },
      { id: 8, passageIndex: 0, question: 'Technology described?', options: ['Steam engine', 'Movable-type printing', 'Telegraph', 'Internet'], answer: 1 },
    ],
  },
  {
    testId: 'read-4',
    title: 'Sleep and Memory',
    passages: [
      {
        title: 'Passage 1 — Why rest matters for learning',
        body: 'Experiments show that sleep helps the brain consolidate new facts and motor skills. Participants who slept eight hours after training recalled vocabulary better than those who stayed awake. Short naps of twenty minutes can improve alertness but may not be enough for complex problem solving. Teenagers are especially vulnerable when school starts early, because circadian rhythms shift toward later bedtimes.',
      },
    ],
    questions: [
      { id: 1, passageIndex: 0, question: 'Sleep helps consolidate?', options: ['Hair growth', 'Facts and motor skills', 'Bone density only', 'Digestion only'], answer: 1 },
      { id: 2, passageIndex: 0, question: 'Better recall after?', options: ['4 hours sleep', '8 hours sleep', 'No sleep', '12 hours awake only'], answer: 1 },
      { id: 3, passageIndex: 0, question: '20-minute naps improve?', options: ['Alertness', 'Long-term memory only', 'Height', 'Vision permanently'], answer: 0 },
      { id: 4, passageIndex: 0, question: 'Short naps may fail for?', options: ['Simple alerts', 'Complex problem solving', 'Walking', 'Breathing'], answer: 1 },
      { id: 5, passageIndex: 0, question: 'Teenagers vulnerable when?', options: ['School starts early', 'School ends early', 'Holidays', 'Summer only'], answer: 0 },
      { id: 6, passageIndex: 0, question: 'Circadian rhythms shift toward?', options: ['Earlier bedtimes', 'Later bedtimes', 'No sleep', '24h work'], answer: 1 },
      { id: 7, passageIndex: 0, question: 'Awake group performed?', options: ['Better', 'Worse on vocabulary', 'Same', 'Not tested'], answer: 1 },
      { id: 8, passageIndex: 0, question: 'Passage focus?', options: ['Cooking', 'Sleep and memory', 'Sports rules', 'Banking'], answer: 1 },
    ],
  },
  {
    testId: 'read-5',
    title: 'Ocean Plastic Pollution',
    passages: [
      {
        title: 'Passage 1 — Microplastics in the food chain',
        body: 'Tiny plastic fragments enter rivers from washing synthetic clothes and from degraded packaging. Marine animals mistake particles for food; toxins can accumulate up the food chain. Some countries have banned single-use straws and bags, yet global production of new plastic continues to rise. Cleanup technologies exist, but scientists stress that reducing source waste is cheaper and more effective long term.',
      },
    ],
    questions: [
      { id: 1, passageIndex: 0, question: 'Microplastics enter rivers from?', options: ['Volcanoes', 'Synthetic clothes and packaging', 'Fish only', 'Trees'], answer: 1 },
      { id: 2, passageIndex: 0, question: 'Marine animals may?', options: ['Ignore plastic', 'Mistake particles for food', 'Eat only metal', 'Leave ocean'], answer: 1 },
      { id: 3, passageIndex: 0, question: 'Toxins can?', options: ['Dissolve instantly', 'Accumulate up food chain', 'Improve health', 'Stop reproduction in plants only'], answer: 1 },
      { id: 4, passageIndex: 0, question: 'Some countries banned?', options: ['Glass bottles', 'Single-use straws and bags', 'All fishing', 'Ships'], answer: 1 },
      { id: 5, passageIndex: 0, question: 'Global plastic production?', options: ['Falling', 'Still rising', 'Illegal everywhere', 'Zero since 2000'], answer: 1 },
      { id: 6, passageIndex: 0, question: 'Scientists prefer reducing?', options: ['Source waste', 'Ocean size', 'Fish numbers', 'Sunlight'], answer: 0 },
      { id: 7, passageIndex: 0, question: 'Cleanup technologies?', options: ['Do not exist', 'Exist but source reduction key', 'Solve all problems alone', 'Banned'], answer: 1 },
      { id: 8, passageIndex: 0, question: 'Main environmental issue?', options: ['Plastic pollution', 'Earthquakes', 'Drought in deserts only', 'Wind storms'], answer: 0 },
    ],
  },
  {
    testId: 'read-6',
    title: 'Remote Work After 2020',
    passages: [
      {
        title: 'Passage 1 — Hybrid offices',
        body: 'Surveys in large firms show that many employees prefer two or three office days per week. Managers initially feared productivity would fall, but several studies reported stable or higher output for knowledge workers. Challenges include onboarding graduates and maintaining team culture. Real-estate companies are redesigning smaller collaboration spaces rather than rows of fixed desks.',
      },
    ],
    questions: [
      { id: 1, passageIndex: 0, question: 'Preferred office attendance?', options: ['Every day', '2–3 days per week', 'Never', 'Once a month'], answer: 1 },
      { id: 2, passageIndex: 0, question: 'Managers feared?', options: ['Higher pay', 'Lower productivity', 'More holidays', 'Fewer emails'], answer: 1 },
      { id: 3, passageIndex: 0, question: 'Knowledge workers often showed?', options: ['Stable or higher output', 'Massive decline', 'No data', 'Only part-time gains'], answer: 0 },
      { id: 4, passageIndex: 0, question: 'Challenge for new graduates?', options: ['Onboarding', 'Retirement', 'Pension', 'Uniforms'], answer: 0 },
      { id: 5, passageIndex: 0, question: 'Another challenge?', options: ['Team culture', 'Paper clips', 'Coffee colour', 'Desk colour'], answer: 0 },
      { id: 6, passageIndex: 0, question: 'Real-estate redesign toward?', options: ['Larger fixed desks', 'Smaller collaboration spaces', 'No offices', 'Factories'], answer: 1 },
      { id: 7, passageIndex: 0, question: 'Data came from?', options: ['Surveys in large firms', 'One student essay', 'A novel', 'Ancient census'], answer: 0 },
      { id: 8, passageIndex: 0, question: 'Topic?', options: ['Remote and hybrid work', 'Medieval trade', 'Cooking', 'Mountaineering'], answer: 0 },
    ],
  },
  {
    testId: 'read-7',
    title: 'Ancient Irrigation Systems',
    passages: [
      {
        title: 'Passage 1 — Water in early agriculture',
        body: 'Archaeologists have mapped canals in dry regions that date back more than three thousand years. Farmers used gravity to move water from rivers to fields, reducing dependence on rainfall. Salinisation eventually damaged some soils when drainage was poor. Modern projects still study these layouts to design efficient drip systems in arid climates.',
      },
    ],
    questions: [
      { id: 1, passageIndex: 0, question: 'Canals found in?', options: ['Polar ice', 'Dry regions', 'Deep ocean', 'Volcanoes'], answer: 1 },
      { id: 2, passageIndex: 0, question: 'Age of some systems?', options: ['100 years', 'Over 3000 years', '50 years', '10 years'], answer: 1 },
      { id: 3, passageIndex: 0, question: 'Water moved using?', options: ['Gravity', 'Electric pumps only', 'Hand buckets only', 'Wind only'], answer: 0 },
      { id: 4, passageIndex: 0, question: 'Benefit for farmers?', options: ['Less rain needed', 'More rain required', 'No crops', 'Frozen soil'], answer: 0 },
      { id: 5, passageIndex: 0, question: 'Soil damage from?', options: ['Salinisation', 'Too much shade', 'Birds only', 'Snow'], answer: 0 },
      { id: 6, passageIndex: 0, question: 'Salinisation linked to?', options: ['Poor drainage', 'Too many trees', 'High mountains', 'Cold winds'], answer: 0 },
      { id: 7, passageIndex: 0, question: 'Modern use of research?', options: ['Drip systems in arid areas', 'Submarines', 'Airports', 'Fashion'], answer: 0 },
      { id: 8, passageIndex: 0, question: 'Who mapped canals?', options: ['Archaeologists', 'Musicians', 'Athletes', 'Chefs'], answer: 0 },
    ],
  },
  {
    testId: 'read-8',
    title: 'Decline of Wild Bees',
    passages: [
      {
        title: 'Passage 1 — Pollinators under pressure',
        body: 'Wild bee numbers have fallen in agricultural regions where monoculture crops replace diverse flowers. Pesticide exposure and habitat loss are leading causes. Some farmers plant flower strips along field edges to support pollinators. Without bees, yields of apples, almonds, and berries can drop sharply, increasing food prices.',
      },
    ],
    questions: [
      { id: 1, passageIndex: 0, question: 'Bee decline linked to?', options: ['Monoculture and habitat loss', 'More forests', 'Less pesticide', 'Urban parks only'], answer: 0 },
      { id: 2, passageIndex: 0, question: 'Leading causes include?', options: ['Pesticides and habitat loss', 'Too many flowers', 'Cold weather only', 'Birds'], answer: 0 },
      { id: 3, passageIndex: 0, question: 'Farmers may plant?', options: ['Flower strips', 'Plastic trees', 'Concrete', 'Rice only'], answer: 0 },
      { id: 4, passageIndex: 0, question: 'Without bees, yields of?', options: ['Apples and berries may drop', 'Rocks increase', 'Metal grows', 'Water vanishes'], answer: 0 },
      { id: 5, passageIndex: 0, question: 'Lower yields can?', options: ['Raise food prices', 'End schools', 'Stop wind', 'Freeze oceans'], answer: 0 },
      { id: 6, passageIndex: 0, question: 'Monoculture replaces?', options: ['Diverse flowers', 'Buildings', 'Roads', 'Snow'], answer: 0 },
      { id: 7, passageIndex: 0, question: 'Wild bees important as?', options: ['Pollinators', 'Pets only', 'Food for humans directly', 'Building material'], answer: 0 },
      { id: 8, passageIndex: 0, question: 'Passage subject?', options: ['Wild bee decline', 'Car engines', 'Phone design', 'Theatre'], answer: 0 },
    ],
  },
  {
    testId: 'read-9',
    title: 'Public Transport Investment',
    passages: [
      {
        title: 'Passage 1 — Light rail in medium cities',
        body: 'Several medium-sized cities built light-rail lines to reduce congestion and air pollution. Construction was expensive, but ticket revenue plus lower healthcare costs from cleaner air partly offset spending. Critics argued that bus lanes would have been cheaper. Surveys show passengers value reliability more than luxury seating.',
      },
    ],
    questions: [
      { id: 1, passageIndex: 0, question: 'Light rail aims to reduce?', options: ['Congestion and pollution', 'Education', 'Tourism', 'Snow'], answer: 0 },
      { id: 2, passageIndex: 0, question: 'Construction was?', options: ['Free', 'Expensive', 'Illegal', 'Instant'], answer: 1 },
      { id: 3, passageIndex: 0, question: 'Offsetting factors include?', options: ['Tickets and health savings', 'Gold mining', 'Oil exports only', 'Fines'], answer: 0 },
      { id: 4, passageIndex: 0, question: 'Critics preferred?', options: ['Bus lanes', 'More cars', 'No transport', 'Helicopters'], answer: 0 },
      { id: 5, passageIndex: 0, question: 'Passengers value?', options: ['Reliability', 'Luxury seating most', 'Free food', 'Silence only'], answer: 0 },
      { id: 6, passageIndex: 0, question: 'Cleaner air may lower?', options: ['Healthcare costs', 'Building height', 'River depth', 'Moon light'], answer: 0 },
      { id: 7, passageIndex: 0, question: 'Cities described as?', options: ['Medium-sized', 'Villages only', 'Megacities only', 'Abandoned'], answer: 0 },
      { id: 8, passageIndex: 0, question: 'Main topic?', options: ['Public transport investment', 'Cooking', 'Fashion', 'Deep sea mining'], answer: 0 },
    ],
  },
  {
    testId: 'read-10',
    title: 'Language Loss and Documentation',
    passages: [
      {
        title: 'Passage 1 — Endangered languages',
        body: 'Linguists estimate that half of the world\'s languages may disappear this century. Young speakers often shift to dominant languages for jobs and education. Digital archives now record grammar and stories, but fluent speakers are still needed to teach pronunciation. Some communities run bilingual schools to slow the loss.',
      },
    ],
    questions: [
      { id: 1, passageIndex: 0, question: 'How many languages may disappear?', options: ['None', 'About half', 'All but one', 'Exactly ten'], answer: 1 },
      { id: 2, passageIndex: 0, question: 'Time frame?', options: ['This century', 'Next millennium only', 'One year', 'Never'], answer: 0 },
      { id: 3, passageIndex: 0, question: 'Young speakers shift for?', options: ['Jobs and education', 'Sports only', 'Weather', 'Food taste'], answer: 0 },
      { id: 4, passageIndex: 0, question: 'Digital archives record?', options: ['Grammar and stories', 'Only music', 'Only numbers', 'Nothing'], answer: 0 },
      { id: 5, passageIndex: 0, question: 'Still needed for pronunciation?', options: ['Fluent speakers', 'Computers only', 'Tourists', 'Robots'], answer: 0 },
      { id: 6, passageIndex: 0, question: 'Communities may use?', options: ['Bilingual schools', 'Single-language bans', 'No schools', 'Online only'], answer: 0 },
      { id: 7, passageIndex: 0, question: 'Who made the estimate?', options: ['Linguists', 'Engineers', 'Chefs', 'Drivers'], answer: 0 },
      { id: 8, passageIndex: 0, question: 'Passage theme?', options: ['Language loss', 'Car racing', 'Gardening', 'Metals'], answer: 0 },
    ],
  },
];

export const WRITING_PROMPTS_SEED = [
  {
    taskType: 'task1_academic',
    title: 'Bar chart — energy use',
    prompt:
      'The chart shows household energy use in four countries in 2020. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
  },
  {
    taskType: 'task1_general',
    title: 'Letter — complaint',
    prompt:
      'You recently bought a product that was faulty. Write a letter to the shop manager. Explain what you bought, what the problem is, and what you want them to do.',
  },
  {
    taskType: 'task2',
    title: 'Essay — technology',
    prompt:
      'Some people believe technology has made life more complicated. To what extent do you agree or disagree? Give reasons and examples.',
  },
  {
    taskType: 'task2',
    title: 'Essay — education',
    prompt:
      'Many students now study online instead of in classrooms. Do the advantages outweigh the disadvantages?',
  },
];
