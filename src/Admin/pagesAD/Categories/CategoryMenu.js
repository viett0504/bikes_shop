import React, { Fragment, useContext } from "react";
import { CategoryContext } from "./index";
import AddCategoryModal from "./AddCategoryModal";

const CategoryMenu = () => {
  const { dispatch } = useContext(CategoryContext);

  return (
    <Fragment>
      
      {/* Hai modal – bình thường ẩn, chỉ hiện khi click */}
      <AddCategoryModal />
    </Fragment>
  );
};

export default CategoryMenu;
