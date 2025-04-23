import React from "react";
import { Link } from "react-router-dom";
import { FiGithub, FiTwitter, FiBook, FiHelpCircle } from "react-icons/fi";

const Footer = ({ version }) => {
  return (
    <footer className="app-footer">
      <div className="footer-container">
        <div className="footer-section">
          <div className="footer-logo">
            <span className="logo-icon">📦</span>
            <span>GOETL</span>
          </div>
          <div className="footer-version">v{version}</div>
          <div className="footer-tagline">
            Modern ETL for LLM Training Data
          </div>
        </div>
        
        <div className="footer-section">
          <h4>Resources</h4>
          <ul>
            <li><Link to="/docs">Documentation</Link></li>
            <li><a href="https://github.com/anurag-bit/goetl" target="_blank" rel="noopener noreferrer">GitHub Repository</a></li>
            <li><Link to="/docs#api">API Reference</Link></li>
            <li><Link to="/docs#cli">CLI Reference</Link></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/">Home</Link></li>
            <li><Link to="/dashboard">Dashboard</Link></li>
            <li><Link to="/job/new">Create Job</Link></li>
            <li><a href="https://github.com/anurag-bit/goetl/issues" target="_blank" rel="noopener noreferrer">Report Issues</a></li>
          </ul>
        </div>
        
        <div className="footer-section">
          <h4>Connect</h4>
          <div className="social-links">
            <a href="https://github.com/anurag-bit/goetl" target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <FiGithub />
            </a>
            <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter">
              <FiTwitter />
            </a>
            <a href="/docs" aria-label="Documentation">
              <FiBook />
            </a>
            <a href="/docs#support" aria-label="Support">
              <FiHelpCircle />
            </a>
          </div>
        </div>
      </div>
      
      <div className="footer-bottom">
        <div>&copy; {new Date().getFullYear()} GOETL. All rights reserved.</div>
        <div className="footer-links">
          <Link to="/privacy">Privacy</Link>
          <Link to="/terms">Terms</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
