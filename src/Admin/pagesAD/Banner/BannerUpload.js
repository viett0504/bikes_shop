// src/Admin/pagesAD/Banner/BannerUpload.js
import React, { useContext, useState } from "react";
import { BannerContext } from "./index";
import { uploadBanner, getBanners } from "./FetchApi";

const BannerUpload = () => {
  const { dispatch } = useContext(BannerContext);

  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [uploading, setUploading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setErrorMsg("");
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
      setErrorMsg("Vui lòng chọn 1 ảnh banner.");
      return;
    }

    try {
      setUploading(true);
      setErrorMsg("");

      // 1. Upload lên BE
      const res = await uploadBanner(imageFile);
      if (res?.error) {
        setErrorMsg(res.error);
        return;
      }

      // 2. Lấy lại list mới nhất
      const images = await getBanners();

      // 3. Cập nhật context
      dispatch({
        type: "fetchBannerAndChangeState",
        payload: images,
      });

      // 4. Clear form
      setImageFile(null);
      setPreview("");
    } catch (err) {
      setErrorMsg("Lỗi upload banner. Kiểm tra lại BE / API.");
      console.log(err);
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

        {errorMsg && <p className="banner-upload__error">{errorMsg}</p>}

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
