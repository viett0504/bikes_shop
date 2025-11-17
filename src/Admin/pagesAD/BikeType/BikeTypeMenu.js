// src/Admin/pagesAD/BikeType/BikeTypeMenu.js
import React, { useContext } from "react";
import { BikeTypeContext } from "./index";

export default function BikeTypeMenu() {
  const { dispatch } = useContext(BikeTypeContext);

  return (
    <div className="ad-card ad-add">
      <div
        className="ad-body"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <button
          className="ad-btn"
          onClick={() => {
            dispatch({ type: "editTypeModalClose" });
            dispatch({ type: "addTypeModal", payload: true });
          }}
        >
          + Thêm loại xe
        </button>
      </div>
    </div>
  );
}
