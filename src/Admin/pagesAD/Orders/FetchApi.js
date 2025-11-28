import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

// Lấy toàn bộ đơn
export const getAllOrders = async () => {
  try {
    const res = await axios.get(`${apiURL}/api/order/get-all-orders`);
    return res.data; // { Orders: [...] }
  } catch (e) { console.log(e); }
};

// Cập nhật trạng thái đơn
export const updateOrderStatus = async ({ oId, status, cancelBy }) => {
  try {
    const res = await axios.post(`${apiURL}/api/order/update-order`, {
      oId,
      status,
      cancelBy,  
    });
    return res.data;
  } catch (e) {
    console.log(e);
  }
};


// Hủy / xóa đơn
export const cancelOrder = async (oId) => {
  try {
    const res = await axios.post(`${apiURL}/api/order/delete-order`, { oId });
    return res.data; // { success | error }
  } catch (e) { console.log(e); }
};

// Lấy đơn hàng theo user
export const getOrdersByUser = async (uId) => {
  try {
    const res = await axios.post(`${apiURL}/api/order/order-by-user`, {
      uId,
    });
    // Backend trả { Order: [...] }
    return res.data?.Order || [];
  } catch (err) {
    console.error("getOrdersByUser error:", err?.response?.data || err);
    return [];
  }
};

export const updatePaymentStatus = async ({ oId, payStatus }) => {
  try {
    const res = await axios.post(`${apiURL}/api/order/update-payment`, {
      oId,
      payStatus,
    });
    return res.data;
  } catch (e) {
    console.log(e);
  }
};
