import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { Provider } from "react-redux";
import store from "./app/store.js";
import { Toaster } from "react-hot-toast";
import "./styles/erp-theme.css";
import "./styles/buttons.css";
import "./styles/forms.css";
import "./styles/tables.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <Toaster position="top-center" toastOptions={{ duration: 2500 }} />
    </Provider>
  </React.StrictMode>
);
