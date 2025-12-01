// src/Customer/pages/Account/FetchApi.js
const apiURL = process.env.REACT_APP_API_URL || "http://localhost:8000";

export const getAvatarSrc = (img) => {
  if (!img) return "";

  if (img.startsWith("blob:") || img.startsWith("data:")) {
    return img;
  }

  if (img.startsWith("http") && img.includes("/ipfs/")) {
    const cid = img.split("/ipfs/")[1];
    if (cid) return `https://ipfs.filebase.io/ipfs/${cid}`;
  }

  if (!img.startsWith("http") && img.startsWith("Qm")) {
    return `https://ipfs.filebase.io/ipfs/${img}`;
  }

  if (!img.startsWith("http")) {
    return `${apiURL}/uploads/users/${img}`;
  }

  return img;
};

/**
 * Gọi API đổi mật khẩu
 * @param {Object} payload
 * @param {string} payload.token - Bearer token
 * @param {string|number} payload.userId - ID user
 * @param {string} payload.oldPassword - Mật khẩu cũ
 * @param {string} payload.newPassword - Mật khẩu mới
 */
export const changePasswordApi = async ({
  token,
  userId,
  oldPassword,
  newPassword,
}) => {
  const res = await fetch(`${apiURL}/api/user/change-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      uId: userId,
      oldPassword,
      newPassword,
    }),
  });

  // Thử parse JSON, nếu backend trả HTML (404, 500...) thì sẽ throw
  let data = null;
  try {
    data = await res.json();
  } catch (e) {
    const err = new Error(
      res.status === 404
        ? "Không tìm thấy API đổi mật khẩu (404). Kiểm tra lại URL backend."
        : "Phản hồi từ server không phải JSON hợp lệ."
    );
    err.status = res.status;
    throw err;
  }

  if (!res.ok || data.error) {
    const err = new Error(
      data.error || data.message || "Đổi mật khẩu thất bại, vui lòng thử lại."
    );
    err.status = res.status;
    throw err;
  }

  return data; // mong đợi: { success: "...", ... }
};

export { apiURL };