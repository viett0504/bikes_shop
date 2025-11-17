import { apiURL } from "../../utils/apiURL";
import axios from "axios";

export const getHeroBanners = async () => {
  try {
    const res = await axios.get(`${apiURL}/api/customize/get-slide-image`);
    // BE trả về dạng { images: ["url1", "url2", ...] }
    return res.data.images || [];
  } catch (error) {
    console.error("getHeroBanners error:", error);
    return [];
  }
};
