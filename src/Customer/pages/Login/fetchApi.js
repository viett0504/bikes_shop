// src/Customer/pages/Login/fetchApi.js
const API_BASE = process.env.REACT_APP_API_URL;

async function handleJsonResponse(res) {
  const text = await res.text();
  let data;

  try {
    data = text ? JSON.parse(text) : {};
  } catch (e) {
    throw new Error("Phản hồi không phải JSON hợp lệ");
  }

  if (!res.ok || data.error) {
    throw new Error(data.error || `Lỗi server: ${res.status}`);
  }
  return data;
}

export async function requestResetCodeApi(email) {
  const res = await fetch(`${API_BASE}/api/user/forgot-password/request-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });
  return handleJsonResponse(res);
}

export async function verifyResetCodeApi(email, code) {
  const res = await fetch(`${API_BASE}/api/user/forgot-password/verify-code`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });
  return handleJsonResponse(res);
}

export async function resetPasswordApi(email, code, newPassword) {
  const res = await fetch(`${API_BASE}/api/user/forgot-password/reset`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code, newPassword }),
  });
  return handleJsonResponse(res);
}
