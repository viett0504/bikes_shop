// src/Admin/pagesAD/BikeType/BikeTypeContext.js
export const bikeTypeState = {
  types: [],
  addTypeModal: false,
  editTypeModal: {
    modal: false,
    tId: "",
    name: "",
    description: "",
    status: "Active",
  },
};

export const bikeTypeReducer = (state, action) => {
  switch (action.type) {
    case "fetchTypesAndChangeState":
      return { ...state, types: action.payload || [] };

    case "addTypeModal":
      return { ...state, addTypeModal: action.payload };

    case "editTypeModalOpen":
      return { ...state, editTypeModal: { modal: true, ...action.typeData } };

    case "editTypeModalClose":
      return { ...state, editTypeModal: { ...bikeTypeState.editTypeModal } };

    default:
      return state;
  }
};
