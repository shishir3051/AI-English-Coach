/**
 * Large vocabulary seed — covers all thin categories.
 * Adds beginner/intermediate/advanced words with full examples, synonyms, antonyms.
 * Import: node scripts/import-big-seed.js
 */

function w(english, bangla, partOfSpeech, category, difficulty, pronunciation, example, exampleBangla, synonyms, antonyms) {
  return { english, bangla, partOfSpeech, category, difficulty, pronunciation: pronunciation || '', example: example || '', exampleBangla: exampleBangla || '', synonyms: synonyms || [], antonyms: antonyms || [] };
}

// ─── ACADEMIC ─────────────────────────────────────────────────────────────────
const ACADEMIC = [
  // Beginner
  w('study','পড়াশোনা করা','verb','Academic','beginner','ˈstʌd.i','She studies every day.','সে প্রতিদিন পড়াশোনা করে।',['learn','read'],['ignore','neglect']),
  w('book','বই','noun','Academic','beginner','bʊk','Open your book to page five.','পাঁচ নম্বর পাতায় বই খোলো।',['textbook','volume'],['close','shut']),
  w('class','ক্লাস/শ্রেণী','noun','Academic','beginner','klæs','The class starts at nine.','ক্লাস নয়টায় শুরু হয়।',['lesson','session'],['break','recess']),
  w('teacher','শিক্ষক','noun','Academic','beginner','ˈtiː.tʃər','The teacher explained the lesson.','শিক্ষক পাঠটি বুঝিয়ে দিলেন।',['educator','instructor'],['student','learner']),
  w('exam','পরীক্ষা','noun','Academic','beginner','ɪɡˈzæm','The exam is on Friday.','শুক্রবার পরীক্ষা আছে।',['test','assessment'],['answer','result']),
  w('write','লেখা','verb','Academic','beginner','raɪt','Please write your name here.','এখানে তোমার নাম লিখো।',['compose','record'],['erase','delete']),
  w('read','পড়া','verb','Academic','beginner','riːd','Read the paragraph carefully.','অনুচ্ছেদটি সাবধানে পড়ো।',['study','skim'],['write','ignore']),
  w('note','নোট/টীকা','noun','Academic','beginner','noʊt','Take notes during the lecture.','বক্তৃতার সময় নোট নাও।',['record','memo'],['overlook','ignore']),
  w('homework','গৃহকর্ম','noun','Academic','beginner','ˈhoʊm.wɜːrk','He finished his homework early.','সে তাড়াতাড়ি গৃহকর্ম শেষ করল।',['assignment','task'],['classwork','leisure']),
  w('question','প্রশ্ন','noun','Academic','beginner','ˈkwes.tʃən','Ask a question if you are confused.','বিভ্রান্ত হলে প্রশ্ন করো।',['query','inquiry'],['answer','reply']),
  // Intermediate
  w('thesis','থিসিস/গবেষণাপত্র','noun','Academic','intermediate','ˈθiː.sɪs','She submitted her thesis last week.','সে গত সপ্তাহে থিসিস জমা দিল।',['dissertation','paper'],['draft','outline']),
  w('semester','সেমিস্টার','noun','Academic','intermediate','sɪˈmes.tər','This semester we study grammar.','এই সেমিস্টারে আমরা ব্যাকরণ পড়ি।',['term','period'],['break','vacation']),
  w('curriculum','পাঠ্যক্রম','noun','Academic','intermediate','kəˈrɪk.jʊ.ləm','The curriculum includes science.','পাঠ্যক্রমে বিজ্ঞান অন্তর্ভুক্ত।',['syllabus','programme'],['elective','extra']),
  w('scholarship','বৃত্তি','noun','Academic','intermediate','ˈskɒl.ə.ʃɪp','He won a scholarship to study abroad.','সে বিদেশে পড়ার বৃত্তি পেল।',['grant','award'],['loan','debt']),
  w('lecture','বক্তৃতা','noun','Academic','intermediate','ˈlek.tʃər','The lecture was very interesting.','বক্তৃতাটি খুব আগ্রহজনক ছিল।',['talk','presentation'],['silence','break']),
  w('bibliography','গ্রন্থপঞ্জি','noun','Academic','intermediate','ˌbɪb.liˈɒɡ.rə.fi','Add a bibliography at the end.','শেষে একটি গ্রন্থপঞ্জি যোগ করো।',['references','citations'],['text','body']),
  w('plagiarism','চৌর্যবৃত্তি','noun','Academic','intermediate','ˈpleɪ.dʒər.ɪ.zəm','Plagiarism can lead to expulsion.','চৌর্যবৃত্তি বহিষ্কারের কারণ হতে পারে।',['copying','theft'],['originality','creativity']),
  // Advanced
  w('epistemology','জ্ঞানতত্ত্ব','noun','Academic','advanced','ɪˌpɪs.tɪˈmɒl.ə.dʒi','Epistemology studies the nature of knowledge.','জ্ঞানতত্ত্ব জ্ঞানের প্রকৃতি অধ্যয়ন করে।',['theory of knowledge'],['ignorance','irrationality']),
  w('interdisciplinary','আন্তঃবিভাগীয়','adjective','Academic','advanced','ˌɪn.tə.dɪˈsɪp.lɪ.nər.i','This is an interdisciplinary research project.','এটি একটি আন্তঃবিভাগীয় গবেষণা প্রকল্প।',['cross-disciplinary','multidisciplinary'],['specialized','narrow']),
  w('empirical','অভিজ্ঞতাভিত্তিক','adjective','Academic','advanced','ɪmˈpɪr.ɪ.kəl','The study uses empirical evidence.','গবেষণাটি অভিজ্ঞতালব্ধ প্রমাণ ব্যবহার করে।',['experimental','observational'],['theoretical','speculative']),
];

