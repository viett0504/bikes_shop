import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

// Lấy dữ liệu tổng dashboard (người dùng, đơn, sản phẩm, danh mục)
export const DashboardData = async () => {
  try {
    const res = await axios.post(`${apiURL}/api/customize/dashboard-data`);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};

// Lấy tất cả đơn hàng hôm nay (nếu backend hỗ trợ)
export const TodayOrders = async () => {
  try {
    const res = await axios.get(`${apiURL}/api/order/all-order`);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
