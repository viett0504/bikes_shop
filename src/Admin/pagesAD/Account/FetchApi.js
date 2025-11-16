import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

export const getAllUsers = async () => {
  try {
    const res = await axios.get(`${apiURL}/api/user/all-users`);
    return res.data;
  } catch (err) {
    console.error("Lỗi getAllUsers:", err);
    return { error: "Không lấy được danh sách user" };
  }
};

export const getSingleUser = async (uId) => {
  try {
    const res = await axios.post(`${apiURL}/api/user/sinlge-user`, { uId });
    return res.data;
  } catch (err) {
    console.error("Lỗi getSingleUser:", err);
    return { error: "Không lấy được thông tin user" };
  }
};

export const addUser = async (payload) => {
  // payload = { allProduct, user, amount, transactionId, address, phone }
  try {
    const res = await axios.post(`${apiURL}/api/user/add-user`, payload);
    return res.data;
  } catch (err) {
    console.error("Lỗi addUser:", err);
    return { error: "Không thêm được user" };
  }
};

export const editUser = async ({ uId, name, phoneNumber }) => {
  try {
    const res = await axios.post(`${apiURL}/api/user/edit-user`, {
      uId,
      name,
      phoneNumber,
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi editUser:", err);
    return { error: "Không sửa được user" };
  }
};
export const changePassword = async ({ uId, oldPassword, newPassword }) => {
  try {
    const res = await axios.post(`${apiURL}/api/user/change-password`, {
      uId,
      oldPassword,
      newPassword,
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi changePassword:", err);
    return { error: "Không đổi được mật khẩu" };
  }
};

// Xóa / đổi trạng thái user
export const deleteUser = async ({ uId, status }) => {
  try {
    const res = await axios.post(`${apiURL}/api/user/delete-user`, {
      uId,
      status,
    });
    return res.data;
  } catch (err) {
    console.error("Lỗi deleteUser:", err);
    return { error: "Không xóa được user" };
  }
};
