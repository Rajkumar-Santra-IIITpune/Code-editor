import React, { useContext, useState, useEffect } from "react";
import { PlaygroundContext } from "../../Providers/PlaygroundProvider";

const languageMap = {
  c: 50,
  cpp: 54,
  rust: 75,
  javascript: 63,
  python: 71,
  java: 62,
};

export const PlaygroundScreen = () => {
  const { folders, currentFile, selectFile, updateFileContent } =
    useContext(PlaygroundContext);
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    if (currentFile) {
      setCode(currentFile.code || "");
      setLanguage(currentFile.language || "javascript");
      setOutput("");
      setInput("");
    }
  }, [currentFile]);

  const handleCodeChange = (e) => {
    const value = e.target.value;
    setCode(value);
    if (currentFile) {
      updateFileContent(currentFile.folderId, currentFile.id, value);
    }
  };

  const runCode = async () => {
    setLoading(true);
    setOutput("");

    // Check if API key is available and valid
    const apiKey = process.env.REACT_APP_JUDGE0_API_KEY;
    if (!apiKey || apiKey === "YOUR_RAPIDAPI_KEY") {
      setOutput("API key is missing or invalid. Please check your .env file and ensure you've replaced 'YOUR_RAPIDAPI_KEY' with your actual API key.");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch(
        "https://judge0-ce.p.rapidapi.com/submissions?base64_encoded=false&wait=true",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Host": "judge0-ce.p.rapidapi.com",
            "X-RapidAPI-Key": apiKey,
          },
          body: JSON.stringify({
            language_id: languageMap[language] || 63,
            source_code: code,
            stdin: input,
          }),
        }
      );

      if (!response.ok) {
        setOutput(
          `API request failed with status ${response.status}: ${response.statusText}`
        );
        setLoading(false);
        return;
      }

      const result = await response.json();
      if (result.stdout) {
        setOutput(result.stdout);
      } else if (result.compile_output) {
        setOutput(result.compile_output);
      } else if (result.stderr) {
        setOutput(result.stderr);
      } else {
        setOutput("No output");
      }
    } catch (error) {
      setOutput("Error running code: " + error.message);
    }
    setLoading(false);
  };

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        backgroundColor: darkMode ? "#1e1e1e" : "#f5f5f5",
        color: darkMode ? "#fff" : "#333",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}>
      {/* File tree panel */}
      <div
        style={{
          width: "250px",
          borderRight: darkMode ? "1px solid #333" : "1px solid #ddd",
          overflowY: "auto",
          backgroundColor: darkMode ? "#252526" : "#fff",
          boxShadow: "2px 0 5px rgba(0,0,0,0.05)",
        }}>
        <h3
          style={{
            padding: "15px 20px",
            margin: 0,
            borderBottom: darkMode ? "1px solid #333" : "1px solid #eee",
            backgroundColor: darkMode ? "#2d2d30" : "#fafafa",
            fontSize: "18px",
            fontWeight: "600",
            color: darkMode ? "#fff" : "#444",
          }}>
          Files
        </h3>
        <div style={{ padding: "10px" }}>
          {folders &&
            folders.map((folder) => (
              <div key={folder.id}>
                <div
                  style={{
                    fontWeight: "600",
                    padding: "8px 12px",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    color: darkMode ? "#fff" : "#555",
                    borderRadius: "4px",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = darkMode ? "#333" : "#f0f0f0"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = "transparent"}>
                  <span
                    className="material-icons"
                    style={{ fontSize: "18px", marginRight: "8px", color: darkMode ? "#aaa" : "#777" }}>
                    folder
                  </span>
                  {folder.title}
                </div>
                <div style={{ paddingLeft: "20px", paddingTop: "5px" }}>
                  {folder.files &&
                    folder.files.map((file) => (
                      <div
                        key={file.id}
                        style={{
                          cursor: "pointer",
                          padding: "6px 12px",
                          backgroundColor:
                            currentFile && file.id === currentFile.id
                              ? darkMode ? "#007acc" : "#e3f2fd"
                              : "transparent",
                          borderRadius: "4px",
                          display: "flex",
                          alignItems: "center",
                          marginTop: "3px",
                          color: darkMode ? "#fff" : "#555",
                          transition: "background-color 0.2s",
                        }}
                        onMouseEnter={(e) => e.target.style.backgroundColor = darkMode ? "#333" : "#f5f5f5"}
                        onMouseLeave={(e) => {
                          if (!(currentFile && file.id === currentFile.id)) {
                            e.target.style.backgroundColor = "transparent";
                          }
                        }}
                        onClick={() =>
                          selectFile && selectFile(folder.id, file.id)
                        }>
                        <span
                          className="material-icons"
                          style={{ fontSize: "16px", marginRight: "8px", color: darkMode ? "#aaa" : "#777" }}>
                          {file.language === "javascript"
                            ? "javascript"
                            : file.language === "python"
                            ? "integration_instructions"
                            : file.language === "java"
                            ? "local_cafe"
                            : file.language === "c" || file.language === "cpp"
                            ? "code"
                            : file.language === "rust"
                            ? "code"
                            : "code"}
                        </span>
                        <span style={{ fontSize: "14px" }}>{file.title}</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
        </div>
      </div>

      {/* Main editor and IO panel */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Header with file info and controls */}
        {currentFile && (
          <div
            style={{
              padding: "12px 20px",
              borderBottom: darkMode ? "1px solid #333" : "1px solid #ddd",
              backgroundColor: darkMode ? "#2d2d30" : "#fff",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              boxShadow: "0 2px 5px rgba(0,0,0,0.05)",
            }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "18px", fontWeight: "600", color: darkMode ? "#fff" : "#333" }}>
                {currentFile.title}
              </h2>
              <p
                style={{
                  margin: "3px 0 0 0",
                  fontSize: "13px",
                  color: darkMode ? "#aaa" : "#777",
                }}>
                {currentFile.folderId &&
                  folders &&
                  folders.find((f) => f.id === currentFile.folderId)
                    ?.title}{" "}
                / {currentFile.title}
              </p>
            </div>
            <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <button
                onClick={() => setDarkMode(!darkMode)}
                style={{
                  backgroundColor: darkMode ? "#555" : "#f0f0f0",
                  color: darkMode ? "#fff" : "#333",
                  border: "none",
                  padding: "4px 10px",
                  borderRadius: "4px",
                  fontSize: "13px",
                  fontWeight: "500",
                  cursor: "pointer",
                }}>
                {darkMode ? "Light Mode" : "Dark Mode"}
              </button>
              <span
                style={{
                  backgroundColor: "#007acc",
                  color: "white",
                  padding: "4px 10px",
                  borderRadius: "4px",
                  fontSize: "13px",
                  fontWeight: "500",
                }}>
                {language}
              </span>
            </div>
          </div>
        )}

        {/* Editor and IO panels */}
        <div style={{ flex: 1, display: "flex", padding: "20px", gap: "20px" }}>
          {/* Code editor */}
          <div style={{ flex: 2, display: "flex", flexDirection: "column" }}>
            <div
              style={{
                backgroundColor: darkMode ? "#2d2d30" : "#fff",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                overflow: "hidden",
                flex: 1,
                display: "flex",
                flexDirection: "column",
              }}>
              <div
                style={{
                  padding: "12px 15px",
                  backgroundColor: darkMode ? "#333" : "#f8f8f8",
                  borderBottom: darkMode ? "1px solid #444" : "1px solid #eee",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                <h3 style={{ margin: 0, fontSize: "15px", color: darkMode ? "#fff" : "#555" }}>Code Editor</h3>
                <div style={{ display: "flex", gap: "10px" }}>
                  <button
                    onClick={runCode}
                    disabled={loading}
                    style={{
                      backgroundColor: "#007acc",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      borderRadius: "4px",
                      cursor: "pointer",
                      fontSize: "13px",
                      fontWeight: "500",
                      transition: "background-color 0.2s",
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = "#005a9e"}
                    onMouseLeave={(e) => e.target.style.backgroundColor = "#007acc"}>
                    {loading ? "Running..." : "Run Code"}
                  </button>
                </div>
              </div>
              <textarea
                value={code}
                onChange={handleCodeChange}
                style={{
                  flex: 1,
                  background: darkMode ? "#1e1e1e" : "#fff",
                  color: darkMode ? "#fff" : "#333",
                  border: "none",
                  fontFamily:
                    'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
                  fontSize: "14px",
                  padding: "15px",
                  resize: "none",
                  outline: "none",
                  lineHeight: "1.5",
                }}
                spellCheck="false"
              />
            </div>
          </div>

          {/* Input and output panels */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              gap: "20px",
            }}>
            {/* Input panel */}
            <div
              style={{
                flex: 1,
                backgroundColor: darkMode ? "#2d2d30" : "#fff",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}>
              <div
                style={{
                  padding: "12px 15px",
                  backgroundColor: darkMode ? "#333" : "#f8f8f8",
                  borderBottom: darkMode ? "1px solid #444" : "1px solid #eee",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                <h3 style={{ margin: 0, fontSize: "15px", color: darkMode ? "#fff" : "#555" }}>Input</h3>
                <button
                  onClick={() => setInput("")}
                  style={{
                    backgroundColor: darkMode ? "#555" : "#f0f0f0",
                    color: darkMode ? "#fff" : "#555",
                    border: "none",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = darkMode ? "#666" : "#e0e0e0"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = darkMode ? "#555" : "#f0f0f0"}>
                  Clear
                </button>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{
                  flex: 1,
                  background: darkMode ? "#1e1e1e" : "#fff",
                  color: darkMode ? "#fff" : "#333",
                  border: "none",
                  fontFamily:
                    'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
                  fontSize: "14px",
                  padding: "15px",
                  resize: "none",
                  outline: "none",
                  lineHeight: "1.5",
                }}
                spellCheck="false"
              />
            </div>

            {/* Output panel */}
            <div
              style={{
                flex: 1,
                backgroundColor: darkMode ? "#2d2d30" : "#fff",
                borderRadius: "8px",
                boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                display: "flex",
                flexDirection: "column",
                overflow: "hidden",
              }}>
              <div
                style={{
                  padding: "12px 15px",
                  backgroundColor: darkMode ? "#333" : "#f8f8f8",
                  borderBottom: darkMode ? "1px solid #444" : "1px solid #eee",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}>
                <h3 style={{ margin: 0, fontSize: "15px", color: darkMode ? "#fff" : "#555" }}>Output</h3>
                <button
                  onClick={() => setOutput("")}
                  style={{
                    backgroundColor: darkMode ? "#555" : "#f0f0f0",
                    color: darkMode ? "#fff" : "#555",
                    border: "none",
                    padding: "4px 8px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    fontSize: "12px",
                    transition: "background-color 0.2s",
                  }}
                  onMouseEnter={(e) => e.target.style.backgroundColor = darkMode ? "#666" : "#e0e0e0"}
                  onMouseLeave={(e) => e.target.style.backgroundColor = darkMode ? "#555" : "#f0f0f0"}>
                  Clear
                </button>
              </div>
              <textarea
                value={output}
                readOnly
                style={{
                  flex: 1,
                  background: darkMode ? "#1e1e1e" : "#fff",
                  color: darkMode ? "#fff" : "#333",
                  border: "none",
                  fontFamily:
                    'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
                  fontSize: "14px",
                  padding: "15px",
                  resize: "none",
                  outline: "none",
                  lineHeight: "1.5",
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
