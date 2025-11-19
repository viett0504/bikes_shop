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
    // nếu backend bạn là /api/order/get-all-orders thì sửa luôn:
    const res = await axios.get(`${apiURL}/api/order/get-all-orders`);
    return res.data;
  } catch (error) {
    console.log(error);
    return null;
  }
};
