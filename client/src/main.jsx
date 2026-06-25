// Import React
import React from "react";

// Import ReactDOM
import ReactDOM from "react-dom/client";

// Import BrowserRouter
import { BrowserRouter } from "react-router-dom";

// Import global styles
import "./index.css";

// Import App component
import App from "./App";

// Render React application
ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>
);