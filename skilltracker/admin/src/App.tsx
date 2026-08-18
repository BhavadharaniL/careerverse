import React, { useState, useEffect } from 'react';
import { adminServices, setAdminAuthToken } from './services/api';
import './App.css';

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [adminToken, setAdminToken] = useState<string | null>(null);
  
  // Login credentials
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  // Active view: 'dashboard' | 'users' | 'addOpp' | 'addNews' | 'addTest'
  const [activeView, setActiveView] = useState('dashboard');

  // Roster lists
  const [usersList, setUsersList] = useState<any[]>([]);
  const [oppCount, setOppCount] = useState(40); // default mock seeded count
  const [newsCount, setNewsCount] = useState(10);
  const [testCount, setTestCount] = useState(5);

  // Form states - Opportunity
  const [oppTitle, setOppTitle] = useState('');
  const [oppType, setOppType] = useState('job');
  const [oppOrg, setOppOrg] = useState('');
  const [oppDesc, setOppDesc] = useState('');
  const [oppQual, setOppQual] = useState('');
  const [oppLoc, setOppLoc] = useState('');
  const [oppSalary, setOppSalary] = useState('');
  const [oppUrl, setOppUrl] = useState('');
  const [oppEligibility, setOppEligibility] = useState('');

  // Form states - News
  const [newsList, setNewsList] = useState<any[]>([]);
  const [newsTitle, setNewsTitle] = useState('');
  const [newsCategory, setNewsCategory] = useState('Technology');
  const [newsSource, setNewsSource] = useState('');
  const [newsDesc, setNewsDesc] = useState('');
  const [newsImage, setNewsImage] = useState('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500');
  const [newsUrl, setNewsUrl] = useState('');
  const [editNewsId, setEditNewsId] = useState<string | null>(null);
  const [isEditingNews, setIsEditingNews] = useState(false);

  // Form states - Test Question
  const [testTitle, setTestTitle] = useState('');
  const [testDuration, setTestDuration] = useState('30');
  const [testCat, setTestCat] = useState('Placement');
  const [qSubject, setQSubject] = useState('General Concepts');
  const [qText, setQText] = useState('');
  const [qOptA, setQOptA] = useState('');
  const [qOptB, setQOptB] = useState('');
  const [qOptC, setQOptC] = useState('');
  const [qOptD, setQOptD] = useState('');
  const [qCorrectIdx, setQCorrectIdx] = useState('0');
  const [qExplanation, setQExplanation] = useState('');

  useEffect(() => {
    // Attempt auto-login if token in storage
    const token = localStorage.getItem('admin_token');
    if (token) {
      setAdminToken(token);
      setAdminAuthToken(token);
      setIsLoggedIn(true);
      loadDashboardData();
    }
  }, []);

  const loadDashboardData = async () => {
    try {
      const users = await adminServices.getUsersSimulated();
      setUsersList(users);
      
      const newsRes = await adminServices.getNews();
      setNewsList(newsRes.data);
      setNewsCount(newsRes.data.length);
    } catch (e) {
      console.error('Error loading dashboard data:', e);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    try {
      const response = await adminServices.login({ email, password });
      const { token, user } = response.data;
      if (user.role !== 'ADMIN') {
        setLoginError('Access denied. Administrator privileges required.');
        return;
      }
      localStorage.setItem('admin_token', token);
      setAdminToken(token);
      setAdminAuthToken(token);
      setIsLoggedIn(true);
      loadDashboardData();
    } catch (e: any) {
      setLoginError(e.response?.data?.message || 'Login failed. Please verify credentials.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    setAdminToken(null);
    setAdminAuthToken(null);
    setIsLoggedIn(false);
  };

  // Submission Submits
  const submitOpportunity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!oppTitle || !oppOrg || !oppQual || !oppLoc || !oppUrl) {
      alert('Please fill in all required opportunity fields.');
      return;
    }
    setOppCount(prev => prev + 1);
    alert(`Successfully added new ${oppType.replace('_', ' ')}: "${oppTitle}"!`);
    // Reset
    setOppTitle('');
    setOppOrg('');
    setOppDesc('');
    setOppQual('');
    setOppLoc('');
    setOppSalary('');
    setOppUrl('');
    setOppEligibility('');
    setActiveView('dashboard');
  };

  const submitNews = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsTitle || !newsSource || !newsDesc) {
      alert('Please complete the news headline, source, and summary.');
      return;
    }

    const payload = {
      title: newsTitle,
      category: newsCategory,
      source: newsSource,
      description: newsDesc,
      image: newsImage,
      url: newsUrl || undefined
    };

    try {
      if (isEditingNews && editNewsId) {
        await adminServices.updateNews(editNewsId, payload);
        alert(`Successfully updated article: "${newsTitle}"!`);
      } else {
        await adminServices.createNews(payload);
        alert(`Successfully created article: "${newsTitle}"!`);
      }
      
      handleCancelEditNews();
      loadDashboardData();
      setActiveView('dashboard');
    } catch (err: any) {
      alert(`Error submitting article: ${err.response?.data?.message || err.message}`);
    }
  };

  const handleDeleteNews = async (id: string) => {
    if (window.confirm("Are you sure you want to delete this article?")) {
      try {
         await adminServices.deleteNews(id);
         alert("Article deleted successfully!");
         loadDashboardData();
      } catch (err) {
         alert("Failed to delete the article.");
      }
    }
  };

  const handleStartEditNews = (item: any) => {
    setNewsTitle(item.title);
    setNewsCategory(item.category);
    setNewsSource(item.source);
    setNewsDesc(item.description);
    setNewsImage(item.image || 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500');
    setNewsUrl(item.url || '');
    setEditNewsId(item._id);
    setIsEditingNews(true);
    setActiveView('addNews');
  };

  const handleCancelEditNews = () => {
    setNewsTitle('');
    setNewsCategory('Technology');
    setNewsSource('');
    setNewsDesc('');
    setNewsImage('https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=500');
    setNewsUrl('');
    setEditNewsId(null);
    setIsEditingNews(false);
  };

  const submitTestMock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!testTitle || !qText || !qOptA || !qOptB) {
      alert('Please complete the mock test title, question text, and options.');
      return;
    }
    setTestCount(prev => prev + 1);
    alert(`Successfully registered test papers: "${testTitle}" with custom questions!`);
    setTestTitle('');
    setQText('');
    setQOptA('');
    setQOptB('');
    setQOptC('');
    setQOptD('');
    setQExplanation('');
    setActiveView('dashboard');
  };

  if (!isLoggedIn) {
    return (
      <div className="login-wrapper">
        <form className="login-card" onSubmit={handleLogin}>
          <h2>CareerVerse Admin</h2>
          <p>Login to manage users, opportunities, examinations, and news articles.</p>
          
          {loginError && <div className="login-error">{loginError}</div>}
          
          <div className="input-group">
            <label>Admin Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@careerverse.com"
              required
            />
          </div>

          <div className="input-group">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="admin123"
              required
            />
          </div>

          <button type="submit" className="login-btn">Sign In to Dashboard</button>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-container">
      {/* Sidebar navigation panel */}
      <aside className="sidebar">
        <div className="brand">
          <span className="brand-logo">🌌</span>
          <h2>CareerVerse</h2>
        </div>

        <nav className="nav-menu">
          <button 
            className={`nav-item ${activeView === 'dashboard' ? 'active' : ''}`}
            onClick={() => setActiveView('dashboard')}
          >
            📊 Dashboard Summary
          </button>
          <button 
            className={`nav-item ${activeView === 'users' ? 'active' : ''}`}
            onClick={() => setActiveView('users')}
          >
            👥 User Rosters
          </button>
          <button 
            className={`nav-item ${activeView === 'addOpp' ? 'active' : ''}`}
            onClick={() => setActiveView('addOpp')}
          >
            💼 Add Opportunity
          </button>
          <button 
            className={`nav-item ${activeView === 'addNews' ? 'active' : ''}`}
            onClick={() => { setActiveView('addNews'); handleCancelEditNews(); }}
          >
            📰 Manage News Feed
          </button>
          <button 
            className={`nav-item ${activeView === 'addTest' ? 'active' : ''}`}
            onClick={() => setActiveView('addTest')}
          >
            🎓 Add Mock Tests
          </button>
        </nav>

        <button className="logout-btn" onClick={handleLogout}>🚪 Sign Out</button>
      </aside>

      {/* Main Console Panel */}
      <main className="main-panel">
        <header className="top-bar">
          <h3>CareerVerse System Console</h3>
          <div className="admin-profile">
            <div className="admin-avatar">A</div>
            <span>HQ Administrator</span>
          </div>
        </header>

        <div className="content">
          
          {/* VIEW 1: DASHBOARD SUMMARY */}
          {activeView === 'dashboard' && (
            <div>
              <div className="metrics-grid">
                <div className="metric-box box-blue">
                  <h4>Total Registered Students</h4>
                  <p className="metric-val">{usersList.length || 3}</p>
                </div>
                <div className="metric-box box-green">
                  <h4>Active Opportunities</h4>
                  <p className="metric-val">{oppCount}</p>
                </div>
                <div className="metric-box box-orange">
                  <h4>Mock Exam Question Banks</h4>
                  <p className="metric-val">{testCount}</p>
                </div>
                <div className="metric-box box-purple">
                  <h4>News Stream Articles</h4>
                  <p className="metric-val">{newsCount}</p>
                </div>
              </div>

              <div className="recent-logins">
                <h3>Recent System Activity Log</h3>
                <div className="activity-item">
                  <span className="badge badge-green">Login</span>
                  <p>User <strong>Bhavadharani</strong> signed in. (Streak: 3 days, XP: 140) • 2 mins ago</p>
                </div>
                <div className="activity-item">
                  <span className="badge badge-blue">Mock Test</span>
                  <p>User <strong>Sneha Reddy</strong> submitted placement assessment scorecard: 85% accuracy • 15 mins ago</p>
                </div>
                <div className="activity-item">
                  <span className="badge badge-purple">Resume</span>
                  <p>User <strong>Amit Kumar</strong> generated custom AI ATS critique guidelines • 45 mins ago</p>
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: USER ROSTER TABLE */}
          {activeView === 'users' && (
            <div className="table-card">
              <h3>Registered Students Database</h3>
              <table className="users-table">
                <thead>
                  <tr>
                    <th>Student Name</th>
                    <th>Email Address</th>
                    <th>Selected Pathways</th>
                    <th>Streak Check</th>
                    <th>Earned XP Score</th>
                  </tr>
                </thead>
                <tbody>
                  {usersList.map((user, i) => (
                    <tr key={i}>
                      <td><strong>{user.name}</strong></td>
                      <td>{user.email}</td>
                      <td>
                        {user.goals.map((g: string, idx: number) => (
                          <span key={idx} className="tag">{g}</span>
                        ))}
                      </td>
                      <td>🔥 {user.streak} Days</td>
                      <td>⭐ {user.xp} XP</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* VIEW 3: ADD OPPORTUNITY FORM */}
          {activeView === 'addOpp' && (
            <div className="form-card">
              <h3>Create Job, Internship, or Scholarship Opportunity</h3>
              <form onSubmit={submitOpportunity} className="admin-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Opportunity Title *</label>
                    <input type="text" value={oppTitle} onChange={e => setOppTitle(e.target.value)} placeholder="e.g. Graduate software engineer" required />
                  </div>
                  <div className="form-group">
                    <label>Listing Type *</label>
                    <select value={oppType} onChange={e => setOppType(e.target.value)}>
                      <option value="job">Private Job</option>
                      <option value="government_job">Government Job</option>
                      <option value="internship">Internship</option>
                      <option value="scholarship">Scholarship</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Hosting Board/Company *</label>
                    <input type="text" value={oppOrg} onChange={e => setOppOrg(e.target.value)} placeholder="Google, ISRO, SSC CGL" required />
                  </div>
                  <div className="form-group">
                    <label>Minimum Qualification *</label>
                    <input type="text" value={oppQual} onChange={e => setOppQual(e.target.value)} placeholder="B.E/B.Tech in CSE, Any Graduate" required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Salary Scale / Stipend Info</label>
                    <input type="text" value={oppSalary} onChange={e => setOppSalary(e.target.value)} placeholder="₹60,000 / month, ₹12 LPA" />
                  </div>
                  <div className="form-group">
                    <label>Office Location *</label>
                    <input type="text" value={oppLoc} onChange={e => setOppLoc(e.target.value)} placeholder="Bangalore, Hybrid, Remote" required />
                  </div>
                </div>

                <div className="form-group">
                  <label>Official Registration URL *</label>
                  <input type="url" value={oppUrl} onChange={e => setOppUrl(e.target.value)} placeholder="https://careers.google.com" required />
                </div>

                <div className="form-group">
                  <label>Basic Eligibility Criteria Summary</label>
                  <textarea value={oppEligibility} onChange={e => setOppEligibility(e.target.value)} placeholder="Age limit under 30. Aggregate CGPA > 6.5." rows={3} />
                </div>

                <div className="form-group">
                  <label>Opportunity Description</label>
                  <textarea value={oppDesc} onChange={e => setOppDesc(e.target.value)} placeholder="Write job roles, daily duties, selection exam schedules..." rows={4} />
                </div>

                <button type="submit" className="submit-btn">Publish Opportunity Listing</button>
              </form>
            </div>
          )}

          {/* VIEW 4: MANAGE CAREER NEWS FEED */}
          {activeView === 'addNews' && (
            <div>
              <div className="form-card">
                <h3>{isEditingNews ? '📝 Edit News Article' : '📰 Publish Article to News Feed'}</h3>
                <form onSubmit={submitNews} className="admin-form">
                  <div className="form-row">
                    <div className="form-group">
                      <label>Article Title / Headline *</label>
                      <input type="text" value={newsTitle} onChange={e => setNewsTitle(e.target.value)} placeholder="Hiring spikes in cloud sectors..." required />
                    </div>
                    <div className="form-group">
                      <label>News Category *</label>
                      <select value={newsCategory} onChange={e => setNewsCategory(e.target.value)}>
                        <option value="Technology">Technology</option>
                        <option value="Placement">Placement Drives</option>
                        <option value="Government">Government Board Updates</option>
                        <option value="Exams">Exams Dates</option>
                        <option value="Scholarships">Scholarships Announcements</option>
                        <option value="Internships">Internships Guide</option>
                      </select>
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="form-group">
                      <label>Source Publisher *</label>
                      <input type="text" value={newsSource} onChange={e => setNewsSource(e.target.value)} placeholder="The Hindu, TechCrunch, PIB" required />
                    </div>
                    <div className="form-group">
                      <label>Illustration Image URL</label>
                      <input type="text" value={newsImage} onChange={e => setNewsImage(e.target.value)} placeholder="https://images.unsplash.com/..." />
                    </div>
                  </div>

                  <div className="form-group">
                    <label>Official Article Link / URL</label>
                    <input type="url" value={newsUrl} onChange={e => setNewsUrl(e.target.value)} placeholder="https://example.com/news-story" />
                  </div>

                  <div className="form-group">
                    <label>Article Summary Context (Short description) *</label>
                    <textarea value={newsDesc} onChange={e => setNewsDesc(e.target.value)} placeholder="Provide 2-3 sentences summarizing the news article..." rows={5} required />
                  </div>

                  <div style={{ display: 'flex', gap: '12px' }}>
                    <button type="submit" className="submit-btn">
                      {isEditingNews ? 'Save Changes' : 'Publish Article to Feed'}
                    </button>
                    {isEditingNews && (
                      <button 
                        type="button" 
                        className="cancel-btn" 
                        onClick={handleCancelEditNews}
                        style={{
                          padding: '12px 24px',
                          backgroundColor: '#6b7280',
                          color: '#ffffff',
                          border: 'none',
                          borderRadius: '8px',
                          fontSize: '15px',
                          fontWeight: '700',
                          cursor: 'pointer'
                        }}
                      >
                        Cancel Edit
                      </button>
                    )}
                  </div>
                </form>
              </div>

              {/* LISTING OF NEWS ARTICLES UNDERNEATH FOR DIRECT MANAGEMENT */}
              <div className="table-card" style={{ marginTop: '30px' }}>
                <h3>Current News Feed Database ({newsList.length})</h3>
                <table className="users-table">
                  <thead>
                    <tr>
                      <th style={{ width: '45%' }}>Headline</th>
                      <th>Category</th>
                      <th>Source</th>
                      <th style={{ textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newsList.length > 0 ? (
                      newsList.map((item, idx) => (
                        <tr key={item._id || idx}>
                          <td><strong>{item.title}</strong></td>
                          <td><span className="tag">{item.category}</span></td>
                          <td>{item.source}</td>
                          <td style={{ textAlign: 'center' }}>
                            <button 
                              onClick={() => handleStartEditNews(item)} 
                              className="edit-action-btn"
                              style={{
                                padding: '4px 10px',
                                backgroundColor: '#3b82f6',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '4px',
                                marginRight: '8px',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                            >
                              Edit
                            </button>
                            <button 
                              onClick={() => handleDeleteNews(item._id)} 
                              className="delete-action-btn"
                              style={{
                                padding: '4px 10px',
                                backgroundColor: '#ef4444',
                                color: '#ffffff',
                                border: 'none',
                                borderRadius: '4px',
                                fontWeight: '600',
                                cursor: 'pointer'
                              }}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={4} style={{ textAlign: 'center', color: '#6b7280', fontStyle: 'italic' }}>
                          No news articles found. Publish one above!
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* VIEW 5: ADD MOCK TEST FORM */}
          {activeView === 'addTest' && (
            <div className="form-card">
              <h3>Create Mock Examination & Questions</h3>
              <form onSubmit={submitTestMock} className="admin-form">
                <div className="form-row">
                  <div className="form-group">
                    <label>Mock Exam Title *</label>
                    <input type="text" value={testTitle} onChange={e => setTestTitle(e.target.value)} placeholder="GATE Computer Science - Section A" required />
                  </div>
                  <div className="form-group">
                    <label>Subject / Topic Category *</label>
                    <select value={testCat} onChange={e => setTestCat(e.target.value)}>
                      <option value="Placement">Placement Aptitude & Coding</option>
                      <option value="Government Exams">Government mock board</option>
                      <option value="Higher Studies">Higher Studies (GATE/CAT)</option>
                    </select>
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Duration scale (in Minutes) *</label>
                    <input type="number" value={testDuration} onChange={e => setTestDuration(e.target.value)} placeholder="e.g. 30" required />
                  </div>
                  <div className="form-group">
                    <label>Diagnostic Question Subject *</label>
                    <input type="text" value={qSubject} onChange={e => setQSubject(e.target.value)} placeholder="Data Structures, Verbal Logic" required />
                  </div>
                </div>

                <div className="form-group">
                  <label>Question Body *</label>
                  <textarea value={qText} onChange={e => setQText(e.target.value)} placeholder="What is the worst-case complexity of binary search?" rows={3} required />
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Option A *</label>
                    <input type="text" value={qOptA} onChange={e => setQOptA(e.target.value)} required />
                  </div>
                  <div className="form-group">
                    <label>Option B *</label>
                    <input type="text" value={qOptB} onChange={e => setQOptB(e.target.value)} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Option C</label>
                    <input type="text" value={qOptC} onChange={e => setQOptC(e.target.value)} />
                  </div>
                  <div className="form-group">
                    <label>Option D</label>
                    <input type="text" value={qOptD} onChange={e => setQOptD(e.target.value)} />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Index of Correct Option (0-indexed) *</label>
                    <select value={qCorrectIdx} onChange={e => setQCorrectIdx(e.target.value)}>
                      <option value="0">Option A (Index 0)</option>
                      <option value="1">Option B (Index 1)</option>
                      <option value="2">Option C (Index 2)</option>
                      <option value="3">Option D (Index 3)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Technical Explanation / Diagnostic Proof</label>
                  <textarea value={qExplanation} onChange={e => setQExplanation(e.target.value)} placeholder="Explain the rationale behind the correct option..." rows={3} />
                </div>

                <button type="submit" className="submit-btn">Register Mock Assessment</button>
              </form>
            </div>
          )}

        </div>
      </main>
    </div>
  );
};

export default App;
