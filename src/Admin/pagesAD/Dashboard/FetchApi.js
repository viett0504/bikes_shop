import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

// Lấy dữ liệu tổng dashboard (người dùng, đơn, sản phẩm, danh mục)
export const DashboardData = async () => {
  try {
    const res = await axios.get(`${apiURL}/api/dashboard/summary`);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Lấy tất cả đơn hàng hôm nay (hoặc tất cả đơn, tùy backend)
export const TodayOrders = async () => {
  try {
    const res = await axios.get(`${apiURL}/api/order/get-all-orders`);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

export const AllUsers = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("Chưa có token → chưa đăng nhập / token bị mất");
      return null;
    }

    const res = await axios.get(`${apiURL}/api/user/all-user`, {
      headers: {
        Authorization: `Bearer ${token}`, 
      },
    });

    return res.data;
  } catch (error) {
    console.log("Lỗi AllUsers:", error?.response || error);
    return null;
  }
};