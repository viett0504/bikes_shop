export const categoryState = {
  categories: [],
  addCategoryModal: false,
  editCategoryModal: {
    modal: false,
    cId: null,
    cName: "",   // 👈 THÊM DÒNG NÀY
    des: "",
    status: "",
  },
  loading: false,
};


export const categoryReducer = (state, action) => {
  switch (action.type) {
    case "fetchCategories":
      return { 
        ...state, 
        categories: action.payload 
      };

    case "fetchCategoryAndChangeState":
      return { 
        ...state, 
        categories: action.payload 
      };

    case "addCategoryModal":
      return { 
        ...state, 
        addCategoryModal: action.payload 
      };

    case "editCategoryModalOpen":
      return {
        ...state,
        editCategoryModal: {
          modal: true,
          cId: action.category._id,          // lấy từ category
          cName: action.category.cName,      // 🔹 tên danh mục
          des: action.category.cDescription, // 🔹 mô tả
          status: action.category.cStatus,   // 🔹 trạng thái
        },
      };

    case "editCategoryModalClose":
      return {
        ...state,
        editCategoryModal: { 
          modal: false, 
          cId: null, 
          cName: "",     // 👈 reset luôn
          des: "", 
          status: "" 
        },
      };


    case "loading":
      return { 
        ...state, 
        loading: action.payload 
      };

    default:
      return state;
  }
};
