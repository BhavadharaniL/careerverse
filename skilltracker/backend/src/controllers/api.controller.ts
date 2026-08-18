import { Response } from 'express';
import { User, Opportunity, Test, Question, TestResult, News, Roadmap, IQuestion } from '../models/Schemas';
import { AuthRequest } from '../middleware/auth.middleware';
import { AIService } from '../services/ai.service';
import { MockDB, isMongoConnected } from '../utils/mockDb';
import mongoose from 'mongoose';

// 1. Get Personalized Feed for Dashboard
export const getPersonalizedFeed = async (req: AuthRequest, res: Response) => {
  try {
    let user: any;
    let deadlines: any[] = [];
    let recommendations: any[] = [];
    let roadmapsProgress: any[] = [];
    let challengeQuestions: any[] = [];
    let cappedReadiness = 50;
    let avgScore = 65;

    if (!isMongoConnected) {
      user = await MockDB.findUserById(req.user?.id || '');
      if (!user) return res.status(404).json({ message: 'User not found' });

      const opps = await MockDB.getOpportunities({});
      const oppTypes: string[] = [];
      if (user.goals.includes('Campus Placement') || user.goals.includes('Skill Development')) oppTypes.push('job', 'internship');
      if (user.goals.includes('Government Jobs') || user.goals.includes('Competitive Exams')) oppTypes.push('government_job');
      if (user.goals.includes('Higher Studies')) oppTypes.push('scholarship', 'fellowship');
      if (user.goals.includes('Internships')) oppTypes.push('internship', 'apprenticeship');

      const matchingOpps = opps.filter(o => oppTypes.includes(o.type));
      
      deadlines = matchingOpps.slice(0, 5).map(o => ({
        _id: o._id,
        title: o.title,
        organization: o.organization,
        type: o.type,
        endDate: o.endDate
      }));

      recommendations = opps.filter(o => 
        oppTypes.includes(o.type) || 
        o.domain === user.education.department ||
        (user.education.areasOfInterest && o.tags && o.tags.some((t: string) => user.education.areasOfInterest.includes(t)))
      ).slice(0, 5);

      roadmapsProgress = user.roadmaps || [];
      challengeQuestions = MockDB.questions.slice(0, 3);

      const results = await MockDB.getTestResults(user._id);
      avgScore = results.length > 0 ? results.reduce((acc, r) => acc + r.accuracy, 0) / results.length : 60;
      
      const profileCompleteness = (user.education.degree ? 20 : 0) + (user.education.college ? 20 : 0) + (user.education.currentSkills && user.education.currentSkills.length > 0 ? 20 : 0) + (user.goals && user.goals.length > 0 ? 20 : 0) + (user.certificates && user.certificates.length > 0 ? 20 : 0);
      const readinessScore = Math.round((profileCompleteness * 0.4) + (avgScore * 0.4) + (user.skills.length * 4));
      cappedReadiness = Math.min(readinessScore, 100);

    } else {
      // Normal MongoDB flow
      user = await User.findById(req.user?.id);
      if (!user) return res.status(404).json({ message: 'User not found' });

      const oppTypes: string[] = [];
      if (user.goals.includes('Campus Placement') || user.goals.includes('Skill Development')) oppTypes.push('job', 'internship');
      if (user.goals.includes('Government Jobs') || user.goals.includes('Competitive Exams')) oppTypes.push('government_job');
      if (user.goals.includes('Higher Studies')) oppTypes.push('scholarship', 'fellowship');
      if (user.goals.includes('Internships')) oppTypes.push('internship', 'apprenticeship');

      const queryDeadlines = await Opportunity.find({
        type: { $in: oppTypes.length > 0 ? oppTypes : ['job', 'internship'] },
        endDate: { $gte: new Date() }
      }).sort({ endDate: 1 }).limit(5).select('title organization type endDate');

      deadlines = queryDeadlines;

      recommendations = await Opportunity.find({
        $or: [
          { type: { $in: oppTypes } },
          { domain: user.education.department },
          { tags: { $in: user.education.areasOfInterest } }
        ],
        endDate: { $gte: new Date() }
      }).limit(5).select('title organization type location salary qualification');

      roadmapsProgress = user.roadmaps || [];
      challengeQuestions = await Question.find().limit(3);

      const results = await TestResult.find({ userId: user._id });
      avgScore = results.length > 0 ? results.reduce((acc, r) => acc + r.accuracy, 0) / results.length : 60;
      
      const profileCompleteness = (user.education.degree ? 20 : 0) + (user.education.college ? 20 : 0) + (user.education.currentSkills && user.education.currentSkills.length > 0 ? 20 : 0) + (user.goals && user.goals.length > 0 ? 20 : 0) + (user.certificates && user.certificates.length > 0 ? 20 : 0);
      const readinessScore = Math.round((profileCompleteness * 0.4) + (avgScore * 0.4) + (user.skills.length * 4));
      cappedReadiness = Math.min(readinessScore, 100);
    }

    res.json({
      readiness: {
        score: cappedReadiness || 45,
        skills: Math.min(40 + user.skills.length * 8, 100),
        preparation: Math.round(avgScore),
        consistency: Math.min(50 + user.streak * 4, 100)
      },
      deadlines: deadlines.map(d => {
        const daysLeft = Math.ceil((new Date(d.endDate).getTime() - new Date().getTime()) / (1000 * 3600 * 24));
        let urgency = 'Later';
        if (daysLeft <= 3) urgency = 'Critical';
        else if (daysLeft <= 7) urgency = 'Upcoming';
        return {
          id: d._id || d.id,
          title: d.title,
          organization: d.organization,
          type: d.type,
          endDate: d.endDate,
          daysLeft,
          urgency
        };
      }),
      recommendations,
      continueLearning: roadmapsProgress.map(r => ({
        id: r.roadmapId,
        title: r.title,
        progress: r.progress
      })),
      dailyChallenge: {
        questions: challengeQuestions,
        completed: false
      }
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving personalized feed', error: error.message });
  }
};

// 2. Get Opportunities with Filters
export const getOpportunities = async (req: AuthRequest, res: Response) => {
  try {
    const { type, location, qualification, domain, remoteOrOnsite, search } = req.query;

    if (!isMongoConnected) {
      let opps = await MockDB.getOpportunities({ type, remoteOrOnsite, search });
      if (location) opps = opps.filter(o => o.location.toLowerCase().includes(String(location).toLowerCase()));
      if (qualification) opps = opps.filter(o => o.qualification.toLowerCase().includes(String(qualification).toLowerCase()));
      if (domain) opps = opps.filter(o => o.domain.toLowerCase().includes(String(domain).toLowerCase()));
      return res.json(opps);
    }

    const filter: any = {};
    if (type) filter.type = type;
    if (location) filter.location = { $regex: String(location), $options: 'i' };
    if (qualification) filter.qualification = { $regex: String(qualification), $options: 'i' };
    if (domain) filter.domain = { $regex: String(domain), $options: 'i' };
    if (remoteOrOnsite) filter.remoteOrOnsite = remoteOrOnsite;
    
    if (search) {
      filter.$or = [
        { title: { $regex: String(search), $options: 'i' } },
        { organization: { $regex: String(search), $options: 'i' } },
        { description: { $regex: String(search), $options: 'i' } }
      ];
    }

    const opportunities = await Opportunity.find(filter).sort({ createdAt: -1 });
    res.json(opportunities);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching opportunities', error: error.message });
  }
};

// 3. Opportunity Details
export const getOpportunityById = async (req: AuthRequest, res: Response) => {
  try {
    if (!isMongoConnected) {
      const opportunity = await MockDB.getOpportunityById(req.params.id);
      if (!opportunity) return res.status(404).json({ message: 'Opportunity not found' });
      return res.json(opportunity);
    }

    const opportunity = await Opportunity.findById(req.params.id);
    if (!opportunity) {
      return res.status(404).json({ message: 'Opportunity not found' });
    }
    res.json(opportunity);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching opportunity details', error: error.message });
  }
};

// 4. Smart Eligibility Checker
export const checkEligibility = async (req: AuthRequest, res: Response) => {
  try {
    let user: any;
    let opportunity: any;

    if (!isMongoConnected) {
      user = await MockDB.findUserById(req.user?.id || '');
      opportunity = await MockDB.getOpportunityById(req.params.id);
    } else {
      user = await User.findById(req.user?.id);
      opportunity = await Opportunity.findById(req.params.id);
    }

    if (!user || !opportunity) {
      return res.status(404).json({ message: 'User or Opportunity not found' });
    }

    const { degree, department } = user.education;
    const reqQual = opportunity.qualification.toLowerCase();

    let eligible = false;
    let message = '';

    const matchesDegree = reqQual.includes('any') || 
                          (degree && reqQual.includes(degree.toLowerCase())) || 
                          (degree && degree.toLowerCase().includes('b.e') && reqQual.includes('engineering'));

    const matchesDept = reqQual.includes('any') || 
                        (department && reqQual.includes(department.toLowerCase()));

    if (matchesDegree && matchesDept) {
      eligible = true;
      message = 'You appear eligible based on your degree and department profile specifications.';
    } else if (matchesDegree && !matchesDept) {
      eligible = false;
      message = `Your qualification degree matches, but this role typically requires specialization in: ${opportunity.qualification}.`;
    } else {
      eligible = false;
      message = `Your education degree (${degree || 'N/A'}) does not match the listed requirements (${opportunity.qualification}).`;
    }

    res.json({ eligible, message });
  } catch (error: any) {
    res.status(500).json({ message: 'Error checking eligibility', error: error.message });
  }
};

// 5. Track Application Status
export const trackApplication = async (req: AuthRequest, res: Response) => {
  try {
    const { opportunityId, status } = req.body;
    let user: any;
    let opp: any;

    if (!isMongoConnected) {
      user = await MockDB.findUserById(req.user?.id || '');
      opp = await MockDB.getOpportunityById(opportunityId);
    } else {
      user = await User.findById(req.user?.id);
      opp = await Opportunity.findById(opportunityId);
    }

    if (!user || !opp) {
      return res.status(404).json({ message: 'User or Opportunity not found' });
    }

    const existingIndex = user.applicationsTracked.findIndex((a: any) => (a.opportunityId || '').toString() === opportunityId);

    if (existingIndex > -1) {
      user.applicationsTracked[existingIndex].status = status;
    } else {
      user.applicationsTracked.push({
        opportunityId: opp._id,
        title: opp.title,
        organization: opp.organization,
        type: opp.type,
        status,
        dateApplied: new Date()
      });
      user.xp += 15;
    }

    if (user.applicationsTracked.length >= 3 && !user.badges.some((b: any) => b.id === 'applicant_tier1')) {
      user.badges.push({
        id: 'applicant_tier1',
        name: 'Career Hunter',
        description: 'Tracked 3 or more opportunities in your tracker!',
        icon: 'briefcase',
        unlockedAt: new Date()
      });
      user.xp += 40;
    }

    if (!isMongoConnected) {
      await MockDB.saveUser(user);
    } else {
      await user.save();
    }

    res.json({ message: 'Application status tracked successfully', applications: user.applicationsTracked, xp: user.xp });
  } catch (error: any) {
    res.status(500).json({ message: 'Error tracking application', error: error.message });
  }
};

// 6. Get Tests (grouped or filtered)
export const getTests = async (req: AuthRequest, res: Response) => {
  try {
    const { category } = req.query;
    
    if (!isMongoConnected) {
      const tests = await MockDB.getTests(category as string);
      return res.json(tests);
    }

    const filter: any = {};
    if (category) filter.category = category;

    const tests = await Test.find(filter).populate('questions');
    res.json(tests);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching tests', error: error.message });
  }
};

// 7. Get Test details
export const getTestById = async (req: AuthRequest, res: Response) => {
  try {
    if (!isMongoConnected) {
      const test = await MockDB.getTestById(req.params.id);
      if (!test) return res.status(404).json({ message: 'Test not found' });
      return res.json(test);
    }

    const test = await Test.findById(req.params.id).populate('questions');
    if (!test) {
      return res.status(404).json({ message: 'Test not found' });
    }
    res.json(test);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching test', error: error.message });
  }
};

// 8. Submit Test answers
export const submitTest = async (req: AuthRequest, res: Response) => {
  try {
    const { testId, answers, timeTaken } = req.body;
    let user: any;
    let test: any;

    if (!isMongoConnected) {
      user = await MockDB.findUserById(req.user?.id || '');
      test = await MockDB.getTestById(testId);
    } else {
      user = await User.findById(req.user?.id);
      test = await Test.findById(testId).populate('questions');
    }

    if (!user || !test) {
      return res.status(404).json({ message: 'User or Test not found' });
    }

    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;
    const strongAreasMap: { [key: string]: number } = {};
    const weakAreasMap: { [key: string]: number } = {};

    test.questions.forEach((q: any) => {
      const questionId = q._id.toString();
      const submittedAnswer = answers[questionId];

      if (submittedAnswer === undefined || submittedAnswer === null) {
        skippedCount++;
      } else if (Number(submittedAnswer) === q.correctOptionIndex) {
        correctCount++;
        strongAreasMap[q.subject] = (strongAreasMap[q.subject] || 0) + 1;
      } else {
        wrongCount++;
        weakAreasMap[q.subject] = (weakAreasMap[q.subject] || 0) + 1;
      }
    });

    const totalQuestions = test.questions.length;
    const accuracy = totalQuestions > 0 ? Math.round((correctCount / totalQuestions) * 100) : 0;
    const score = correctCount * 4 - wrongCount * 1;

    const strongAreas = Object.keys(strongAreasMap).filter(k => strongAreasMap[k] >= (weakAreasMap[k] || 0));
    const weakAreas = Object.keys(weakAreasMap).filter(k => weakAreasMap[k] > (strongAreasMap[k] || 0));

    const aiRecommendation = await AIService.analyzeTestPerformance(score, accuracy, timeTaken, test.category, test.title);

    const resultData = {
      userId: user._id,
      testId: test._id,
      score,
      accuracy,
      timeTaken,
      correctAnswersCount: correctCount,
      wrongAnswersCount: wrongCount,
      skippedQuestionsCount: skippedCount,
      strongAreas,
      weakAreas,
      aiRecommendation
    };

    let savedResult: any;
    if (!isMongoConnected) {
      savedResult = await MockDB.saveTestResult(resultData);
    } else {
      const testResult = new TestResult(resultData);
      savedResult = await testResult.save();
    }

    // Award rewards
    user.xp = (user.xp || 0) + 50;
    if (!user.badges.some((b: any) => b.id === 'first_test')) {
      user.badges.push({
        id: 'first_test',
        name: 'First Mock Test',
        description: 'Completed your first assessment on CareerVerse!',
        icon: 'medal',
        unlockedAt: new Date()
      });
    }

    if (!isMongoConnected) {
      await MockDB.saveUser(user);
    } else {
      await user.save();
    }

    res.json({
      resultId: savedResult._id,
      score,
      accuracy,
      timeTaken,
      correctAnswersCount: correctCount,
      wrongAnswersCount: wrongCount,
      skippedQuestionsCount: skippedCount,
      strongAreas,
      weakAreas,
      aiRecommendation
    });
  } catch (error: any) {
    res.status(500).json({ message: 'Error submitting test', error: error.message });
  }
};

// 9. Get Test Results dashboard metrics
export const getTestAnalytics = async (req: AuthRequest, res: Response) => {
  try {
    if (!isMongoConnected) {
      const results = await MockDB.getTestResults(req.user?.id || '');
      return res.json(results);
    }

    const results = await TestResult.find({ userId: req.user?.id }).populate('testId').sort({ date: -1 });
    res.json(results);
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving test analytics', error: error.message });
  }
};

// 10. AI Roadmap and Skill Gap generator
export const getRoadmaps = async (req: AuthRequest, res: Response) => {
  try {
    const { targetCareer } = req.query;

    if (!isMongoConnected) {
      if (targetCareer) {
        const roadmap = await MockDB.getRoadmapByCareer(String(targetCareer));
        return res.json(roadmap);
      }
      const roadmaps = await MockDB.getRoadmaps();
      return res.json(roadmaps.map(r => ({ _id: r._id, targetCareer: r.targetCareer })));
    }

    if (targetCareer) {
      let roadmap = await Roadmap.findOne({ targetCareer: { $regex: String(targetCareer), $options: 'i' } });
      if (!roadmap) {
        const user = await User.findById(req.user?.id);
        const userSkills = user?.skills.map(s => s.name) || [];
        const steps = await AIService.generateRoadmap(String(targetCareer), userSkills);
        
        roadmap = new Roadmap({
          targetCareer: String(targetCareer),
          steps
        });
        await roadmap.save();
      }
      return res.json(roadmap);
    }

    const roadmaps = await Roadmap.find().select('targetCareer');
    res.json(roadmaps);
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving roadmap', error: error.message });
  }
};

// 11. Run AI Skill Gap analysis
export const analyzeSkillGap = async (req: AuthRequest, res: Response) => {
  try {
    const { targetRole } = req.body;
    let user: any;
    if (!isMongoConnected) {
      user = await MockDB.findUserById(req.user?.id || '');
    } else {
      user = await User.findById(req.user?.id);
    }

    if (!user) return res.status(404).json({ message: 'User not found' });

    const currentSkills = user.skills.map((s: any) => s.name);
    const analysis = await AIService.analyzeSkillGap(targetRole, currentSkills);
    res.json(analysis);
  } catch (error: any) {
    res.status(500).json({ message: 'Error executing skill gap analysis', error: error.message });
  }
};

// 12. Personalized News
export const getNews = async (req: AuthRequest, res: Response) => {
  try {
    const { category } = req.query;
    let user: any;

    if (!isMongoConnected) {
      user = await MockDB.findUserById(req.user?.id || '');
      const newsFeed = await MockDB.getNews(category as string);
      return res.json(newsFeed);
    }

    user = await User.findById(req.user?.id);
    const filter: any = {};
    if (category && category !== 'All') {
      filter.category = category;
    } else if (user) {
      const goalCategories: string[] = ['Technology'];
      if (user.goals.includes('Campus Placement')) goalCategories.push('Placement', 'Jobs');
      if (user.goals.includes('Government Jobs')) goalCategories.push('Government', 'Exams');
      if (user.goals.includes('Higher Studies')) goalCategories.push('Higher Studies', 'Scholarships');
      if (user.goals.includes('Internships')) goalCategories.push('Internships');
      
      filter.category = { $in: goalCategories };
    }

    const newsFeed = await News.find(filter).sort({ publishedAt: -1 });
    res.json(newsFeed);
  } catch (error: any) {
    res.status(500).json({ message: 'Error fetching news feed', error: error.message });
  }
};

// 13. AI Assistant Chat Submission
export const submitChat = async (req: AuthRequest, res: Response) => {
  try {
    const { message, history } = req.body;
    let user: any;

    if (!isMongoConnected) {
      user = await MockDB.findUserById(req.user?.id || '');
    } else {
      user = await User.findById(req.user?.id);
    }

    if (!user) return res.status(404).json({ message: 'User not found' });

    const reply = await AIService.chat(message, user, history || []);
    res.json({ reply });
  } catch (error: any) {
    res.status(500).json({ message: 'Error retrieving chatbot answer', error: error.message });
  }
};

// 14. Resume Wizard Audit
export const submitResumeAudit = async (req: AuthRequest, res: Response) => {
  try {
    const { resumeData } = req.body;
    let user: any;

    if (!isMongoConnected) {
      user = await MockDB.findUserById(req.user?.id || '');
    } else {
      user = await User.findById(req.user?.id);
    }

    if (!user) return res.status(404).json({ message: 'User not found' });

    const audit = await AIService.analyzeResume(resumeData);
    
    if (!user.badges.some((b: any) => b.id === 'resume_ready')) {
      user.badges.push({
        id: 'resume_ready',
        name: 'Resume Ready',
        description: 'Successfully built and analyzed your resume!',
        icon: 'file-text',
        unlockedAt: new Date()
      });
      user.xp += 30;
      
      if (!isMongoConnected) {
        await MockDB.saveUser(user);
      } else {
        await user.save();
      }
    }

    res.json(audit);
  } catch (error: any) {
    res.status(500).json({ message: 'Error auditing resume', error: error.message });
  }
};

// 15. Create or Update Study Plan
export const updateStudyPlan = async (req: AuthRequest, res: Response) => {
  try {
    const { targetExam, targetJob, examDate, dailyHours } = req.body;
    let user: any;

    if (!isMongoConnected) {
      user = await MockDB.findUserById(req.user?.id || '');
    } else {
      user = await User.findById(req.user?.id);
    }

    if (!user) return res.status(404).json({ message: 'User not found' });

    const planDetails = await AIService.generateStudyPlan(targetExam, dailyHours, targetJob, examDate);

    user.studyPlanner = {
      targetExam: targetExam || '',
      targetJob: targetJob || '',
      examDate: new Date(examDate),
      dailyHours,
      dailyTasks: planDetails.dailyTasks || [],
      weeklyTargets: planDetails.weeklyTargets || [],
      progress: 0
    };

    if (!isMongoConnected) {
      await MockDB.saveUser(user);
    } else {
      await user.save();
    }

    res.json({ message: 'Study plan generated', studyPlanner: user.studyPlanner });
  } catch (error: any) {
    res.status(500).json({ message: 'Error planning study schedule', error: error.message });
  }
};

// 16. Create News Article
export const createNews = async (req: AuthRequest, res: Response) => {
  try {
    const { title, category, image, description, source, url } = req.body;
    if (!isMongoConnected) {
      const article = await MockDB.saveNews({ title, category, image, description, source, url });
      return res.json(article);
    }

    const article = new News({ title, category, image, description, source, url, publishedAt: new Date() });
    await article.save();
    res.json(article);
  } catch (error: any) {
    res.status(500).json({ message: 'Error creating news article', error: error.message });
  }
};

// 17. Update News Article
export const updateNews = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { title, category, image, description, source, url } = req.body;

    if (!isMongoConnected) {
      const article = await MockDB.saveNews({ _id: id, title, category, image, description, source, url });
      return res.json(article);
    }

    const article = await News.findByIdAndUpdate(
      id,
      { title, category, image, description, source, url },
      { new: true }
    );
    if (!article) return res.status(404).json({ message: 'News article not found' });
    res.json(article);
  } catch (error: any) {
    res.status(500).json({ message: 'Error updating news article', error: error.message });
  }
};

// 18. Delete News Article
export const deleteNews = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    if (!isMongoConnected) {
      const deleted = await MockDB.deleteNews(id);
      if (!deleted) return res.status(404).json({ message: 'News article not found' });
      return res.json({ message: 'News article deleted successfully' });
    }

    const article = await News.findByIdAndDelete(id);
    if (!article) return res.status(404).json({ message: 'News article not found' });
    res.json({ message: 'News article deleted successfully' });
  } catch (error: any) {
    res.status(500).json({ message: 'Error deleting news article', error: error.message });
  }
};

