import axios from 'axios';

// Dynamically target localhost or local Wi-Fi IP based on client origin hostname
const host = typeof window !== 'undefined' ? window.location.hostname : 'localhost';
const BASE_URL = `http://${host === 'localhost' ? 'localhost' : '10.33.123.177'}:5000/api`;

export const adminApi = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json'
  }
});

export const setAdminAuthToken = (token: string | null) => {
  if (token) {
    adminApi.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete adminApi.defaults.headers.common['Authorization'];
  }
};

export const adminServices = {
  login: (data: any) => axios.post(`http://${host === 'localhost' ? 'localhost' : '10.33.123.177'}:5000/api/auth/login`, data),
  getProfile: () => adminApi.get('/auth/profile'),
  
  // Opportunities CRUD
  getOpportunities: () => adminApi.get('/opportunities'),
  createOpportunity: (data: any) => adminApi.post('/opportunities', data),
  
  // News CRUD
  getNews: () => adminApi.get('/news'),
  createNews: (data: any) => adminApi.post('/news', data),
  updateNews: (id: string, data: any) => adminApi.put(`/news/${id}`, data),
  deleteNews: (id: string) => adminApi.delete(`/news/${id}`),
  
  // Tests CRUD
  getTests: () => adminApi.get('/tests'),
  
  // Custom Admin simulated operations (intercepted by MockDB on backend if mongo is offline)
  getUsersSimulated: () => adminApi.get('/auth/profile').then(() => {
    return [
      { name: 'Bhavadharani', email: 'bhavadharani@gmail.com', role: 'USER', goals: ['Campus Placement', 'Government Jobs'], xp: 140, streak: 3 },
      { name: 'Amit Kumar', email: 'amit@gmail.com', role: 'USER', goals: ['Skill Development'], xp: 85, streak: 1 },
      { name: 'Sneha Reddy', email: 'sneha@gmail.com', role: 'USER', goals: ['Higher Studies', 'Internships'], xp: 210, streak: 7 }
    ];
  })
};
