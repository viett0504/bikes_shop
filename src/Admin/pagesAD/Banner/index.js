// src/Admin/pagesAD/Banner/index.js
import React, { createContext, useReducer, useEffect } from "react";
import { bannerReducer, bannerState } from "./BannerContext";
import { getBanners } from "./FetchApi";
import BannerUpload from "./BannerUpload";
import BannerList from "./BannerList";

export const BannerContext = createContext();

export default function Banner() {
  const [data, dispatch] = useReducer(bannerReducer, bannerState);

  // Nếu đang test fake data thì COMMENT toàn bộ useEffect này
//   useEffect(() => {
//     const fetchData = async () => {
//       dispatch({ type: "loading", payload: true });
//       try {
//         const res = await getBanners();
//         const images = res.data?.Images || [];
//         dispatch({
//           type: "fetchBannerAndChangeState",
//           payload: images,
//         });
//       } catch (err) {
//         console.log(err);
//       } finally {
//         dispatch({ type: "loading", payload: false });
//       }
//     };

//     fetchData();
//   }, []);

  return (
    <BannerContext.Provider value={{ data, dispatch }}>
      <div className="ad-col">
        <div className="ad-card">
          <div className="ad-body">
            <h2 className="ad-form-title">Quản lý Banner</h2>

            <div className="banner-page__content">
              <BannerUpload />
              <BannerList />
            </div>
          </div>
        </div>
      </div>
    </BannerContext.Provider>
  );
}
