import React, { useContext, useState, useEffect } from "react";
import { PlaygroundContext } from "../../Providers/PlaygroundProvider";
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';
import { html } from '@codemirror/lang-html';
import { css } from '@codemirror/lang-css';
import { python } from '@codemirror/lang-python';
import { java } from '@codemirror/lang-java';
import { cpp } from '@codemirror/lang-cpp';
import { materialDark } from '@uiw/codemirror-theme-material';

const languageMap = {
  cpp: 54,
  javascript: 63,
  python: 71,
  java: 62,
};

const getLanguageExtension = (language) => {
  switch (language) {
    case 'javascript':
      return javascript();
    case 'html':
      return html();
    case 'css':
      return css();
    case 'python':
      return python();
    case 'java':
      return java();
    case 'cpp':
      return cpp();
    default:
      return javascript();
  }
};

export const PlaygroundScreen = () => {
  const { folders, currentFile, selectFile, updateFileContent } =
    useContext(PlaygroundContext);
  const [code, setCode] = useState("");
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentFile) {
      setCode(currentFile.code || "");
      setLanguage(currentFile.language || "javascript");
      setOutput("");
      setInput("");
    }
  }, [currentFile]);

  const handleCodeChange = (value) => {
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
        backgroundColor: "#1e1e1e",
        color: "white",
      }}>
      {/* File tree panel */}
      <div
        style={{
          width: "250px",
          borderRight: "1px solid #333",
          overflowY: "auto",
          backgroundColor: "#252526",
        }}>
        <h3
          style={{
            padding: "10px 15px",
            margin: 0,
            borderBottom: "1px solid #333",
          }}>
          Files
        </h3>
        <div style={{ padding: "10px" }}>
          {folders &&
            folders.map((folder) => (
              <div key={folder.id}>
                <div
                  style={{
                    fontWeight: "bold",
                    padding: "5px 0",
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                  }}>
                  <span
                    className="material-icons"
                    style={{ fontSize: "16px", marginRight: "5px" }}>
                    folder
                  </span>
                  {folder.title}
                </div>
                <div style={{ paddingLeft: "15px" }}>
                  {folder.files &&
                    folder.files.map((file) => (
                      <div
                        key={file.id}
                        style={{
                          cursor: "pointer",
                          padding: "5px",
                          backgroundColor:
                            currentFile && file.id === currentFile.id
                              ? "#375780"
                              : "transparent",
                          borderRadius: "3px",
                          display: "flex",
                          alignItems: "center",
                          marginTop: "3px",
                        }}
                        onClick={() =>
                          selectFile && selectFile(folder.id, file.id)
                        }>
                        <span
                          className="material-icons"
                          style={{ fontSize: "14px", marginRight: "5px" }}>
                          {file.language === "javascript"
                            ? "javascript"
                            : file.language === "python"
                            ? "integration_instructions"
                            : file.language === "java"
                            ? "local_cafe"
                            : "code"}
                        </span>
                        {file.title}
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
              padding: "10px 15px",
              borderBottom: "1px solid #333",
              backgroundColor: "#2d2d30",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}>
            <div>
              <h2 style={{ margin: 0, fontSize: "16px" }}>
                {currentFile.title}
              </h2>
              <p
                style={{
                  margin: "3px 0 0 0",
                  fontSize: "12px",
                  color: "#aaa",
                }}>
                {currentFile.folderId &&
                  folders &&
                  folders.find((f) => f.id === currentFile.folderId)
                    ?.title}{" "}
                / {currentFile.title}
              </p>
            </div>
            <div>
              <span
                style={{
                  backgroundColor: "#007acc",
                  padding: "3px 8px",
                  borderRadius: "3px",
                  fontSize: "12px",
                }}>
                {language}
              </span>
            </div>
          </div>
        )}

        {/* Editor and IO panels */}
        <div style={{ flex: 1, display: "flex" }}>
          {/* Code editor */}
          <div style={{ flex: 2 }}>
            <CodeMirror
              value={code}
              height="100%"
              extensions={[getLanguageExtension(language)]}
              onChange={handleCodeChange}
              theme={materialDark}
              style={{
                height: "100%",
                fontSize: "14px",
              }}
            />
          </div>

          {/* Input and output panels */}
          <div
            style={{
              flex: 1,
              display: "flex",
              flexDirection: "column",
              borderLeft: "1px solid #333",
            }}>
            <div
              style={{
                flex: 1,
                padding: "10px",
                borderBottom: "1px solid #333",
              }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "5px",
                }}>
                <strong>Input:</strong>
                <button onClick={() => setInput("")}>Clear Input</button>
              </div>
              <textarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                style={{
                  width: "100%",
                  height: "100%",
                  background: "#252526",
                  color: "#d4d4d4",
                  border: "none",
                  fontFamily:
                    'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
                  fontSize: "14px",
                  padding: "10px",
                  resize: "none",
                  outline: "none",
                }}
                spellCheck="false"
              />
            </div>
            <div style={{ flex: 1, padding: "10px" }}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: "5px",
                }}>
                <strong>Output:</strong>
                <button onClick={() => setOutput("")}>Clear Output</button>
              </div>
              <textarea
                value={output}
                readOnly
                style={{
                  width: "100%",
                  height: "100%",
                  background: "#252526",
                  color: "#d4d4d4",
                  border: "none",
                  fontFamily:
                    'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
                  fontSize: "14px",
                  padding: "10px",
                  resize: "none",
                  outline: "none",
                }}
              />
            </div>
          </div>
        </div>

        {/* Run button */}
        <div
          style={{
            padding: "10px",
            borderTop: "1px solid #333",
            backgroundColor: "#2d2d30",
            textAlign: "right",
          }}>
          <button
            onClick={runCode}
            style={{
              backgroundColor: "#007acc",
              color: "white",
              border: "none",
              padding: "8px 16px",
              borderRadius: "4px",
              cursor: "pointer",
            }}
            disabled={loading}>
            {loading ? "Running..." : "Run Code"}
          </button>
        </div>
      </div>
    </div>
  );
};
