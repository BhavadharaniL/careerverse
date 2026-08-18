export interface User {
  id: string;
  name: string;
  email: string;
  role: 'USER' | 'ADMIN';
  goals: string[];
  education: {
    degree: string;
    department: string;
    college: string;
    currentYear: string;
    graduationYear: string;
    location: string;
    currentSkills: string[];
    areasOfInterest: string[];
  };
  skills: Array<{
    name: string;
    proficiency: 'Beginner' | 'Intermediate' | 'Advanced';
    percentage: number;
    learningHours: number;
  }>;
  roadmaps: Array<{
    roadmapId: string;
    title: string;
    progress: number;
    completedSteps: string[];
  }>;
  streak: number;
  xp: number;
  badges: Array<{
    id: string;
    name: string;
    description: string;
    icon: string;
    unlockedAt: string;
  }>;
  targetCareer?: string;
  applicationsTracked: Array<{
    opportunityId: string;
    type: 'job' | 'government_job' | 'internship' | 'scholarship' | 'fellowship' | 'apprenticeship';
    title: string;
    organization: string;
    status: 'Saved' | 'Applied' | 'Assessment' | 'Technical Interview' | 'HR Interview' | 'Selected' | 'Rejected';
    dateApplied: string;
  }>;
  savedOpportunities: string[];
  savedNews: string[];
  certificates: Array<{
    name: string;
    provider: string;
    issueDate: string;
    credentialUrl?: string;
  }>;
  studyPlanner?: {
    targetExam: string;
    targetJob: string;
    examDate: string;
    dailyHours: number;
    dailyTasks: string[];
    weeklyTargets: string[];
    progress: number;
  };
  notificationPreferences?: {
    jobDeadlines: boolean;
    examRegistrations: boolean;
    dailyChallenges: boolean;
    studyReminders: boolean;
  };
}

export interface Opportunity {
  _id: string;
  type: 'job' | 'government_job' | 'internship' | 'scholarship' | 'fellowship' | 'apprenticeship';
  title: string;
  organization: string;
  description: string;
  vacancies?: number;
  qualification: string;
  ageLimit?: string;
  salary?: string;
  location: string;
  startDate?: string;
  endDate: string;
  eligibility: string;
  benefits?: string;
  documents?: string[];
  selectionProcess?: string;
  examPattern?: string;
  syllabus?: string;
  officialUrl: string;
  remoteOrOnsite?: 'remote' | 'onsite' | 'hybrid';
  domain: string;
  tags: string[];
}

export interface Question {
  _id: string;
  subject: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

export interface Test {
  _id: string;
  title: string;
  examId?: string;
  category: 'Placement' | 'Government Exams' | 'Higher Studies';
  duration: number;
  questions: Question[];
}

export interface TestResult {
  _id: string;
  userId: string;
  testId: string | Test;
  score: number;
  accuracy: number;
  timeTaken: number;
  correctAnswersCount: number;
  wrongAnswersCount: number;
  skippedQuestionsCount: number;
  strongAreas: string[];
  weakAreas: string[];
  aiRecommendation: string;
  date: string;
}

export interface News {
  _id: string;
  title: string;
  description: string;
  image: string;
  source: string;
  url: string;
  category: 'All' | 'Jobs' | 'Government' | 'Placement' | 'Technology' | 'Higher Studies' | 'Scholarships' | 'Internships' | 'Exams';
  publishedAt: string;
  tags: string[];
}

export interface RoadmapStep {
  title: string;
  description: string;
  resources: Array<{
    title: string;
    type: 'video' | 'article' | 'course';
    url: string;
  }>;
  practiceTestId?: string;
}

export interface Roadmap {
  _id: string;
  targetCareer: string;
  steps: RoadmapStep[];
}
