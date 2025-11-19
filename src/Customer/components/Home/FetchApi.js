// src/pages/Home/homeAPI.js
import axios from "axios";

const apiURL = process.env.REACT_APP_API_URL;


export const getHeroBanners = async () => {
  try {
    const res = await axios.get(`${apiURL}/api/customize/get-slide-image`);

    // BE trả về { Images: [ { _id, slideImage, ... }, ... ] }
    const raw = res.data?.Images || [];

    // HeroSection chỉ cần mảng URL ảnh
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
    // BE trả về { Products: [...] }
    return res.data?.Products || [];
  } catch (error) {
    console.error("getHomeProducts error:", error);
    return [];
  }
};
