

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
  // AUTH
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

  getOtherProfileByUserId(userId) {
    return request(`/api/profile/${encodeURIComponent(userId)}`);
  },

 
  getProfileById(profileId) {
    return request(`/api/profiles/${encodeURIComponent(profileId)}`);
  },


  getDateIdeas() {
    return request("/api/dateideas");
  },

  
  getOthersProfile() {
  return request("/api/othersprofile");
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
  getMatchById(matchId) {
    return request(`/api/matches/${encodeURIComponent(matchId)}`);
  },

  getNotifications() {
    return request("/api/notifications");
  },

  markMatchNotifsSeen() {
    return request("/api/notifications/matches/seen", { method: "POST" });
  },

  markDateIdeaNotifsSeen() {
    return request("/api/notifications/dateideas/seen", { method: "POST" });
  },

  // (optional) unread count бас энд байж болно
  getUnreadNotifCount() {
    return request("/api/notifications/unread-count");
  },
 
  me() {
    return request("/api/me");
  },

  getUnreadNotifCount() {
    return request("/api/notifications/unread-count");
  },
  
  setPhoto(form){
    return request("//api/upload/image", {
      method: "POST",
      body: form,
    });
  }
  ,
  sendDateIdea({ toUserId, cardId, title, meta = "", tags = [] }) {
    return request("/api/dateideas/send", {
      method: "POST",
      body: { toUserId, cardId, title, meta, tags },
    });
  },

   getMatches() {
    return request("/api/matches");
  },

  matches() {
    return request("/api/matches");
  },
 
  getMessages(otherId, limit = 200) {
    return request(`/api/messages?other=${encodeURIComponent(otherId)}&limit=${limit}`);
  },
 
  sendMessage({ otherId, text, type = "text" }) {
    return request("/api/messages", {
      method: "POST",
      body: { other: otherId, text, type },
    });
  },
 
  selectOtherProfile(userId) {
    return request("/api/othersprofile/select", {
      method: "POST",
      body: { userId },
    });
  },
  
};
