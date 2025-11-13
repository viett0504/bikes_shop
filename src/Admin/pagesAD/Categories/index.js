// src/Admin/pagesAD/Categories/index.js
import React, { Fragment, createContext, useReducer } from "react";
import CategoryMenu from "./CategoryMenu";
import AllCategories from "./AllCategory";
import { categoryState, categoryReducer } from "./CategoryContext";

// Context dùng chung cho Category
export const CategoryContext = createContext();

const Categories = () => {
  const [data, dispatch] = useReducer(categoryReducer, categoryState);

  return (
    <Fragment>
      {/* Provider bao toàn bộ phần category */}
      <CategoryContext.Provider value={{ data, dispatch }}>
        {/* Bọc bằng card cho giống style admin của bạn */}
        <div className="ad-card" style={{ marginTop: 16 }}>
          <div className="ad-body">
            {/* Thanh nút “+ Thêm danh mục” */}
            <div style={{ marginBottom: 16 }}>
              <CategoryMenu />
            </div>

            {/* Bảng danh mục */}
            <AllCategories />
          </div>
        </div>
      </CategoryContext.Provider>
    </Fragment>
  );
};

export default Categories;
