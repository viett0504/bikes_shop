export const accountState = {
  accounts: [],            // <- mảng rỗng
  addAccountModal: false,
  editAccountModal: {
    modal: false,name: "", email: "",
    position: "", password: "", phoneNumber: "",
  },
};

export const accountReducer = (state, action) => {
  switch (action.type) {
    case "fetchAccountsAndChangeState":
      return { ...state, accounts: action.payload || [] };
    case "addAccountModal":
      return { ...state, addAccountModal: action.payload };
    case "editAccountModalOpen":
      return { ...state, editAccountModal: { modal: true, ...action.account } };
    case "editAccountModalClose":
      return { ...state, editAccountModal: { ...accountState.editAccountModal } };
    default:
      return state;
  }
};
