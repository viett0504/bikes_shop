import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

const mapPositionToRole = (position) => {
  if (!position) return 0;
  const p = position.toLowerCase().trim();

  // 2 = Quản lý / Admin
  if (
    p.includes("quản lý") ||
    p.includes("quan ly") ||
    p.includes("admin")
  ) {
    return 2;
  }


  // 1 = Nhân viên
  if (p.includes("nhân viên") || p.includes("nhan vien")) {
    return 1;
  }

  // 0 = Khách hàng
  return 0;
};

const getToken = () => localStorage.getItem("token");

// Lấy danh sách user
export const getAllUsers = async () => {
  try {
    const res = await axios.get(`${apiURL}/api/user/all-user`, {
      headers: {
        token: `Bearer ${getToken()}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi getAllUsers:", err?.response?.data || err.message || err);
    return { error: "Không lấy được danh sách user" };
  }
};

// Lấy 1 user
export const getSingleUser = async (uId) => {
  try {
    const res = await axios.post(
      `${apiURL}/api/user/signle-user`,
      { uId },
      {
        headers: {
          token: `Bearer ${getToken()}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Lỗi getSingleUser:", err?.response?.data || err.message || err);
    return { error: "Không lấy được thông tin người dùng" };
  }
};

// Thêm user (admin)
export const addUser = async ({
  name,
  email,
  password,
  phoneNumber,
  position,
  imageFile,
}) => {
  try {
    const form = new FormData();
    form.append("name", name);
    form.append("email", email);
    form.append("password", password);
    form.append("phoneNumber", phoneNumber || "");
    form.append("userRole", mapPositionToRole(position));
    if (imageFile) form.append("userImage", imageFile);

    const res = await axios.post(`${apiURL}/api/user/add-user`, form, {
      headers: {
        "Content-Type": "multipart/form-data",
        token: `Bearer ${getToken()}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi addUser:", err?.response?.data || err.message || err);
    return { error: "Không thêm được user" };
  }
};

// Sửa user (admin)
export const editUser = async ({
  uId,
  name,
  email,
  phoneNumber,
  position,
  password,
  imageFile,
}) => {
  try {
    const form = new FormData();
    form.append("uId", uId);
    form.append("name", name);
    form.append("email", email);
    form.append("phoneNumber", phoneNumber || "");
    form.append("userRole", mapPositionToRole(position));
    if (password && password.trim()) {
      form.append("newPassword", password.trim());
    }
    if (imageFile) {
      form.append("userImage", imageFile);
    }

    const res = await axios.post(`${apiURL}/api/user/edit-user`, form, {
      headers: {
        "Content-Type": "multipart/form-data",
        token: `Bearer ${getToken()}`,
      },
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi editUser:", err?.response?.data || err.message || err);
    return { error: "Không sửa được user" };
  }
};

// Xóa user
export const deleteUser = async (uId) => {
  try {
    const res = await axios.post(
      `${apiURL}/api/user/delete-user`,
      { uId },
      {
        headers: {
          token: `Bearer ${getToken()}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Lỗi deleteUser:", err?.response?.data || err.message || err);
    return { error: "Không xóa được user" };
  }
};

// Đổi mật khẩu 
export const changePassword = async ({ uId, oldPassword, newPassword }) => {
  try {
    const res = await axios.post(
      `${apiURL}/api/user/change-password`,
      { uId, oldPassword, newPassword },
      {
        headers: {
          token: `Bearer ${getToken()}`,
        },
      }
    );
    return res.data;
  } catch (err) {
    console.error("Lỗi changePassword:", err?.response?.data || err.message || err);
    return { error: "Không đổi được mật khẩu" };
  }
};
