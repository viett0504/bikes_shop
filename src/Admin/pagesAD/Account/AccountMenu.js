import React, { useContext } from "react";
import { AccountContext } from "./index";

export default function AccountMenu() {
  const { dispatch } = useContext(AccountContext);
  return (
    <div className="ad-card ad-add">
      <div className="ad-body" style={{display:'flex',justifyContent:'space-between',alignItems:'center'}}>
        <button className="ad-btn" onClick={() => dispatch({ type: "addAccountModal", payload: true })}>
          + Thêm người dùng
        </button>
        {/* Sau này nhúng addAccountModal / addAccountModal nếu muốn */}
      </div>
    </div>
  );
}
