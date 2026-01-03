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
    data = text; // JSON биш байж болно
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
  // -------- AUTH --------
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

  // -------- PROFILES --------
  // ✅ MY profile (logged-in user) — ID хэрэггүй
  getMyProfile() {
    return request("/api/profile");
  },

  // ✅ Home feed profiles
  getProfiles() {
    return request("/api/profiles");
  },

  // ✅ OTHERS profile (userId-гаар нь авах) — чи яг үүнийг ашиглах ёстой
  getOtherProfileByUserId(userId) {
    return request(`/api/profile/${encodeURIComponent(userId)}`);
  },

  // ⚠️ Зөвхөн profiles collection-ын document _id (profileId) байгаа үед хэрэглэнэ
  getProfileById(profileId) {
    return request(`/api/profiles/${encodeURIComponent(profileId)}`);
  },

  // -------- OTHER --------
  getDateIdeas() {
    return request("/api/dateideas");
  },

  getRecipients() {
    return request("/api/recipients");
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
   async getOtherProfileByToken(token) {
    const res = await fetch(`/api/othersprofile?t=${encodeURIComponent(token)}`, {
      credentials: "include",
    });
    const data = await res.json().catch(() => ({}));
    if (!res.ok) {
      const err = new Error(data?.error || "Failed to load others profile");
      err.status = res.status;
      err.data = data;
      throw err;
    }
    return data;
  },
  

  setPhoto(form){
    return request("//api/upload/image", {
      method: "POST",
      body: form,
    });
  }
  
};
