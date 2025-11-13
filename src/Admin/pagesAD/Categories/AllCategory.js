// src/Admin/pagesAD/Categories/AllCategory.js
import { useContext, useEffect, useState } from "react";
import { CategoryContext } from "./index";
import { getAllCategory } from "./FetchApi";  // <-- đúng tên export

const AllCategory = () => {
  const { data, dispatch } = useContext(CategoryContext);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const res = await getAllCategory();     // <-- dùng getAllCategory
      if (res && res.Categories) {
        dispatch({ type: "fetchCategories", payload: res.Categories });
      }
      setLoading(false);
    };

    fetchData();
  }, [dispatch]); // không còn cảnh báo fetchData

  const { categories } = data;

  return (
    <div className="ad-card" style={{ marginTop: 16 }}>
      <div className="ad-body">
        <div style={{ marginBottom: 12, fontWeight: 600 }}>Danh sách danh mục</div>

        <div style={{ overflowX: "auto" }}>
          <table className="ad-table">
            <thead>
              <tr>
                <th>Tên danh mục</th>
                <th>Mô tả</th>
                <th>Ảnh</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Cập nhật</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: 16 }}>
                    Đang tải...
                  </td>
                </tr>
              ) : categories && categories.length > 0 ? (
                categories.map((c) => (
                  <tr key={c._id}>
                    <td>{c.cName}</td>
                    <td>{c.cDescription}</td>
                    <td>
                      {c.cImage ? (
                        <img
                          src={c.cImage}
                          alt={c.cName}
                          style={{ width: 60, height: 40, objectFit: "cover", borderRadius: 4 }}
                        />
                      ) : (
                        "–"
                      )}
                    </td>
                    <td>{c.cStatus}</td>
                    <td>{new Date(c.createdAt).toLocaleString("vi-VN")}</td>
                    <td>{new Date(c.updatedAt).toLocaleString("vi-VN")}</td>
                    <td>
                      {/* ở đây bạn có thể thêm nút Sửa / Xóa sau */}
                      {/* ví dụ:
                      <button className="ad-btn">Sửa</button>
                      */}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: "center", padding: 16 }}>
                    Chưa có danh mục
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <div style={{ marginTop: 8, fontSize: 13 }}>
          Tổng: {categories ? categories.length : 0} danh mục
        </div>
      </div>
    </div>
  );
};

export default AllCategory;
