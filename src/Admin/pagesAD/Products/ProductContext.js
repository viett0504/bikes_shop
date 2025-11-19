// src/Admin/pagesAD/Products/ProductContext.js
export const productState = {
  products: [],
  addProductModal: false,
  editProductModal: {
    modal: false,
    pId: "",
    pName: "",
    pDescription: "",
    pImages: null,
    pStatus: "",
    pCategory: "",
    pQuantity: "",
    pPrice: "",
    pOffer: "",
    pBiketype: "",   
  },
  searchText: "",
};

export const productReducer = (state, action) => {
  switch (action.type) {
    case "fetchProductsAndChangeState":
      return { ...state, products: action.payload || [] };
    case "addProductModal":
      return { ...state, addProductModal: action.payload };
    case "editProductModalOpen":
      return {
        ...state,
        editProductModal: { modal: true, ...action.product },
      };
    case "editProductModalClose":
      return {
        ...state,
        editProductModal: { ...productState.editProductModal },
      };
    case "setSearchText":                 // 👈 thêm
      return { ...state, searchText: action.payload };
    default:
      return state;
  }
};