// ─── ANIMALS ──────────────────────────────────────────────────────────────────
const ANIMALS = [
  w('cat','বিড়াল','noun','Animals','beginner','kæt','The cat is sleeping on the sofa.','বিড়ালটি সোফায় ঘুমাচ্ছে।',['kitten','feline'],['dog','canine']),
  w('dog','কুকুর','noun','Animals','beginner','dɒɡ','The dog barked at the stranger.','কুকুরটি অপরিচিত লোককে দেখে ডাকল।',['hound','canine'],['cat','feline']),
  w('bird','পাখি','noun','Animals','beginner','bɜːrd','A bird sang in the morning.','সকালে একটি পাখি গান গাইল।',['fowl','avian'],['fish','reptile']),
  w('fish','মাছ','noun','Animals','beginner','fɪʃ','We saw colourful fish in the river.','নদীতে রঙিন মাছ দেখলাম।',['aquatic animal'],['bird','mammal']),
  w('horse','ঘোড়া','noun','Animals','beginner','hɔːrs','The horse ran very fast.','ঘোড়াটি খুব দ্রুত দৌড়াল।',['stallion','mare'],['donkey','mule']),
  w('cow','গরু','noun','Animals','beginner','kaʊ','The cow gives milk every day.','গরু প্রতিদিন দুধ দেয়।',['bovine','heifer'],['bull','ox']),
  w('elephant','হাতি','noun','Animals','beginner','ˈel.ɪ.fənt','Elephants have excellent memory.','হাতির স্মৃতিশক্তি অসাধারণ।',['pachyderm'],['mouse','ant']),
  w('tiger','বাঘ','noun','Animals','beginner','ˈtaɪ.ɡər','The tiger is the national animal.','বাঘ জাতীয় পশু।',['feline','predator'],['deer','prey']),
  w('rabbit','খরগোশ','noun','Animals','beginner','ˈræb.ɪt','The rabbit hopped across the garden.','খরগোশ বাগানে লাফিয়ে লাফিয়ে গেল।',['hare','bunny'],['fox','wolf']),
  w('monkey','বানর','noun','Animals','beginner','ˈmʌŋ.ki','Monkeys are very clever animals.','বানর খুব চালাক প্রাণী।',['primate','ape'],['reptile','amphibian']),
  w('snake','সাপ','noun','Animals','intermediate','sneɪk','The snake slithered into the grass.','সাপটি ঘাসের মধ্যে ঢুকে গেল।',['serpent','reptile'],['mongoose','eagle']),
  w('dolphin','ডলফিন','noun','Animals','intermediate','ˈdɒl.fɪn','Dolphins are intelligent marine mammals.','ডলফিন বুদ্ধিমান সামুদ্রিক স্তন্যপায়ী।',['porpoise'],['shark','whale']),
  w('eagle','ঈগল','noun','Animals','intermediate','ˈiː.ɡəl','The eagle soared high in the sky.','ঈগল আকাশে উঁচুতে ভেসে বেড়াল।',['hawk','raptor'],['sparrow','pigeon']),
  w('crocodile','কুমির','noun','Animals','intermediate','ˈkrɒk.ə.daɪl','The crocodile lurked in the river.','কুমিরটি নদীতে ওঁৎ পেতে ছিল।',['alligator','reptile'],['bird','mammal']),
  w('nocturnal','নিশাচর','adjective','Animals','advanced','nɒkˈtɜː.nəl','Owls are nocturnal creatures.','পেঁচা নিশাচর প্রাণী।',['night-active'],['diurnal','day-active']),
  w('carnivore','মাংসাশী','noun','Animals','advanced','ˈkɑːr.nɪ.vɔːr','Lions are carnivores by nature.','সিংহ স্বভাবগতভাবে মাংসাশী।',['predator','meat-eater'],['herbivore','omnivore']),
  w('herbivore','তৃণভোজী','noun','Animals','advanced','ˈhɜː.bɪ.vɔːr','Cows and sheep are herbivores.','গরু ও ভেড়া তৃণভোজী।',['plant-eater','grazer'],['carnivore','predator']),
];

// ─── BUSINESS ─────────────────────────────────────────────────────────────────
const BUSINESS = [
  w('profit','লাভ','noun','Business','beginner','ˈprɒf.ɪt','The company made a big profit.','কোম্পানি বড় লাভ করেছে।',['gain','earnings'],['loss','deficit']),
  w('loss','লোকসান','noun','Business','beginner','lɒs','They made a loss this quarter.','এই প্রান্তিকে তাদের লোকসান হয়েছে।',['deficit','shortfall'],['profit','gain']),
  w('market','বাজার','noun','Business','beginner','ˈmɑːr.kɪt','The market is open every day.','বাজার প্রতিদিন খোলা থাকে।',['marketplace','trade'],['home','private']),
  w('sale','বিক্রয়','noun','Business','beginner','seɪl','The sale ends on Sunday.','রবিবার বিক্রয় শেষ হয়।',['selling','trade'],['purchase','buying']),
  w('price','মূল্য','noun','Business','beginner','praɪs','The price of rice has gone up.','চালের দাম বেড়ে গেছে।',['cost','rate'],['free','discount']),
  w('customer','গ্রাহক','noun','Business','beginner','ˈkʌs.tə.mər','The customer is always right.','গ্রাহক সবসময় সঠিক।',['client','buyer'],['seller','vendor']),
  w('product','পণ্য','noun','Business','beginner','ˈprɒd.ʌkt','This product is very popular.','এই পণ্যটি খুব জনপ্রিয়।',['goods','item'],['service','idea']),
  w('invoice','চালান','noun','Business','intermediate','ˈɪn.vɔɪs','Please send me the invoice.','দয়া করে আমাকে চালান পাঠাও।',['bill','receipt'],['payment','credit']),
  w('budget','বাজেট','noun','Business','intermediate','ˈbʌdʒ.ɪt','We need to plan our budget carefully.','আমাদের বাজেট সাবধানে পরিকল্পনা করতে হবে।',['plan','allocation'],['excess','overspend']),
  w('revenue','রাজস্ব/আয়','noun','Business','intermediate','ˈrev.ɪ.njuː','Revenue increased by 20% this year.','এ বছর রাজস্ব ২০% বৃদ্ধি পেয়েছে।',['income','earnings'],['expense','cost']),
  w('stakeholder','স্টেকহোল্ডার','noun','Business','intermediate','ˈsteɪk.hoʊl.dər','All stakeholders attended the meeting.','সমস্ত স্টেকহোল্ডার বৈঠকে উপস্থিত ছিলেন।',['investor','shareholder'],['bystander','outsider']),
  w('entrepreneur','উদ্যোক্তা','noun','Business','intermediate','ˌɒn.trə.prəˈnɜːr','She is a successful entrepreneur.','সে একজন সফল উদ্যোক্তা।',['businessman','founder'],['employee','worker']),
  w('leverage','সুবিধা নেওয়া/লিভারেজ','verb','Business','advanced','ˈliː.vər.ɪdʒ','We can leverage our network to grow.','বাড়তে আমরা নেটওয়ার্ক ব্যবহার করতে পারি।',['utilize','exploit'],['ignore','waste']),
  w('acquisition','অধিগ্রহণ','noun','Business','advanced','ˌæk.wɪˈzɪʃ.ən','The acquisition was worth millions.','অধিগ্রহণটির মূল্য ছিল কোটি টাকা।',['takeover','merger'],['sale','divestiture']),
  w('synergy','সমন্বিত শক্তি','noun','Business','advanced','ˈsɪn.ər.dʒi','The merger created strong synergy.','একীভূতকরণ শক্তিশালী সমন্বয় তৈরি করেছে।',['collaboration','cooperation'],['conflict','competition']),
  w('liquidate','সমাপ্তি করা','verb','Business','advanced','ˈlɪk.wɪ.deɪt','They had to liquidate all assets.','তাদের সব সম্পদ বিক্রি করতে হয়েছিল।',['dissolve','sell off'],['invest','acquire']),
];

