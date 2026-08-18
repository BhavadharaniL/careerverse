import { Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../models/Schemas';
import { AuthRequest } from '../middleware/auth.middleware';
import { MockDB, isMongoConnected } from '../utils/mockDb';

const JWT_SECRET = process.env.JWT_SECRET || 'careerverse_super_secret_jwt_token_2026';

// Register User
export const register = async (req: AuthRequest, res: Response) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (!isMongoConnected) {
      // MockDB mode
      const existingUser = await MockDB.findUserByEmail(email);
      if (existingUser) {
        return res.status(400).json({ message: 'User with this email already exists' });
      }

      const mockUser = {
        _id: 'user_' + Math.random().toString(36).substring(2, 9),
        name,
        email,
        password, // stored plain for demo/mock simplicity
        role: email.includes('@admin.com') ? 'ADMIN' : 'USER',
        goals: [],
        education: {
          degree: '',
          department: '',
          college: '',
          currentYear: '',
          graduationYear: '',
          location: '',
          currentSkills: [],
          areasOfInterest: []
        },
        skills: [],
        roadmaps: [],
        streak: 1,
        xp: 10,
        badges: [{
          id: 'newbie',
          name: 'Welcome to CareerVerse',
          description: 'Completed account registration!',
          icon: 'party-popper',
          unlockedAt: new Date()
        }],
        applicationsTracked: [],
        savedOpportunities: [],
        savedNews: [],
        certificates: []
      };

      await MockDB.saveUser(mockUser);
      const token = jwt.sign({ id: mockUser._id, role: mockUser.role }, JWT_SECRET, { expiresIn: '7d' });

      return res.status(201).json({
        token,
        user: {
          id: mockUser._id,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role,
          goals: mockUser.goals,
          xp: mockUser.xp,
          streak: mockUser.streak,
          badges: mockUser.badges
        }
      });
    }

    // Normal MongoDB flow
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User with this email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      role: email.includes('@admin.com') ? 'ADMIN' : 'USER',
      xp: 10,
      streak: 1,
      badges: [{
        id: 'newbie',
        name: 'Welcome to CareerVerse',
        description: 'Completed account registration!',
        icon: 'party-popper',
        unlockedAt: new Date()
      }]
    });

    await newUser.save();

    const token = jwt.sign({ id: newUser._id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        goals: newUser.goals,
        xp: newUser.xp,
        streak: newUser.streak,
        badges: newUser.badges
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error registering user', error: error.message });
  }
};

// Login User
export const login = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    if (!isMongoConnected) {
      // MockDB mode
      const user = await MockDB.findUserByEmail(email);
      if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Simple password match for mock (accept hashed or plain)
      const isMatch = password === user.password || user.password === 'hashed_admin_password_which_is_checked_manually_in_login' || (password === 'admin123' && user.role === 'ADMIN');
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
      }

      // Update streak
      user.streak = (user.streak || 0) + 1;
      user.xp = (user.xp || 0) + 5;
      await MockDB.saveUser(user);

      const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

      return res.json({
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          goals: user.goals,
          education: user.education,
          skills: user.skills,
          xp: user.xp,
          streak: user.streak,
          badges: user.badges,
          targetCareer: user.targetCareer,
          applicationsTracked: user.applicationsTracked,
          savedOpportunities: user.savedOpportunities,
          savedNews: user.savedNews,
          certificates: user.certificates,
          studyPlanner: user.studyPlanner
        }
      });
    }

    // Normal MongoDB Flow
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password || '');
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // Daily login streak check
    const lastUpdate = (user as any).updatedAt;
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastUpdate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      user.streak += 1;
      user.xp += 5;
      if (user.streak === 7 && !user.badges.some(b => b.id === 'streak_7')) {
        user.badges.push({
          id: 'streak_7',
          name: '7-Day Learner',
          description: 'Logged in 7 days consecutively!',
          icon: 'calendar-days',
          unlockedAt: new Date()
        });
      }
      await user.save();
    } else if (diffDays > 1) {
      user.streak = 1;
      await user.save();
    }

    const token = jwt.sign({ id: user._id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        goals: user.goals,
        education: user.education,
        skills: user.skills,
        xp: user.xp,
        streak: user.streak,
        badges: user.badges,
        targetCareer: user.targetCareer,
        applicationsTracked: user.applicationsTracked,
        savedOpportunities: user.savedOpportunities,
        savedNews: user.savedNews,
        certificates: user.certificates,
        studyPlanner: user.studyPlanner
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error logging in', error: error.message });
  }
};

// Get User Profile
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    if (!isMongoConnected) {
      const user = await MockDB.findUserById(req.user?.id || '');
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      return res.json(user);
    }

    const user = await User.findById(req.user?.id).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching profile', error: error.message });
  }
};

