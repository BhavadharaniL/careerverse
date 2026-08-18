const testApi = async () => {
  const BASE_URL = 'http://127.0.0.1:5000/api';
  console.log('--- DIAGNOSTIC API TEST RUNNING (NATIVE FETCH) ---');

  try {
    // 1. Register a test user
    console.log('1. Attempting test registration...');
    const regRes = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: 'Test Student',
        email: `student_${Math.random().toString(36).substring(2, 7)}@gmail.com`,
        password: 'password123'
      })
    });
    
    if (!regRes.ok) {
      throw new Error(`Registration failed: ${regRes.status} ${regRes.statusText}`);
    }
    
    const regData = await regRes.json() as any;
    const token = regData.token;
    console.log('Registration success. Token received:', token ? 'YES' : 'NO');

    // Configure headers
    const headers = { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}` 
    };

    // 2. Setup goals
    console.log('2. Updating career goals...');
    const goalsRes = await fetch(`${BASE_URL}/auth/goals`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({ goals: ['Campus Placement', 'Skill Development'] })
    });
    if (!goalsRes.ok) throw new Error('Goals update failed');

    // 3. Setup education
    console.log('3. Updating education profile...');
    const profileRes = await fetch(`${BASE_URL}/auth/profile`, {
      method: 'PUT',
      headers,
      body: JSON.stringify({
        education: {
          degree: 'B.E',
          department: 'Computer Science',
          college: 'Test College',
          currentYear: '3rd Year',
          graduationYear: '2027',
          location: 'Chennai',
          currentSkills: ['Python'],
          areasOfInterest: ['AI']
        },
        targetCareer: 'AI Engineer'
      })
    });
    if (!profileRes.ok) throw new Error('Profile update failed');

    // 4. Fetch personalized feed
    console.log('4. Requesting personalized dashboard feed...');
    const feedRes = await fetch(`${BASE_URL}/feed`, { headers });
    if (!feedRes.ok) {
      const errText = await feedRes.text();
      throw new Error(`Feed request failed: ${feedRes.status} - ${errText}`);
    }
    const feedData = await feedRes.json() as any;
    console.log('Feed fetched successfully! Readiness Score:', feedData.readiness?.score);

    // 5. Fetch personalized news
    console.log('5. Requesting news feed...');
    const newsRes = await fetch(`${BASE_URL}/news`, { headers });
    if (!newsRes.ok) throw new Error('News request failed');
    const newsData = await newsRes.json() as any;
    console.log('News fetched successfully! Article count:', newsData.length);

    console.log('--- ALL API ENDPOINTS ARE STABLE AND WORKING PERFECTLY ---');
  } catch (error: any) {
    console.error('--- DIAGNOSTIC ENCOUNTERED ERROR ---');
    console.error(error.message);
  }
};

testApi();