// ─── COMMUNICATION ────────────────────────────────────────────────────────────
const COMMUNICATION_EXTRA = [
  w('speak','বলা/কথা বলা','verb','Communication','beginner','spiːk','Please speak clearly.','দয়া করে স্পষ্ট করে বলো।',['talk','utter'],['listen','be silent']),
  w('listen','শোনা','verb','Communication','beginner','ˈlɪs.ən','Listen carefully to the instructions.','নির্দেশনা সাবধানে শোনো।',['hear','attend'],['ignore','speak']),
  w('reply','উত্তর দেওয়া','verb','Communication','beginner','rɪˈplaɪ','Please reply to my message.','আমার বার্তার উত্তর দাও।',['respond','answer'],['ignore','avoid']),
  w('message','বার্তা','noun','Communication','beginner','ˈmes.ɪdʒ','She sent me a message.','সে আমাকে একটি বার্তা পাঠাল।',['note','text'],['silence','voice call']),
  w('discuss','আলোচনা করা','verb','Communication','intermediate','dɪˈskʌs','We discussed the issue at length.','আমরা বিস্তারিত বিষয়টি নিয়ে আলোচনা করলাম।',['debate','converse'],['ignore','dismiss']),
  w('negotiate','আলোচনা করে সিদ্ধান্ত নেওয়া','verb','Communication','intermediate','nɪˈɡoʊ.ʃi.eɪt','We negotiated a good deal.','আমরা একটি ভালো চুক্তি আলোচনা করলাম।',['bargain','mediate'],['demand','force']),
  w('persuade','রাজি করানো','verb','Communication','intermediate','pəˈsweɪd','He persuaded me to stay.','সে আমাকে থাকতে রাজি করাল।',['convince','influence'],['discourage','deter']),
  w('articulate','স্পষ্টভাবে বলা','verb','Communication','advanced','ɑːrˈtɪk.jʊ.leɪt','She articulated her ideas well.','সে তার ধারণাগুলো স্পষ্টভাবে বলল।',['express','voice'],['mumble','suppress']),
  w('rhetoric','বাগ্মীতা','noun','Communication','advanced','ˈret.ər.ɪk','His rhetoric moved the audience.','তার বাগ্মীতা দর্শকদের মুগ্ধ করল।',['oratory','eloquence'],['silence','plain speech']),
  w('diplomacy','কূটনীতি/বিনয়ী কথাবার্তা','noun','Communication','advanced','dɪˈploʊ.mə.si','Handle the conflict with diplomacy.','কূটনীতির সাথে দ্বন্দ্ব সামলাও।',['tact','finesse'],['rudeness','bluntness']),
];

// ─── LEGAL ────────────────────────────────────────────────────────────────────
const LEGAL = [
  w('law','আইন','noun','Legal','beginner','lɔː','Everyone must follow the law.','সবাইকে আইন মানতে হবে।',['rule','regulation'],['crime','violation']),
  w('court','আদালত','noun','Legal','beginner','kɔːrt','The case went to court.','মামলাটি আদালতে গেল।',['tribunal','judiciary'],['street','informal']),
  w('judge','বিচারক','noun','Legal','beginner','dʒʌdʒ','The judge gave a fair verdict.','বিচারক ন্যায্য রায় দিলেন।',['magistrate','justice'],['criminal','defendant']),
  w('lawyer','আইনজীবী','noun','Legal','beginner','ˈlɔː.jər','She hired a good lawyer.','সে একজন ভালো আইনজীবী নিয়োগ করল।',['attorney','advocate'],['client','defendant']),
  w('crime','অপরাধ','noun','Legal','beginner','kraɪm','Theft is a crime.','চুরি একটি অপরাধ।',['offence','felony'],['virtue','honesty']),
  w('evidence','প্রমাণ','noun','Legal','intermediate','ˈev.ɪ.dəns','The evidence was clear.','প্রমাণ স্পষ্ট ছিল।',['proof','testimony'],['conjecture','assumption']),
  w('verdict','রায়','noun','Legal','intermediate','ˈvɜːr.dɪkt','The jury delivered its verdict.','জুরি তাদের রায় ঘোষণা করল।',['judgement','decision'],['appeal','reversal']),
  w('plaintiff','বাদী','noun','Legal','intermediate','ˈpleɪn.tɪf','The plaintiff filed a lawsuit.','বাদী একটি মামলা দায়ের করল।',['complainant','claimant'],['defendant','respondent']),
  w('defendant','আসামি/প্রতিবাদী','noun','Legal','intermediate','dɪˈfen.dənt','The defendant pleaded not guilty.','আসামি দোষী নয় বলে দাবি করল।',['accused','respondent'],['plaintiff','prosecutor']),
  w('litigation','মামলা-মোকদ্দমা','noun','Legal','advanced','ˌlɪt.ɪˈɡeɪ.ʃən','The litigation lasted for years.','মামলা বছরের পর বছর চলল।',['lawsuit','legal action'],['settlement','arbitration']),
  w('jurisprudence','আইনশাস্ত্র','noun','Legal','advanced','ˌdʒʊər.ɪsˈpruː.dəns','He studied jurisprudence at university.','সে বিশ্ববিদ্যালয়ে আইনশাস্ত্র অধ্যয়ন করল।',['legal theory','law'],['ignorance','lawlessness']),
  w('habeas corpus','বন্দিত্ব পরীক্ষার পরোয়ানা','phrase','Legal','advanced','ˈheɪ.bi.əs ˈkɔːr.pəs','The lawyer filed a habeas corpus petition.','আইনজীবী হেবিয়াস কর্পাস আবেদন দাখিল করলেন।',['legal writ'],['imprisonment','detention']),
];

// ─── LITERATURE ───────────────────────────────────────────────────────────────
const LITERATURE = [
  w('poem','কবিতা','noun','Literature','beginner','poʊm','She wrote a beautiful poem.','সে একটি সুন্দর কবিতা লিখল।',['verse','rhyme'],['prose','essay']),
  w('story','গল্প','noun','Literature','beginner','ˈstɔːr.i','Tell me a bedtime story.','ঘুমের আগে একটি গল্প বলো।',['tale','narrative'],['fact','reality']),
  w('character','চরিত্র','noun','Literature','beginner','ˈkær.ɪk.tər','The main character is brave.','প্রধান চরিত্র সাহসী।',['persona','role'],['author','writer']),
  w('novel','উপন্যাস','noun','Literature','beginner','ˈnɒv.əl','She read the whole novel in two days.','সে দুই দিনে পুরো উপন্যাস পড়ল।',['book','fiction'],['fact','nonfiction']),
  w('author','লেখক','noun','Literature','beginner','ˈɔː.θər','Who is the author of this book?','এই বইটির লেখক কে?',['writer','novelist'],['reader','audience']),
  w('plot','কাহিনী/ষড়যন্ত্র','noun','Literature','intermediate','plɒt','The plot of the story is exciting.','গল্পের কাহিনী উত্তেজনাপূর্ণ।',['storyline','narrative'],['subplot','tangent']),
  w('metaphor','রূপক','noun','Literature','intermediate','ˈmet.ə.fɔːr','Life is a journey is a metaphor.','জীবন একটি যাত্রা - এটি একটি রূপক।',['figure of speech','analogy'],['literal','fact']),
  w('simile','উপমা','noun','Literature','intermediate','ˈsɪm.ɪ.li','As brave as a lion is a simile.','সিংহের মতো সাহসী - এটি একটি উপমা।',['comparison','analogy'],['metaphor','literal']),
  w('protagonist','নায়ক/প্রধান চরিত্র','noun','Literature','intermediate','prəʊˈtæɡ.ə.nɪst','The protagonist faces many challenges.','প্রধান চরিত্র অনেক চ্যালেঞ্জের মুখোমুখি হয়।',['hero','lead character'],['antagonist','villain']),
  w('antagonist','খলনায়ক/বিরোধী চরিত্র','noun','Literature','intermediate','ænˈtæɡ.ə.nɪst','The antagonist opposes the hero.','খলনায়ক নায়কের বিরোধিতা করে।',['villain','opponent'],['protagonist','hero']),
  w('allegory','রূপকথা/রূপক কাহিনী','noun','Literature','advanced','ˈæl.ɪ.ɡɔːr.i','Animal Farm is a political allegory.','অ্যানিমাল ফার্ম একটি রাজনৈতিক রূপক।',['fable','parable'],['literal story','fact']),
  w('soliloquy','স্বগতোক্তি','noun','Literature','advanced','səˈlɪl.ə.kwi','Hamlet delivers a famous soliloquy.','হ্যামলেট একটি বিখ্যাত স্বগতোক্তি করে।',['monologue','speech'],['dialogue','conversation']),
  w('denouement','উপসংহার/সমাধান','noun','Literature','advanced','deɪˈnuː.mɒ̃','The denouement was surprising.','উপসংহার চমকপ্রদ ছিল।',['resolution','conclusion'],['climax','beginning']),
];

