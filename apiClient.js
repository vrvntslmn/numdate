const API_BASE = "";

async function request(path, { method = "GET", body } = {}) {
  const res = await fetch(API_BASE + path, {
    method,
    headers: body ? { "Content-Type": "application/json" } : undefined,
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });
 
  const text = await res.text();
  let data = null;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
   
    data = text;
  }
 
  if (!res.ok) {
    const err = new Error(
      data?.error || data?.message || `Request failed with ${res.status}`
    );
    err.status = res.status;
    err.data = data;
    throw err;
  }
 
  return data;
}
 
export const api = {
  login({ email, password }) {
    return request("/api/auth/login", {
      method: "POST",
      body: { email, password },
    });
  },
 
  register(payload) {
    return request("/api/auth/register", {
      method: "POST",
      body: payload,
    });
  },
 
  logout() {
    return request("/api/auth/logout", { method: "POST" });
  },
 
  me() {
    return request("/api/me");
  },
 
  resendVerification(email) {
    return request("/api/auth/resend-verification", {
      method: "POST",
      body: { email },
    });
  },
 
  getMyProfile() {
    return request("/api/profile");
  },
 
  getProfiles() {
    return request("/api/profiles");
  },
 
  getDateIdeas() {
    return request("/api/dateideas");
  },
 
  getRecipients() {
    return request("/api/recipients");
  },

  getProfileByUserId(userId) {
    return request(`/api/profile/${encodeURIComponent(userId)}`);
  },

  getProfileById(profileId) {
    return request(`/api/profiles/${encodeURIComponent(profileId)}`);
  },

  like(toUserId) {
    return request("/api/like", {
      method: "POST",
      body: { toUserId },
    });
  },

  getMatchNotifications() {
    return request("/api/notifications/matches");
  },

  setPhoto(form){
    return request("//api/upload/image", {
      method: "POST",
      body: form,
    });
  }
  
};