import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

// Create an axios instance with default config
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to attach the auth token to every request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    // Handle 401 Unauthorized errors (token expired, etc.)
    if (error.response && error.response.status === 401) {
      // Clear local storage and redirect to login
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// AUTH SERVICES
export const authService = {
  login: (credentials) => api.post("/users/login", credentials),
  register: (userData) => api.post("/users/register", userData),
};

// TASK SERVICES
export const taskService = {
  createTask: (taskData) => api.post("/tasks", taskData),
  getAllTasks: () => api.get("/tasks"),
  getTaskById: (id) => api.get(`/tasks/${id}`),
  updateTask: (id, data) => api.put(`/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/tasks/${id}`),
  completeTask: (id) => api.put(`/tasks/${id}`, { status: "COMPLETED" }),
};

// PRESCRIPTION SERVICES
export const prescriptionService = {
  createPrescription: (data) => api.post("/prescriptions", data),
  getUserPrescriptions: (userId) => api.get(`/prescriptions/user/${userId}`),
  getPrescriptionById: (id) => api.get(`/prescriptions/${id}`),
  updatePrescription: (id, data) => api.put(`/prescriptions/${id}`, data),
  deletePrescription: (id) => api.delete(`/prescriptions/${id}`),
};

// GROCERY SERVICES
export const groceryService = {
  createGroceryOrder: (data) => api.post("/grocery", data),
  getGroceryOrders: () => api.get("/grocery"),
  getGroceryOrderById: (id) => api.get(`/grocery/${id}`),
  updateGroceryOrder: (id, data) => api.put(`/grocery/${id}`, data),
  deleteGroceryOrder: (id) => api.delete(`/grocery/${id}`),
};

// EMERGENCY SERVICES
export const emergencyService = {
  createEmergencyAlert: (data) => api.post("/emergency", data),
  getEmergencyAlerts: () => api.get("/emergency"),
  resolveEmergencyAlert: (id) => api.put(`/emergency/${id}/resolve`, {}),
};

// VOLUNTEER SERVICES
export const volunteerService = {
  getAllVolunteers: () => api.get("/volunteer"),
  assignVolunteer: (taskId, volunteerId) =>
    api.post(`/volunteer/assign`, { taskId, volunteerId }),
};

// CHAT SERVICES
export const chatService = {
  getMessages: (userId) => api.get(`/chat/messages/${userId}`),
  sendMessage: (data) => api.post("/chat/messages", data),
};

// FORUM SERVICES
export const forumService = {
  createPost: (data) => api.post("/forum/posts", data),
  getAllPosts: () => api.get("/forum/posts"),
  getPostById: (id) => api.get(`/forum/posts/${id}`),
  addComment: (postId, data) =>
    api.post(`/forum/posts/${postId}/comments`, data),
  getComments: (postId) => api.get(`/forum/posts/${postId}/comments`),
};

// HEALTH LOG SERVICES
export const healthService = {
  createHealthLog: (data) => api.post("/health", data),
  getHealthLogs: (userId) => api.get(`/health?userId=${userId}`),
  updateHealthLog: (id, data) => api.put(`/health/${id}`, data),
};

// CHECK-IN SERVICES
export const checkInService = {
  createCheckIn: (data) => api.post("/checkin", data),
  getCheckIns: (userId) => api.get(`/checkin?userId=${userId}`),
};

// RATING SERVICES
export const ratingService = {
  rateUser: (data) => api.post("/ratings", data),
  getUserRatings: (userId) => api.get(`/ratings/user/${userId}`),
};

// VOICE COMMAND SERVICES
export const voiceCommandService = {
  processCommand: (command) => api.post("/voice/process", { command }),
};

export default api;