// ─── MEDICAL ──────────────────────────────────────────────────────────────────
const MEDICAL = [
  w('doctor','ডাক্তার','noun','Medical','beginner','ˈdɒk.tər','The doctor checked the patient.','ডাক্তার রোগী পরীক্ষা করলেন।',['physician','surgeon'],['patient','nurse']),
  w('hospital','হাসপাতাল','noun','Medical','beginner','ˈhɒs.pɪ.t əl','She was admitted to the hospital.','সে হাসপাতালে ভর্তি হলো।',['clinic','infirmary'],['home','office']),
  w('medicine','ওষুধ','noun','Medical','beginner','ˈmed.ɪ.sɪn','Take the medicine twice a day.','দিনে দুইবার ওষুধ খাও।',['drug','treatment'],['illness','sickness']),
  w('nurse','নার্স','noun','Medical','beginner','nɜːrs','The nurse checked my blood pressure.','নার্স আমার রক্তচাপ পরীক্ষা করলেন।',['caregiver','attendant'],['patient','doctor']),
  w('fever','জ্বর','noun','Medical','beginner','ˈfiː.vər','He has a high fever today.','আজ তার তীব্র জ্বর আছে।',['temperature','pyrexia'],['health','wellness']),
  w('surgery','অস্ত্রোপচার','noun','Medical','intermediate','ˈsɜːr.dʒər.i','She had surgery last month.','গত মাসে সে অস্ত্রোপচার করল।',['operation','procedure'],['medicine','recovery']),
  w('diagnosis','রোগ নির্ণয়','noun','Medical','intermediate','ˌdaɪ.əɡˈnoʊ.sɪs','The diagnosis took several tests.','রোগ নির্ণয়ে বেশ কয়েকটি পরীক্ষা লাগল।',['assessment','evaluation'],['treatment','cure']),
  w('prescription','ব্যবস্থাপত্র','noun','Medical','intermediate','prɪˈskrɪp.ʃən','The doctor gave a prescription.','ডাক্তার একটি ব্যবস্থাপত্র দিলেন।',['order','recommendation'],['diagnosis','symptom']),
  w('symptom','লক্ষণ','noun','Medical','intermediate','ˈsɪmp.təm','Fever is a symptom of infection.','জ্বর সংক্রমণের একটি লক্ষণ।',['sign','indication'],['cure','treatment']),
  w('pandemic','মহামারী','noun','Medical','advanced','pænˈdem.ɪk','The pandemic affected the whole world.','মহামারী সারা বিশ্বকে প্রভাবিত করল।',['epidemic','outbreak'],['health','recovery']),
  w('pathogen','রোগজীবাণু','noun','Medical','advanced','ˈpæθ.ə.dʒən','The pathogen was identified quickly.','রোগজীবাণু দ্রুত চিহ্নিত হলো।',['microbe','bacterium'],['antibody','cure']),
  w('prognosis','রোগের ভবিষ্যৎ পূর্বাভাস','noun','Medical','advanced','prɒɡˈnoʊ.sɪs','The prognosis is positive.','রোগের পূর্বাভাস ইতিবাচক।',['outlook','forecast'],['diagnosis','uncertainty']),
];

// ─── NATURE ───────────────────────────────────────────────────────────────────
const NATURE = [
  w('tree','গাছ','noun','Nature','beginner','triː','The mango tree is very tall.','আমগাছটি খুব লম্বা।',['plant','flora'],['building','concrete']),
  w('river','নদী','noun','Nature','beginner','ˈrɪv.ər','The river flows through the village.','নদী গ্রামের মধ্য দিয়ে বয়।',['stream','waterway'],['desert','mountain']),
  w('mountain','পাহাড়','noun','Nature','beginner','ˈmaʊn.tɪn','The mountain is covered with snow.','পাহাড় বরফে ঢাকা।',['hill','peak'],['valley','plain']),
  w('ocean','মহাসাগর','noun','Nature','beginner','ˈoʊ.ʃən','The ocean is vast and deep.','মহাসাগর বিশাল এবং গভীর।',['sea','deep water'],['land','desert']),
  w('forest','বন','noun','Nature','beginner','ˈfɒr.ɪst','Tigers live in the forest.','বাঘ বনে বাস করে।',['jungle','woodland'],['city','desert']),
  w('flower','ফুল','noun','Nature','beginner','ˈflaʊ.ər','The flower smells wonderful.','ফুলটি দারুণ সুগন্ধি।',['blossom','bloom'],['thorn','stone']),
  w('sky','আকাশ','noun','Nature','beginner','skaɪ','The sky is clear and blue today.','আজ আকাশ পরিষ্কার এবং নীল।',['heavens','atmosphere'],['ground','earth']),
  w('soil','মাটি','noun','Nature','beginner','sɔɪl','The soil here is very fertile.','এখানকার মাটি খুব উর্বর।',['earth','ground'],['sky','space']),
  w('ecosystem','বাস্তুসংস্থান','noun','Nature','intermediate','ˈiː.koʊ.sɪs.təm','The forest ecosystem is fragile.','বনের বাস্তুসংস্থান ভঙ্গুর।',['habitat','environment'],['urban','artificial']),
  w('erosion','ক্ষয়','noun','Nature','intermediate','ɪˈroʊ.ʒən','Erosion is destroying the riverbank.','ক্ষয় নদীতীর ধ্বংস করছে।',['wearing away','weathering'],['growth','development']),
  w('drought','খরা','noun','Nature','intermediate','draʊt','The drought lasted three months.','খরা তিন মাস স্থায়ী হলো।',['dry spell','aridity'],['flood','rain']),
  w('biodiversity','জীববৈচিত্র্য','noun','Nature','advanced','ˌbaɪ.oʊ.daɪˈvɜːr.sɪ.ti','Biodiversity is crucial for survival.','বেঁচে থাকার জন্য জীববৈচিত্র্য গুরুত্বপূর্ণ।',['variety of life','richness'],['monoculture','extinction']),
  w('photosynthesis','সালোকসংশ্লেষণ','noun','Nature','advanced','ˌfoʊ.toʊˈsɪn.θɪ.sɪs','Plants make food by photosynthesis.','উদ্ভিদ সালোকসংশ্লেষণ দ্বারা খাদ্য তৈরি করে।',['food production in plants'],['respiration','decomposition']),
];

