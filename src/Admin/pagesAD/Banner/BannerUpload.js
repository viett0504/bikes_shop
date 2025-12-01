// src/Admin/pagesAD/Banner/BannerUpload.js
import React, { useContext, useState } from "react";
import { BannerContext } from "./index";
import { uploadBanner, getBanners } from "./FetchApi";
import { useNotification } from "../../../Customer/components/Noti/notification";

const BannerUpload = () => {
  const { dispatch } = useContext(BannerContext);
  const { showNotification } = useNotification();

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [uploading, setUploading] = useState(false);

  const logBannerAction = async (action, extra = {}) => {
    try {
      await fetch("/logs/activity/admin/banner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...extra }),
      });
    } catch (err) {
      console.error("Log banner error:", err);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setPreview(url);
    } else {
      setImageFile(null);
      setPreview("");
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!imageFile) {
      showNotification("Vui lòng chọn 1 ảnh banner.", "warning", {
        title: "Thiếu file",
      });
      return;
    }

    try {
      setUploading(true);

      const res = await uploadBanner(imageFile);
      if (res?.error) {
        showNotification(res.error, "error", { title: "Upload thất bại" });
        return;
      }

      const images = await getBanners();
      dispatch({
        type: "fetchBannerAndChangeState",
        payload: images,
      });

      showNotification("Upload banner thành công!", "success", {
        title: "Thao tác thành công",
      });

      await logBannerAction("ADMIN_UPLOAD_BANNER", {
        fileName: imageFile.name,
      });

      setImageFile(null);
      setPreview("");
    } catch (err) {
      console.log(err);
      showNotification(
        "Lỗi upload banner. Kiểm tra lại BE / API.",
        "error",
        { title: "Lỗi server" }
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="banner-upload">
      <h3 className="banner-upload__title">Thêm Banner mới</h3>

      <form onSubmit={handleUpload} className="banner-upload__form">
        <div className="banner-upload__group">
          <label className="banner-upload__label">Chọn ảnh banner</label>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="banner-upload__input"
          />
        </div>

        {preview && (
          <div className="banner-upload__preview">
            <p>Ảnh xem trước:</p>
            <img src={preview} alt="preview banner" />
          </div>
        )}

        <button
          type="submit"
          className="banner-upload__btn"
          disabled={uploading}
        >
          {uploading ? "Đang lưu..." : "Lưu Banner"}
        </button>
      </form>
    </div>
  );
};

export default BannerUpload;
