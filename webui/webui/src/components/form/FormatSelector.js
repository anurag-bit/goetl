import React from "react";
import { 
  FiFileText, 
  FiDatabase, 
  FiServer, 
  FiHardDrive, 
  FiLayers, 
  FiCpu,
  FiActivity
} from "react-icons/fi";

const FormatSelector = ({ selected, onSelect }) => {
  const formats = [
    { id: "jsonl", name: "JSONL", icon: <FiFileText />, description: "JSON Lines format" },
    { id: "csv", name: "CSV", icon: <FiFileText />, description: "Comma-separated values" },
    { id: "postgres", name: "PostgreSQL", icon: <FiDatabase />, description: "SQL database" },
    { id: "mysql", name: "MySQL", icon: <FiDatabase />, description: "SQL database" },
    { id: "sqlite", name: "SQLite", icon: <FiHardDrive />, description: "File-based SQL" },
    { id: "mongodb", name: "MongoDB", icon: <FiLayers />, description: "NoSQL database" },
    { id: "redis", name: "Redis", icon: <FiActivity />, description: "In-memory store" },
  ];

  return (
    <div className="format-selector">
      {formats.map((format) => (
        <div
          key={format.id}
          className={`format-option ${selected === format.id ? "selected" : ""}`}
          onClick={() => onSelect(format.id)}
        >
          <div className="format-icon">{format.icon}</div>
          <div className="format-name">{format.name}</div>
          <div className="format-description">{format.description}</div>
        </div>
      ))}
    </div>
  );
};

export default FormatSelector;
