// src/Admin/pagesAD/BikeType/index.js
import React, { createContext, useReducer } from "react";
import { bikeTypeState, bikeTypeReducer } from "./BikeTypeContext";
import BikeTypeMenu from "./BikeTypeMenu";
import BikeTypeTable from "./BikeTypeTable";
import AddBikeTypeModal from "./AddBikeTypeModal";
import EditBikeTypeModal from "./EditBikeTypeModal";

export const BikeTypeContext = createContext();

export default function BikeTypes() {
  const [data, dispatch] = useReducer(bikeTypeReducer, bikeTypeState);

  return (
    <BikeTypeContext.Provider value={{ data, dispatch }}>
      <div className="ad-col">
        <BikeTypeMenu />
        <BikeTypeTable />
        <AddBikeTypeModal />
        <EditBikeTypeModal />
      </div>
    </BikeTypeContext.Provider>
  );
}