// ─── PROFESSIONAL ─────────────────────────────────────────────────────────────
const PROFESSIONAL = [
  w('interview','সাক্ষাৎকার','noun','Professional','beginner','ˈɪn.tə.vjuː','She had a job interview today.','আজ তার চাকরির সাক্ষাৎকার ছিল।',['meeting','discussion'],['dismissal','rejection']),
  w('resume','জীবনবৃত্তান্ত','noun','Professional','beginner','ˈrez.ʊ.meɪ','Update your resume before applying.','আবেদনের আগে জীবনবৃত্তান্ত আপডেট করো।',['CV','portfolio'],['rejection','failure']),
  w('salary','বেতন','noun','Professional','beginner','ˈsæl.ər.i','Her salary was increased this year.','এ বছর তার বেতন বাড়ল।',['pay','wage'],['expense','debt']),
  w('deadline','সময়সীমা','noun','Professional','beginner','ˈded.laɪn','The deadline is next Monday.','সময়সীমা আগামী সোমবার।',['due date','cutoff'],['extension','flexibility']),
  w('promotion','পদোন্নতি','noun','Professional','beginner','prəˈmoʊ.ʃən','She got a promotion last month.','গত মাসে সে পদোন্নতি পেল।',['advancement','upgrade'],['demotion','downgrade']),
  w('colleague','সহকর্মী','noun','Professional','intermediate','ˈkɒl.iːɡ','My colleagues are very helpful.','আমার সহকর্মীরা খুব সহায়ক।',['coworker','associate'],['competitor','rival']),
  w('management','ব্যবস্থাপনা','noun','Professional','intermediate','ˈmæn.ɪdʒ.mənt','Good management leads to success.','ভালো ব্যবস্থাপনা সাফল্যের দিকে নিয়ে যায়।',['administration','leadership'],['chaos','disorder']),
  w('presentation','উপস্থাপনা','noun','Professional','intermediate','ˌprez.ənˈteɪ.ʃən','She gave an excellent presentation.','সে চমৎকার উপস্থাপনা দিল।',['report','demonstration'],['silence','avoidance']),
  w('accountability','জবাবদিহিতা','noun','Professional','advanced','əˌkaʊn.tə.ˈbɪl.ɪ.ti','Accountability is key in leadership.','নেতৃত্বে জবাবদিহিতা মুখ্য বিষয়।',['responsibility','transparency'],['evasion','blame-shifting']),
  w('delegation','দায়িত্ব অর্পণ','noun','Professional','advanced','ˌdel.ɪˈɡeɪ.ʃən','Effective delegation improves productivity.','কার্যকর দায়িত্ব অর্পণ উৎপাদনশীলতা বাড়ায়।',['assignment','transfer'],['micromanagement','control']),
  w('benchmarking','মানদণ্ড নির্ধারণ','noun','Professional','advanced','ˈbentʃ.mɑːr.kɪŋ','Benchmarking helps set performance goals.','মানদণ্ড নির্ধারণ লক্ষ্যমাত্রা স্থাপনে সহায়তা করে।',['comparison','evaluation'],['guessing','approximation']),
];

// ─── SCIENCE ──────────────────────────────────────────────────────────────────
const SCIENCE = [
  w('experiment','পরীক্ষা-নিরীক্ষা','noun','Science','beginner','ɪkˈsper.ɪ.mənt','We did an experiment in class.','আমরা ক্লাসে একটি পরীক্ষা করলাম।',['test','trial'],['theory','speculation']),
  w('hypothesis','অনুমান/প্রকল্প','noun','Science','beginner','haɪˈpɒθ.ɪ.sɪs','Form a hypothesis before testing.','পরীক্ষার আগে একটি অনুমান তৈরি করো।',['theory','assumption'],['proof','fact']),
  w('chemical','রাসায়নিক','noun','Science','beginner','ˈkem.ɪ.kəl','Handle chemicals with care.','রাসায়নিক সাবধানে পরিচালনা করো।',['substance','compound'],['natural','organic']),
  w('laboratory','গবেষণাগার','noun','Science','beginner','ləˈbɒr.ə.tər.i','The students worked in the laboratory.','শিক্ষার্থীরা গবেষণাগারে কাজ করল।',['lab','research centre'],['classroom','office']),
  w('gravity','মাধ্যাকর্ষণ','noun','Science','beginner','ˈɡræv.ɪ.ti','Gravity keeps us on the ground.','মাধ্যাকর্ষণ আমাদের মাটিতে ধরে রাখে।',['attraction','force'],['repulsion','levity']),
  w('molecule','অণু','noun','Science','intermediate','ˈmɒl.ɪ.kjuːl','Water is made of tiny molecules.','পানি ক্ষুদ্র অণু দিয়ে তৈরি।',['particle','compound'],['atom','element']),
  w('radiation','বিকিরণ','noun','Science','intermediate','ˌreɪ.diˈeɪ.ʃən','Radiation from the sun is powerful.','সূর্যের বিকিরণ শক্তিশালী।',['emission','rays'],['absorption','shade']),
  w('catalyst','অনুঘটক','noun','Science','intermediate','ˈkæt.ə.lɪst','A catalyst speeds up a reaction.','একটি অনুঘটক বিক্রিয়াকে দ্রুত করে।',['accelerator','trigger'],['inhibitor','retardant']),
  w('osmosis','অভিস্রবণ','noun','Science','advanced','ɒzˈmoʊ.sɪs','Water enters the cell by osmosis.','পানি অভিস্রবণ দ্বারা কোষে প্রবেশ করে।',['diffusion','permeation'],['concentration','blockage']),
  w('quantum','কোয়ান্টাম','noun','Science','advanced','ˈkwɒn.təm','Quantum physics is complex.','কোয়ান্টাম পদার্থবিদ্যা জটিল।',['unit','discrete amount'],['continuous','classical']),
  w('entropy','এনট্রপি/বিশৃঙ্খলা','noun','Science','advanced','ˈen.trə.pi','Entropy increases in a closed system.','একটি বদ্ধ ব্যবস্থায় এনট্রপি বৃদ্ধি পায়।',['disorder','randomness'],['order','structure']),
];

