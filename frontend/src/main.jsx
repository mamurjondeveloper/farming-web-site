import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { LanguageProvider } from "./context/LanguageContext";

import App from "./App";
import "./index.css";

// Ilovani BrowserRouter orqali ishga tushiramiz
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <LanguageProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </LanguageProvider>
  </React.StrictMode>
);
