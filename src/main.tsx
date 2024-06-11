import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import { Provider } from "react-redux";
import store from "./state/store";

import { Toaster } from "./components/ui/toaster";

import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <Provider store={store}>
      <App />
      <Toaster />
    </Provider>
  </React.StrictMode>,
);
