import dotenv from 'dotenv';
dotenv.config();

export let isMongoConnected = false;

export const setMongoConnected = (connected: boolean) => {
  isMongoConnected = connected;
};

// Simple ID Generator
const generateId = () => Math.random().toString(36).substring(2, 9);

export class MockDB {
  static users: any[] = [];
  static testResults: any[] = [];
  static opportunities: any[] = [];
  static exams: any[] = [];
  static questions: any[] = [];
  static tests: any[] = [];
  static news: any[] = [];
  static roadmaps: any[] = [];

  static initialize() {
    // 1. Seed 10 Government Jobs
    const govJobs = [
      {
        _id: 'gov1',
        type: 'government_job',
        title: 'Assistant Section Officer (ASO)',
        organization: 'Staff Selection Commission (SSC CGL)',
        description: 'Assisting Section Officers in drafting notes, communication, and files processing in Central Secretariat Service.',
        vacancies: 950,
        qualification: 'Bachelor\'s Degree in any discipline from a recognized University.',
        ageLimit: '20 to 30 Years',
        salary: '₹44,900 - ₹1,42,400',
        location: 'New Delhi / Anywhere in India',
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        eligibility: 'Must be an Indian Citizen, aged between 20-30, and hold a graduation degree.',
        selectionProcess: 'Computer Based Exams (Tier I & Tier II) followed by document verification.',
        examPattern: 'Tier I: 100 Questions (General Intelligence, Reasoning, Quantitative Aptitude, English Comprehension).',
        syllabus: 'General Intelligence & Reasoning, General Awareness, Quantitative Aptitude, English Comprehension.',
        officialUrl: 'https://ssc.gov.in',
        domain: 'Administration',
        tags: ['ssc', 'cgl', 'government', 'aso']
      },
      {
        _id: 'gov2',
        type: 'government_job',
        title: 'Scientist/Engineer \'SC\' (Computer Science)',
        organization: 'Indian Space Research Organisation (ISRO)',
        description: 'Design, development, and maintenance of software systems, satellite payload controls, and computational models.',
        vacancies: 45,
        qualification: 'B.E/B.Tech in Computer Science & Engineering with first class (minimum 65% marks).',
        ageLimit: 'Up to 28 Years',
        salary: '₹56,100 (Basic Pay) + Allowances',
        location: 'Bangalore / Trivandrum',
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        eligibility: 'First-class engineering graduates in CSE/IT disciplines.',
        selectionProcess: 'Written examination followed by academic vetting and technical interview.',
        examPattern: '80 MCQs on Core CSE Topics in 120 minutes.',
        syllabus: 'Data Structures, OS, DBMS, Networks, Theory of Computation, Discrete Mathematics.',
        officialUrl: 'https://isro.gov.in',
        domain: 'Engineering',
        tags: ['isro', 'scientist', 'engineering', 'cse']
      },
      {
        _id: 'gov3',
        type: 'government_job',
        title: 'Civil Services Officer (IAS/IFS/IPS)',
        organization: 'Union Public Service Commission (UPSC)',
        description: 'Elite administrative, police, and foreign service positions managing policy implementation, public administration, and security.',
        vacancies: 1050,
        qualification: 'Graduate degree in any discipline.',
        ageLimit: '21 to 32 Years',
        salary: '₹56,100 + Allowances',
        location: 'Anywhere in India',
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        eligibility: 'Indian Citizen holding a recognized bachelor\'s degree.',
        selectionProcess: 'Prelims, Mains, and Personality Test.',
        examPattern: 'Prelims: General Studies 200 marks, CSAT 200 marks.',
        syllabus: 'History, Geography, Polity, Economics, Environment, Science & Tech, Current Affairs.',
        officialUrl: 'https://upsc.gov.in',
        domain: 'Civil Services',
        tags: ['upsc', 'ias', 'civil services', 'government']
      },
      {
        _id: 'gov4',
        type: 'government_job',
        title: 'Station Master',
        organization: 'Railway Recruitment Board (RRB NTPC)',
        description: 'Supervising railway movements, managing train departures, platform operations, and customer safety.',
        vacancies: 1200,
        qualification: 'Degree from recognized University or its equivalent.',
        ageLimit: '18 to 33 Years',
        salary: '₹35,400 + Allowances',
        location: 'Any Railway Zone in India',
        endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        eligibility: 'Graduation degree with visual acuity standard A-2.',
        selectionProcess: '1st Stage CBT, 2nd Stage CBT, Computer Based Aptitude Test (CBAT).',
        examPattern: 'CBT Stage 1: General Awareness (40), Mathematics (30), Reasoning (30).',
        syllabus: 'Arithmetic, Algebra, Analytical Reasoning, Coding-Decoding, Indian Geography.',
        officialUrl: 'https://indianrailways.gov.in',
        domain: 'Railways',
        tags: ['rrb', 'ntpc', 'station master', 'railways']
      },
      {
        _id: 'gov5',
        type: 'government_job',
        title: 'Scientific Officer \'C\'',
        organization: 'Bhabha Atomic Research Centre (BARC)',
        description: 'Nuclear physics research, materials testing, reactor operations, and computational software validation.',
        vacancies: 60,
        qualification: 'B.E / B.Tech / B.Sc (Engineering) with minimum 60% aggregate marks.',
        ageLimit: 'Up to 26 Years',
        salary: '₹56,100 + Allowances',
        location: 'Mumbai / Kalpakkam',
        endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        eligibility: 'Engineering Graduates or Science Postgraduates.',
        selectionProcess: 'GATE Score Screening or Online Written Exam, followed by technical interview.',
        examPattern: '100 Core Questions in 120 minutes.',
        syllabus: 'Core engineering, math, thermodynamics, digital electronics.',
        officialUrl: 'https://barconlineexam.gov.in',
        domain: 'Engineering',
        tags: ['barc', 'scientific', 'nuclear', 'engineering']
      },
      {
        _id: 'gov6',
        type: 'government_job',
        title: 'Probationary Officer (PO)',
        organization: 'State Bank of India (SBI)',
        description: 'Managing customer accounts, loan processing, treasury operations, and marketing branch banking products.',
        vacancies: 2000,
        qualification: 'Graduation in any discipline.',
        ageLimit: '21 to 30 Years',
        salary: 'Gross approx. ₹65,000/month',
        location: 'Anywhere in India',
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        eligibility: 'Any graduate. Final semester students can also apply.',
        selectionProcess: 'Preliminary Exam, Main Exam, Group Exercise, and Interview.',
        examPattern: 'Prelims: English (30), Quantitative (35), Reasoning (35).',
        syllabus: 'Data Analysis, Reasoning, English Grammar, General Economy, Banking Awareness.',
        officialUrl: 'https://sbi.co.in/careers',
        domain: 'Banking',
        tags: ['sbi', 'banking', 'po', 'finance']
      },
      {
        _id: 'gov7',
        type: 'government_job',
        title: 'Assistant Administrative Officer (AAO)',
        organization: 'Life Insurance Corporation of India (LIC)',
        description: 'Reviewing insurance applications, claim approvals, public relations, and auditing sales branches.',
        vacancies: 300,
        qualification: 'Bachelor\'s Degree in any discipline.',
        ageLimit: '21 to 30 Years',
        salary: '₹53,600 per month basic pay',
        location: 'Divisional offices across India',
        endDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        eligibility: 'Graduate in any subject.',
        selectionProcess: 'Preliminary Examination, Mains Examination, and Interview.',
        examPattern: 'Prelims: Quantitative, Reasoning, English.',
        syllabus: 'General Knowledge, Current Affairs, Insurance & Financial Market Awareness.',
        officialUrl: 'https://licindia.in',
        domain: 'Insurance',
        tags: ['lic', 'insurance', 'aao']
      },
      {
        _id: 'gov8',
        type: 'government_job',
        title: 'Group II Non-Interview Assistant',
        organization: 'Tamil Nadu Public Service Commission (TNPSC)',
        description: 'Administrative support in government departments, treasury desks, and registration offices.',
        vacancies: 2400,
        qualification: 'Any Degree from a recognized university.',
        ageLimit: '18 to 32 Years',
        salary: '₹20,600 - ₹75,900',
        location: 'Tamil Nadu',
        endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        eligibility: 'Tamil language proficiency is mandatory.',
        selectionProcess: 'Single Stage written examination (Prelims & Mains).',
        examPattern: 'Prelims: General Studies (175 items) + Aptitude (25 items) = 200 items in 3 hours.',
        syllabus: 'General Studies, History of India, Tamil Nadu Heritage, Aptitude.',
        officialUrl: 'https://tnpsc.gov.in',
        domain: 'Administration',
        tags: ['tnpsc', 'group 2', 'state govt']
      },
      {
        _id: 'gov9',
        type: 'government_job',
        title: 'Junior Research Fellow (JRF)',
        organization: 'Defence Research and Development Organisation (DRDO)',
        description: 'Conducting defense-oriented research in aerodynamics, cryptography, and simulation software.',
        vacancies: 15,
        qualification: 'B.E/B.Tech in Mechanical/Electrical/CSE and valid GATE score.',
        ageLimit: 'Max 28 Years',
        salary: '₹37,000 + HRA per month',
        location: 'Pune / Hyderabad',
        endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        eligibility: 'B.E/B.Tech with valid GATE Score or M.E/M.Tech.',
        selectionProcess: 'Screening of applications followed by interview.',
        examPattern: 'Interview based.',
        syllabus: 'Core engineering concepts, math, programming basics.',
        officialUrl: 'https://drdo.gov.in',
        domain: 'Research',
        tags: ['drdo', 'jrf', 'research', 'defense']
      },
      {
        _id: 'gov10',
        type: 'government_job',
        title: 'Commissioned Officer (AFCAT)',
        organization: 'Indian Air Force (IAF)',
        description: 'Flying branch (pilot), ground duty technical, and ground duty non-technical administration.',
        vacancies: 310,
        qualification: 'Graduation with physics & math at 10+2 level or B.E/B.Tech.',
        ageLimit: '20 to 26 Years',
        salary: '₹56,100 basic pay scale',
        location: 'Any Air Force Station in India',
        endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        eligibility: 'Physically fit candidates with graduation background.',
        selectionProcess: 'AFCAT written test, followed by AFSB SSB interview.',
        examPattern: 'AFCAT: General Awareness, Verbal, Numerical, Reasoning.',
        syllabus: 'English grammar, speed math, military aptitude, current events.',
        officialUrl: 'https://careerindianairforce.cdac.in',
        domain: 'Defense',
        tags: ['iaf', 'afcat', 'pilot', 'defense']
      }
    ];

    // 2. Seed 10 Private Jobs
    const privateJobs = [
      {
        _id: 'job1',
        type: 'job',
        title: 'Software Engineer I',
        organization: 'Google',
        description: 'Develop the next generation of technologies that change how billions of users connect and interact.',
        qualification: 'Bachelor\'s degree in Computer Science, or equivalent practical experience.',
        salary: '₹18,00,000 - ₹24,00,000 / year',
        location: 'Bangalore, India',
        endDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
        eligibility: 'Experience in C++, Java, Python, Go. Data structures & algorithms knowledge.',
        officialUrl: 'https://careers.google.com',
        remoteOrOnsite: 'hybrid',
        domain: 'CSE',
        tags: ['google', 'software engineer', 'coding']
      },
      {
        _id: 'job2',
        type: 'job',
        title: 'Data Analyst',
        organization: 'Amazon',
        description: 'Provide database querying, design analytical tools, compile business metrics, and write summaries.',
        qualification: 'Degree in Statistics, CSE, Math, or related fields.',
        salary: '₹8,00,000 - ₹12,00,000 / year',
        location: 'Hyderabad, India',
        endDate: new Date(Date.now() + 18 * 24 * 60 * 60 * 1000),
        eligibility: 'Proficiency in SQL, Excel, and Tableau. Python knowledge.',
        officialUrl: 'https://amazon.jobs',
        remoteOrOnsite: 'onsite',
        domain: 'IT',
        tags: ['amazon', 'data analyst', 'sql']
      },
      {
        _id: 'job3',
        type: 'job',
        title: 'Associate Frontend Developer',
        organization: 'Microsoft',
        description: 'Build responsive and modern web interfaces using React, TypeScript, and Microsoft Fluent Design.',
        qualification: 'Bachelor\'s in CSE, IT or related disciplines.',
        salary: '₹14,00,000 - ₹18,00,000 / year',
        location: 'Hyderabad, India',
        endDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
        eligibility: 'HTML5, CSS3, ES6 JavaScript, React, Redux, and TypeScript.',
        officialUrl: 'https://careers.microsoft.com',
        remoteOrOnsite: 'hybrid',
        domain: 'CSE',
        tags: ['microsoft', 'frontend', 'react']
      },
      {
        _id: 'job4',
        type: 'job',
        title: 'AI Resident Scientist',
        organization: 'OpenAI',
        description: 'Train and fine-tune large language models, research reinforcement learning, and develop agents.',
        qualification: 'Ph.D. or Master\'s degree in ML, CSE, or Mathematics.',
        salary: '$180,000 - $250,000 / year',
        location: 'San Francisco, CA',
        endDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
        eligibility: 'Strong publications record or advanced open-source contributions.',
        officialUrl: 'https://openai.com/careers',
        remoteOrOnsite: 'remote',
        domain: 'CSE',
        tags: ['openai', 'ai', 'research']
      },
      {
        _id: 'job5',
        type: 'job',
        title: 'Cloud Support Engineer',
        organization: 'Amazon Web Services (AWS)',
        description: 'Provide technical assistance to AWS customers, troubleshoot network architecture, and script automation.',
        qualification: 'Degree in CSE, IT, or ECE.',
        salary: '₹10,00,000 - ₹13,50,000 / year',
        location: 'Bangalore, India',
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        eligibility: 'Linux, Networking (TCP/IP), DNS, Cloud architecture, and Python.',
        officialUrl: 'https://amazon.jobs',
        remoteOrOnsite: 'onsite',
        domain: 'IT',
        tags: ['aws', 'cloud', 'networking']
      },
      {
        _id: 'job6',
        type: 'job',
        title: 'Cybersecurity Associate Analyst',
        organization: 'Palo Alto Networks',
        description: 'Monitor threat logs, investigate security alerts, perform vulnerability testing, and deploy rules.',
        qualification: 'B.Tech/B.Sc in CSE or Information Security.',
        salary: '₹9,00,000 - ₹12,00,000 / year',
        location: 'Bangalore, India',
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        eligibility: 'Understanding of firewalls, cryptography, and ethical hacking.',
        officialUrl: 'https://paloaltonetworks.com/careers',
        remoteOrOnsite: 'onsite',
        domain: 'IT',
        tags: ['security', 'cybersecurity']
      },
      {
        _id: 'job7',
        type: 'job',
        title: 'Backend Engineer (API Team)',
        organization: 'Stripe',
        description: 'Design robust APIs, scale payment processors, and write high-throughput databases integrations.',
        qualification: 'Graduation in Computer Science or similar software experience.',
        salary: '₹22,00,000 - ₹28,00,000 / year',
        location: 'Remote (India)',
        endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        eligibility: 'Highly proficient in Ruby, Java, Go, or Python.',
        officialUrl: 'https://stripe.com/jobs',
        remoteOrOnsite: 'remote',
        domain: 'CSE',
        tags: ['stripe', 'backend', 'api']
      },
      {
        _id: 'job8',
        type: 'job',
        title: 'Full Stack Engineer (L3)',
        organization: 'Meta',
        description: 'Develop products across social apps, scale graph database endpoints, and construct user flows.',
        qualification: 'B.E/B.Tech or MS in CS.',
        salary: '₹25,00,000 - ₹32,00,000 / year',
        location: 'Bangalore, India',
        endDate: new Date(Date.now() + 32 * 24 * 60 * 60 * 1000),
        eligibility: 'React, GraphQL, Node.js, and relational databases.',
        officialUrl: 'https://meta.com/careers',
        remoteOrOnsite: 'hybrid',
        domain: 'CSE',
        tags: ['meta', 'fullstack', 'react']
      },
      {
        _id: 'job9',
        type: 'job',
        title: 'Associate UI/UX Designer',
        organization: 'Figma',
        description: 'Create interface layouts, wireframes, user personas, and conduct UX experiments.',
        qualification: 'Degree/Diploma in Design, HCI, or CSE.',
        salary: '₹12,00,000 - ₹16,00,000 / year',
        location: 'Remote (India)',
        endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        eligibility: 'Expertise in Figma, design systems, wireframing, and user research.',
        officialUrl: 'https://figma.com/careers',
        remoteOrOnsite: 'remote',
        domain: 'Design',
        tags: ['figma', 'ux', 'ui']
      },
      {
        _id: 'job10',
        type: 'job',
        title: 'Site Reliability Engineer (SRE)',
        organization: 'Netflix',
        description: 'Manage streaming servers traffic, deploy Kubernetes, optimize Docker, and debug latency.',
        qualification: 'Bachelor\'s degree in CSE, IT or relevant field.',
        salary: '₹26,00,000 - ₹34,00,000 / year',
        location: 'Mumbai, India',
        endDate: new Date(Date.now() + 27 * 24 * 60 * 60 * 1000),
        eligibility: 'Kubernetes, Docker, Terraform, CI/CD, and Python.',
        officialUrl: 'https://jobs.netflix.com',
        remoteOrOnsite: 'hybrid',
        domain: 'CSE',
        tags: ['netflix', 'sre', 'devops']
      }
    ];

    // 3. Seed 10 Scholarships
    const scholarships = [
      {
        _id: 'schol1',
        type: 'scholarship',
        title: 'Reliance Foundation Undergraduate Scholarships',
        organization: 'Reliance Foundation',
        description: 'Supporting meritorious undergraduate students from all fields to complete their degree studies in India.',
        qualification: '1st Year Full-time UG students with minimum 60% in 12th.',
        salary: 'Up to ₹2,00,000 over the duration of degree',
        location: 'India',
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        eligibility: 'Annual family income must be less than ₹15,00,000.',
        benefits: 'Cash grant, mentorship, alumni networks.',
        documents: ['10th & 12th Marksheets', 'Family Income Certificate', 'College Admission Proof'],
        officialUrl: 'https://reliancefoundation.org',
        domain: 'General',
        tags: ['reliance', 'scholarship', 'undergraduate']
      },
      {
        _id: 'schol2',
        type: 'scholarship',
        title: 'Aditya Birla Academy Scholarship',
        organization: 'Aditya Birla Group',
        description: 'Scholarship awarded to students at top institutes like IITs, BITS, IIMs, and Law Colleges.',
        qualification: 'Students currently enrolled in first-year of Engineering, Management, or Law.',
        salary: '₹1,50,000 - ₹3,00,000 per annum',
        location: 'India',
        endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        eligibility: 'Shortlisting based on academic entry ranks and essays.',
        benefits: 'Full tuition support, direct pathways to group internships.',
        documents: ['Admission Letter', 'JEE/CAT entrance ranks card'],
        officialUrl: 'https://adityabirlascholars.net',
        domain: 'Elite',
        tags: ['aditya birla', 'scholarship']
      },
      {
        _id: 'schol3',
        type: 'scholarship',
        title: 'Adobe Women-in-Technology Scholarship',
        organization: 'Adobe Research',
        description: 'Empowering outstanding female computer science students globally.',
        qualification: 'Female students pursuing undergraduate or master\'s in CSE, IT, or Math.',
        salary: '$25,000 (One-time award)',
        location: 'Global (India Eligible)',
        endDate: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        eligibility: 'Female student pursuing computing. Evaluated on academic merit and coding.',
        benefits: 'Funding for tuition, internship pathway at Adobe.',
        documents: ['Resume', 'Transcript', 'Two letters of recommendation'],
        officialUrl: 'https://research.adobe.com/scholarships',
        domain: 'CSE',
        tags: ['adobe', 'female', 'scholarship']
      },
      {
        _id: 'schol4',
        type: 'scholarship',
        title: 'Fulbright-Nehru Master\'s Fellowships',
        organization: 'USIEF',
        description: 'For outstanding Indians to pursue a master\'s degree program in the United States.',
        qualification: 'Bachelor\'s degree with at least 55% marks, and 3 years of work experience.',
        salary: 'Full tuition, living stipend, medical, and airfare covered',
        location: 'USA Universities',
        endDate: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        eligibility: 'Indian citizen with high leadership, TOEFL score, and professional record.',
        benefits: 'Complete study costs funded, J-1 visa sponsorship.',
        documents: ['Academic transcripts', 'TOEFL Score card', 'Reference letters'],
        officialUrl: 'https://usief.org.in',
        domain: 'Higher Studies',
        tags: ['fulbright', 'usa', 'masters']
      },
      {
        _id: 'schol5',
        type: 'scholarship',
        title: 'HDFC Educational Crisis Scholarship',
        organization: 'HDFC Bank',
        description: 'Supporting students facing sudden financial crises to prevent drop-outs.',
        qualification: 'Students in school or pursuing UG/PG degrees.',
        salary: '₹35,000 - ₹75,000 depending on level',
        location: 'India',
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        eligibility: 'Students experiencing family crisis (loss of earning member, natural disaster).',
        benefits: 'Direct tuition reimbursement.',
        documents: ['Income proof', 'Crisis declaration affidavit', 'College marks sheet'],
        officialUrl: 'https://hdfcbank.com',
        domain: 'Crisis Support',
        tags: ['hdfc', 'scholarship', 'financial-aid']
      },
      {
        _id: 'schol6',
        type: 'scholarship',
        title: 'L\'Oréal India For Young Women in Science',
        organization: 'L\'Oréal India',
        description: 'Encouraging young women to pursue higher studies in science and tech fields.',
        qualification: 'Female students who passed 12th science with 85% aggregate.',
        salary: 'Up to ₹2,50,000 for graduation',
        location: 'India',
        endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        eligibility: 'Family income under ₹6,00,000/annum. Must enroll in science.',
        benefits: 'Financial grants, mentorship.',
        documents: ['12th Marksheet', 'Income Proof', 'Admission letter'],
        officialUrl: 'https://foryoungwomeninscience.co.in',
        domain: 'Science',
        tags: ['loreal', 'women', 'science']
      },
      {
        _id: 'schol7',
        type: 'scholarship',
        title: 'Narotam Sekhsaria PG Scholarship',
        organization: 'Narotam Sekhsaria Foundation',
        description: 'Interest-free loan scholarships for Indian students pursuing PG studies.',
        qualification: 'Graduates planning postgraduate studies at elite institutions.',
        salary: 'Up to ₹20,00,000 (Interest-free loan)',
        location: 'Global',
        endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        eligibility: 'Indian national, age below 30.',
        benefits: 'High financing, mentorship.',
        documents: ['Offer letter', 'GRE/GMAT scores', 'Transcripts'],
        officialUrl: 'https://pg.nsfoundation.co.in',
        domain: 'Higher Studies',
        tags: ['sekhsaria', 'loan']
      },
      {
        _id: 'schol8',
        type: 'scholarship',
        title: 'Rhodes Scholarship for India',
        organization: 'The Rhodes Trust',
        description: 'Fully funded postgraduate award enabling study at the University of Oxford.',
        qualification: 'Undergraduate degree holder with high first-class honors.',
        salary: 'All Oxford tuition fees + Living stipend',
        location: 'Oxford University, UK',
        endDate: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000),
        eligibility: 'Indian citizen, aged 20-25, exhibiting exceptional intellect and leadership.',
        benefits: 'Tuition fees, living expenses, airfare, health insurance.',
        documents: ['Birth certificate', 'Academic references', 'Personal Statement'],
        officialUrl: 'https://rhodeshouse.ox.ac.uk',
        domain: 'Higher Studies',
        tags: ['rhodes', 'oxford', 'uk']
      },
      {
        _id: 'schol9',
        type: 'scholarship',
        title: 'Tata Scholarship at Cornell University',
        organization: 'Tata Education and Development Trust',
        description: 'Enabling underprivileged Indian citizens to pursue undergraduate studies at Cornell University.',
        qualification: 'Indian citizens accepted to Cornell University as undergraduate students.',
        salary: 'Complete tuition and accommodation covered',
        location: 'Cornell University, NY, USA',
        endDate: new Date(Date.now() + 80 * 24 * 60 * 60 * 1000),
        eligibility: 'Must qualify for need-based financial aid. Engineering/science streams.',
        benefits: 'Covers up to 8 semesters of undergraduate study at Cornell.',
        documents: ['Cornell Admission Offer', 'Financial Aid Profile'],
        officialUrl: 'https://admissions.cornell.edu',
        domain: 'Higher Studies',
        tags: ['tata', 'cornell', 'usa']
      },
      {
        _id: 'schol10',
        type: 'scholarship',
        title: 'DST INSPIRE Scholarship',
        organization: 'Department of Science & Technology',
        description: 'Inspiring talented youth to take up research careers in basic and natural sciences.',
        qualification: 'Students in top 1% of 12th board exams, pursuing B.Sc or Integrated M.Sc.',
        salary: '₹80,000 per annum',
        location: 'India',
        endDate: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
        eligibility: 'Must be pursuing basic natural sciences. Purely on Board percentages.',
        benefits: 'Annual scholarship for up to 5 years.',
        documents: ['12th Board marks transcript', 'Eligibility Certificate'],
        officialUrl: 'https://online-inspire.gov.in',
        domain: 'Science',
        tags: ['inspire', 'dst', 'science']
      }
    ];

