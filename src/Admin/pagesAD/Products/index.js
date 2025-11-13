// src/Admin/pagesAD/Products/index.js
import React, { Fragment, createContext, useReducer } from "react";
import ProductMenu from "./ProductMenu";
import ProductTable from "./ProductTable";
import { productState, productReducer } from "./ProductContext";
import AddProductModal from "./AddProductModal";

export const ProductContext = createContext();

export default function Products() {
  const [data, dispatch] = useReducer(productReducer, productState);

  return (
    <ProductContext.Provider value={{ data, dispatch }}>
      <div className="ad-col">
        <ProductMenu />
        <ProductTable />
        {/* luôn render ở đây, còn hiển thị hay không do data.addProductModal quyết định */}
        <AddProductModal />
      </div>
    </ProductContext.Provider>
  );
}