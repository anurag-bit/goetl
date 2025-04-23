import React from "react";
import { Link, useParams, useLocation, Navigate } from "react-router-dom";
import { FiCheck, FiClock, FiFile, FiArrowLeft } from "react-icons/fi";

const JobResult = () => {
  const params = useParams();
  const location = useLocation();
  const result = location.state?.result;
  
  // If no result in state, try to fetch by ID
  // For this example we're just returning to dashboard if not found
  if (!result && params.id !== "latest") {
    // In a real app, you would fetch the job result by ID
    return <Navigate to="/dashboard" />;
  }

  return (
    <div className="container">
      <div className="page-header">
        <h2>ETL Job Result</h2>
        <div className="breadcrumbs">
          <Link to="/dashboard">Dashboard</Link> / <span>Job Result</span>
        </div>
      </div>

      <div className="result-card">
        <div className="result-header success">
          <FiCheck className="result-icon" />
          <h3>{result?.message || "Job Completed"}</h3>
        </div>
        
        <div className="result-details">
          <div className="result-detail">
            <FiFile className="detail-icon" />
            <div>
              <div className="detail-label">Output Path</div>
              <div className="detail-value">{result?.output || result?.outputPath || "Not specified"}</div>
            </div>
          </div>
          
          <div className="result-detail">
            <FiClock className="detail-icon" />
            <div>
              <div className="detail-label">Processing Time</div>
              <div className="detail-value">{result?.elapsed || "Not recorded"}</div>
            </div>
          </div>
        </div>
        
        <div className="result-actions">
          <Link to="/job/new" className="button primary">
            Start New Job
          </Link>
          <Link to="/dashboard" className="button text">
            <FiArrowLeft /> Back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobResult;
