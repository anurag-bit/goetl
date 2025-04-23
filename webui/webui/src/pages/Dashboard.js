import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiPlusCircle, FiFileText, FiCpu, FiActivity } from "react-icons/fi";
import StatCard from "../components/ui/StatCard";

const Dashboard = () => {
  const [stats, setStats] = useState({
    totalJobs: 0,
    successJobs: 0,
    failedJobs: 0,
    avgProcessingTime: "0s"
  });
  
  const [recentJobs, setRecentJobs] = useState([
    // Mock data - in a real app this would come from an API
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
    }
  ]);
  
  // In a real app, fetch this data from an API
  useEffect(() => {
    // Mock data loading
    setTimeout(() => {
      setStats({
        totalJobs: 15,
        successJobs: 12,
        failedJobs: 3,
        avgProcessingTime: "1.8s"
      });
    }, 500);
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
          icon={<FiActivity />}
          title="Success Rate"
          value={`${Math.round((stats.successJobs / stats.totalJobs) * 100 || 0)}%`}
          color="green"
        />
        <StatCard
          icon={<FiCpu />}
          title="Avg. Processing"
          value={stats.avgProcessingTime}
          color="purple"
        />
      </div>
      
      <div className="section">
        <h3>Recent Jobs</h3>
        <div className="table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Input</th>
                <th>Format</th>
                <th>Status</th>
                <th>Time</th>
                <th>Processed</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {recentJobs.map(job => (
                <tr key={job.id} className={job.status}>
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
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
