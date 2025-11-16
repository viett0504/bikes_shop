export const productState = {
  products: [],            // <- mảng rỗng
  addProductModal: false,
  editProductModal: {
    modal: false, pId: "", pName: "", pDescription: "",
    pImages: null, pStatus: "", pCategory: "", pQuantity: "",
    pPrice: "", pOffer: "", pType: "",
  },
};

export const productReducer = (state, action) => {
  switch (action.type) {
    case "fetchProductsAndChangeState":
      return { ...state, products: action.payload || [] };
    case "addProductModal":
      return { ...state, addProductModal: action.payload };
    case "editProductModalOpen":
      return { ...state, editProductModal: { modal: true, ...action.product } };
    case "editProductModalClose":
      return { ...state, editProductModal: { ...productState.editProductModal } };
    default:
      return state;
  }
};
