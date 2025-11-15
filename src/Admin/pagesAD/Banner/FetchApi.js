// src/Admin/pagesAD/Banner/FetchApi.js
import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL;

// Lấy danh sách banner đang treo
export const getBanners = async () => {
  try {
    const res = await axios.get(`${apiURL}/api/customize/images`);
    // Giả sử BE trả về: { Images: [ { _id, imageUrl } ] }
    return res;
  } catch (error) {
    console.error("❌ Lỗi getBanners:", error);
    throw error;
  }
};

// Upload 1 banner mới
export const uploadBanner = async (imageFile) => {
  try {
    const formData = new FormData();
    // TÊN FIELD "image" phải trùng với multer.single("image") bên BE
    formData.append("image", imageFile);

    const res = await axios.post(
      `${apiURL}/api/customize/upload-slide-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return res;
  } catch (error) {
    console.error("❌ Lỗi uploadBanner:", error);
    throw error;
  }
};

// Xoá 1 banner
export const deleteBanner = async (id) => {
  try {
    const res = await axios.delete(`${apiURL}/api/customize/delete-image/${id}`);
    return res;
  } catch (error) {
    console.error("❌ Lỗi deleteBanner:", error);
    throw error;
  }
};
