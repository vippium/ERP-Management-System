import { configureStore } from "@reduxjs/toolkit";
import productReducer from "../features/products/productSlice.js";
import customerReducer from "../features/customers/customerSlice.js";
import supplierReducer from "../features/suppliers/supplierSlice.js";
import purchaseReducer from "../features/purchases/purchaseSlice.js";
import saleReducer from "../features/sales/saleSlice.js";
import userReducer from "../features/users/userSlice.js";
import uiReducer from "../features/ui/uiSlice.js";

const store = configureStore({
  reducer: {
    products: productReducer,
    ui: uiReducer,
    users: userReducer,
    customers: customerReducer,
    suppliers: supplierReducer,
    purchases: purchaseReducer,
    sales: saleReducer,
  },
});

export default store;
