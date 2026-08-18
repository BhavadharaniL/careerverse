import { GoogleGenerativeAI } from '@google/generative-ai';
import dotenv from 'dotenv';

dotenv.config();

const API_KEY = process.env.GEMINI_API_KEY;
let genAI: GoogleGenerativeAI | null = null;

if (API_KEY) {
  genAI = new GoogleGenerativeAI(API_KEY);
  console.log('Gemini AI Service initialized with API Key.');
} else {
  console.log('Gemini API key missing. AI Service running in Demo/Fallback mode.');
}

export class AIService {
  
  // 1. Generate Career Roadmap
  static async generateRoadmap(targetCareer: string, currentSkills: string[]): Promise<any> {
    const prompt = `
      Create a step-by-step career learning roadmap for becoming a "${targetCareer}".
      The user currently knows these skills: ${currentSkills.join(', ')}.
      
      Respond STRICTLY with a valid JSON array of steps. Do not include markdown codeblocks or extra text.
      Format:
      [
        {
          "title": "Step title",
          "description": "Step description and detailed guidance",
          "resources": [
            { "title": "Resource title (e.g. Codecademy, Coursera, FreeCodeCamp)", "type": "course", "url": "https://example.com/learn" }
          ]
        }
      ]
    `;

    try {
      if (genAI) {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonText);
      }
    } catch (e) {
      console.error('Gemini generateRoadmap error, falling back:', e);
    }

