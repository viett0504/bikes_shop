// src/Admin/pagesAD/Banner/BannerList.js
import React, { useContext, useState } from "react";
import { BannerContext } from "./index";
// import { deleteBanner, getBanners } from "./FetchApi"; // TODO: bật lại khi dùng API

const BannerList = () => {
  const { data, dispatch } = useContext(BannerContext);
  const { banners, loading } = data;

  const [deletingId, setDeletingId] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xoá banner này?")) return;

    // =======================
    // ❌ LOGIC GỌI API – TẠM COMMENT
    // =======================
    /*
    try {
      setDeletingId(id);
      setErrorMsg("");

      // 1. Gọi API xoá
      await deleteBanner(id);

      // 2. Lấy lại list mới nhất từ server
      const resList = await getBanners();
      const images = resList.data?.Images || [];

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
    */

    // =======================
    // ✅ LOGIC FAKE CỨNG – KHÔNG CẦN API
    // =======================
    try {
      setDeletingId(id);
      setErrorMsg("");

      dispatch({ type: "deleteBanner", payload: id });
    } catch (err) {
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
                src={banner.imageUrl}
                alt="banner"
                className="banner-card__image"
              />
              <button
                className="banner-card__btn-delete"
                onClick={() => handleDelete(banner._id)}
                disabled={deletingId === banner._id}
              >
                {deletingId === banner._id ? "Đang xoá..." : "Xoá banner (fake)"}
              </button>
            </div>
          ))}
      </div>
    </div>
  );
};

export default BannerList;