    // 4. Seed 10 Internships
    const internships = [
      {
        _id: 'intern1',
        type: 'internship',
        title: 'Software Engineering Intern (Summer 2027)',
        organization: 'Google',
        description: 'Write, debug, and benchmark codes across various Google cloud and web applications.',
        qualification: 'Pursuing B.E/B.Tech, M.Tech, or PhD in CS.',
        salary: '₹80,000 / month',
        location: 'Bangalore, India',
        endDate: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
        eligibility: 'Students in pre-final or final year. Linux and programming fundamentals.',
        benefits: 'Free meals, transport, PPI offer potential.',
        officialUrl: 'https://careers.google.com',
        remoteOrOnsite: 'onsite',
        domain: 'CSE',
        tags: ['google', 'internship', 'software']
      },
      {
        _id: 'intern2',
        type: 'internship',
        title: 'Data Science Intern',
        organization: 'Uber',
        description: 'Build predictive dispatch models, run A/B testing on driver incentives, and visualize metrics.',
        qualification: 'Pursuing degree in Statistics, Math, or CSE.',
        salary: '₹60,000 / month',
        location: 'Bangalore, India',
        endDate: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
        eligibility: 'SQL mastery, Python (Pandas/NumPy) and stats. 6 months duration.',
        benefits: 'Monthly Uber credits, medical cover.',
        officialUrl: 'https://uber.com/careers',
        remoteOrOnsite: 'hybrid',
        domain: 'CSE',
        tags: ['uber', 'data science', 'sql']
      },
      {
        _id: 'intern3',
        type: 'internship',
        title: 'Product Management Intern',
        organization: 'Microsoft',
        description: 'Collaborate with engineers and designers to define product specifications and launch features.',
        qualification: 'Pursuing engineering degree or MBA.',
        salary: '₹75,000 / month',
        location: 'Hyderabad, India',
        endDate: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
        eligibility: 'Communication skills, wireframing, analytics, and business acumen.',
        benefits: 'Relocation assistance, corporate laptop.',
        officialUrl: 'https://careers.microsoft.com',
        remoteOrOnsite: 'onsite',
        domain: 'Management',
        tags: ['microsoft', 'pm']
      },
      {
        _id: 'intern4',
        type: 'internship',
        title: 'Cyber Security Analyst Intern',
        organization: 'CrowdStrike',
        description: 'Participate in threat hunting, security log correlation, and writing scripts.',
        qualification: 'Pursuing degree in Info Security or Computer Science.',
        salary: '₹45,000 / month',
        location: 'Pune, India',
        endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000),
        eligibility: 'Understanding of TCP/IP, cybersecurity frameworks, and Python.',
        benefits: 'Home office allowance, flexible hours.',
        officialUrl: 'https://crowdstrike.com/careers',
        remoteOrOnsite: 'remote',
        domain: 'IT',
        tags: ['security', 'cybersecurity']
      },
      {
        _id: 'intern5',
        type: 'internship',
        title: 'Machine Learning Research Intern',
        organization: 'Tesla',
        description: 'Train models on camera arrays for autopilot objects labeling and optimize edge inference.',
        qualification: 'Pursuing Master\'s or PhD in DL or CSE.',
        salary: '$6,500 / month',
        location: 'Palo Alto, CA (Remote available)',
        endDate: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
        eligibility: 'PyTorch/TensorFlow expertise, CUDA optimization experience.',
        benefits: 'High stipend, compute cluster allocations.',
        officialUrl: 'https://tesla.com/careers',
        remoteOrOnsite: 'remote',
        domain: 'CSE',
        tags: ['tesla', 'ml', 'deep learning']
      },
      {
        _id: 'intern6',
        type: 'internship',
        title: 'Mobile Developer Intern (iOS/Android)',
        organization: 'Spotify',
        description: 'Develop user-facing features on Spotify Android/iOS using Swift/React Native.',
        qualification: 'Pursuing graduation in CSE, ECE or IT.',
        salary: '₹50,000 / month',
        location: 'Remote (India)',
        endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        eligibility: 'Basic app portfolio on GitHub using Flutter/React Native/Swift.',
        benefits: 'Free premium subscriptions, merchandise.',
        officialUrl: 'https://spotify.com/careers',
        remoteOrOnsite: 'remote',
        domain: 'CSE',
        tags: ['spotify', 'mobile']
      },
      {
        _id: 'intern7',
        type: 'internship',
        title: 'Frontend Web Intern',
        organization: 'Vercel',
        description: 'Optimize Next.js templates, build visual components, and test deployment.',
        qualification: 'Undergraduate student in CSE, IT or Design.',
        salary: '₹55,000 / month',
        location: 'Remote (Global)',
        endDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
        eligibility: 'Next.js, Tailwind CSS, JavaScript. Active open-source contributions.',
        benefits: 'Fully remote, top-tier hardware.',
        officialUrl: 'https://vercel.com/careers',
        remoteOrOnsite: 'remote',
        domain: 'CSE',
        tags: ['vercel', 'frontend']
      },
      {
        _id: 'intern8',
        type: 'internship',
        title: 'Research Intern',
        organization: 'Microsoft Research (MSR)',
        description: 'Conduct fundamental research in natural language processing and systems.',
        qualification: 'PhD candidate or highly motivated postgraduate in CS/Math.',
        salary: '₹70,000 / month',
        location: 'Bangalore, India',
        endDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
        eligibility: 'Must submit research summaries. Advanced math/writing.',
        benefits: 'Collaboration with research scientists, publication opportunities.',
        officialUrl: 'https://microsoft.com/research',
        remoteOrOnsite: 'onsite',
        domain: 'Research',
        tags: ['msr', 'research']
      },
      {
        _id: 'intern9',
        type: 'internship',
        title: 'Cloud Infrastructure Intern',
        organization: 'IBM',
        description: 'Deploy cloud monitoring tools, audit hypervisor resources, and script automation.',
        qualification: 'Pursuing B.Tech ECE, EEE, CSE, IT.',
        salary: '₹30,000 / month',
        location: 'Hyderabad, India',
        endDate: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
        eligibility: 'Linux CLI knowledge, Docker basics.',
        benefits: 'IBM certification coupons, cloud credits.',
        officialUrl: 'https://ibm.com/careers',
        remoteOrOnsite: 'hybrid',
        domain: 'IT',
        tags: ['ibm', 'cloud']
      },
      {
        _id: 'intern10',
        type: 'internship',
        title: 'Full Stack Web Intern',
        organization: 'Airbnb',
        description: 'Build backend node logic, database schemas, and checkout user flows.',
        qualification: 'Pursuing CSE or IT graduation.',
        salary: '₹65,000 / month',
        location: 'Bangalore, India',
        endDate: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
        eligibility: 'NodeJS, Express, React, MongoDB. API security understanding.',
        benefits: 'Travel coupons, healthcare.',
        officialUrl: 'https://careers.airbnb.com',
        remoteOrOnsite: 'onsite',
        domain: 'CSE',
        tags: ['airbnb', 'fullstack']
      }
    ];

    MockDB.opportunities = [...govJobs, ...privateJobs, ...scholarships, ...internships];

    // 5. Seed 10 News Articles
    MockDB.news = [
      {
        _id: 'news1',
        title: 'Tech Hiring Trends 2026: Shift toward Generative AI and Agents Dev',
        description: 'Tech giants shift hiring focus. Experience in large language model chains, LangChain, and agentic workflows are highly preferred over generic CRUD experience.',
        image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500',
        source: 'TechCrunch',
        url: 'https://techcrunch.com',
        category: 'Technology',
        tags: ['ai', 'hiring', 'jobs']
      },
      {
        _id: 'news2',
        title: 'UPSC Civil Services Exam Pattern: New Syllabus Updates Discussed',
        description: 'The Commission is contemplating visual and logical reasoning updates in Paper-II (CSAT) to reflect digital literacy needs.',
        image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=500',
        source: 'The Hindu',
        url: 'https://thehindu.com',
        category: 'Exams',
        tags: ['upsc', 'exams']
      },
      {
        _id: 'news3',
        title: 'Central Government Jobs Announced: Over 12,000 Vacancies in Defense & Space',
        description: 'DRDO, ISRO, and HAL open unified registrations portals for engineering and basic sciences graduates today.',
        image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?w=500',
        source: 'Press Information Bureau',
        url: 'https://pib.gov.in',
        category: 'Government',
        tags: ['isro', 'drdo']
      },
      {
        _id: 'news4',
        title: 'Global Scholarships Applications Opened for Undergraduate Study Abroad',
        description: 'Fulbright, Rhodes, and Chevening announce higher budget limits for Indian applicants planning admissions in Autumn term.',
        image: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=500',
        source: 'International Education Times',
        url: 'https://educationtimes.com',
        category: 'Scholarships',
        tags: ['scholarships', 'masters']
      },
      {
        _id: 'news5',
        title: 'Top Summer Internships for CSE/IT Students: Applications Close Soon',
        description: 'Google, Uber, and Microsoft open early applications pipeline for summer 2027 internship cohorts.',
        image: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=500',
        source: 'CareerVerse News',
        url: '',
        category: 'Internships',
        tags: ['internships', 'placement']
      },
      {
        _id: 'news6',
        title: 'Mastering Coding Placements: Priority Areas in DSA and System Design',
        description: 'Senior recruitment managers list Graphs, Dynamic Programming, and Redis caching as key evaluation pillars in technical interviews.',
        image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=500',
        source: 'HackerNews',
        url: 'https://news.ycombinator.com',
        category: 'Placement',
        tags: ['placement', 'dsa']
      },
      {
        _id: 'news7',
        title: 'GATE 2027: Syllabus Refinements in Data Science and AI Paper',
        description: 'IIT Madras releases updated GATE CS & DA syllabus. Machine learning mathematics weightage is set to increase.',
        image: 'https://images.unsplash.com/photo-1509228468518-180dd4864904?w=500',
        source: 'National Education Portal',
        url: '',
        category: 'Exams',
        tags: ['gate', 'exams']
      },
      {
        _id: 'news8',
        title: 'The Rise of Remote Internships: Best Practices and Search Guidelines',
        description: 'More tech companies opt for remote cohorts. Learn how to showcase self-start capacity and clean documentation workflows.',
        image: 'https://images.unsplash.com/photo-1588196749597-9ff075ee6b5b?w=500',
        source: 'Forbes',
        url: 'https://forbes.com',
        category: 'Internships',
        tags: ['remote', 'internships']
      },
      {
        _id: 'news9',
        title: 'Banking and LIC Job Exams: Registrations Deadline Approaching',
        description: 'SBI PO and LIC AAO online portals will close admissions this week. Candidates are advised to submit fees early.',
        image: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=500',
        source: 'Financial Express',
        url: 'https://financialexpress.com',
        category: 'Jobs',
        tags: ['sbi', 'banking']
      },
      {
        _id: 'news10',
        title: 'AI Engineering: Roadmap and Salary Trends for Fresh Graduates',
        description: 'Industry reports indicate starting salary packages of ₹12 LPA for freshmen displaying proven capabilities in fine-tuning and PyTorch.',
        image: 'https://images.unsplash.com/photo-1531747118685-ca8fa6e08806?w=500',
        source: 'LinkedIn Insights',
        url: '',
        category: 'Technology',
        tags: ['ai', 'salary']
      }
    ];

    // 6. Seed 5 Exams
    MockDB.exams = [
      { _id: 'exam1', name: 'GATE Computer Science', category: 'Higher Studies', subjects: ['Engineering Mathematics', 'Data Structures', 'Operating Systems', 'DBMS', 'Networks'] },
      { _id: 'exam2', name: 'CAT Quantitative Aptitude', category: 'Higher Studies', subjects: ['Arithmetic', 'Algebra', 'Geometry', 'Number Systems', 'Data Interpretation'] },
      { _id: 'exam3', name: 'SSC CGL Tier-I General Test', category: 'Government Exams', subjects: ['General Intelligence', 'Quantitative Aptitude', 'General Awareness', 'English Comprehension'] },
      { _id: 'exam4', name: 'TNPSC Group II Mock Paper', category: 'Government Exams', subjects: ['General Studies', 'Aptitude & Mental Ability', 'Current Events', 'Tamil Nadu Culture'] },
      { _id: 'exam5', name: 'Campus Placement Technical MCQ', category: 'Placement', subjects: ['Programming Syntax (Java/Python)', 'Data Structures', 'Database Queries', 'OOP Concepts'] }
    ];

    // 7. Seed 50 Questions (10 for each exam)
    const questions: any[] = [];
    
    // GATE CS (10 questions)
    for (let i = 1; i <= 10; i++) {
      questions.push({
        _id: `q_gate_${i}`,
        subject: 'Data Structures',
        text: `[GATE CS Q${i}] What is the worst-case time complexity of inserting n elements into an empty Binary Search Tree (BST) without self-balancing?`,
        options: ['O(log n)', 'O(n)', 'O(n log n)', 'O(n²)'],
        correctOptionIndex: 3,
        explanation: 'In the worst case, the elements are inserted in sorted order, creating a skewed tree resembling a linked list. Inserting n elements into a linked list takes O(n²) total time.'
      });
    }

    // CAT (10 questions)
    for (let i = 1; i <= 10; i++) {
      questions.push({
        _id: `q_cat_${i}`,
        subject: 'Arithmetic',
        text: `[CAT Q${i}] A train running at 54 km/h takes 20 seconds to cross a telegraph post. How long will it take to cross a platform of length 200 meters?`,
        options: ['30 seconds', '33.3 seconds', '35 seconds', '40 seconds'],
        correctOptionIndex: 1,
        explanation: 'Speed = 54 * (5/18) = 15 m/s. Length of train = speed * time = 15 * 20 = 300 meters. Total distance to cross platform = 300 + 200 = 500 meters. Time = 500 / 15 = 33.33 seconds.'
      });
    }

    // SSC CGL (10 questions)
    for (let i = 1; i <= 10; i++) {
      questions.push({
        _id: `q_ssc_${i}`,
        subject: 'General Intelligence',
        text: `[SSC CGL Q${i}] Select the missing term from the series: 3, 7, 15, 31, 63, ?`,
        options: ['125', '127', '129', '131'],
        correctOptionIndex: 1,
        explanation: 'The pattern is (previous term * 2) + 1. So, (63 * 2) + 1 = 126 + 1 = 127.'
      });
    }

    // TNPSC Group II (10 questions)
    for (let i = 1; i <= 10; i++) {
      questions.push({
        _id: `q_tnpsc_${i}`,
        subject: 'General Studies',
        text: `[TNPSC Q${i}] In which year was the Self-Respect Movement (Suyamariyathai Iyakkam) started by E.V. Ramasamy (Periyar) in Tamil Nadu?`,
        options: ['1920', '1925', '1930', '1935'],
        correctOptionIndex: 1,
        explanation: 'Periyar E.V. Ramasamy started the Self-Respect Movement in the year 1925 to establish a society based on equality and rationalism.'
      });
    }

    // Campus Placement (10 questions)
    for (let i = 1; i <= 10; i++) {
      questions.push({
        _id: `q_place_${i}`,
        subject: 'OOP Concepts',
        text: `[Placement MCQ Q${i}] Which of the following Object-Oriented Programming properties is defined as wrapping data and code modules together into a single unit?`,
        options: ['Inheritance', 'Abstraction', 'Encapsulation', 'Polymorphism'],
        correctOptionIndex: 2,
        explanation: 'Encapsulation is the mechanism of binding code and the data it manipulates, keeping both safe from outside interference and misuse.'
      });
    }

    MockDB.questions = questions;

    // 8. Seed 5 Mock Tests linking to those questions
    MockDB.tests = [
      {
        _id: 'test_gate',
        title: 'GATE CS Theory Mock Test',
        examId: 'exam1',
        category: 'Higher Studies',
        duration: 30,
        questions: questions.slice(0, 10)
      },
      {
        _id: 'test_cat',
        title: 'CAT Speed Math Sectional Test',
        examId: 'exam2',
        category: 'Higher Studies',
        duration: 20,
        questions: questions.slice(10, 20)
      },
      {
        _id: 'test_ssc',
        title: 'SSC CGL Reasoning Mock Exam',
        examId: 'exam3',
        category: 'Government Exams',
        duration: 15,
        questions: questions.slice(20, 30)
      },
      {
        _id: 'test_tnpsc',
        title: 'TNPSC General Studies Chapter Test',
        examId: 'exam4',
        category: 'Government Exams',
        duration: 40,
        questions: questions.slice(30, 40)
      },
      {
        _id: 'test_place',
        title: 'Placement Technical Coding & MCQ Test',
        examId: 'exam5',
        category: 'Placement',
        duration: 15,
        questions: questions.slice(40, 50)
      }
    ];

    // 9. Seed 5 Roadmaps
    MockDB.roadmaps = [
      {
        _id: 'road_se',
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
            practiceTestId: 'test_place'
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
        _id: 'road_ai',
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
        _id: 'road_web',
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
        _id: 'road_ds',
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
        _id: 'road_gov',
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
            practiceTestId: 'test_ssc'
          }
        ]
      }
    ];

    // Seed default Admin User
    MockDB.users.push({
      _id: 'admin_user_id',
      name: 'CareerVerse Administrator',
      email: 'admin@careerverse.com',
      password: 'hashed_admin_password_which_is_checked_manually_in_login', // We bypass password hashing check in mock login or check simply
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
      },
      skills: [],
      roadmaps: [],
      streak: 1,
      xp: 100,
      badges: [],
      applicationsTracked: [],
      savedOpportunities: [],
      savedNews: [],
      certificates: []
    });

    // Ensure all seeded news articles have a valid publishedAt date
    MockDB.news.forEach(n => {
      if (!n.publishedAt) n.publishedAt = new Date();
    });
  }

  // Helper Mock API Methods
  static async findUserByEmail(email: string) {
    return MockDB.users.find(u => u.email === email);
  }

  static async findUserById(id: string) {
    return MockDB.users.find(u => u._id === id);
  }

  static async saveUser(userObj: any) {
    const idx = MockDB.users.findIndex(u => u._id === userObj._id);
    if (idx > -1) {
      MockDB.users[idx] = { ...MockDB.users[idx], ...userObj };
      return MockDB.users[idx];
    } else {
      if (!userObj._id) userObj._id = generateId();
      MockDB.users.push(userObj);
      return userObj;
    }
  }

  static async getOpportunities(query: any) {
    let result = [...MockDB.opportunities];
    if (query.type) result = result.filter(o => o.type === query.type);
    if (query.remoteOrOnsite) result = result.filter(o => o.remoteOrOnsite === query.remoteOrOnsite);
    if (query.search) {
      const s = String(query.search).toLowerCase();
      result = result.filter(o => o.title.toLowerCase().includes(s) || o.organization.toLowerCase().includes(s));
    }
    return result;
  }

  static async getOpportunityById(id: string) {
    return MockDB.opportunities.find(o => o._id === id);
  }

  static async getTests(category?: string) {
    let result = [...MockDB.tests];
    if (category) result = result.filter(t => t.category === category);
    return result;
  }

  static async getTestById(id: string) {
    return MockDB.tests.find(t => t._id === id);
  }

  static async saveTestResult(resultObj: any) {
    resultObj._id = generateId();
    resultObj.date = new Date();
    MockDB.testResults.push(resultObj);
    return resultObj;
  }

  static async getTestResults(userId: string) {
    return MockDB.testResults.filter(r => r.userId === userId);
  }

  static async getNews(category?: string) {
    let result = [...MockDB.news];
    if (category && category !== 'All') result = result.filter(n => n.category === category);
    return result;
  }

  static async saveNews(newsObj: any) {
    const idx = MockDB.news.findIndex(n => n._id === newsObj._id);
    if (idx > -1) {
      MockDB.news[idx] = { ...MockDB.news[idx], ...newsObj, updatedAt: new Date() };
      return MockDB.news[idx];
    } else {
      if (!newsObj._id) newsObj._id = 'news_' + generateId();
      newsObj.publishedAt = new Date();
      newsObj.updatedAt = new Date();
      MockDB.news.push(newsObj);
      return newsObj;
    }
  }

  static async deleteNews(id: string) {
    const idx = MockDB.news.findIndex(n => n._id === id);
    if (idx > -1) {
      MockDB.news.splice(idx, 1);
      return true;
    }
    return false;
  }

  static async getRoadmaps() {
    return MockDB.roadmaps;
  }

  static async getRoadmapByCareer(career: string) {
    return MockDB.roadmaps.find(r => r.targetCareer.toLowerCase() === career.toLowerCase()) || 
           MockDB.roadmaps[0];
  }
}

// Initialize MockDB
MockDB.initialize();
