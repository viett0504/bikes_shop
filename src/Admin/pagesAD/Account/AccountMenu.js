import React, { useContext } from "react";
import { AccountContext } from "./index";

export default function AccountMenu() {
  const { data, dispatch } = useContext(AccountContext);
  const searching = data?.searching || "";
  return (
    <div className="ad-account-menu">
      {/* Ô tìm kiếm – gọn, không kéo full width */}
      <input
        type="text"
        value={searching}
        onChange={(e) =>
          dispatch({ type: "setSearchText", payload: e.target.value })
        }
        placeholder="Tìm kiếm tên tài khoản..."
        className="ad-search-input"
      />
    </div>
  );
}
