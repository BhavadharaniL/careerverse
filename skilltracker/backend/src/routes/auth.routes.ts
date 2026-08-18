import { Router } from 'express';
import { register, login, getProfile, updateGoals, updateEducationProfile, updateSkills, addCertificate } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);

// Protected Profile Endpoints
router.get('/profile', authenticateToken, getProfile);
router.put('/goals', authenticateToken, updateGoals);
router.put('/profile', authenticateToken, updateEducationProfile);
router.put('/skills', authenticateToken, updateSkills);
router.post('/certificates', authenticateToken, addCertificate);

export default router;
