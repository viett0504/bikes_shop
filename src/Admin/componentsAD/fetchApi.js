// src/Admin/componentsAD/fetchApi.js

// Đọc raw auth từ localStorage, thử nhiều key khác nhau
const readRawAuth = () => {
  if (typeof window === "undefined") return null;

  const keysToTry = ["jwt", "auth", "user", "currentUser"];

  for (const key of keysToTry) {
    const raw = localStorage.getItem(key);
    if (!raw) continue;

    try {
      const parsed = JSON.parse(raw);
      return { key, data: parsed };
    } catch (e) {
      return { key, data: { token: raw } };
    }
  }

  return null;
};

// Chuẩn hóa dữ liệu user về 1 dạng chung
export const getCurrentUser = () => {
  const auth = readRawAuth();
  if (!auth) return null;

  const { data } = auth;

  let user = null;

  if (data.user) {
    user = data.user;
  } else {
    user = data;
  }

  if (!user) return null;

  const name = user.name || "Không tên";
  const email = user.email || "";

  const rawRole = user.role ?? user.userRole ?? user.roleId ?? 0;
  const role = Number(rawRole) || 0; // 0: Khách, 1: Nhân viên, 2: Admin

  let roleLabel = "Khách hàng";
  if (role === 1) roleLabel = "Nhân viên";
  if (role === 2) roleLabel = "Quản trị viên";

  return {
    name,
    email,
    role,
    roleLabel,
  };
};
