const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(path, options = {}) {
  const response = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: { "Content-Type": "application/json", ...(options.headers || {}) }
  });
  if (!response.ok) throw new Error(`API request failed: ${response.status}`);
  return response.json();
}

/*
  Current UI uses local mock data so the frontend works before the backend exists.
  Replace the functions below with request(...) calls when Node/Express is ready.
*/

export const api = {
  baseUrl: API_URL,

  async login(credentials) {
    // return request("/auth/login", { method: "POST", body: JSON.stringify(credentials) });
    return { user: { name: "Bhumik Sharma", email: credentials.email } };
  },

  async getMe() {
    // return request("/users/me");
    return { name: "Bhumik Sharma", email: "bhumik@example.com" };
  },

  async uploadResume(file) {
    // Use FormData here when backend is ready.
    return { filename: file.name, status: "analyzed" };
  },

  async createInterview(config) {
    // return request("/interviews", { method: "POST", body: JSON.stringify(config) });
    return { id: "mock-interview-id", ...config };
  },

  async submitAnswer(interviewId, answer) {
    // return request(`/interviews/${interviewId}/answer`, {
    //   method: "POST",
    //   body: JSON.stringify({ answer })
    // });
    return { accepted: true };
  }
};
