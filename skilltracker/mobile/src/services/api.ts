import axios from 'axios';
import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';
const host = (isWeb && typeof window !== 'undefined') ? window.location.hostname : '10.33.123.177';

// Use dynamic host for web, and PC network IP address for Android/iOS physical devices
const BASE_URL = `http://${host === 'localhost' ? 'localhost' : '10.33.123.177'}:5000/api`;

export const api = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Configure token injection interceptor
export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common['Authorization'];
  }
};

export const authAPI = {
  register: (data: any) => api.post('/auth/register', data),
  login: (data: any) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateGoals: (goals: string[]) => api.put('/auth/goals', { goals }),
  updateProfile: (data: any) => api.put('/auth/profile', data),
  updateSkills: (skills: any[]) => api.put('/auth/skills', { skills }),
  addCertificate: (data: any) => api.post('/auth/certificates', data)
};

export const coreAPI = {
  getFeed: () => api.get('/feed'),
  getOpportunities: (filters: any) => api.get('/opportunities', { params: filters }),
  getOpportunityById: (id: string) => api.get(`/opportunities/${id}`),
  checkEligibility: (id: string) => api.get(`/opportunities/${id}/eligibility`),
  trackApplication: (opportunityId: string, status: string) => api.post('/opportunities/track', { opportunityId, status }),
  
  getTests: (category?: string) => api.get('/tests', { params: { category } }),
  getTestById: (id: string) => api.get(`/tests/${id}`),
  submitTest: (testId: string, answers: any, timeTaken: number) => api.post('/tests/submit', { testId, answers, timeTaken }),
  getTestAnalytics: () => api.get('/tests/analytics'),

  getRoadmaps: (targetCareer?: string) => api.get('/roadmaps', { params: { targetCareer } }),
  analyzeSkillGap: (targetRole: string) => api.post('/roadmaps/gap-analysis', { targetRole }),
  
  getNews: (category?: string) => api.get('/news', { params: { category } })
};

export const aiAPI = {
  submitChat: (message: string, history: any[]) => api.post('/ai/chat', { message, history }),
  submitResumeAudit: (resumeData: any) => api.post('/ai/resume-analysis', { resumeData }),
  updateStudyPlan: (data: any) => api.post('/ai/study-plan', data)
};
