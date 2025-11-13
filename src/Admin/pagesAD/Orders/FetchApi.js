import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

// Lấy toàn bộ đơn
export const getAllOrders = async () => {
  try {
    const res = await axios.get(`${apiURL}/api/order/all-order`);
    return res.data; // { Orders: [...] }
  } catch (e) { console.log(e); }
};

// Cập nhật trạng thái đơn
export const updateOrderStatus = async ({ oId, status }) => {
  try {
    const res = await axios.post(`${apiURL}/api/order/update-status`, { oId, status });
    return res.data; // { success | error }
  } catch (e) { console.log(e); }
};

// Hủy / xóa đơn
export const cancelOrder = async (oId) => {
  try {
    const res = await axios.post(`${apiURL}/api/order/cancel`, { oId });
    return res.data; // { success | error }
  } catch (e) { console.log(e); }
};
