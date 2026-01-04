const API_BASE = "";

async function request(path, { method = "GET", body, headers } = {}) {
  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;
  const isBodyPresent = body !== undefined && body !== null;

  const res = await fetch(API_BASE + path, {
    method,
    credentials: "include",
    headers: {
      ...(headers || {}),
      ...(isBodyPresent && !isFormData
        ? { "Content-Type": "application/json" }
        : {}),
    },
    body: !isBodyPresent
      ? undefined
      : isFormData
        ? body
        : JSON.stringify(body),
  });

  const text = await res.text().catch(() => "");
  let data = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg =
      (data && typeof data === "object" && (data.error || data.message)) ||
      (typeof data === "string" && data) ||
      `Request failed with ${res.status}`;

    const err = new Error(msg);
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

  getOtherProfileByUserId(userId) {
    return request(`/api/profile/${encodeURIComponent(userId)}`);
  },

  getProfileById(profileId) {
    return request(`/api/profiles/${encodeURIComponent(profileId)}`);
  },

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

  setPhoto(formData) {
    return request("/api/upload/image", {
      method: "POST",
      body: formData,
    });
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
