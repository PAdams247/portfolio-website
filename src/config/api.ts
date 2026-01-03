const API_BASE_URL = process.env.NODE_ENV === 'production'
  ? 'https://planner-backend-t5w4.onrender.com'
  : 'http://localhost:3001';

export const API_ENDPOINTS = {
  // Auth endpoints
  SIGNUP: `${API_BASE_URL}/api/auth/signup`,
  LOGIN: `${API_BASE_URL}/api/auth/login`,
  
  // Planner endpoints
  GET_PLAN: (date: string) => `${API_BASE_URL}/api/planner/plan/${date}`,
  SAVE_PLAN: `${API_BASE_URL}/api/planner/plan`,
  CREATE_TOMORROW: `${API_BASE_URL}/api/planner/create-tomorrow`,
};

export const getAuthToken = (): string | null => {
  return localStorage.getItem('authToken');
};

export const setAuthToken = (token: string): void => {
  localStorage.setItem('authToken', token);
};

export const removeAuthToken = (): void => {
  localStorage.removeItem('authToken');
};

export const getAuthHeaders = () => {
  const token = getAuthToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};
