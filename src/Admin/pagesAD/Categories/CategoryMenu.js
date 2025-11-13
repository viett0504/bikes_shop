import React, { Fragment, useContext } from "react";
import { CategoryContext } from "./index";
import AddCategoryModal from "./AddCategoryModal";
import EditCategoryModal from "./EditCategoryModal";

const CategoryMenu = () => {
  const { dispatch } = useContext(CategoryContext);

  return (
    <Fragment>
      <div className="flex items-center justify-between w-full">
        <div
          style={{ background: "#303031" }}
          onClick={() =>
            dispatch({ type: "addCategoryModal", payload: true })
          }
          className="cursor-pointer rounded-full px-4 py-2 text-gray-100 text-sm font-semibold uppercase"
        >
          + Thêm danh mục
        </div>
      </div>

      {/* Hai modal – bình thường ẩn, chỉ hiện khi click */}
      <AddCategoryModal />
      <EditCategoryModal />
    </Fragment>
  );
};

export default CategoryMenu;
