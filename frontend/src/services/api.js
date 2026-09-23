const API_BASE_URL = "http://127.0.0.1:8000";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
    ...options,
  });

  if (!response.ok) {
    throw new Error(`API request failed: ${response.status}`);
  }

  return response.json();
}

export async function getDashboardSummary() {
  return request("/api/dashboard/summary");
}

export async function askCopilot(question) {
  return request("/api/ai/ask", {
    method: "POST",
    body: JSON.stringify({
      question,
    }),
  });
}

export async function getActions() {
  return request("/api/actions");
}

export async function createAction(action) {
  return request("/api/actions", {
    method: "POST",
    body: JSON.stringify(action),
  });
}

export default {
  getDashboardSummary,
  askCopilot,
  getActions,
  createAction,
};