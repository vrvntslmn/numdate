

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
    data = text; // JSON биш байж болно
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

  getMyProfile() {
    return request("/api/profile");
  },

  // ✅ Home feed profiles
  getProfiles() {
    return request("/api/profiles");
  },

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



  setPhoto(form) {
    return request("//api/upload/image", {
      method: "POST",
      body: { other: otherId, text, type },
    });
  }

};
