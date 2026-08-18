import mongoose, { Schema, Document } from 'mongoose';

// User Interface & Schema
export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
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
    roadmapId: mongoose.Types.ObjectId;
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
    unlockedAt: Date;
  }>;
  targetCareer?: string;
  applicationsTracked: Array<{
    opportunityId: mongoose.Types.ObjectId;
    type: 'job' | 'government_job' | 'internship' | 'scholarship' | 'fellowship' | 'apprenticeship';
    title: string;
    organization: string;
    status: 'Saved' | 'Applied' | 'Assessment' | 'Technical Interview' | 'HR Interview' | 'Selected' | 'Rejected';
    dateApplied: Date;
  }>;
  savedOpportunities: mongoose.Types.ObjectId[];
  savedNews: mongoose.Types.ObjectId[];
  certificates: Array<{
    name: string;
    provider: string;
    issueDate: Date;
    credentialUrl?: string;
  }>;
  studyPlanner?: {
    targetExam: string;
    targetJob: string;
    examDate: Date;
    dailyHours: number;
    dailyTasks: string[];
    weeklyTargets: string[];
    progress: number;
  };
  notificationPreferences: {
    jobDeadlines: boolean;
    examRegistrations: boolean;
    dailyChallenges: boolean;
    studyReminders: boolean;
  };
}

const UserSchema: Schema = new Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['USER', 'ADMIN'], default: 'USER' },
  goals: { type: [String], default: [] },
  education: {
    degree: { type: String, default: '' },
    department: { type: String, default: '' },
    college: { type: String, default: '' },
    currentYear: { type: String, default: '' },
    graduationYear: { type: String, default: '' },
    location: { type: String, default: '' },
    currentSkills: { type: [String], default: [] },
    areasOfInterest: { type: [String], default: [] }
  },
  skills: [{
    name: { type: String, required: true },
    proficiency: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    percentage: { type: Number, default: 0 },
    learningHours: { type: Number, default: 0 }
  }],
  roadmaps: [{
    roadmapId: { type: Schema.Types.ObjectId, ref: 'Roadmap' },
    title: { type: String, required: true },
    progress: { type: Number, default: 0 },
    completedSteps: { type: [String], default: [] }
  }],
  streak: { type: Number, default: 0 },
  xp: { type: Number, default: 0 },
  badges: [{
    id: { type: String, required: true },
    name: { type: String, required: true },
    description: { type: String, required: true },
    icon: { type: String, required: true },
    unlockedAt: { type: Date, default: Date.now }
  }],
  targetCareer: { type: String, default: '' },
  applicationsTracked: [{
    opportunityId: { type: Schema.Types.ObjectId, ref: 'Opportunity' },
    type: { type: String, required: true },
    title: { type: String, required: true },
    organization: { type: String, required: true },
    status: { type: String, enum: ['Saved', 'Applied', 'Assessment', 'Technical Interview', 'HR Interview', 'Selected', 'Rejected'], default: 'Saved' },
    dateApplied: { type: Date, default: Date.now }
  }],
  savedOpportunities: [{ type: Schema.Types.ObjectId, ref: 'Opportunity' }],
  savedNews: [{ type: Schema.Types.ObjectId, ref: 'News' }],
  certificates: [{
    name: { type: String, required: true },
    provider: { type: String, required: true },
    issueDate: { type: Date, default: Date.now },
    credentialUrl: { type: String, default: '' }
  }],
  studyPlanner: {
    targetExam: { type: String, default: '' },
    targetJob: { type: String, default: '' },
    examDate: { type: Date },
    dailyHours: { type: Number, default: 0 },
    dailyTasks: { type: [String], default: [] },
    weeklyTargets: { type: [String], default: [] },
    progress: { type: Number, default: 0 }
  },
  notificationPreferences: {
    jobDeadlines: { type: Boolean, default: true },
    examRegistrations: { type: Boolean, default: true },
    dailyChallenges: { type: Boolean, default: true },
    studyReminders: { type: Boolean, default: true }
  }
}, { timestamps: true });

// Unified Opportunity Interface & Schema
export interface IOpportunity extends Document {
  type: 'job' | 'government_job' | 'internship' | 'scholarship' | 'fellowship' | 'apprenticeship';
  title: string;
  organization: string; // company or agency/board (e.g. UPSC, ISRO)
  description: string;
  vacancies?: number;
  qualification: string; // e.g. B.E/B.Tech in CSE, Any Degree
  ageLimit?: string;
  salary?: string; // or stipend (e.g. 50,000/month)
  location: string; // e.g. Bangalore, Remote, India
  startDate?: Date;
  endDate: Date; // Last date to apply
  eligibility: string; // Detail requirements description
  benefits?: string; // For scholarships/internships
  documents?: string[];
  selectionProcess?: string; // Gov exam selection steps
  examPattern?: string;
  syllabus?: string;
  officialUrl: string; // application link
  remoteOrOnsite?: 'remote' | 'onsite' | 'hybrid';
  domain: string; // e.g. CSE, IT, Electrical, Management
  tags: string[];
}

