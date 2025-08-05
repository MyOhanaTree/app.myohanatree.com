import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { ErrorProvider } from "./context/Error";

const rootElement = document.getElementById("root");

if (rootElement) {
  // Create a root
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <React.StrictMode>
      <ErrorProvider>
        <App />
      </ErrorProvider>
    </React.StrictMode>
  )
}