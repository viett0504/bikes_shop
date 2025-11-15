// src/Admin/pagesAD/Categories/AllCategory.js
import { useContext, useEffect } from "react";
import { CategoryContext } from "./index";     
import { getAllCategory } from "./FetchApi"; 

const AllCategory = () => {
  const { data, dispatch } = useContext(CategoryContext);
  const { categories, loading } = data;         // lấy từ context

  useEffect(() => {
    const fetchData = async () => {
      dispatch({ type: "loading", payload: true });

      const res = await getAllCategory();
      console.log("👉 res in AllCategory =", res);

      if (res && res.Categories) {
        dispatch({ type: "fetchCategories", payload: res.Categories });
      }

      dispatch({ type: "loading", payload: false });
    };

    fetchData();
  }, [dispatch]);

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
                          src={`${process.env.REACT_APP_API_URL}/uploads/categories/${c.cImage}`}
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
                      {/* sau này thêm Sửa/Xóa */}
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