// ─── SPORTS ───────────────────────────────────────────────────────────────────
const SPORTS = [
  w('cricket','ক্রিকেট','noun','Sports','beginner','ˈkrɪk.ɪt','Cricket is popular in Bangladesh.','বাংলাদেশে ক্রিকেট জনপ্রিয়।',['bat-and-ball game'],['football','tennis']),
  w('football','ফুটবল','noun','Sports','beginner','ˈfʊt.bɔːl','He loves playing football.','সে ফুটবল খেলতে ভালোবাসে।',['soccer'],['cricket','volleyball']),
  w('team','দল','noun','Sports','beginner','tiːm','Our team won the match.','আমাদের দল ম্যাচ জিতল।',['squad','group'],['individual','opponent']),
  w('goal','গোল/লক্ষ্য','noun','Sports','beginner','ɡoʊl','He scored a goal in the last minute.','সে শেষ মিনিটে গোল করল।',['score','target'],['miss','failure']),
  w('coach','কোচ','noun','Sports','beginner','koʊtʃ','The coach trained the team hard.','কোচ দলকে কঠোর প্রশিক্ষণ দিলেন।',['trainer','instructor'],['player','team member']),
  w('tournament','টুর্নামেন্ট','noun','Sports','intermediate','ˈtɜːr.nə.mənt','The cricket tournament starts tomorrow.','ক্রিকেট টুর্নামেন্ট আগামীকাল শুরু হয়।',['championship','competition'],['practice','training']),
  w('athlete','খেলোয়াড়/ক্রীড়াবিদ','noun','Sports','intermediate','ˈæθ.liːt','She is a world-class athlete.','সে বিশ্বমানের ক্রীড়াবিদ।',['sportsperson','player'],['spectator','coach']),
  w('stamina','সহনশক্তি','noun','Sports','intermediate','ˈstæm.ɪ.nə','Running increases your stamina.','দৌড়ানো সহনশক্তি বাড়ায়।',['endurance','resilience'],['weakness','fatigue']),
  w('sportsmanship','ক্রীড়াসুলভ আচরণ','noun','Sports','advanced','ˈspɔːrts.mən.ʃɪp','Sportsmanship means playing fairly.','ক্রীড়াসুলভ আচরণ মানে ন্যায়সঙ্গতভাবে খেলা।',['fair play','integrity'],['cheating','dishonesty']),
  w('tactical','কৌশলগত','adjective','Sports','advanced','ˈtæk.tɪ.kəl','The team made a tactical change.','দল একটি কৌশলগত পরিবর্তন করল।',['strategic','calculated'],['random','impulsive']),
  w('doping','ডোপিং/নিষিদ্ধ ওষুধ সেবন','noun','Sports','advanced','ˈdoʊ.pɪŋ','Doping is banned in all sports.','সব খেলায় ডোপিং নিষিদ্ধ।',['drug use','performance enhancement'],['clean sport','integrity']),
];

// ─── TECHNOLOGY ───────────────────────────────────────────────────────────────
const TECHNOLOGY = [
  w('computer','কম্পিউটার','noun','Technology','beginner','kəmˈpjuː.tər','The computer is on the desk.','কম্পিউটারটি ডেস্কে আছে।',['PC','laptop'],['notebook','typewriter']),
  w('internet','ইন্টারনেট','noun','Technology','beginner','ˈɪn.tə.net','The internet connects the world.','ইন্টারনেট বিশ্বকে সংযুক্ত করে।',['web','network'],['offline','disconnect']),
  w('software','সফটওয়্যার','noun','Technology','beginner','ˈsɒft.weər','This software is free to use.','এই সফটওয়্যার বিনামূল্যে ব্যবহার করা যায়।',['program','application'],['hardware','device']),
  w('hardware','হার্ডওয়্যার','noun','Technology','beginner','ˈhɑːrd.weər','The hardware was damaged in the flood.','বন্যায় হার্ডওয়্যার ক্ষতিগ্রস্ত হলো।',['device','equipment'],['software','program']),
  w('password','পাসওয়ার্ড','noun','Technology','beginner','ˈpæs.wɜːrd','Never share your password.','পাসওয়ার্ড কখনো শেয়ার করো না।',['passcode','PIN'],['public','open']),
  w('database','ডেটাবেস','noun','Technology','intermediate','ˈdeɪ.tə.beɪs','The database stores all records.','ডেটাবেস সমস্ত রেকর্ড সংরক্ষণ করে।',['data store','repository'],['delete','empty']),
  w('algorithm','অ্যালগরিদম','noun','Technology','intermediate','ˈæl.ɡə.rɪ.ðəm','The search algorithm is very fast.','সার্চ অ্যালগরিদম খুব দ্রুত।',['procedure','method'],['random','chance']),
  w('encryption','এনক্রিপশন','noun','Technology','intermediate','ɪnˈkrɪp.ʃən','Encryption protects your data.','এনক্রিপশন তোমার ডেটা রক্ষা করে।',['coding','security'],['decryption','exposure']),
  w('cybersecurity','সাইবার নিরাপত্তা','noun','Technology','advanced','ˈsaɪ.bər.sɪˌkjʊər.ɪ.ti','Cybersecurity is a growing field.','সাইবার নিরাপত্তা একটি ক্রমবর্ধমান ক্ষেত্র।',['data protection','network security'],['vulnerability','breach']),
  w('machine learning','মেশিন লার্নিং','phrase','Technology','advanced','məˈʃiːn ˈlɜːr.nɪŋ','Machine learning powers modern apps.','মেশিন লার্নিং আধুনিক অ্যাপকে চালিত করে।',['AI','deep learning'],['manual processing','hardcoding']),
  w('cloud computing','ক্লাউড কম্পিউটিং','phrase','Technology','advanced','klaʊd kəmˈpjuː.tɪŋ','Cloud computing saves storage costs.','ক্লাউড কম্পিউটিং স্টোরেজ খরচ বাঁচায়।',['remote computing','SaaS'],['local storage','on-premise']),
];

// ─── GENERAL (extra words) ─────────────────────────────────────────────────────
const GENERAL_EXTRA = [
  w('happy','সুখী','adjective','General','beginner','ˈhæp.i','She feels happy today.','আজ সে খুশি অনুভব করছে।',['joyful','glad'],['sad','miserable']),
  w('sad','দুঃখী','adjective','General','beginner','sæd','He was sad after the news.','সংবাদ শুনে সে দুঃখী হলো।',['unhappy','sorrowful'],['happy','joyful']),
  w('big','বড়','adjective','General','beginner','bɪɡ','This is a big house.','এটি একটি বড় বাড়ি।',['large','huge'],['small','tiny']),
  w('small','ছোট','adjective','General','beginner','smɔːl','The baby has small hands.','শিশুর ছোট হাত আছে।',['tiny','little'],['big','large']),
  w('fast','দ্রুত','adjective','General','beginner','fæst','The car is very fast.','গাড়িটি অনেক দ্রুত।',['quick','swift'],['slow','gradual']),
  w('slow','ধীর','adjective','General','beginner','sloʊ','Walk slow in the hospital.','হাসপাতালে আস্তে হাটো।',['gradual','steady'],['fast','quick']),
  w('beautiful','সুন্দর','adjective','General','beginner','ˈbjuː.tɪ.fəl','The sunset was beautiful.','সূর্যাস্ত সুন্দর ছিল।',['lovely','gorgeous'],['ugly','plain']),
  w('difficult','কঠিন','adjective','General','intermediate','ˈdɪf.ɪ.kəlt','The exam was difficult.','পরীক্ষাটি কঠিন ছিল।',['hard','challenging'],['easy','simple']),
  w('important','গুরুত্বপূর্ণ','adjective','General','intermediate','ɪmˈpɔːr.tənt','This meeting is very important.','এই বৈঠকটি খুব গুরুত্বপূর্ণ।',['crucial','significant'],['trivial','unimportant']),
  w('necessary','প্রয়োজনীয়','adjective','General','intermediate','ˈnes.ə.ser.i','Water is necessary for life.','জীবনের জন্য পানি প্রয়োজনীয়।',['essential','required'],['optional','unnecessary']),
  w('ambiguous','দ্ব্যর্থবোধক','adjective','General','advanced','æmˈbɪɡ.ju.əs','The instructions were ambiguous.','নির্দেশাবলী দ্ব্যর্থবোধক ছিল।',['unclear','vague'],['clear','precise']),
  w('innate','সহজাত','adjective','General','advanced','ɪˈneɪt','She has an innate talent for music.','সঙ্গীতে তার সহজাত প্রতিভা আছে।',['inborn','natural'],['learned','acquired']),
];

