export const accountState = {
  accounts: [],            // <- mảng rỗng
  addAccountModal: false,
  editAccountModal: {
    modal: false,name: "", email: "",
    position: "", password: "", phoneNumber: "",
  },
  searching: "",
};

export const accountReducer = (state, action) => {
  switch (action.type) {
    case "fetchAccountsAndChangeState":
      return {
        ...state,
        accounts: action.payload,
      };

    case "addAccountModal":
      return {
        ...state,
        addAccountModal: action.payload,
      };

    case "editAccountModalOpen":
      let positionLabel = "Khách hàng";
      if (action.account.userRole === 1) {
        positionLabel = "Nhân viên";
      } else if (action.account.userRole === 2) {
        positionLabel = "Admin"; 
      }

      return {
        ...state,
        editAccountModal: {
          modal: true,
          aId: action.account._id,
          name: action.account.name,
          email: action.account.email || "",
          position: positionLabel,
          phoneNumber: action.account.phoneNumber || "",
        },
      };


    case "editAccountModalClose":
      return {
        ...state,
        editAccountModal: {
          modal: false,
          aId: null,
          name: "",
          email: "",
          position: "",
          phoneNumber: "",
        },
      };

    case "loading":
      return {
        ...state,
        loading: action.payload,
      };
    case "setSearchText":                 // 👈 thêm
    return { ...state, searching: action.payload };

    default:
      return state;
  }
};

