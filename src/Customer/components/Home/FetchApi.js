// src/pages/Home/fetchApi.js
import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL;


export const getHeroBanners = async () => {
  try {
    const res = await axios.get(`${apiURL}/api/customize/get-slide-image`);

    const raw = res.data?.Images || [];
    const urls = raw.map((item) => item.slideImage);

    return urls;
  } catch (error) {
    console.error("getHeroBanners error:", error);
    return [];
  }
};

// Lấy danh sách sản phẩm cho trang Home (sản phẩm nổi bật, v.v.)
export const getHomeProducts = async () => {
  try {
    const res = await axios.get(`${apiURL}/api/product/all-product`);
    return res.data?.Products || [];
  } catch (error) {
    console.error("getHomeProducts error:", error);
    return [];
  }
};

export const getHomeCategories = async () => {
  try {
    const res = await axios.get(`${apiURL}/api/category/all-category`);
    return res.data?.Categories || [];
  } catch (err) {
    console.error("❌ getHomeCategories error:", err?.response?.data || err);
    return [];
  }
};