// ─── IELTS TOPICS (extra) ─────────────────────────────────────────────────────
const IELTS_TOPICS = [
  w('globalisation','বৈশ্বিকরণ','noun','IELTS Topics','intermediate','ˌɡloʊ.bəl.aɪˈzeɪ.ʃən','Globalisation has changed the world.','বৈশ্বিকরণ বিশ্ব পরিবর্তন করেছে।',['internationalization','integration'],['isolationism','nationalism']),
  w('urbanisation','নগরায়ণ','noun','IELTS Topics','intermediate','ˌɜːr.bən.aɪˈzeɪ.ʃən','Urbanisation is rapid in Asia.','এশিয়ায় নগরায়ণ দ্রুত ঘটছে।',['city growth','development'],['rural decline','suburbanisation']),
  w('renewable energy','নবায়নযোগ্য শক্তি','phrase','IELTS Topics','intermediate','rɪˈnjuː.ə.bl ˈen.ər.dʒi','Renewable energy is the future.','নবায়নযোগ্য শক্তি ভবিষ্যৎ।',['clean energy','sustainable energy'],['fossil fuels','non-renewable']),
  w('immigration','অভিবাসন','noun','IELTS Topics','intermediate','ˌɪm.ɪˈɡreɪ.ʃən','Immigration enriches cultures.','অভিবাসন সংস্কৃতিকে সমৃদ্ধ করে।',['migration','settlement'],['emigration','deportation']),
  w('climate change','জলবায়ু পরিবর্তন','phrase','IELTS Topics','intermediate','ˈklaɪ.mɪt tʃeɪndʒ','Climate change is a global threat.','জলবায়ু পরিবর্তন বৈশ্বিক হুমকি।',['global warming','environmental crisis'],['climate stability','status quo']),
  w('overpopulation','অতিরিক্ত জনসংখ্যা','noun','IELTS Topics','advanced','ˌoʊ.vər.pɒp.jʊˈleɪ.ʃən','Overpopulation strains resources.','অতিরিক্ত জনসংখ্যা সম্পদের উপর চাপ দেয়।',['overcrowding','population explosion'],['underpopulation','sparse population']),
  w('deforestation','বন উজাড়','noun','IELTS Topics','advanced','ˌdiː.fɒr.ɪˈsteɪ.ʃən','Deforestation causes floods.','বন উজাড় বন্যা সৃষ্টি করে।',['forest clearing','logging'],['reforestation','afforestation']),
  w('consumerism','ভোক্তাবাদ','noun','IELTS Topics','advanced','kənˈsjuː.mər.ɪ.zəm','Consumerism leads to waste.','ভোক্তাবাদ অপচয় ঘটায়।',['materialism','commercialism'],['minimalism','sustainability']),
  w('social media','সামাজিক মাধ্যম','phrase','IELTS Topics','beginner','ˈsoʊ.ʃəl ˈmiː.di.ə','Social media connects people.','সামাজিক মাধ্যম মানুষকে সংযুক্ত করে।',['online platforms','networking'],['offline','isolation']),
  w('mental health','মানসিক স্বাস্থ্য','phrase','IELTS Topics','beginner','ˈmen.t əl helθ','Mental health is as important as physical health.','মানসিক স্বাস্থ্য শারীরিক স্বাস্থ্যের মতোই গুরুত্বপূর্ণ।',['psychological wellbeing','emotional health'],['mental illness','stress']),
];

// ─── EVERYDAY OBJECTS (extra) ─────────────────────────────────────────────────
const EVERYDAY_OBJECTS = [
  w('chair','চেয়ার','noun','Everyday Objects','beginner','tʃeər','Please sit on the chair.','দয়া করে চেয়ারে বসো।',['seat','stool'],['table','floor']),
  w('table','টেবিল','noun','Everyday Objects','beginner','ˈteɪ.bəl','Put the books on the table.','বইগুলো টেবিলে রাখো।',['desk','surface'],['chair','bench']),
  w('bag','ব্যাগ','noun','Everyday Objects','beginner','bæɡ','She carried a heavy bag.','সে ভারী ব্যাগ বহন করল।',['sack','pouch'],['pocket','wallet']),
  w('key','চাবি','noun','Everyday Objects','beginner','kiː','The key is on the door.','চাবি দরজায় আছে।',['lock key','opener'],['lock','door']),
  w('phone','ফোন','noun','Everyday Objects','beginner','foʊn','My phone needs charging.','আমার ফোনে চার্জ দেওয়া দরকার।',['mobile','device'],['letter','email']),
  w('clock','ঘড়ি','noun','Everyday Objects','beginner','klɒk','The clock shows nine oclock.','ঘড়িতে নয়টা দেখাচ্ছে।',['timepiece','watch'],['sundial','guess']),
  w('umbrella','ছাতা','noun','Everyday Objects','beginner','ʌmˈbrel.ə','Take an umbrella in case of rain.','বৃষ্টির জন্য ছাতা নাও।',['parasol','brolly'],['sun','clear weather']),
  w('mirror','আয়না','noun','Everyday Objects','beginner','ˈmɪr.ər','She looked at herself in the mirror.','সে আয়নায় নিজেকে দেখল।',['glass','reflector'],['window','screen']),
  w('refrigerator','রেফ্রিজারেটর/ফ্রিজ','noun','Everyday Objects','intermediate','rɪˈfrɪdʒ.ər.eɪ.tər','Keep the milk in the refrigerator.','দুধ রেফ্রিজারেটরে রাখো।',['fridge','cooler'],['oven','heater']),
  w('microwave','মাইক্রোওয়েভ','noun','Everyday Objects','intermediate','ˈmaɪ.krə.weɪv','Heat the food in the microwave.','মাইক্রোওয়েভে খাবার গরম করো।',['oven','heater'],['fridge','cooler']),
  w('stethoscope','স্টেথোস্কোপ','noun','Everyday Objects','advanced','ˈsteθ.ə.skoʊp','The doctor used a stethoscope.','ডাক্তার স্টেথোস্কোপ ব্যবহার করলেন।',['medical device'],['syringe','scalpel']),
];

