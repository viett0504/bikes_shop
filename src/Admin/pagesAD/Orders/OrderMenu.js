import React, { Fragment, useContext, useState } from "react";
import { orderContext } from "./index";
import { getAllOrders } from "./FetchApi";

export default function OrderMenu() {
  const { dispatch } = useContext(orderContext);
  const [loading, setLoading] = useState(false);

  const refresh = async () => {
    setLoading(true);
    const data = await getAllOrders();
    dispatch({ type: "fetchOrders", payload: (data && data.Orders) || [] });
    setLoading(false);
  };

  return (
    <Fragment>
      <div className="ad-card ad-refresh">
        <div className="ad-body" style={{ display: "flex", justifyContent: "flex-start" }}>
          <button className="ad-bt  n" onClick={refresh} disabled={loading}>
            {loading ? "Đang tải…" : "Làm mới"}
          </button>
        </div>
      </div>
    </Fragment>
  );
}