const OpportunitySchema: Schema = new Schema({
  type: { type: String, required: true, enum: ['job', 'government_job', 'internship', 'scholarship', 'fellowship', 'apprenticeship'] },
  title: { type: String, required: true },
  organization: { type: String, required: true },
  description: { type: String, required: true },
  vacancies: { type: Number },
  qualification: { type: String, required: true },
  ageLimit: { type: String },
  salary: { type: String },
  location: { type: String, required: true },
  startDate: { type: Date },
  endDate: { type: Date, required: true },
  eligibility: { type: String, required: true },
  benefits: { type: String },
  documents: { type: [String], default: [] },
  selectionProcess: { type: String },
  examPattern: { type: String },
  syllabus: { type: String },
  officialUrl: { type: String, required: true },
  remoteOrOnsite: { type: String, enum: ['remote', 'onsite', 'hybrid'], default: 'onsite' },
  domain: { type: String, required: true },
  tags: { type: [String], default: [] }
}, { timestamps: true });

// Exam Interface & Schema
export interface IExam extends Document {
  name: string;
  category: 'Government Exams' | 'Placement' | 'Higher Studies';
  subjects: string[];
}

const ExamSchema: Schema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true, enum: ['Government Exams', 'Placement', 'Higher Studies'] },
  subjects: { type: [String], default: [] }
});

// Question Interface & Schema
export interface IQuestion extends Document {
  subject: string;
  text: string;
  options: string[];
  correctOptionIndex: number;
  explanation: string;
}

const QuestionSchema: Schema = new Schema({
  subject: { type: String, required: true },
  text: { type: String, required: true },
  options: { type: [String], required: true },
  correctOptionIndex: { type: Number, required: true },
  explanation: { type: String, default: '' }
});

// Test Interface & Schema
export interface ITest extends Document {
  title: string;
  examId?: mongoose.Types.ObjectId; // For subject/exam linkage
  category: 'Placement' | 'Government Exams' | 'Higher Studies';
  duration: number; // in minutes
  questions: mongoose.Types.ObjectId[];
}

const TestSchema: Schema = new Schema({
  title: { type: String, required: true },
  examId: { type: Schema.Types.ObjectId, ref: 'Exam' },
  category: { type: String, required: true, enum: ['Placement', 'Government Exams', 'Higher Studies'] },
  duration: { type: Number, required: true },
  questions: [{ type: Schema.Types.ObjectId, ref: 'Question' }]
});

// TestResult Interface & Schema
export interface ITestResult extends Document {
  userId: mongoose.Types.ObjectId;
  testId: mongoose.Types.ObjectId;
  score: number;
  accuracy: number; // e.g. 80 (for 80%)
  timeTaken: number; // in seconds
  correctAnswersCount: number;
  wrongAnswersCount: number;
  skippedQuestionsCount: number;
  strongAreas: string[];
  weakAreas: string[];
  aiRecommendation: string;
  date: Date;
}

const TestResultSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  testId: { type: Schema.Types.ObjectId, ref: 'Test', required: true },
  score: { type: Number, required: true },
  accuracy: { type: Number, required: true },
  timeTaken: { type: Number, required: true },
  correctAnswersCount: { type: Number, required: true },
  wrongAnswersCount: { type: Number, required: true },
  skippedQuestionsCount: { type: Number, required: true },
  strongAreas: { type: [String], default: [] },
  weakAreas: { type: [String], default: [] },
  aiRecommendation: { type: String, default: '' },
  date: { type: Date, default: Date.now }
});

// News Interface & Schema
export interface INews extends Document {
  title: string;
  description: string;
  image: string;
  source: string;
  url: string;
  category: 'All' | 'Jobs' | 'Government' | 'Placement' | 'Technology' | 'Higher Studies' | 'Scholarships' | 'Internships' | 'Exams';
  publishedAt: Date;
  tags: string[];
}

const NewsSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  image: { type: String, required: true },
  source: { type: String, required: true },
  url: { type: String, default: '' },
  category: { type: String, required: true, enum: ['All', 'Jobs', 'Government', 'Placement', 'Technology', 'Higher Studies', 'Scholarships', 'Internships', 'Exams'] },
  publishedAt: { type: Date, default: Date.now },
  tags: { type: [String], default: [] }
}, { timestamps: true });

// Roadmap Interface & Schema
export interface IRoadmap extends Document {
  targetCareer: string; // e.g. "Software Engineer"
  steps: Array<{
    title: string;
    description: string;
    resources: Array<{
      title: string;
      type: 'video' | 'article' | 'course';
      url: string;
    }>;
    practiceTestId?: mongoose.Types.ObjectId;
  }>;
}

const RoadmapSchema: Schema = new Schema({
  targetCareer: { type: String, required: true, unique: true },
  steps: [{
    title: { type: String, required: true },
    description: { type: String, required: true },
    resources: [{
      title: { type: String, required: true },
      type: { type: String, enum: ['video', 'article', 'course'], required: true },
      url: { type: String, required: true }
    }],
    practiceTestId: { type: Schema.Types.ObjectId, ref: 'Test' }
  }]
});

// Export all models
export const User = mongoose.model<IUser>('User', UserSchema);
export const Opportunity = mongoose.model<IOpportunity>('Opportunity', OpportunitySchema);
export const Exam = mongoose.model<IExam>('Exam', ExamSchema);
export const Question = mongoose.model<IQuestion>('Question', QuestionSchema);
export const Test = mongoose.model<ITest>('Test', TestSchema);
export const TestResult = mongoose.model<ITestResult>('TestResult', TestResultSchema);
export const News = mongoose.model<INews>('News', NewsSchema);
export const Roadmap = mongoose.model<IRoadmap>('Roadmap', RoadmapSchema);
