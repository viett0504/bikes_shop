import React, { Fragment, createContext, useReducer } from "react";
import OrderMenu from "./OrderMenu";
import AllOrder from "./AllOrder";
import { orderState, orderReducer } from "./OrderContext";

export const orderContext = createContext();

const OrdersComponent = () => (
  <div className="grid grid-cols-1 space-y-4 p-4">
    <OrderMenu />
    <AllOrder />
  </div>
);

const Orders = () => {
  const [data, dispatch] = useReducer(orderReducer, orderState); // giống Products
  return (
    <Fragment>
      <orderContext.Provider value={{ data, dispatch }}>
        <OrdersComponent />
      </orderContext.Provider>
    </Fragment>
  );
};

export default Orders;
