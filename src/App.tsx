import React, { useState } from "react";
import Editor from "./editor";
import Renderer from "./renderer";
import "./App.css";

function App() {
  const [currentPath, setCurrentPath] = useState("/editor");

  return (
    <div className="App">
      <nav style={{ marginBottom: 20 }}>
        <button
          onClick={() => setCurrentPath("/editor")}
          style={{
            marginRight: 10,
            padding: "8px 16px",
            backgroundColor: currentPath === "/editor" ? "#007bff" : "#ccc",
            color: currentPath === "/editor" ? "white" : "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Editor
        </button>
        <button
          onClick={() => setCurrentPath("/export")}
          style={{
            padding: "8px 16px",
            backgroundColor: currentPath === "/export" ? "#007bff" : "#ccc",
            color: currentPath === "/export" ? "white" : "black",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Export
        </button>
      </nav>

      {currentPath === "/editor" && <Editor />}
      {currentPath === "/export" && <Renderer />}
    </div>
  );
}

export default App;