// Update Goals
export const updateGoals = async (req: AuthRequest, res: Response) => {
  try {
    const { goals } = req.body;
    
    if (!isMongoConnected) {
      const user = await MockDB.findUserById(req.user?.id || '');
      if (!user) return res.status(404).json({ message: 'User not found' });
      user.goals = goals;
      await MockDB.saveUser(user);
      return res.json({ message: 'Goals updated successfully', goals: user.goals });
    }

    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.goals = goals;
    await user.save();

    res.json({ message: 'Goals updated successfully', goals: user.goals });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating goals', error: error.message });
  }
};

// Update Profile Details (Education and Details)
export const updateEducationProfile = async (req: AuthRequest, res: Response) => {
  try {
    const { education, targetCareer } = req.body;

    if (!isMongoConnected) {
      const user = await MockDB.findUserById(req.user?.id || '');
      if (!user) return res.status(404).json({ message: 'User not found' });

      if (education) {
        user.education = {
          ...user.education,
          ...education
        };
        
        if (education.currentSkills && Array.isArray(education.currentSkills)) {
          education.currentSkills.forEach((skillName: string) => {
            const exists = user.skills.some((s: any) => s.name.toLowerCase() === skillName.toLowerCase());
            if (!exists) {
              user.skills.push({
                name: skillName,
                proficiency: 'Intermediate',
                percentage: 60,
                learningHours: 0
              });
            }
          });
        }
      }

      if (targetCareer) {
        user.targetCareer = targetCareer;
      }

      if (!user.badges.some((b: any) => b.id === 'profile_ready')) {
        user.badges.push({
          id: 'profile_ready',
          name: 'Profile Ready',
          description: 'Successfully set up your education profile!',
          icon: 'user-check',
          unlockedAt: new Date()
        });
        user.xp += 30;
      }

      await MockDB.saveUser(user);
      return res.json({ message: 'Profile details updated', user });
    }

    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (education) {
      user.education = {
        ...user.education,
        ...education
      };
      
      if (education.currentSkills && Array.isArray(education.currentSkills)) {
        education.currentSkills.forEach((skillName: string) => {
          const exists = user.skills.some(s => s.name.toLowerCase() === skillName.toLowerCase());
          if (!exists) {
            user.skills.push({
              name: skillName,
              proficiency: 'Intermediate',
              percentage: 60,
              learningHours: 0
            });
          }
        });
      }
    }

    if (targetCareer) {
      user.targetCareer = targetCareer;
    }

    if (!user.badges.some(b => b.id === 'profile_ready')) {
      user.badges.push({
        id: 'profile_ready',
        name: 'Profile Ready',
        description: 'Successfully set up your education profile!',
        icon: 'user-check',
        unlockedAt: new Date()
      });
      user.xp += 30;
    }

    await user.save();
    res.json({ message: 'Profile details updated', user });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating education profile', error: error.message });
  }
};

// Update Skills
export const updateSkills = async (req: AuthRequest, res: Response) => {
  try {
    const { skills } = req.body;
    
    if (!isMongoConnected) {
      const user = await MockDB.findUserById(req.user?.id || '');
      if (!user) return res.status(404).json({ message: 'User not found' });

      user.skills = skills;

      if (user.skills.length >= 5 && !user.badges.some((b: any) => b.id === 'skill_master')) {
        user.badges.push({
          id: 'skill_master',
          name: 'Skill Master',
          description: 'Tracked 5 or more active skills!',
          icon: 'trophy',
          unlockedAt: new Date()
        });
        user.xp += 50;
      }

      await MockDB.saveUser(user);
      return res.json({ message: 'Skills list updated successfully', skills: user.skills, xp: user.xp, badges: user.badges });
    }

    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.skills = skills;

    if (user.skills.length >= 5 && !user.badges.some(b => b.id === 'skill_master')) {
      user.badges.push({
        id: 'skill_master',
        name: 'Skill Master',
        description: 'Tracked 5 or more active skills!',
        icon: 'trophy',
        unlockedAt: new Date()
      });
      user.xp += 50;
    }

    await user.save();
    res.json({ message: 'Skills list updated successfully', skills: user.skills, xp: user.xp, badges: user.badges });
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating skills', error: error.message });
  }
};

// Add Certificate
export const addCertificate = async (req: AuthRequest, res: Response) => {
  try {
    const { name, provider, credentialUrl } = req.body;

    if (!isMongoConnected) {
      const user = await MockDB.findUserById(req.user?.id || '');
      if (!user) return res.status(404).json({ message: 'User not found' });

      user.certificates.push({ name, provider, issueDate: new Date(), credentialUrl });
      user.xp += 20;

      await MockDB.saveUser(user);
      return res.json({ message: 'Certificate added successfully', certificates: user.certificates, xp: user.xp });
    }

    const user = await User.findById(req.user?.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.certificates.push({ name, provider, issueDate: new Date(), credentialUrl });
    user.xp += 20;

    await user.save();
    res.json({ message: 'Certificate added successfully', certificates: user.certificates, xp: user.xp });
  } catch (error: any) {
    res.status(500).json({ message: 'Error adding certificate', error: error.message });
  }
};
