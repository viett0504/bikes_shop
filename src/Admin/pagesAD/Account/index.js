// src/Admin/pagesAD/accounts/index.js
import React, { Fragment, createContext, useReducer } from "react";
import { accountState, accountReducer } from "./AccountContext";
import AccountMenu from "./AccountMenu";
import AccountTable from "./AccountTable";
import AddAccountModal from "./AddAccountModal";

export const AccountContext = createContext();

export default function Account() {
  const [data, dispatch] = useReducer(accountReducer, accountState);

  return (
    <AccountContext.Provider value={{ data, dispatch }}>
      <div className="ad-col">
        <AccountMenu />
        <AccountTable/>
        <AddAccountModal />
      </div>
    </AccountContext.Provider>
  );
}