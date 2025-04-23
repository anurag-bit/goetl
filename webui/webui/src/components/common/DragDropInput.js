import React, { useState, useRef } from "react";
import { FiUploadCloud, FiFile, FiX } from "react-icons/fi";

const DragDropInput = ({ onFileSelected, acceptedTypes = ".pdf,.txt", label = "Drop files here" }) => {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState([]);
  const fileInputRef = useRef(null);
  
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };
  
  const handleDragLeave = () => {
    setIsDragging(false);
  };
  
  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    handleFiles(droppedFiles);
  };
  
  const handleFileInputChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    handleFiles(selectedFiles);
  };
  
  const handleFiles = (newFiles) => {
    setFiles(newFiles);
    
    if (onFileSelected) {
      onFileSelected(newFiles);
    }
  };
  
  const removeFile = (index) => {
    const updatedFiles = [...files];
    updatedFiles.splice(index, 1);
    setFiles(updatedFiles);
    
    if (onFileSelected) {
      onFileSelected(updatedFiles);
    }
  };
  
  const openFileDialog = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };
  
  return (
    <div className="drag-drop-container">
      <div 
        className={`drag-drop-area ${isDragging ? 'dragging' : ''} ${files.length > 0 ? 'has-files' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={openFileDialog}
      >
        <input 
          type="file"
          ref={fileInputRef}
          className="file-input"
          onChange={handleFileInputChange}
          accept={acceptedTypes}
          multiple={false}
        />
        
        <div className="drag-drop-content">
          <div className="upload-icon">
            <FiUploadCloud />
          </div>
          <div className="upload-text">
            <strong>{label}</strong>
            <span>or click to browse files</span>
          </div>
          <div className="upload-hint">
            Supported formats: {acceptedTypes.replace(/\./g, '').replace(/,/g, ', ')}
          </div>
        </div>
      </div>
      
      {files.length > 0 && (
        <div className="file-list">
          {files.map((file, index) => (
            <div key={index} className="file-item">
              <div className="file-icon"><FiFile /></div>
              <div className="file-name">{file.name}</div>
              <div className="file-size">{(file.size / 1024).toFixed(1)} KB</div>
              <button 
                className="file-remove"
                onClick={(e) => {
                  e.stopPropagation();
                  removeFile(index);
                }}
              >
                <FiX />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DragDropInput;
