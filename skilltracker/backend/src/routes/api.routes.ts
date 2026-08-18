import { Router } from 'express';
import {
  getPersonalizedFeed,
  getOpportunities,
  getOpportunityById,
  checkEligibility,
  trackApplication,
  getTests,
  getTestById,
  submitTest,
  getTestAnalytics,
  getRoadmaps,
  analyzeSkillGap,
  getNews,
  createNews,
  updateNews,
  deleteNews,
  submitChat,
  submitResumeAudit,
  updateStudyPlan
} from '../controllers/api.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

// Apply auth middleware to all endpoints
router.use(authenticateToken);

router.get('/feed', getPersonalizedFeed);
router.get('/opportunities', getOpportunities);
router.get('/opportunities/:id', getOpportunityById);
router.get('/opportunities/:id/eligibility', checkEligibility);
router.post('/opportunities/track', trackApplication);

router.get('/tests', getTests);
router.get('/tests/analytics', getTestAnalytics);
router.get('/tests/:id', getTestById);
router.post('/tests/submit', submitTest);

router.get('/roadmaps', getRoadmaps);
router.post('/roadmaps/gap-analysis', analyzeSkillGap);

router.get('/news', getNews);
router.post('/news', createNews);
router.put('/news/:id', updateNews);
router.delete('/news/:id', deleteNews);

// AI Layer Endpoints
router.post('/ai/chat', submitChat);
router.post('/ai/resume-analysis', submitResumeAudit);
router.post('/ai/study-plan', updateStudyPlan);

export default router;
