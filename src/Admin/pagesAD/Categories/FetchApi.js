import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

export const getAllCategory = async () => {
  try {
    const res = await axios.get(`${apiURL}/api/category/all-category`);
    console.log("👉 FE getAllCategory res.data =", res.data); // THÊM DÒNG NÀY
    return res.data;
  } catch (e) {
    console.error(
      "❌ getAllCategory error:",
      e?.response?.data || e.message || e
    ); // THÊM DÒNG NÀY
  }
};

export const createCategory = async ({ cName, cImage, cDescription, cStatus }) => {
  const formData = new FormData();
  formData.append("cImage", cImage);
  formData.append("cName", cName);
  formData.append("cDescription", cDescription);
  formData.append("cStatus", cStatus);
  try {
    const res = await axios.post(`${apiURL}/api/category/add-category`, formData);
    return res.data;
  } catch (e) { console.log(e); }
};

export const editCategory = async (cId, des, status) => {
  try {
    const res = await axios.post(`${apiURL}/api/category/edit-category`, { cId, cDescription: des, cStatus: status });
    return res.data;
  } catch (e) { console.log(e); }
};

export const deleteCategory = async (cId) => {
  try {
    const res = await axios.post(`${apiURL}/api/category/delete-category`, { cId });
    return res.data;
  } catch (e) { console.log(e); }
};