// ─── DESCRIPTIVE WORDS (extra) ────────────────────────────────────────────────
const DESCRIPTIVE_WORDS = [
  w('bright','উজ্জ্বল','adjective','Descriptive Words','beginner','braɪt','The room is bright and cheerful.','ঘরটি উজ্জ্বল ও প্রাণবন্ত।',['shiny','vivid'],['dark','dim']),
  w('dark','অন্ধকার','adjective','Descriptive Words','beginner','dɑːrk','The room was very dark.','ঘরটি খুব অন্ধকার ছিল।',['dim','shadowy'],['bright','light']),
  w('clean','পরিষ্কার','adjective','Descriptive Words','beginner','kliːn','Keep the classroom clean.','শ্রেণীকক্ষ পরিষ্কার রাখো।',['tidy','spotless'],['dirty','messy']),
  w('dirty','ময়লা','adjective','Descriptive Words','beginner','ˈdɜːr.ti','The streets were dirty after rain.','বৃষ্টির পরে রাস্তা ময়লা ছিল।',['messy','filthy'],['clean','tidy']),
  w('hot','গরম','adjective','Descriptive Words','beginner','hɒt','It is very hot today.','আজ খুব গরম।',['warm','scorching'],['cold','cool']),
  w('cold','ঠান্ডা','adjective','Descriptive Words','beginner','koʊld','The water is very cold.','পানিটি খুব ঠান্ডা।',['cool','chilly'],['hot','warm']),
  w('friendly','বন্ধুত্বপূর্ণ','adjective','Descriptive Words','intermediate','ˈfrend.li','The people here are very friendly.','এখানকার মানুষ খুব বন্ধুত্বপূর্ণ।',['kind','warm'],['hostile','unfriendly']),
  w('intelligent','বুদ্ধিমান','adjective','Descriptive Words','intermediate','ɪnˈtel.ɪ.dʒənt','She is a very intelligent student.','সে খুব বুদ্ধিমান শিক্ষার্থী।',['smart','clever'],['foolish','ignorant']),
  w('generous','উদার','adjective','Descriptive Words','intermediate','ˈdʒen.ər.əs','He is generous with his time.','সে তার সময়ের ব্যাপারে উদার।',['giving','kind'],['selfish','greedy']),
  w('pessimistic','হতাশাবাদী','adjective','Descriptive Words','advanced','ˌpes.ɪˈmɪs.tɪk','She was pessimistic about the result.','সে ফলাফল নিয়ে হতাশাবাদী ছিল।',['negative','gloomy'],['optimistic','hopeful']),
  w('resilient','সহনশীল','adjective','Descriptive Words','advanced','rɪˈzɪl.i.ənt','She is resilient despite challenges.','চ্যালেঞ্জ সত্ত্বেও সে সহনশীল।',['strong','tough'],['fragile','vulnerable']),
];

// ─── OPPOSITE ADJECTIVES (extra, covering more pairs) ─────────────────────────
const OPPOSITE_ADJECTIVES = [
  w('rich','ধনী','adjective','Opposite Adjectives','beginner','rɪtʃ','He is a rich businessman.','সে একজন ধনী ব্যবসায়ী।',['wealthy','affluent'],['poor','broke']),
  w('poor','গরীব','adjective','Opposite Adjectives','beginner','pɔːr','The poor family needed help.','গরীব পরিবারটির সাহায্য দরকার ছিল।',['needy','impoverished'],['rich','wealthy']),
  w('strong','শক্তিশালী','adjective','Opposite Adjectives','beginner','strɒŋ','He is physically very strong.','সে শারীরিকভাবে খুব শক্তিশালী।',['powerful','mighty'],['weak','frail']),
  w('weak','দুর্বল','adjective','Opposite Adjectives','beginner','wiːk','The signal is too weak here.','এখানে সংকেত খুব দুর্বল।',['fragile','feeble'],['strong','powerful']),
  w('new','নতুন','adjective','Opposite Adjectives','beginner','njuː','This is a new building.','এটি একটি নতুন ভবন।',['fresh','recent'],['old','ancient']),
  w('old','পুরনো','adjective','Opposite Adjectives','beginner','oʊld','The old bridge needs repair.','পুরনো সেতুটির মেরামত দরকার।',['aged','ancient'],['new','modern']),
  w('true','সত্য','adjective','Opposite Adjectives','intermediate','truː','That is a true story.','এটি একটি সত্য গল্প।',['real','genuine'],['false','untrue']),
  w('false','মিথ্যা','adjective','Opposite Adjectives','intermediate','fɔːls','His statement was false.','তার বিবৃতি মিথ্যা ছিল।',['wrong','untrue'],['true','correct']),
  w('confident','আত্মবিশ্বাসী','adjective','Opposite Adjectives','intermediate','ˈkɒn.fɪ.dənt','Be confident in your abilities.','তোমার দক্ষতায় আত্মবিশ্বাসী হও।',['self-assured','bold'],['shy','timid']),
  w('humble','বিনয়ী','adjective','Opposite Adjectives','intermediate','ˈhʌm.bəl','She is humble despite her success.','সাফল্য সত্ত্বেও সে বিনয়ী।',['modest','meek'],['arrogant','proud']),
  w('superficial','উপরিভাগীয়','adjective','Opposite Adjectives','advanced','ˌsuː.pəˈfɪʃ.əl','His understanding was superficial.','তার বোঝাপড়া ছিল উপরিভাগীয়।',['shallow','surface'],['deep','profound']),
  w('profound','গভীর','adjective','Opposite Adjectives','advanced','prəˈfaʊnd','She has a profound understanding of math.','গণিতে তার গভীর বোঝাপড়া আছে।',['deep','meaningful'],['superficial','shallow']),
];

// ─── GRAMMAR (extra intermediate/advanced) ────────────────────────────────────
const GRAMMAR_EXTRA = [
  w('clause','উপবাক্য','noun','Grammar','intermediate','klɔːz','A clause has a subject and verb.','একটি উপবাক্যে কর্তা ও ক্রিয়া থাকে।',['phrase','sentence'],['word','syllable']),
  w('syntax','বাক্যগঠন','noun','Grammar','intermediate','ˈsɪn.tæks','Learn syntax to write correctly.','সঠিকভাবে লিখতে বাক্যগঠন শেখো।',['grammar','structure'],['vocabulary','meaning']),
  w('tense','কাল','noun','Grammar','intermediate','tens','Past tense describes completed actions.','অতীত কাল সম্পূর্ণ কাজ বোঝায়।',['time form','verbal form'],['aspect','mood']),
  w('participle','কৃদন্ত পদ','noun','Grammar','advanced','ˈpɑːr.tɪ.sɪ.pəl','A participle can act as an adjective.','কৃদন্ত পদ বিশেষণ হিসেবে কাজ করতে পারে।',['verb form'],['noun','pronoun']),
  w('gerund','ক্রিয়াবাচক বিশেষ্য','noun','Grammar','advanced','ˈdʒer.ənd','Swimming is a gerund in this sentence.','এই বাক্যে সাঁতার কাটা একটি ক্রিয়াবাচক বিশেষ্য।',['verb-noun'],['adjective','adverb']),
  w('passive voice','কর্মবাচ্য','phrase','Grammar','intermediate','ˈpæs.ɪv vɔɪs','The book was written by her (passive voice).','বইটি তার দ্বারা লেখা হয়েছিল (কর্মবাচ্য)।',['passive construction'],['active voice','direct speech']),
  w('conditional','শর্তযুক্ত','adjective','Grammar','advanced','kənˈdɪʃ.ən.əl','Conditional sentences use if.','শর্তযুক্ত বাক্যে if ব্যবহার হয়।',['hypothetical','dependent'],['definite','certain']),
];

export const VOCABULARY_BIG_SEED = [
  ...ACADEMIC,
  ...ANIMALS,
  ...BUSINESS,
  ...COMMUNICATION_EXTRA,
  ...LEGAL,
  ...LITERATURE,
  ...MEDICAL,
  ...NATURE,
  ...PROFESSIONAL,
  ...SCIENCE,
  ...SPORTS,
  ...TECHNOLOGY,
  ...GENERAL_EXTRA,
  ...IELTS_TOPICS,
  ...EVERYDAY_OBJECTS,
  ...DESCRIPTIVE_WORDS,
  ...OPPOSITE_ADJECTIVES,
  ...GRAMMAR_EXTRA,
];
