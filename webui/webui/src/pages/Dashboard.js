import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { 
  FiPlusCircle, 
  FiFileText, 
  FiCpu, 
  FiActivity, 
  FiSearch,
  FiFilter,
  FiArrowDown,
  FiArrowUp,
  FiCheck,
  FiX,
  FiClock
} from "react-icons/fi";
import StatCard from "../components/ui/StatCard";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    successJobs: 0,
    failedJobs: 0,
    avgProcessingTime: "0s"
  });
  
  const [recentJobs, setRecentJobs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortField, setSortField] = useState("timestamp");
  const [sortDirection, setSortDirection] = useState("desc");
  
  // Mock data - in a real app this would come from an API
  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      const mockJobs = [
        {
          id: "job123",
          inputPath: "/data/sample.pdf",
          format: "jsonl",
          status: "success",
          timestamp: "2023-06-15T14:30:00Z",
          elapsedTime: "1.5s"
        },
        {
          id: "job122",
          inputPath: "/data/code/",
          format: "semantic",
          status: "success",
          timestamp: "2023-06-14T10:20:00Z",
          elapsedTime: "2.2s"
        },
        {
          id: "job121",
          inputPath: "/data/report.txt",
          format: "postgres",
          status: "failed",
          timestamp: "2023-06-13T09:15:00Z",
          elapsedTime: "-"
        },
        {
          id: "job120",
          inputPath: "/data/dataset.pdf",
          format: "csv",
          status: "success",
          timestamp: "2023-06-12T16:40:00Z",
          elapsedTime: "0.9s"
        },
        {
          id: "job119",
          inputPath: "/data/large-document.pdf",
          format: "mongodb",
          status: "processing",
          timestamp: "2023-06-12T16:35:00Z",
          elapsedTime: "-"
        }
      ];
      
      setRecentJobs(mockJobs);
      setStats({
        totalJobs: 15,
        successJobs: 12,
        failedJobs: 3,
        avgProcessingTime: "1.8s"
      });
      setIsLoading(false);
    }, 800);
  }, []);
  
  // Format date for display
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };
  
  // Handle sorting
  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };
  
  // Filter and sort jobs
  const filteredJobs = recentJobs
    .filter(job => {
      // Apply status filter
      if (statusFilter !== 'all' && job.status !== statusFilter) {
        return false;
      }
      
      // Apply search filter
      if (searchTerm && !job.inputPath.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !job.format.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      return true;
    })
    .sort((a, b) => {
      // Apply sorting
      let comparison = 0;
      
      switch (sortField) {
        case 'timestamp':
          comparison = new Date(a.timestamp) - new Date(b.timestamp);
          break;
        case 'format':
          comparison = a.format.localeCompare(b.format);
          break;
        case 'status':
          comparison = a.status.localeCompare(b.status);
          break;
        case 'elapsedTime':
          // Handle cases where elapsed time might be "-"
          const timeA = a.elapsedTime === "-" ? 0 : parseFloat(a.elapsedTime);
          const timeB = b.elapsedTime === "-" ? 0 : parseFloat(b.elapsedTime);
          comparison = timeA - timeB;
          break;
        case 'inputPath':
          comparison = a.inputPath.localeCompare(b.inputPath);
          break;
        default:
          comparison = 0;
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
  
  const renderSortIcon = (field) => {
    if (sortField !== field) return null;
    return sortDirection === 'asc' ? <FiArrowUp size={14} /> : <FiArrowDown size={14} />;
  };
  
  return (
    <div className="container dashboard-container">
      <div className="page-header with-actions">
        <div>
          <h2>Dashboard</h2>
          <p>Monitor your ETL jobs and system performance</p>
        </div>
        <Link to="/job/new" className="button primary">
          <FiPlusCircle /> New Job
        </Link>
      </div>
      
      <div className="stats-grid">
        <StatCard
          icon={<FiFileText />}
          title="Total Jobs"
          value={stats.totalJobs}
          color="blue"
        />
        <StatCard
          icon={<FiCheck />}
          title="Successful"
          value={stats.successJobs}
          color="green"
        />
        <StatCard
          icon={<FiX />}
          title="Failed"
          value={stats.failedJobs}
          color="orange"
        />
        <StatCard
          icon={<FiClock />}
          title="Avg. Processing"
          value={stats.avgProcessingTime}
          color="purple"
        />
      </div>
      
      <div className="section">
        <h3>Recent Jobs</h3>
        <div className="filters">
          <div className="search search-container">
            <FiSearch className="search-icon" />
            <input 
              type="text" 
              placeholder="Search jobs..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="filter-status">
            <select 
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
            >
              <option value="all">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
              <option value="processing">Processing</option>
            </select>
          </div>
        </div>
        
        <div className="table-container">
          {isLoading ? (
            <div className="loading-indicator">
              <div className="loading-spinner"></div>
              <p>Loading jobs...</p>
            </div>
          ) : (
            <table className="data-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort('inputPath')} style={{ cursor: 'pointer' }}>
                    Input {renderSortIcon('inputPath')}
                  </th>
                  <th onClick={() => handleSort('format')} style={{ cursor: 'pointer' }}>
                    Format {renderSortIcon('format')}
                  </th>
                  <th onClick={() => handleSort('status')} style={{ cursor: 'pointer' }}>
                    Status {renderSortIcon('status')}
                  </th>
                  <th onClick={() => handleSort('elapsedTime')} style={{ cursor: 'pointer' }}>
                    Time {renderSortIcon('elapsedTime')}
                  </th>
                  <th onClick={() => handleSort('timestamp')} style={{ cursor: 'pointer' }}>
                    Processed {renderSortIcon('timestamp')}
                  </th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>
                      No jobs match your criteria
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map(job => (
                    <tr key={job.id}>
                      <td className="truncate" title={job.inputPath}>
                        {job.inputPath}
                      </td>
                      <td>
                        <span className="badge format">
                          {job.format}
                        </span>
                      </td>
                      <td>
                        <span className={`badge status ${job.status}`}>
                          {job.status}
                        </span>
                      </td>
                      <td>{job.elapsedTime}</td>
                      <td>{formatDate(job.timestamp)}</td>
                      <td>
                        <Link to={`/job/result/${job.id}`} className="button small">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
