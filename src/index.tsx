import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import { ErrorProvider } from "./context/Error";

const rootElement = document.getElementById("root");

if (rootElement) {
  // Create a root
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <ErrorProvider>
      <App />
    </ErrorProvider>
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals({});
