import { useState } from "react";
import { TideDependents } from "./TideDependents/TideDependents";
import { Footer } from "./Footer/Footer";
import "./index.css";

function App() {
  return (
    <>
      <TideDependents />
      <Footer />
    </>
  );
}

export default App;
