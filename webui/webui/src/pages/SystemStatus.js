import React, { useState, useEffect } from "react";
import { 
  FiCpu, 
  FiHardDrive, 
  FiDatabase, 
  FiServer, 
  FiActivity, 
  FiAlertTriangle,
  FiClock,
  FiRefreshCw,
  FiTerminal
} from "react-icons/fi";

const SystemStatus = () => {
  const [systemData, setSystemData] = useState({
    engineStatus: "operational", // operational, warning, critical, maintenance
    uptime: "23d 07h 12m",
    apiLatency: 32,
    engineVersion: "1.1.0",
    cpuUsage: 23.5,
    memoryUsage: 68.2,
    diskSpace: 42.7,
    activeWorkers: 3,
    queuedJobs: 2,
    jobsProcessed24h: 157,
    lastUpdated: new Date(),
    metrics: {
      successRate: 97.8,
      avgProcessingTime: 1.35,
      throughput: 6.5
    },
    logs: [
      { timestamp: "2025-04-23 09:37:10.025", level: "INFO", message: "Worker #3 completed task ETL-20250423-091" },
      { timestamp: "2025-04-23 09:35:22.417", level: "INFO", message: "Worker #2 completed task ETL-20250423-090" },
      { timestamp: "2025-04-23 09:32:05.301", level: "WARN", message: "High memory usage detected (78%)" },
      { timestamp: "2025-04-23 09:30:11.224", level: "INFO", message: "Worker #1 completed task ETL-20250423-089" },
      { timestamp: "2025-04-23 09:28:57.120", level: "INFO", message: "New job ETL-20250423-091 added to queue" },
    ]
  });

  // Simulate updating system data periodically
  useEffect(() => {
    const interval = setInterval(() => {
      setSystemData(prev => {
        // Update with slight variations to simulate real-time changes
        const cpuDelta = (Math.random() * 5) - 2; // -2 to +3
        const memDelta = (Math.random() * 2) - 0.5; // -0.5 to +1.5
        
        // Random chance to add a new log entry
        let newLogs = [...prev.logs];
        if (Math.random() > 0.7) {
          const logTypes = [
            { level: "INFO", message: `Worker #${Math.floor(Math.random() * 4) + 1} completed task ETL-20250423-${Math.floor(Math.random() * 100)}` },
            { level: "INFO", message: "Periodic health check completed" },
            { level: "WARN", message: "Database connection delay detected" },
            { level: "INFO", message: "Cache flushed successfully" }
          ];
          const randomLog = logTypes[Math.floor(Math.random() * logTypes.length)];
          
          // Add a new log at the beginning and limit to 5 logs
          newLogs.unshift({
            timestamp: new Date().toISOString().replace('T', ' ').substring(0, 23),
            level: randomLog.level,
            message: randomLog.message
          });
          newLogs = newLogs.slice(0, 5);
        }
        
        return {
          ...prev,
          cpuUsage: Math.max(0, Math.min(100, prev.cpuUsage + cpuDelta)).toFixed(1),
          memoryUsage: Math.max(0, Math.min(100, prev.memoryUsage + memDelta)).toFixed(1),
          queuedJobs: Math.max(0, prev.queuedJobs + (Math.random() > 0.8 ? 1 : (Math.random() > 0.6 ? -1 : 0))),
          lastUpdated: new Date(),
          logs: newLogs
        };
      });
    }, 3000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case "operational": return "#00cb51"; // Green
      case "warning": return "#ff9500"; // Amber
      case "critical": return "#ff3b30"; // Red
      case "maintenance": return "#0080ff"; // Blue
      default: return "#00cb51";
    }
  };

  const getStatusCode = (status) => {
    switch(status) {
      case "operational": return "OPERATIONAL [CODE: GREEN]";
      case "warning": return "DEGRADED PERFORMANCE [CODE: AMBER]";
      case "critical": return "SYSTEM ALERT [CODE: RED]";
      case "maintenance": return "SCHEDULED MAINTENANCE [CODE: BLUE]";
      default: return "OPERATIONAL [CODE: GREEN]";
    }
  };

  const getResourceIndicator = (percentage) => {
    const percent = parseFloat(percentage);
    if (percent > 80) return "high";
    if (percent > 50) return "medium";
    return "normal";
  };
  
  const formatTimestamp = () => {
    const now = systemData.lastUpdated;
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')} ${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}:${String(now.getSeconds()).padStart(2, '0')}`;
  };

  return (
    <div className="container system-status military-grade">
      <div className="status-header">
        <div className="header-left">
          <h2>SYSTEM STATUS</h2>
          <div className="system-id">NODE: ETL-PRIME-01 // REGION: US-EAST</div>
        </div>
        <div className="header-right">
          <div className="timestamp-display">
            <div className="timestamp-label">TIMESTAMP</div>
            <div className="timestamp">{formatTimestamp()}</div>
          </div>
          <div className="system-status-indicator" style={{backgroundColor: getStatusColor(systemData.engineStatus)}}>
            <div className="status-code">{getStatusCode(systemData.engineStatus)}</div>
          </div>
        </div>
      </div>
      
      <div className="metrics-grid">
        <div className="metric-panel resource-metrics">
          <div className="panel-header">
            <h3>RESOURCE ALLOCATION</h3>
            <div className="panel-controls">
              <button className="control-button">
                <FiRefreshCw size={14} />
              </button>
            </div>
          </div>
          <div className="resource-metrics-content">
            <div className="resource-metric">
              <div className="resource-info">
                <FiCpu className="resource-icon" />
                <div className="resource-name">CPU UTILIZATION</div>
              </div>
              <div className="resource-bar-container">
                <div 
                  className={`resource-bar ${getResourceIndicator(systemData.cpuUsage)}`} 
                  style={{width: `${systemData.cpuUsage}%`}}
                ></div>
              </div>
              <div className="resource-value">{systemData.cpuUsage}%</div>
            </div>
            
            <div className="resource-metric">
              <div className="resource-info">
                <FiServer className="resource-icon" />
                <div className="resource-name">MEMORY ALLOCATION</div>
              </div>
              <div className="resource-bar-container">
                <div 
                  className={`resource-bar ${getResourceIndicator(systemData.memoryUsage)}`} 
                  style={{width: `${systemData.memoryUsage}%`}}
                ></div>
              </div>
              <div className="resource-value">{systemData.memoryUsage}%</div>
            </div>
            
            <div className="resource-metric">
              <div className="resource-info">
                <FiHardDrive className="resource-icon" />
                <div className="resource-name">STORAGE CAPACITY</div>
              </div>
              <div className="resource-bar-container">
                <div 
                  className={`resource-bar ${getResourceIndicator(systemData.diskSpace)}`} 
                  style={{width: `${systemData.diskSpace}%`}}
                ></div>
              </div>
              <div className="resource-value">{systemData.diskSpace}%</div>
            </div>
          </div>
        </div>
        
        <div className="metric-panel system-info">
          <div className="panel-header">
            <h3>SYSTEM PARAMETERS</h3>
          </div>
          <div className="system-info-grid">
            <div className="info-item">
              <div className="info-label">ENGINE VERSION</div>
              <div className="info-value">{systemData.engineVersion}</div>
            </div>
            <div className="info-item">
              <div className="info-label">UPTIME</div>
              <div className="info-value">{systemData.uptime}</div>
            </div>
            <div className="info-item">
              <div className="info-label">API LATENCY</div>
              <div className="info-value">{systemData.apiLatency} ms</div>
            </div>
            <div className="info-item">
              <div className="info-label">ACTIVE WORKERS</div>
              <div className="info-value">{systemData.activeWorkers}</div>
            </div>
            <div className="info-item">
              <div className="info-label">QUEUED JOBS</div>
              <div className="info-value">{systemData.queuedJobs}</div>
            </div>
            <div className="info-item">
              <div className="info-label">24H THROUGHPUT</div>
              <div className="info-value">{systemData.jobsProcessed24h}</div>
            </div>
          </div>
        </div>
      </div>
      
      <div className="lower-metrics-grid">
        <div className="metric-panel performance-metrics">
          <div className="panel-header">
            <h3>PERFORMANCE METRICS</h3>
            <div className="panel-id">GRID: A-7</div>
          </div>
          <div className="metrics-inner-grid">
            <div className="metric-box">
              <div className="metric-box-label">SUCCESS RATE</div>
              <div className="metric-box-value">{systemData.metrics.successRate}%</div>
              <div className="metric-trend success">
                <FiActivity size={16} />
              </div>
            </div>
            <div className="metric-box">
              <div className="metric-box-label">AVG PROCESSING</div>
              <div className="metric-box-value">{systemData.metrics.avgProcessingTime}s</div>
              <div className="metric-trend neutral">
                <FiClock size={16} />
              </div>
            </div>
            <div className="metric-box">
              <div className="metric-box-label">THROUGHPUT</div>
              <div className="metric-box-value">{systemData.metrics.throughput}/min</div>
              <div className="metric-trend success">
                <FiDatabase size={16} />
              </div>
            </div>
          </div>
        </div>
        
        <div className="metric-panel system-logs">
          <div className="panel-header">
            <h3>SYSTEM LOGS</h3>
            <div className="panel-controls">
              <button className="control-button">
                <FiTerminal size={14} />
              </button>
            </div>
          </div>
          <div className="log-container">
            <table className="log-table">
              <thead>
                <tr>
                  <th>TIMESTAMP</th>
                  <th>LEVEL</th>
                  <th>MESSAGE</th>
                </tr>
              </thead>
              <tbody>
                {systemData.logs.map((log, index) => (
                  <tr key={index} className={log.level.toLowerCase()}>
                    <td className="log-timestamp">{log.timestamp}</td>
                    <td className="log-level">{log.level}</td>
                    <td className="log-message">{log.message}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div className="footer-banner">
        <div className="footer-section">
          <span className="footer-label">ENGINE ID:</span>
          <span className="footer-value">GOETL-ETL-v{systemData.engineVersion}</span>
        </div>
        <div className="footer-section">
          <span className="footer-label">CLUSTER:</span>
          <span className="footer-value">PRIMARY</span>
        </div>
        <div className="footer-section">
          <span className="footer-label">SECURITY:</span>
          <span className="footer-value">LEVEL 2 (STANDARD)</span>
        </div>
        <div className="footer-section">
          <span className="footer-label">LAST REFRESH:</span>
          <span className="footer-value">{formatTimestamp()}</span>
        </div>
      </div>
    </div>
  );
};

export default SystemStatus;
