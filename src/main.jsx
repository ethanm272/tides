import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import "./MainInfoSection/MainInfoSection.jsx";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(<App />);
