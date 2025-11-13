export const orderState = {
  orders: [],     // <- mảng rỗng
  query: ""
};

export const orderReducer = (state, action) => {
  switch (action.type) {
    case "fetchOrders":
      return { ...state, orders: action.payload || [] }; // luôn là mảng
    case "search":
      return { ...state, query: action.payload };
    default:
      return state;
  }
};
