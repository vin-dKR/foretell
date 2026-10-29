import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import Site from "./Site";
import "./index.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Site pathname={window.location.pathname} search={window.location.search} />
  </StrictMode>,
);
