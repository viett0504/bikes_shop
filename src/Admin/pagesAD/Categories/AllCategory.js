// src/Admin/pagesAD/Categories/AllCategory.js
import { useContext, useEffect } from "react";
import { CategoryContext } from "./index";
import { deleteCategory, getAllCategory } from "./FetchApi";

const AllCategory = () => {
  const { data, dispatch } = useContext(CategoryContext);
  const { categories, loading } = data;

  // Tách hàm fetchData ra ngoài để onDelete cũng dùng được
  const fetchData = async () => {
    dispatch({ type: "loading", payload: true });

    const res = await getAllCategory();
    console.log("👉 res in AllCategory =", res);

    if (res && res.Categories) {
      // nếu reducer của bạn dùng type khác (vd: fetchCategoryAndChangeState)
      // thì đổi lại cho khớp
      dispatch({ type: "fetchCategories", payload: res.Categories });
    }

    dispatch({ type: "loading", payload: false });
  };

  useEffect(() => {
    fetchData();
    // eslint-disable-next-line
  }, [dispatch]);

  const onDelete = async (id) => {
    const r = await deleteCategory(id);
    if (r?.success) {
      // 🔁 xóa xong load lại danh sách
      fetchData();
    }
  };

  const onEdit = (c) => {
    dispatch({ type: "addCategoryModal", payload: false });

    dispatch({
      type: "editCategoryModalOpen",
      category: c,
    });
  };

  return (
    <div className="ad-card" style={{ marginTop: 16 }}>
      <div className="ad-body">
        <div style={{ marginBottom: 12, fontWeight: 600 }}>
          Danh sách danh mục
        </div>

        {/* ✅ wrapper scroll dọc + ngang giống ProductTable */}
        <div
          style={{
            maxHeight: 600,       // ~5–6 dòng, thừa sẽ xuất hiện thanh trượt
            overflowY: "auto",
            overflowX: "auto",
          }}
        >
          <table
            className="ad-table ad-table-sticky"
            style={{ minWidth: 900 }}
          >
            <thead>
              <tr>
                <th>Tên danh mục</th>
                <th>Mô tả</th>
                <th>Ảnh</th>
                <th>Trạng thái</th>
                <th>Ngày tạo</th>
                <th>Cập nhật</th>
                <th className="text-center">Hành động</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td
                    colSpan="7"
                    style={{ textAlign: "center", padding: 16 }}
                  >
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
                          style={{
                            width: 60,
                            height: 40,
                            objectFit: "cover",
                            borderRadius: 4,
                          }}
                        />
                      ) : (
                        "–"
                      )}
                    </td>
                    <td>{c.cStatus}</td>
                    <td>
                      {c.createdAt
                        ? new Date(c.createdAt).toLocaleString("vi-VN")
                        : "—"}
                    </td>
                    <td>
                      {c.updatedAt
                        ? new Date(c.updatedAt).toLocaleString("vi-VN")
                        : "—"}
                    </td>
                    <td className="text-center" style={{ paddingRight: 12 }}>
                      <div
                        style={{
                          display: "flex",
                          gap: 8,
                          justifyContent: "center",
                        }}
                      >
                        <button
                          className="ad-btn left"
                          type="button"
                          onClick={() => onEdit(c)}
                        >
                          Sửa
                        </button>
                        <button
                          className="ad-btn danger"
                          type="button"
                          onClick={() => onDelete(c._id)}
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    style={{ textAlign: "center", padding: 16 }}
                  >
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
