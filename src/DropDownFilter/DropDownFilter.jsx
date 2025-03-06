import { useState } from "react";
import { ResultsList } from "./ResultsList/ResultsList";
import { SubmitAddLocation } from "./SubmitAddLocation/SubmitAddLocation";
import "./DropDownFilter.css";

export const DropDownFilter = ({ addStation }) => {
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
        className="search-input"
        name="seach locations"
        id="search-entry"
        onChange={inputHandler}
      />
      <ResultsList text={text} inputField={(text) => setInputField(text)} />
      <SubmitAddLocation addStation={addStation} />
    </div>
  );
};
