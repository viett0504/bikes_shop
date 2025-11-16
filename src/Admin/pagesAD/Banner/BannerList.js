// src/Admin/pagesAD/Banner/BannerList.js
import React, { useContext, useState } from "react";
import { BannerContext } from "./index";
import { deleteBanner, getBanners } from "./FetchApi";

const BannerList = () => {
  const { data, dispatch } = useContext(BannerContext);
  const { banners, loading } = data;

  const [deletingId, setDeletingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá banner này?")) return;

    try {
      setDeletingId(id);
      setErrorMsg("");

      const res = await deleteBanner(id);
      if (res?.error) {
        setErrorMsg(res.error);
        return;
      }

      // Lấy lại danh sách mới nhất
      const images = await getBanners();
      dispatch({
        type: "fetchBannerAndChangeState",
        payload: images,
      });
    } catch (err) {
      setErrorMsg("Lỗi xoá banner. Kiểm tra lại BE / API.");
      console.log(err);
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="banner-list">
      <h3 className="banner-list__title">Banner đang treo</h3>

      {loading && <p>Đang tải danh sách banner...</p>}
      {errorMsg && <p className="banner-list__error">{errorMsg}</p>}

      {(!banners || banners.length === 0) && !loading && (
        <p>Chưa có banner nào.</p>
      )}

      <div className="banner-list__grid">
        {banners &&
          banners.map((banner) => (
            <div key={banner._id} className="banner-card">
              <img
                src={banner.imageUrl}   // ← dùng field đã map ở FetchApi
                alt="banner"
                className="banner-card__image"
              />

              <button
                className="banner-card__btn-delete"
                onClick={() => handleDelete(banner._id)}
                disabled={deletingId === banner._id}
              >
                {deletingId === banner._id ? "Đang xoá..." : "Xoá banner"}
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default BannerList;
