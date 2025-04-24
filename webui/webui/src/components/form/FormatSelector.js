import React from "react";
import { 
  FiFileText, 
  FiDatabase, 
  FiServer, 
  FiHardDrive, 
  FiLayers, 
  FiCpu, 
  FiAlertTriangle 
} from "react-icons/fi";

const FormatSelector = ({ selected, onSelect }) => {
  const formats = [
    { id: "jsonl", name: "JSONL", icon: <FiFileText /> },
    { id: "csv", name: "CSV", icon: <FiFileText /> },
    { id: "postgres", name: "PostgreSQL", icon: <FiDatabase /> },
    { id: "mysql", name: "MySQL", icon: <FiDatabase /> },
    { id: "sqlite", name: "SQLite", icon: <FiHardDrive /> },
    { id: "mongodb", name: "MongoDB", icon: <FiLayers /> },
    { id: "redis", name: "Redis", icon: <FiServer /> },
    { id: "semantic", name: "Semantic", icon: <FiCpu /> }
  ];

  return (
    <div className="format-options">
      {formats.map((format) => (
        <div
          key={format.id}
          className={`format-option ${selected === format.id ? "selected" : ""}`}
          onClick={() => onSelect(format.id)}
        >
          <div className="format-icon">{format.icon}</div>
          <div className="format-name">{format.name}</div>
        </div>
      ))}
    </div>
  );
};

export default FormatSelector;
