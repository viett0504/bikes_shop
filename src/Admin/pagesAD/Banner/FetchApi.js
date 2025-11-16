// src/Admin/pagesAD/Banner/FetchApi.js
import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL;

// Lấy danh sách banner đang treo từ BE (customize.js)
export const getBanners = async () => {
  try {
    const res = await axios.get(`${apiURL}/api/customize/get-slide-image`);
    const raw = res.data?.Images || [];
    const mapped = raw.map((img) => ({
      _id: img._id,
      imageUrl: img.slideImage,  // dùng trực tiếp URL từ DB
    }));

    return mapped;
  } catch (error) {
    console.error("❌ Lỗi getBanners:", error);
    return [];
  }
};

// Upload 1 banner mới
export const uploadBanner = async (imageFile) => {
  try {
    const formData = new FormData();
    // TÊN FIELD "image" phải trùng với upload.single("image") bên BE
    formData.append("image", imageFile);

    // BE: /api/customize/upload-slide-image (POST)
    const res = await axios.post(
      `${apiURL}/api/customize/upload-slide-image`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    return res.data; // { success: "..."} / { error: "..." }
  } catch (error) {
    console.error("❌ Lỗi uploadBanner:", error);
    throw error;
  }
};

// Xoá 1 banner
export const deleteBanner = async (id) => {
  try {
    // BE: router.post("/delete-slide-image", customizeController.deleteSlideImage);
    // BE nhận { id } trong body
    const res = await axios.post(
      `${apiURL}/api/customize/delete-slide-image`,
      { id }
    );
    return res.data;
  } catch (error) {
    console.error("❌ Lỗi deleteBanner:", error);
    throw error;
  }
};
