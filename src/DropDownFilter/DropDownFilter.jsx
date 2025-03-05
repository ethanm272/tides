import { useState } from "react";
import { ResultsList } from "./ResultsList/ResultsList";
import "./DropDownFilter.css";

export const DropDownFilter = () => {
  const [text, setText] = useState("");
  const inputField = document.getElementById("search-entry");

  const inputHandler = (event) => {
    setText(event.target.value.toLowerCase());
  };

  const setInputField = (data) => {
    inputField.value = data;
  };

  return (
    <div className="search-bar">
      <input
        type="search"
        name="seach locations"
        id="search-entry"
        onChange={inputHandler}
      />
      <ResultsList text={text} inputField={(text) => setInputField(text)} />
    </div>
  );
};
