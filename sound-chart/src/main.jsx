import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import HomePage from "./pages/HomePage.jsx";
import Header from "./components/header.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Header />
    <HomePage />
  </StrictMode>
);