    // Fallback Mock Roadmap
    return [
      {
        title: "1. Core Fundamentals",
        description: `Master basic programming, data structures, and computer science fundamentals relevant to ${targetCareer}.`,
        resources: [
          { title: "Introduction to Programming & Logic", type: "course", url: "https://www.coursera.org" },
          { title: "Data Structures & Core Algorithms", type: "video", url: "https://www.youtube.com" }
        ]
      },
      {
        title: "2. Specialized Tooling",
        description: `Learn the key frameworks, libraries and SDKs used by professionals in the ${targetCareer} domain.`,
        resources: [
          { title: "Advanced Technical Mastery Path", type: "course", url: "https://www.udemy.com" }
        ]
      },
      {
        title: "3. Project Showcase & Portfolio",
        description: "Build 2-3 real-world projects showing database usage, user interaction, and production-ready code.",
        resources: [
          { title: "Portfolio Building & Git workflow", type: "article", url: "https://github.com" }
        ]
      },
      {
        title: "4. Interview Practice & Placement Preparation",
        description: "Focus on problem-solving, live coding rounds, behavioral interviews, and resume refinement.",
        resources: [
          { title: "Technical Mock Interviews", type: "course", url: "https://leetcode.com" }
        ]
      }
    ];
  }

  // 2. Skill Gap Analysis
  static async analyzeSkillGap(targetRole: string, currentSkills: string[]): Promise<any> {
    const prompt = `
      Perform a skill gap analysis for the role: "${targetRole}".
      The user currently has these skills: ${currentSkills.join(', ')}.
      
      Identify missing skills, calculate a readiness percentage (0-100), and write a concise personalized explanation of how to fill the gap.
      
      Respond STRICTLY with a valid JSON object. Do not include markdown codeblocks or extra text.
      Format:
      {
        "gapCount": 4,
        "missingSkills": ["Skill A", "Skill B"],
        "readinessPercentage": 65,
        "explanation": "Your summary goes here..."
      }
    `;

    try {
      if (genAI) {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonText);
      }
    } catch (e) {
      console.error('Gemini analyzeSkillGap error, falling back:', e);
    }

    // Fallback Mock Skill Gap Analysis
    const allRequiredSkillsMap: { [key: string]: string[] } = {
      'ai engineer': ['Python', 'Machine Learning', 'Deep Learning', 'TensorFlow', 'NLP', 'Computer Vision', 'SQL'],
      'software engineer': ['Java', 'Python', 'C++', 'Data Structures', 'Algorithms', 'DBMS', 'Git', 'System Design'],
      'web developer': ['HTML', 'CSS', 'JavaScript', 'React', 'Node.js', 'Express', 'MongoDB', 'Git'],
      'data scientist': ['Python', 'SQL', 'Statistics', 'Pandas', 'Scikit-Learn', 'Data Visualization', 'Machine Learning']
    };

    const targetKey = targetRole.toLowerCase();
    const required = allRequiredSkillsMap[targetKey] || ['Problem Solving', 'Communication', 'Technical Design', 'System Architecture'];
    const missing = required.filter(s => !currentSkills.some(cs => cs.toLowerCase() === s.toLowerCase()));
    const matchingCount = required.length - missing.length;
    const readiness = Math.round((matchingCount / required.length) * 100) || 40;

    return {
      gapCount: missing.length,
      missingSkills: missing,
      readinessPercentage: readiness,
      explanation: `Based on your current skills, you are approximately ${readiness}% prepared for the ${targetRole} role. To bridge the gap, prioritize learning: ${missing.join(', ')}.`
    };
  }

  // 3. AI Chatbot
  static async chat(message: string, userContext: any, history: any[]): Promise<string> {
    const contextString = `
      User Name: ${userContext.name || 'Student'}
      Selected Goals: ${userContext.goals?.join(', ') || 'General Growth'}
      Education: ${userContext.education?.degree || 'College'} in ${userContext.education?.department || 'Department'}, Year: ${userContext.education?.currentYear || 'N/A'}
      Skills: ${userContext.skills?.map((s: any) => s.name).join(', ') || 'None added yet'}
      Target Career: ${userContext.targetCareer || 'Career Exploration'}
    `;

    const prompt = `
      You are CareerVerse AI, an intelligent, helpful career guidance counselor.
      Use this user profile context to personalize your advice:
      ${contextString}

      Previous conversation history:
      ${history.map(h => `${h.role === 'user' ? 'User' : 'Assistant'}: ${h.content}`).join('\n')}

      User: ${message}
      Assistant:
    `;

    try {
      if (genAI) {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent(prompt);
        return result.response.text().trim();
      }
    } catch (e) {
      console.error('Gemini Chat error, falling back:', e);
    }

    // Fallback Chat Response
    if (message.toLowerCase().includes('job') || message.toLowerCase().includes('opportunity')) {
      return `Hi ${userContext.name || 'there'}! Based on your goals in ${userContext.goals?.join(' & ') || 'your profile'}, you can check out the 'Opportunities' tab to find tailored jobs, internships, and scholarships. Let me know if you need help preparing for a specific interview!`;
    }
    return `Hello ${userContext.name || 'there'}! I'm here to guide you in your preparation for ${userContext.targetCareer || 'your career goals'}. You can ask me to outline learning paths, review skill gaps, or explain test answers!`;
  }

  // 4. Resume analysis
  static async analyzeResume(resumeData: any): Promise<any> {
    const prompt = `
      Analyze the following resume details for ATS formatting, structure, and keyword completeness relative to standard tech and corporate roles.
      Resume text/fields:
      ${JSON.stringify(resumeData)}

      Respond STRICTLY with a valid JSON object. Do not include markdown codeblocks or extra text.
      Format:
      {
        "missingKeywords": ["Keywords to include"],
        "formattingSuggestions": ["Formatting feedback"],
        "skillSuggestions": ["Skills recommended for their target domain"],
        "atsRecommendation": "Full actionable critique and checklist"
      }
    `;

    try {
      if (genAI) {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonText);
      }
    } catch (e) {
      console.error('Gemini analyzeResume error, falling back:', e);
    }

    return {
      missingKeywords: ["Action Verbs (Executed, Architected)", "ATS Metrics", "Core Technologies matching target job description"],
      formattingSuggestions: ["Use single-column layout", "Remove headers/footers icons that trip parses", "Ensure dates follow 'Month Year' format"],
      skillSuggestions: ["Version Control (Git)", "API Integration", "Cloud Deployment fundamentals (AWS/GCP/Vercel)"],
      atsRecommendation: "Your resume structure is relatively clean. However, to increase your ATS scorecard: 1) Quantify achievements (e.g., 'Optimized query speeds by 30%'), 2) Match keyword density from job descriptions, 3) Stick to simple, readable fonts like Arial or Calibri."
    };
  }

  // 5. Study Planner
  static async generateStudyPlan(targetExam: string, dailyHours: number, targetJob: string, date: string): Promise<any> {
    const prompt = `
      Generate a study plan for preparing for the "${targetExam || targetJob}" exam/role.
      Target exam date: ${date || 'in 30 days'}.
      Available daily preparation hours: ${dailyHours} hours.
      
      Respond STRICTLY with a valid JSON object. Do not include markdown codeblocks or extra text.
      Format:
      {
        "dailyTasks": ["Task 1", "Task 2"],
        "weeklyTargets": ["Target 1", "Target 2"],
        "revisionSchedule": "Revision instructions",
        "mockTestSchedule": "Test timeline details"
      }
    `;

    try {
      if (genAI) {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent(prompt);
        const text = result.response.text();
        const jsonText = text.replace(/```json/g, '').replace(/```/g, '').trim();
        return JSON.parse(jsonText);
      }
    } catch (e) {
      console.error('Gemini generateStudyPlan error, falling back:', e);
    }

    return {
      dailyTasks: [
        "Dedicate 1 hour to core theoretical topics (concept building)",
        "Spend 1 hour solving practical practice questions or mock exercises",
        "Revise formulas, shortcut methods, and write micro-notes"
      ],
      weeklyTargets: [
        "Complete 3 major syllabus chapters",
        "Attempt 1 full-length subject mock test and review answers",
        "Review speed-math or coding syntax patterns"
      ],
      revisionSchedule: "Every Sunday, spend 2 hours revising all topics covered during the week. Avoid learning new topics on revision days.",
      mockTestSchedule: "Take a chapter test every Wednesday and a comprehensive mock test every Saturday."
    };
  }

  // 6. Test performance analysis
  static async analyzeTestPerformance(score: number, accuracy: number, timeTaken: number, category: string, title: string): Promise<string> {
    const prompt = `
      Provide a constructive, encouraging AI analysis recommendation based on these test results:
      Test Title: ${title} (${category})
      Score: ${score}
      Accuracy: ${accuracy}%
      Time Taken: ${timeTaken} seconds
      
      Give actionable guidance (max 3 sentences) for the student to improve.
    `;

    try {
      if (genAI) {
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
        const result = await model.generateContent(prompt);
        return result.response.text().trim();
      }
    } catch (e) {
      console.error('Gemini test analysis error, falling back:', e);
    }

    if (accuracy < 60) {
      return `Your accuracy in ${title} is lower than average (${accuracy}%). Spend time reviewing correct explanations for skipped/wrong options, and practice 15 targeted topic questions daily.`;
    }
    return `Excellent speed and accuracy in ${title}! Keep this momentum going by attempting advanced difficulty mocks and focusing on speed optimization.`;
  }
}
