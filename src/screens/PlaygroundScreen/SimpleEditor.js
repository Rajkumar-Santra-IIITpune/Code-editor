import React, { useContext, useState, useEffect } from 'react';
import { PlaygroundContext } from '../../Providers/PlaygroundProvider';

export const SimpleEditor = () => {
  const { folders, currentFile, selectFile, updateFileContent } = useContext(PlaygroundContext);
  const [code, setCode] = useState('');

  useEffect(() => {
    if (currentFile) {
      setCode(currentFile.code || '');
    }
  }, [currentFile]);

  const handleCodeChange = (e) => {
    const value = e.target.value;
    setCode(value);
    if (currentFile) {
      updateFileContent(currentFile.folderId, currentFile.id, value);
    }
  };

  return (
    <div style={{ display: 'flex', height: '100vh', backgroundColor: '#1e1e1e', color: 'white' }}>
      {/* File tree panel */}
      <div style={{ width: '250px', borderRight: '1px solid #333', overflowY: 'auto', backgroundColor: '#252526' }}>
        <h3 style={{ padding: '10px 15px', margin: 0, borderBottom: '1px solid #333' }}>Files</h3>
        <div style={{ padding: '10px' }}>
          {folders.map(folder => (
            <div key={folder.id}>
              <div style={{ 
                fontWeight: 'bold', 
                padding: '5px 0', 
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}>
                <span className="material-icons" style={{ fontSize: '16px', marginRight: '5px' }}>folder</span>
                {folder.title}
              </div>
              <div style={{ paddingLeft: '15px' }}>
                {folder.files.map(file => (
                  <div 
                    key={file.id} 
                    style={{ 
                      cursor: 'pointer', 
                      padding: '5px',
                      backgroundColor: file.id === currentFile?.id ? '#375780' : 'transparent',
                      borderRadius: '3px',
                      display: 'flex',
                      alignItems: 'center',
                      marginTop: '3px'
                    }}
                    onClick={() => selectFile(folder.id, file.id)}
                  >
                    <span className="material-icons" style={{ fontSize: '14px', marginRight: '5px' }}>
                      {file.language === 'javascript' ? 'javascript' : 
                       file.language === 'python' ? 'integration_instructions' : 
                       file.language === 'java' ? 'local_cafe' : 'code'}
                    </span>
                    {file.title}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Code editor panel */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        {currentFile ? (
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
            <div style={{ 
              padding: '10px 15px', 
              borderBottom: '1px solid #333', 
              backgroundColor: '#2d2d30',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h2 style={{ margin: 0, fontSize: '16px' }}>{currentFile.title}</h2>
                <p style={{ margin: '3px 0 0 0', fontSize: '12px', color: '#aaa' }}>
                  {currentFile.folderId && folders.find(f => f.id === currentFile.folderId)?.title} / {currentFile.title}
                </p>
              </div>
              <div>
                <span style={{ 
                  backgroundColor: '#007acc', 
                  padding: '3px 8px', 
                  borderRadius: '3px', 
                  fontSize: '12px' 
                }}>
                  {currentFile.language}
                </span>
              </div>
            </div>
            <textarea
              value={code}
              onChange={handleCodeChange}
              style={{
                flex: 1,
                background: '#1e1e1e',
                color: '#d4d4d4',
                border: 'none',
                fontFamily: 'Consolas, Monaco, "Andale Mono", "Ubuntu Mono", monospace',
                fontSize: '14px',
                padding: '10px',
                resize: 'none',
                outline: 'none'
              }}
              spellCheck="false"
            />
          </div>
        ) : (
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            height: '100%', 
            flexDirection: 'column'
          }}>
            <h2>No file selected</h2>
            <p>Please select a file from the file tree to start editing</p>
          </div>
        )}
      </div>
    </div>
  );
};
