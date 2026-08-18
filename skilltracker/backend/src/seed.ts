import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Opportunity, Exam, Question, Test, News, Roadmap, User } from './models/Schemas';

dotenv.config();

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/careerverse';

const seedData = async () => {
  try {
    console.log('Connecting to database for seeding...');
    await mongoose.connect(MONGODB_URI);
    console.log('Connected to MongoDB.');

    // Clear existing collections
    console.log('Clearing existing collection data...');
    await Opportunity.deleteMany({});
    await Exam.deleteMany({});
    await Question.deleteMany({});
    await Test.deleteMany({});
    await News.deleteMany({});
    await Roadmap.deleteMany({});
    console.log('Collections cleared.');

    // 1. Create 10 Government Jobs
    console.log('Seeding government jobs...');
    const govJobs = [
      {
        type: 'government_job',
        title: 'Assistant Section Officer (ASO)',
        organization: 'Staff Selection Commission (SSC CGL)',
        description: 'Assisting Section Officers in drafting notes, communication, and files processing in Central Secretariat Service.',
        vacancies: 950,
        qualification: 'Bachelor\'s Degree in any discipline from a recognized University.',
        ageLimit: '20 to 30 Years (Relaxation as per norms)',
        salary: '₹44,900 - ₹1,42,400 (Level 7 Pay Matrix)',
        location: 'New Delhi / Anywhere in India',
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
        eligibility: 'Must be an Indian Citizen, aged between 20-30, and hold a graduation degree.',
        selectionProcess: 'Computer Based Exams (Tier I & Tier II) followed by document verification.',
        examPattern: 'Tier I: 100 Questions (General Intelligence, Reasoning, Quantitative Aptitude, English Comprehension).',
        syllabus: 'General Intelligence & Reasoning, General Awareness, Quantitative Aptitude, English Comprehension.',
        officialUrl: 'https://ssc.gov.in',
        domain: 'Administration',
        tags: ['ssc', 'cgl', 'government', 'aso', 'graduation']
      },
      {
        type: 'government_job',
        title: 'Scientist/Engineer \'SC\' (Computer Science)',
        organization: 'Indian Space Research Organisation (ISRO)',
        description: 'Design, development, and maintenance of software systems, satellite payload controls, and computational models.',
        vacancies: 45,
        qualification: 'B.E/B.Tech in Computer Science & Engineering with first class (minimum 65% marks or 6.84 CGPA).',
        ageLimit: 'Up to 28 Years',
        salary: '₹56,100 (Basic Pay) + Allowances (approx. ₹95,000/month)',
        location: 'Bangalore / Trivandrum / Ahmedabad',
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        eligibility: 'First-class engineering graduates in CSE/IT disciplines.',
        selectionProcess: 'Written examination followed by academic vetting and technical interview.',
        examPattern: '80 MCQs on Core CSE Topics (Data Structures, OS, DBMS, Networks, Mathematics) in 120 minutes.',
        syllabus: 'Discrete Mathematics, Computer Architecture, Programming, Data Structures, Algorithms, OS, DBMS, Networks, Theory of Computation.',
        officialUrl: 'https://isro.gov.in',
        domain: 'Engineering',
        tags: ['isro', 'scientist', 'engineering', 'cse', 'research']
      },
      {
        type: 'government_job',
        title: 'Civil Services Officer (IAS/IFS/IPS)',
        organization: 'Union Public Service Commission (UPSC)',
        description: 'Elite administrative, police, and foreign service positions managing policy implementation, public administration, and security.',
        vacancies: 1050,
        qualification: 'Graduate degree in any discipline from a recognized university.',
        ageLimit: '21 to 32 Years (Relaxations apply for OBC/SC/ST)',
        salary: '₹56,100 (Basic Level 10 Pay Matrix) + Government Bungalow/Vehicle',
        location: 'Anywhere in India',
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        eligibility: 'Indian Citizen holding a recognized bachelor\'s degree.',
        selectionProcess: 'Prelims (CSAT), Mains (9 Descriptive Papers), and Personality Test (Interview).',
        examPattern: 'Prelims: 2 papers (General Studies 200 marks, CSAT 200 marks - qualifying).',
        syllabus: 'History, Geography, Polity, Economics, Environment, Science & Tech, Current Affairs, Essay Writing, Optional Subjects.',
        officialUrl: 'https://upsc.gov.in',
        domain: 'Civil Services',
        tags: ['upsc', 'ias', 'civil services', 'government', 'administrative']
      },
      {
        type: 'government_job',
        title: 'Station Master',
        organization: 'Railway Recruitment Board (RRB NTPC)',
        description: 'Supervising railway movements, managing train departures, platform operations, and customer safety at train terminals.',
        vacancies: 1200,
        qualification: 'Degree from recognized University or its equivalent.',
        ageLimit: '18 to 33 Years',
        salary: '₹35,400 (Level 6) + Allowances',
        location: 'Any Railway Zone in India',
        endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        eligibility: 'Graduation degree with visual acuity standard A-2.',
        selectionProcess: '1st Stage CBT, 2nd Stage CBT, Computer Based Aptitude Test (CBAT), and Document Verification.',
        examPattern: 'CBT Stage 1: General Awareness (40), Mathematics (30), General Intelligence & Reasoning (30).',
        syllabus: 'Arithmetic, Algebra, Analytical Reasoning, Coding-Decoding, Indian Geography, Science, Polity.',
        officialUrl: 'https://indianrailways.gov.in',
        domain: 'Railways',
        tags: ['rrb', 'ntpc', 'station master', 'railways']
      },
      {
        type: 'government_job',
        title: 'Scientific Officer \'C\'',
        organization: 'Bhabha Atomic Research Centre (BARC)',
        description: 'Nuclear physics research, materials testing, reactor operations, and computational software validation.',
        vacancies: 60,
        qualification: 'B.E / B.Tech / B.Sc (Engineering) with minimum 60% aggregate marks.',
        ageLimit: 'Up to 26 Years',
        salary: '₹56,100 (Level 10) + Allowances',
        location: 'Mumbai / Kalpakkam / Tarapur',
        endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        eligibility: 'Engineering Graduates or Science Postgraduates with high academic index.',
        selectionProcess: 'GATE Score Screening or Online Written Exam, followed by tough technical interview round.',
        examPattern: '100 Core Questions in 120 minutes. Negative markings apply.',
        syllabus: 'Physics, Thermodynamics, Digital Electronics, Electromagnetics, Database systems, Computational Math.',
        officialUrl: 'https://barconlineexam.gov.in',
        domain: 'Engineering',
        tags: ['barc', 'scientific', 'nuclear', 'engineering']
      },
      {
        type: 'government_job',
        title: 'Probationary Officer (PO)',
        organization: 'State Bank of India (SBI)',
        description: 'Managing customer accounts, loan processing, treasury operations, and marketing branch banking products.',
        vacancies: 2000,
        qualification: 'Graduation in any discipline from a recognized University or final year students.',
        ageLimit: '21 to 30 Years',
        salary: 'Basic ₹41,960 + DA, HRA, CCA (Gross package around ₹65,000/month)',
        location: 'Anywhere in India',
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // urgent
        eligibility: 'Any graduate. Candidates in the final semester can also apply.',
        selectionProcess: 'Preliminary Exam, Main Exam, Psychometric Test, Group Exercise, and Interview.',
        examPattern: 'Prelims: English Language (30), Quantitative Aptitude (35), Reasoning Ability (35).',
        syllabus: 'Data Analysis, Reasoning, English Grammar, General Economy, Banking Awareness, Letter & Essay Writing.',
        officialUrl: 'https://sbi.co.in/careers',
        domain: 'Banking',
        tags: ['sbi', 'banking', 'po', 'finance', 'officer']
      },
      {
        type: 'government_job',
        title: 'Assistant Administrative Officer (AAO)',
        organization: 'Life Insurance Corporation of India (LIC)',
        description: 'Reviewing insurance applications, claim approvals, public relations, and auditing sales branches.',
        vacancies: 300,
        qualification: 'Bachelor\'s Degree in any discipline from a recognized Indian University.',
        ageLimit: '21 to 30 Years',
        salary: '₹53,600 per month basic pay + other benefits',
        location: 'Divisional offices across India',
        endDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        eligibility: 'Graduate in any subject.',
        selectionProcess: 'Preliminary Examination, Mains Examination, followed by Personal Interview.',
        examPattern: 'Prelims: Quantitative, Reasoning, English (Qualifying only).',
        syllabus: 'General Knowledge, Current Affairs, Insurance & Financial Market Awareness, Professional Knowledge.',
        officialUrl: 'https://licindia.in',
        domain: 'Insurance',
        tags: ['lic', 'insurance', 'aao', 'administration']
      },
      {
        type: 'government_job',
        title: 'Group II Non-Interview Assistant',
        organization: 'Tamil Nadu Public Service Commission (TNPSC)',
        description: 'Administrative support in government departments, treasury desks, revenue administration, and registration offices.',
        vacancies: 2400,
        qualification: 'Any Degree from a recognized university.',
        ageLimit: '18 to 32 Years',
        salary: '₹20,600 - ₹75,900 (Level 10 Pay)',
        location: 'Tamil Nadu',
        endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        eligibility: 'Tamil language proficiency is mandatory. Graduation required.',
        selectionProcess: 'Single Stage written examination (Prelims & Mains).',
        examPattern: 'Prelims: General Studies (175 items) + Aptitude (25 items) = 200 items in 3 hours.',
        syllabus: 'General Studies, History & Culture of India, Tamil Nadu Heritage, Aptitude and Mental Ability, Current Events.',
        officialUrl: 'https://tnpsc.gov.in',
        domain: 'Administration',
        tags: ['tnpsc', 'group 2', 'state govt', 'assistant']
      },
      {
        type: 'government_job',
        title: 'Junior Research Fellow (JRF)',
        organization: 'Defence Research and Development Organisation (DRDO)',
        description: 'Conducting defense-oriented research in aerodynamics, cryptography, composite materials, and simulation software.',
        vacancies: 15,
        qualification: 'B.E/B.Tech in Mechanical/Electrical/CSE with first division and valid GATE score.',
        ageLimit: 'Max 28 Years',
        salary: '₹37,000 + HRA per month',
        location: 'Pune / Hyderabad / Bangalore',
        endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        eligibility: 'B.E/B.Tech with valid GATE Score or M.E/M.Tech first class.',
        selectionProcess: 'Screening of applications followed by online test and panel interview.',
        examPattern: 'Interview based, sometimes preceded by a written technical screening test.',
        syllabus: 'Core engineering concepts, math, programming basics, research methodology.',
        officialUrl: 'https://drdo.gov.in',
        domain: 'Research',
        tags: ['drdo', 'jrf', 'research', 'defense', 'engineering']
      },
      {
        type: 'government_job',
        title: 'Commissioned Officer (AFCAT)',
        organization: 'Indian Air Force (IAF)',
        description: 'Flying branch (pilot), ground duty technical, and ground duty non-technical (logistics, accounts) administration roles.',
        vacancies: 310,
        qualification: 'Graduation with physics & math at 10+2 level or B.E/B.Tech with minimum 60% marks.',
        ageLimit: '20 to 26 Years',
        salary: '₹56,100 (Officer Cadet stipend) rising to Level 10 scales + flying allowances',
        location: 'Any Air Force Station in India',
        endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        eligibility: 'Physically fit candidates with graduation background.',
        selectionProcess: 'AFCAT written test, followed by AFSB SSB interview (5-day testing) and medical exams.',
        examPattern: 'AFCAT: General Awareness, Verbal Ability, Numerical Ability, Reasoning & Military Aptitude.',
        syllabus: 'English grammar, vocabulary, speed math, military aptitude patterns, history, sports, defense news.',
        officialUrl: 'https://careerindianairforce.cdac.in',
        domain: 'Defense',
        tags: ['iaf', 'afcat', 'pilot', 'defense', 'officer']
      }
    ];

    await Opportunity.insertMany(govJobs);
    console.log('Seeded 10 Government Jobs.');

    // 2. Create 10 Private Jobs
    console.log('Seeding private jobs...');
    const privateJobs = [
      {
        type: 'job',
        title: 'Software Engineer I',
        organization: 'Google',
        description: 'Develop the next generation of technologies that change how billions of users connect, explore, and interact with information.',
        qualification: 'Bachelor\'s degree in Computer Science, related technical field, or equivalent practical experience.',
        salary: '₹18,00,000 - ₹24,00,000 / year',
        location: 'Bangalore, India',
        endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        eligibility: 'Experience in C++, Java, Python, Go. Understanding of data structures & algorithms.',
        officialUrl: 'https://careers.google.com',
        remoteOrOnsite: 'hybrid',
        domain: 'CSE',
        tags: ['google', 'software engineer', 'coding', 'algorithms', 'entry-level']
      },
      {
        type: 'job',
        title: 'Data Analyst',
        organization: 'Amazon',
        description: 'Provide database querying, design analytical tools, compile business metrics, and write deep-dive summaries to support executives.',
        qualification: 'Degree in Statistics, CSE, Math, Economics or related fields.',
        salary: '₹8,00,000 - ₹12,00,000 / year',
        location: 'Hyderabad, India',
        endDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        eligibility: 'Proficiency in SQL, Excel, and Tableau/QuickSight. Working knowledge of Python.',
        officialUrl: 'https://amazon.jobs',
        remoteOrOnsite: 'onsite',
        domain: 'IT',
        tags: ['amazon', 'data analyst', 'sql', 'tableau', 'excel']
      },
      {
        type: 'job',
        title: 'Associate Frontend Developer',
        organization: 'Microsoft',
        description: 'Build responsive and modern web interfaces using React, TypeScript, and Microsoft Fluent Design system.',
        qualification: 'Bachelor\'s in CSE, IT or electrical disciplines.',
        salary: '₹14,00,000 - ₹18,00,000 / year',
        location: 'Hyderabad, India',
        endDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
        eligibility: 'HTML5, CSS3, ES6 JavaScript, React, Redux, and modern styling libraries.',
        officialUrl: 'https://careers.microsoft.com',
        remoteOrOnsite: 'hybrid',
        domain: 'CSE',
        tags: ['microsoft', 'frontend', 'react', 'typescript']
      },
      {
        type: 'job',
        title: 'AI Resident Scientist',
        organization: 'OpenAI',
        description: 'Train and fine-tune large language models, research reinforcement learning, and develop agents.',
        qualification: 'Ph.D. or Master\'s degree in ML, CSE, Mathematics, or equivalent experience.',
        salary: '$180,000 - $250,000 / year',
        location: 'San Francisco, CA (H1B / Remote options)',
        endDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
        eligibility: 'Strong publications record (NeurIPS, ICML, CVPR) or advanced open-source contributions.',
        officialUrl: 'https://openai.com/careers',
        remoteOrOnsite: 'remote',
        domain: 'CSE',
        tags: ['openai', 'ai', 'research', 'deep learning', 'nlp']
      },
      {
        type: 'job',
        title: 'Cloud Support Engineer',
        organization: 'Amazon Web Services (AWS)',
        description: 'Provide technical assistance to AWS customers, troubleshoot network architecture, and script automation hooks.',
        qualification: 'Degree in CSE, IT, ECE or related engineering streams.',
        salary: '₹10,00,000 - ₹13,50,000 / year',
        location: 'Bangalore, India',
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        eligibility: 'Linux, Networking (TCP/IP), DNS, Cloud architecture, and Python/Bash scripting.',
        officialUrl: 'https://amazon.jobs',
        remoteOrOnsite: 'onsite',
        domain: 'IT',
        tags: ['aws', 'cloud', 'networking', 'linux', 'ops']
      },
      {
        type: 'job',
        title: 'Cybersecurity Associate Analyst',
        organization: 'Palo Alto Networks',
        description: 'Monitor threat logs, investigate security alerts, perform vulnerability testing, and deploy firewall rules.',
        qualification: 'B.Tech/B.Sc in CSE or Information Security.',
        salary: '₹9,00,000 - ₹12,00,000 / year',
        location: 'Bangalore, India',
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        eligibility: 'Understanding of firewalls, cryptography, ethical hacking, and incident response.',
        officialUrl: 'https://paloaltonetworks.com/careers',
        remoteOrOnsite: 'onsite',
        domain: 'IT',
        tags: ['security', 'cybersecurity', 'firewalls', 'cryptography']
      },
      {
        type: 'job',
        title: 'Backend Engineer (API Team)',
        organization: 'Stripe',
        description: 'Design robust APIs, scale payment processors, and write high-throughput databases integrations.',
        qualification: 'Graduation in Computer Science or similar practical software building experience.',
        salary: '₹22,00,000 - ₹28,00,000 / year',
        location: 'Remote (India)',
        endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        eligibility: 'Highly proficient in Ruby, Java, Go, or Python. Experience designing microservices.',
        officialUrl: 'https://stripe.com/jobs',
        remoteOrOnsite: 'remote',
        domain: 'CSE',
        tags: ['stripe', 'backend', 'api', 'databases', 'payments']
      },
      {
        type: 'job',
        title: 'Full Stack Engineer (L3)',
        organization: 'Meta',
        description: 'Develop products across social apps, scale graph database endpoints, and construct user flows.',
        qualification: 'B.E/B.Tech or MS in CS.',
        salary: '₹25,00,000 - ₹32,00,000 / year',
        location: 'Bangalore, India',
        endDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000),
        eligibility: 'Full stack development experience using React, GraphQL, Node.js, and relational databases.',
        officialUrl: 'https://meta.com/careers',
        remoteOrOnsite: 'hybrid',
        domain: 'CSE',
        tags: ['meta', 'fullstack', 'react', 'graphql', 'node']
      },
      {
        type: 'job',
        title: 'Associate UI/UX Designer',
        organization: 'Figma',
        description: 'Create interface layouts, wireframes, user personas, and conduct UX experiments for collaborative tools.',
        qualification: 'Degree/Diploma in Design, Human-Computer Interaction, or CSE with design portfolio.',
        salary: '₹12,00,000 - ₹16,00,000 / year',
        location: 'Remote (India)',
        endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        eligibility: 'Expertise in Figma, design systems, vector art, wireframing, and user research methodologies.',
        officialUrl: 'https://figma.com/careers',
        remoteOrOnsite: 'remote',
        domain: 'Design',
        tags: ['figma', 'ux', 'ui', 'design', 'hci']
      },
      {
        type: 'job',
        title: 'Site Reliability Engineer (SRE)',
        organization: 'Netflix',
        description: 'Manage live streaming servers traffic, deploy Kubernetes pods, optimize Docker images, and debug AWS latency issues.',
        qualification: 'Bachelor\'s degree in CSE, IT or relevant field.',
        salary: '₹26,00,000 - ₹34,00,000 / year',
        location: 'Mumbai, India',
        endDate: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000),
        eligibility: 'Deep expertise in Kubernetes, Docker, Terraform, CI/CD pipelines, and Python automation scripts.',
        officialUrl: 'https://jobs.netflix.com',
        remoteOrOnsite: 'hybrid',
        domain: 'CSE',
        tags: ['netflix', 'sre', 'devops', 'kubernetes', 'cloud']
      }
    ];

    await Opportunity.insertMany(privateJobs);
    console.log('Seeded 10 Private Jobs.');

    // 3. Create 10 Scholarships
    console.log('Seeding scholarships...');
    const scholarships = [
      {
        type: 'scholarship',
        title: 'Reliance Foundation Undergraduate Scholarships',
        organization: 'Reliance Foundation',
        description: 'Supporting meritorious undergraduate students from all fields to complete their degree studies in India.',
        qualification: '1st Year Full-time UG students with minimum 60% in 12th board exams.',
        salary: 'Up to ₹2,00,000 over the duration of degree',
        location: 'India',
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        eligibility: 'Annual family income must be less than ₹15,00,000. Priority to income below ₹2,50,000.',
        benefits: 'Cash grant, mentorship, alumni networks, and leadership modules.',
        documents: ['10th & 12th Marksheets', 'Family Income Certificate', 'College Admission Proof', 'Identity Proof'],
        officialUrl: 'https://reliancefoundation.org',
        domain: 'General',
        tags: ['reliance', 'scholarship', 'undergraduate', 'financial-aid']
      },
      {
        type: 'scholarship',
        title: 'Aditya Birla Academy Scholarship',
        organization: 'Aditya Birla Group',
        description: 'Prestigious scholarship awarded to students at top institutes like IITs, BITS, IIMs, and Law Colleges.',
        qualification: 'Students currently enrolled in first-year of Engineering, Management, or Law at premier colleges.',
        salary: '₹1,50,000 - ₹3,00,000 per annum',
        location: 'India',
        endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        eligibility: 'Shortlisting based on academic entry ranks and subsequent essays and interviews.',
        benefits: 'Full tuition support, direct pathways to group internships.',
        documents: ['Admission Letter', 'JEE/CAT entrance ranks card', 'Essay writing submission'],
        officialUrl: 'https://adityabirlascholars.net',
        domain: 'Elite',
        tags: ['aditya birla', 'scholarship', 'iit', 'iim', 'bits']
      },
      {
        type: 'scholarship',
        title: 'Adobe Women-in-Technology Scholarship',
        organization: 'Adobe Research',
        description: 'Empowering outstanding female computer science students globally to pursue careers in computing.',
        qualification: 'Female students pursuing undergraduate or master\'s in CSE, IT, Data Science or Math.',
        salary: '$25,000 (One-time award) + free Creative Cloud license',
        location: 'Global (India Eligible)',
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        eligibility: 'Must be a full-time female student pursuing computing. Evaluated on academic merit and coding profile.',
        benefits: 'Funding for tuition, interview pathway for Adobe research internships.',
        documents: ['Resume', 'Academic Transcript', 'Two letters of recommendation', 'Answer to essay prompts'],
        officialUrl: 'https://research.adobe.com/scholarships',
        domain: 'CSE',
        tags: ['adobe', 'female', 'scholarship', 'women-in-tech', 'cse']
      },
      {
        type: 'scholarship',
        title: 'Fulbright-Nehru Master\'s Fellowships',
        organization: 'USIEF (United States-India Educational Foundation)',
        description: 'For outstanding Indians to pursue a master\'s degree program at selected U.S. colleges and universities.',
        qualification: 'Bachelor\'s degree with at least 55% marks, and minimum 3 years of work experience.',
        salary: 'Full tuition, living stipend, medical, and airfare covered',
        location: 'USA Universities',
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        eligibility: 'Indian citizen with high leadership capability, TOEFL score, and professional record.',
        benefits: 'Complete study costs funded, J-1 visa sponsorship, pre-departure orientations.',
        documents: ['Academic transcripts', 'TOEFL Score card', 'Professional reference letters', 'Detailed study objectives essay'],
        officialUrl: 'https://usief.org.in',
        domain: 'Higher Studies',
        tags: ['fulbright', 'usa', 'masters', 'fellowship', 'study-abroad']
      },
      {
        type: 'scholarship',
        title: 'HDFC Educational Crisis Scholarship',
        organization: 'HDFC Bank',
        description: 'Supporting students who are facing a sudden financial crisis in their family to prevent drop-outs.',
        qualification: 'Students in school (class 6-12) or pursuing UG/PG degrees.',
        salary: '₹35,000 - ₹75,000 depending on level',
        location: 'India',
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        eligibility: 'Students experiencing family crisis (loss of earning member, critical illness, natural disaster).',
        benefits: 'Direct tuition reimbursement to college/school.',
        documents: ['Income proof', 'Crisis declaration affidavit', 'College marks sheet'],
        officialUrl: 'https://hdfcbank.com',
        domain: 'Crisis Support',
        tags: ['hdfc', 'scholarship', 'financial-aid', 'emergency']
      },
      {
        type: 'scholarship',
        title: 'L\'Oréal India For Young Women in Science',
        organization: 'L\'Oréal India',
        description: 'Encouraging young women to pursue higher studies in science and tech fields.',
        qualification: 'Female students who passed 12th science stream in the current year with 85% aggregate.',
        salary: 'Up to ₹2,50,000 for graduation studies',
        location: 'India',
        endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        eligibility: 'Family income must not exceed ₹6,00,000/annum. Must enroll in science degree.',
        benefits: 'Financial grants, mentorship cycles with senior women scientists.',
        documents: ['12th Marksheet', 'Income Proof', 'Admission confirmation letter'],
        officialUrl: 'https://foryoungwomeninscience.co.in',
        domain: 'Science',
        tags: ['loreal', 'women', 'science', 'scholarship', 'graduation']
      },
      {
        type: 'scholarship',
        title: 'Narotam Sekhsaria PG Scholarship',
        organization: 'Narotam Sekhsaria Foundation',
        description: 'Interest-free loan scholarships for Indian students with high academic records pursuing PG studies abroad or in India.',
        qualification: 'Graduates planning postgraduate studies at elite institutions from Autumn term.',
        salary: 'Up to ₹20,00,000 (Interest-free loan)',
        location: 'Global',
        endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        eligibility: 'Indian national, age below 30. Enrolled or applied to top postgraduate colleges.',
        benefits: 'High financing, direct mentorship panels, alumni connects.',
        documents: ['University offer letter', 'GRE/GMAT scores', 'Detailed academic transcripts', 'Income statements'],
        officialUrl: 'https://pg.nsfoundation.co.in',
        domain: 'Higher Studies',
        tags: ['sekhsaria', 'loan scholarship', 'postgraduate', 'study-abroad']
      },
      {
        type: 'scholarship',
        title: 'Rhodes Scholarship for India',
        organization: 'The Rhodes Trust',
        description: 'Fully funded postgraduate award enabling exceptional young people from India to study at the University of Oxford.',
        qualification: 'Undergraduate degree holder from recognized university with high first-class honors.',
        salary: 'All Oxford tuition fees + Monthly living stipend (approx. £18,000/year)',
        location: 'Oxford University, UK',
        endDate: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000),
        eligibility: 'Indian citizen, aged 20-25, exhibiting exceptional intellect, character, and leadership potential.',
        benefits: 'Tuition fees, living expenses, airfare, health insurance, Oxford cohort workshops.',
        documents: ['Birth certificate', 'Academic references (6 letters)', 'Personal Statement essay', 'CV'],
        officialUrl: 'https://rhodeshouse.ox.ac.uk',
        domain: 'Higher Studies',
        tags: ['rhodes', 'oxford', 'uk', 'masters', 'fully-funded']
      },
      {
        type: 'scholarship',
        title: 'Tata Scholarship at Cornell University',
        organization: 'Tata Education and Development Trust',
        description: 'Enabling underprivileged Indian citizens to pursue undergraduate studies at Cornell University.',
        qualification: 'Indian citizens accepted to Cornell University as undergraduate students.',
        salary: 'Complete tuition and accommodation fees covered',
        location: 'Cornell University, NY, USA',
        endDate: new Date(Date.now() + 80 * 24 * 60 * 60 * 1000),
        eligibility: 'Must qualify for need-based financial aid. Preference to architecture, engineering, science streams.',
        benefits: 'Covers up to 8 semesters of undergraduate study at Cornell.',
        documents: ['Cornell Admission Offer', 'FAFSA/College Board Financial Aid Profile', 'Indian tax filings'],
        officialUrl: 'https://admissions.cornell.edu',
        domain: 'Higher Studies',
        tags: ['tata', 'cornell', 'usa', 'undergraduate', 'fully-funded']
      },
      {
        type: 'scholarship',
        title: 'DST INSPIRE Scholarship',
        organization: 'Department of Science & Technology, Govt of India',
        description: 'Inspiring talented youth to take up research careers in basic and natural sciences.',
        qualification: 'Students in top 1% of 12th board exams, pursuing B.Sc or Integrated M.Sc.',
        salary: '₹80,000 per annum (₹60,000 cash + ₹20,000 mentorship project)',
        location: 'India',
        endDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
        eligibility: 'Must be pursuing basic natural sciences degrees. Evaluation purely on Board percentages.',
        benefits: 'Annual scholarship for up to 5 years or completion of master\'s.',
        documents: ['12th Board marks transcript', 'Eligibility Certificate from school principal', 'Admitted college endorsement form'],
        officialUrl: 'https://online-inspire.gov.in',
        domain: 'Science',
        tags: ['inspire', 'dst', 'government', 'science', 'bsc']
      }
    ];

    await Opportunity.insertMany(scholarships);
    console.log('Seeded 10 Scholarships.');

    // 4. Create 10 Internships
    console.log('Seeding internships...');
    const internships = [
      {
        type: 'internship',
        title: 'Software Engineering Intern (Summer 2027)',
        organization: 'Google',
        description: 'Write, debug, and benchmark codes across various Google cloud and web applications.',
        qualification: 'Pursuing B.E/B.Tech, M.Tech, or PhD in Computer Science or related fields.',
        salary: '₹80,000 / month',
        location: 'Bangalore, India',
        endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        eligibility: 'Students in pre-final or final year of college. Understanding of Unix/Linux and C++/Java/Python.',
        benefits: 'Free meals, transport, direct placement interview offer (PPI) based on performance.',
        officialUrl: 'https://careers.google.com',
        remoteOrOnsite: 'onsite',
        domain: 'CSE',
        tags: ['google', 'internship', 'software', 'coding', 'summer']
      },
      {
        type: 'internship',
        title: 'Data Science Intern',
        organization: 'Uber',
        description: 'Build predictive dispatch models, run A/B testing on driver incentives, and visualize transit metrics.',
        qualification: 'Pursuing degree in Statistics, Math, CSE, or related quantitative streams.',
        salary: '₹60,000 / month',
        location: 'Bangalore, India',
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        eligibility: 'SQL mastery, Python (Pandas/NumPy) and statistics fundamentals. Available for 6 months.',
        benefits: 'Monthly Uber credits, medical cover, direct training cycles.',
        officialUrl: 'https://uber.com/careers',
        remoteOrOnsite: 'hybrid',
        domain: 'CSE',
        tags: ['uber', 'data science', 'statistics', 'python', 'sql']
      },
      {
        type: 'internship',
        title: 'Product Management Intern',
        organization: 'Microsoft',
        description: 'Collaborate with engineers and designers to define product specifications, user stories, and launch features.',
        qualification: 'Pursuing engineering degree or MBA with technical background.',
        salary: '₹75,000 / month',
        location: 'Hyderabad, India',
        endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        eligibility: 'Strong communication skills, wireframing, analytics, and business acumen.',
        benefits: 'Relocation assistance, corporate laptop, health benefits.',
        officialUrl: 'https://careers.microsoft.com',
        remoteOrOnsite: 'onsite',
        domain: 'Management',
        tags: ['microsoft', 'product management', 'business', 'wireframing']
      },
      {
        type: 'internship',
        title: 'Cyber Security Analyst Intern',
        organization: 'CrowdStrike',
        description: 'Participate in threat hunting, security log correlation, and writing automation scripts for endpoint containment.',
        qualification: 'Pursuing degree in Information Security, Computer Science, or Network Systems.',
        salary: '₹45,000 / month',
        location: 'Pune, India',
        endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        eligibility: 'Understanding of TCP/IP, cybersecurity frameworks, and scripting in Python or PowerShell.',
        benefits: 'Home office setups allowance, flexible hours.',
        officialUrl: 'https://crowdstrike.com/careers',
        remoteOrOnsite: 'remote',
        domain: 'IT',
        tags: ['security', 'threat hunting', 'cybersecurity', 'networks']
      },
      {
        type: 'internship',
        title: 'Machine Learning Research Intern',
        organization: 'Tesla',
        description: 'Train models on camera arrays for autopilot objects labeling and optimizing edge inference pipelines.',
        qualification: 'Pursuing Master\'s or PhD in Deep Learning, Computer Vision or CSE.',
        salary: '$6,500 / month',
        location: 'Palo Alto, CA (Remote from India allowed)',
        endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        eligibility: 'PyTorch/TensorFlow expertise, CUDA optimization experience, and C++ competency.',
        benefits: 'High stipend, compute cluster allocations (H100s), research paper publishing.',
        officialUrl: 'https://tesla.com/careers',
        remoteOrOnsite: 'remote',
        domain: 'CSE',
        tags: ['tesla', 'ml', 'deep learning', 'autopilot', 'cv']
      },
      {
        type: 'internship',
        title: 'Mobile Developer Intern (iOS/Android)',
        organization: 'Spotify',
        description: 'Develop user-facing features on Spotify Android/iOS applications using Kotlin, Swift, or React Native.',
        qualification: 'Pursuing graduation in CSE, ECE or IT.',
        salary: '₹50,000 / month',
        location: 'Remote (India)',
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        eligibility: 'Basic apps portfolio on GitHub using Flutter, React Native, Kotlin, or Swift.',
        benefits: 'Free premium subscriptions, merchandise kits, mental health support.',
        officialUrl: 'https://spotify.com/careers',
        remoteOrOnsite: 'remote',
        domain: 'CSE',
        tags: ['spotify', 'mobile', 'react-native', 'kotlin', 'swift']
      },
      {
        type: 'internship',
        title: 'Frontend Web Intern',
        organization: 'Vercel',
        description: 'Optimize Next.js default templates, build visual components libraries, and test deployment flows.',
        qualification: 'Undergraduate student in CSE, IT or Web Design.',
        salary: '₹55,00,00 / month (equivalent USD)',
        location: 'Remote (Global)',
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        eligibility: 'Next.js, Tailwind CSS, JavaScript/TypeScript proficiency. Active open-source contributions.',
        benefits: 'Fully remote, top-tier developer setup hardware, stipend.',
        officialUrl: 'https://vercel.com/careers',
        remoteOrOnsite: 'remote',
        domain: 'CSE',
        tags: ['vercel', 'nextjs', 'react', 'frontend', 'tailwind']
      },
      {
        type: 'internship',
        title: 'Research Intern',
        organization: 'Microsoft Research (MSR)',
        description: 'Conduct fundamental research in natural language processing, cryptographic protocols, and system design.',
        qualification: 'PhD candidate or highly motivated postgraduate student in CS/Math.',
        salary: '₹70,000 / month',
        location: 'Bangalore, India',
        endDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        eligibility: 'Must submit past research summaries. Advanced discrete math and research paper drafting skills.',
        benefits: 'Direct collaboration with globally recognized research scientists, publication opportunities.',
        officialUrl: 'https://microsoft.com/research',
        remoteOrOnsite: 'onsite',
        domain: 'Research',
        tags: ['msr', 'research', 'nlp', 'science', 'math']
      },
      {
        type: 'internship',
        title: 'Cloud Infrastructure Intern',
        organization: 'IBM',
        description: 'Deploy cloud monitoring tools, audit hypervisor resource utilization, and automate deployment scripts.',
        qualification: 'Pursuing B.Tech ECE, EEE, CSE, IT.',
        salary: '₹30,000 / month',
        location: 'Hyderabad, India',
        endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        eligibility: 'Linux CLI knowledge, Docker basics, and understanding of virtualization.',
        benefits: 'IBM certification coupons, cloud credits.',
        officialUrl: 'https://ibm.com/careers',
        remoteOrOnsite: 'hybrid',
        domain: 'IT',
        tags: ['ibm', 'cloud', 'docker', 'infrastructure']
      },
      {
        type: 'internship',
        title: 'Full Stack Web Developer Intern',
        organization: 'Airbnb',
        description: 'Build backend node logic, model booking databases schemas, and design booking checkout UIs.',
        qualification: 'Pursuing CSE or IT graduation.',
        salary: '₹65,000 / month',
        location: 'Bangalore, India',
        endDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
        eligibility: 'NodeJS, Express, React, MongoDB or PostgreSQL. Solid understanding of API security.',
        benefits: 'Travel coupons, healthcare, direct mentorship under senior leads.',
        officialUrl: 'https://careers.airbnb.com',
        remoteOrOnsite: 'onsite',
        domain: 'CSE',
        tags: ['airbnb', 'fullstack', 'react', 'node', 'mongodb']
      }
    ];

    await Opportunity.insertMany(internships);
    console.log('Seeded 10 Internships.');

    // 5. Create 10 News Articles
    console.log('Seeding news articles...');
    const newsArticles = [
      {
        title: 'Tech Hiring Trends 2026: Shift toward Generative AI and Agents Dev',
        description: 'Tech giants shift hiring focus. Experience in large language model chains, LangChain, and agentic workflows are highly preferred over generic CRUD experience.',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500',
        source: 'TechCrunch',
        url: 'https://techcrunch.com',
        category: 'Technology',
        tags: ['ai', 'hiring', 'jobs', '2026']
      },
      {
        title: 'UPSC Civil Services Exam Pattern: New Syllabus Updates Discussed',
        description: 'The Commission is contemplating visual and logical reasoning updates in Paper-II (CSAT) to reflect digital literacy needs.',
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500',
        source: 'The Hindu',
        url: 'https://thehindu.com',
        category: 'Exams',
        tags: ['upsc', 'exams', 'government']
      },
      {
        title: 'Central Government Jobs Announced: Over 12,000 Vacancies in Defense & Space',
        description: 'DRDO, ISRO, and HAL open unified registrations portals for engineering and basic sciences graduates today. Check deadlines.',
        image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=500',
        source: 'Press Information Bureau',
        url: 'https://pib.gov.in',
        category: 'Government',
        tags: ['isro', 'drdo', 'jobs', 'engineering']
      },
      {
        title: 'Global Scholarships Applications Opened for Undergraduate Study Abroad',
        description: 'Fulbright, Rhodes, and Chevening announce higher budget limits for Indian applicants planning admissions in Autumn term.',
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500',
        source: 'International Education Times',
        url: 'https://educationtimes.com',
        category: 'Scholarships',
        tags: ['scholarships', 'oxford', 'masters', 'abroad']
      },
      {
        title: 'Top Summer Internships for CSE/IT Students: Applications Close Soon',
        description: 'Google, Uber, and Microsoft open early applications pipeline for summer 2027 internship cohorts. Apply before the deadline.',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500',
        source: 'CareerVerse News',
        url: '',
        category: 'Internships',
        tags: ['internships', 'google', 'placement']
      },
      {
        title: 'Mastering Coding Placements: Priority Areas in DSA and System Design',
        description: 'Senior recruitment managers list Graphs, Dynamic Programming, and Redis caching as key evaluation pillars in technical interviews.',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500',
        source: 'HackerNews',
        url: 'https://news.ycombinator.com',
        category: 'Placement',
        tags: ['placement', 'dsa', 'interviews']
      },
      {
        title: 'GATE 2027: Syllabus Refinements in Data Science and AI Paper',
        description: 'IIT Madras releases updated GATE CS & DA syllabus. Machine learning mathematics and linear algebra weightage is set to increase.',
        image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500',
        source: 'National Education Portal',
        url: '',
        category: 'Exams',
        tags: ['gate', 'exams', 'syllabus']
      },
      {
        title: 'The Rise of Remote Internships: Best Practices and Search Guidelines',
        description: 'More tech companies opt for remote cohorts. Learn how to showcase self-start capacity and clean documentation workflows.',
        image: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=500',
        source: 'Forbes',
        url: 'https://forbes.com',
        category: 'Internships',
        tags: ['remote', 'internships', 'work-from-home']
      },
      {
        title: 'Banking and LIC Job Exams: Registrations Deadline Approaching',
        description: 'SBI PO and LIC AAO online portals will close admissions this week. Candidates are advised to submit fees early to avoid network congestion.',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500',
        source: 'Financial Express',
        url: 'https://financialexpress.com',
        category: 'Jobs',
        tags: ['sbi', 'banking', 'lic', 'deadlines']
      },
      {
        title: 'AI Engineering: Roadmap and Salary Trends for Fresh Graduates',
        description: 'Industry reports indicate starting salary packages of ₹12 LPA for freshmen displaying proven capabilities in fine-tuning and PyTorch projects.',
        image: 'https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?w=500',
        source: 'LinkedIn Insights',
        url: '',
        category: 'Technology',
        tags: ['ai', 'salary', 'career-guide', 'skills']
      }
    ];

    await News.insertMany(newsArticles);
    console.log('Seeded 10 News Articles.');

    // 6. Create 5 Exams
    console.log('Seeding exams...');
    const examsData = [
      { name: 'GATE Computer Science', category: 'Higher Studies', subjects: ['Engineering Mathematics', 'Data Structures', 'Operating Systems', 'DBMS', 'Networks'] },
      { name: 'CAT Quantitative Aptitude', category: 'Higher Studies', subjects: ['Arithmetic', 'Algebra', 'Geometry', 'Number Systems', 'Data Interpretation'] },
      { name: 'SSC CGL Tier-I General Test', category: 'Government Exams', subjects: ['General Intelligence', 'Quantitative Aptitude', 'General Awareness', 'English Comprehension'] },
      { name: 'TNPSC Group II Mock Paper', category: 'Government Exams', subjects: ['General Studies', 'Aptitude & Mental Ability', 'Current Events', 'Tamil Nadu Culture'] },
      { name: 'Campus Placement Technical MCQ', category: 'Placement', subjects: ['Programming Syntax (Java/Python)', 'Data Structures', 'Database Queries', 'OOP Concepts'] }
    ];

    const exams = await Exam.insertMany(examsData);
    console.log('Seeded 5 Exams.');

    // 7. Create 50 Questions (10 for each exam)
    console.log('Seeding 50 questions...');
    const questionsData: any[] = [];

    // Exam 1: GATE CS Questions (10 items)
    for (let i = 1; i <= 10; i++) {
      questionsData.push({
        subject: 'Data Structures',
        text: `[GATE CS Q${i}] What is the worst-case time complexity of inserting n elements into an empty Binary Search Tree (BST) without self-balancing?`,
        options: ['O(log n)', 'O(n)', 'O(n log n)', 'O(n²)'],
        correctOptionIndex: 3,
        explanation: 'In the worst case, the elements are inserted in sorted order, creating a skewed tree resembling a linked list. Inserting n elements into a linked list takes O(n²) total time.'
      });
    }

    // Exam 2: CAT Questions (10 items)
    for (let i = 1; i <= 10; i++) {
      questionsData.push({
        subject: 'Arithmetic',
        text: `[CAT Q${i}] A train running at 54 km/h takes 20 seconds to cross a telegraph post. How long will it take to cross a platform of length 200 meters?`,
        options: ['30 seconds', '33.3 seconds', '35 seconds', '40 seconds'],
        correctOptionIndex: 1,
        explanation: 'Speed = 54 * (5/18) = 15 m/s. Length of train = speed * time = 15 * 20 = 300 meters. Total distance to cross platform = 300 + 200 = 500 meters. Time = 500 / 15 = 33.33 seconds.'
      });
    }

    // Exam 3: SSC CGL Questions (10 items)
    for (let i = 1; i <= 10; i++) {
      questionsData.push({
        subject: 'General Intelligence',
        text: `[SSC CGL Q${i}] Select the missing term from the series: 3, 7, 15, 31, 63, ?`,
        options: ['125', '127', '129', '131'],
        correctOptionIndex: 1,
        explanation: 'The pattern is (previous term * 2) + 1. So, (63 * 2) + 1 = 126 + 1 = 127.'
      });
    }

    // Exam 4: TNPSC Group II Questions (10 items)
    for (let i = 1; i <= 10; i++) {
      questionsData.push({
        subject: 'General Studies',
        text: `[TNPSC Q${i}] In which year was the Self-Respect Movement (Suyamariyathai Iyakkam) started by E.V. Ramasamy (Periyar) in Tamil Nadu?`,
        options: ['1920', '1925', '1930', '1935'],
        correctOptionIndex: 1,
        explanation: 'Periyar E.V. Ramasamy started the Self-Respect Movement in the year 1925 to establish a society based on equality and rationalism.'
      });
    }

    // Exam 5: Campus Placement Questions (10 items)
    for (let i = 1; i <= 10; i++) {
      questionsData.push({
        subject: 'OOP Concepts',
        text: `[Placement MCQ Q${i}] Which of the following Object-Oriented Programming properties is defined as wrapping data and code modules together into a single unit?`,
        options: ['Inheritance', 'Abstraction', 'Encapsulation', 'Polymorphism'],
        correctOptionIndex: 2,
        explanation: 'Encapsulation is the mechanism of binding code and the data it manipulates, keeping both safe from outside interference and misuse.'
      });
    }

    const seededQuestions = await Question.insertMany(questionsData);
    console.log('Seeded 50 Questions.');

    // 8. Create 5 Mock Tests linking to those questions
    console.log('Seeding 5 mock tests...');
    const test1 = new Test({
      title: 'GATE CS Theory Mock Test',
      examId: exams[0]._id,
      category: 'Higher Studies',
      duration: 30,
      questions: seededQuestions.slice(0, 10).map(q => q._id)
    });
    await test1.save();

    const test2 = new Test({
      title: 'CAT Speed Math Sectional Test',
      examId: exams[1]._id,
      category: 'Higher Studies',
      duration: 20,
      questions: seededQuestions.slice(10, 20).map(q => q._id)
    });
    await test2.save();

    const test3 = new Test({
      title: 'SSC CGL Reasoning Mock Exam',
      examId: exams[2]._id,
      category: 'Government Exams',
      duration: 15,
      questions: seededQuestions.slice(20, 30).map(q => q._id)
    });
    await test3.save();

    const test4 = new Test({
      title: 'TNPSC General Studies Chapter Test',
      examId: exams[3]._id,
      category: 'Government Exams',
      duration: 40,
      questions: seededQuestions.slice(30, 40).map(q => q._id)
    });
    await test4.save();

    const test5 = new Test({
      title: 'Placement Technical Coding & MCQ Test',
      examId: exams[4]._id,
      category: 'Placement',
      duration: 15,
      questions: seededQuestions.slice(40, 50).map(q => q._id)
    });
    await test5.save();

    console.log('Seeded 5 Mock Tests.');

    // 9. Create 5 Career Roadmaps
    console.log('Seeding 5 career roadmaps...');
    const roadmapsData = [
      {
        targetCareer: 'Software Engineer',
        steps: [
          {
            title: '1. Programming Basics',
            description: 'Learn syntax, loops, functions and basic terminal operations in Python or Java.',
            resources: [{ title: 'Codecademy Python Path', type: 'course', url: 'https://codecademy.com' }]
          },
          {
            title: '2. Data Structures & Algorithms',
            description: 'Master Arrays, Lists, Stacks, Queues, Trees, Graphs, Sorting, and Binary Search.',
            resources: [{ title: 'FreeCodeCamp DSA Course', type: 'video', url: 'https://freecodecamp.org' }],
            practiceTestId: test5._id as mongoose.Types.ObjectId
          },
          {
            title: '3. Databases & SQL',
            description: 'Learn relational database schemas, JOIN queries, normalization, and indexing operations.',
            resources: [{ title: 'SQLZoo Interactive Tutor', type: 'course', url: 'https://sqlzoo.net' }]
          },
          {
            title: '4. System Design & Projects',
            description: 'Develop full stack applications and review basic microservices architectures.',
            resources: [{ title: 'Full Stack Open', type: 'course', url: 'https://fullstackopen.com' }]
          }
        ]
      },
      {
        targetCareer: 'AI Engineer',
        steps: [
          {
            title: '1. Mathematical Prerequisites',
            description: 'Study Linear Algebra, Multivariate Calculus, Probability, and Statistical Distributions.',
            resources: [{ title: 'Khan Academy Linear Algebra', type: 'course', url: 'https://khanacademy.org' }]
          },
          {
            title: '2. Machine Learning Fundamentals',
            description: 'Implement Linear Regression, Decision Trees, K-Means Clustering, and SVMs using Scikit-Learn.',
            resources: [{ title: 'Coursera ML Specialization by Andrew Ng', type: 'course', url: 'https://coursera.org' }]
          },
          {
            title: '3. Deep Learning & Neural Networks',
            description: 'Build MLP, CNN, RNN and Transformers architectures in PyTorch or TensorFlow.',
            resources: [{ title: 'Fast.ai Deep Learning for Coders', type: 'course', url: 'https://fast.ai' }]
          },
          {
            title: '4. Large Language Models & RAG',
            description: 'Learn prompt engineering, vector databases, LangChain integration, and fine-tuning parameters.',
            resources: [{ title: 'DeepLearning.AI LLM Courses', type: 'course', url: 'https://deeplearning.ai' }]
          }
        ]
      },
      {
        targetCareer: 'Web Developer',
        steps: [
          {
            title: '1. Frontend Core',
            description: 'Learn structure and layouts using HTML5 semantic tags, CSS Flexbox/Grid, and JavaScript ES6 hooks.',
            resources: [{ title: 'MDN Web Docs Learning Path', type: 'article', url: 'https://developer.mozilla.org' }]
          },
          {
            title: '2. Frontend Frameworks (React)',
            description: 'Study components, states, props, hooks (useState, useEffect), and client-side routing.',
            resources: [{ title: 'Official React Documentation', type: 'article', url: 'https://react.dev' }]
          },
          {
            title: '3. Backend Server & Databases',
            description: 'Create API servers with Node.js and Express, connecting to MongoDB Atlas clusters.',
            resources: [{ title: 'MongoDB University Courses', type: 'course', url: 'https://learn.mongodb.com' }]
          }
        ]
      },
      {
        targetCareer: 'Data Scientist',
        steps: [
          {
            title: '1. Python & Data Analysis tools',
            description: 'Master Numpy arrays, Pandas DataFrames data munging, and Matplotlib plotting.',
            resources: [{ title: 'Kaggle Learn Data Analysis', type: 'course', url: 'https://kaggle.com/learn' }]
          },
          {
            title: '2. SQL & Warehousing',
            description: 'Write analytics queries, aggregates, window functions, and manage Snowflake or BigQuery datasets.',
            resources: [{ title: 'Mode Analytics SQL Tutorial', type: 'article', url: 'https://mode.com' }]
          }
        ]
      },
      {
        targetCareer: 'Civil Servant',
        steps: [
          {
            title: '1. Foundation Building',
            description: 'Read school NCERT textbooks on History, Geography, Polity, and Economics.',
            resources: [{ title: 'NCERT Free Books Downloads', type: 'article', url: 'https://ncert.nic.in' }]
          },
          {
            title: '2. Current Affairs & Daily News',
            description: 'Develop habits of reading standard daily newspapers and reviewing monthly current events digests.',
            resources: [{ title: 'IASbaba Daily Analysis', type: 'article', url: 'https://iasbaba.com' }],
            practiceTestId: test3._id as mongoose.Types.ObjectId
          }
        ]
      }
    ];

    await Roadmap.insertMany(roadmapsData);
    console.log('Seeded 5 Career Roadmaps.');

    // 10. Verify a test admin user exists
    console.log('Ensuring demo admin exists...');
    const adminUser = await User.findOne({ email: 'admin@careerverse.com' });
    if (!adminUser) {
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('admin123', 10);
      const newAdmin = new User({
        name: 'CareerVerse Administrator',
        email: 'admin@careerverse.com',
        password: hashedPassword,
        role: 'ADMIN',
        goals: ['Skill Development'],
        education: {
          degree: 'PhD',
          department: 'Executive Board',
          college: 'Admin HQ',
          currentYear: 'N/A',
          graduationYear: '2020',
          location: 'Remote',
          currentSkills: ['Management'],
          areasOfInterest: ['Product Leadership']
        }
      });
      await newAdmin.save();
      console.log('Created Admin login: admin@careerverse.com / admin123');
    }

    console.log('MongoDB successfully seeded with CareerVerse demo data!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failure:', error);
    process.exit(1);
  }
};

seedData();
