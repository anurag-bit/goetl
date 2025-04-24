import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { FiSun, FiMoon, FiMenu, FiX, FiAlertCircle, FiCheck, FiLoader, FiGlobe } from "react-icons/fi";

const Navbar = ({ apiStatus }) => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "New Job", path: "/job/new" },
    { name: "System Status", path: "/system" },
    { name: "Documentation", path: "/docs" },
    { name: "Project Website", path: "https://anurag-bit.github.io/goetl", external: true, icon: <FiGlobe size={16} /> }
  ];

  // Get appropriate status icon
  const getStatusIcon = () => {
    switch(apiStatus) {
      case "connected": 
        return <FiCheck size={12} />;
      case "checking": 
        return <FiLoader size={12} className="spin-animation" />;
      case "error":
      default: 
        return <FiAlertCircle size={12} />;
    }
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          <span className="logo-icon">📦</span>
          <h1>GOETL</h1>
        </Link>

        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          {navLinks.map((link) => (
            link.external ? 
            <a 
              key={link.path}
              href={link.path}
              className="external-link"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name} {link.icon}
            </a>
            :
            <Link 
              key={link.path}
              to={link.path}
              className={location.pathname === link.path ? 'active' : ''}
              onClick={() => setIsMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
        </div>

        <div className="navbar-right">
          <div className={`api-status ${apiStatus}`}>
            <span className="status-dot"></span>
            {apiStatus === "connected" ? "API Online" : 
             apiStatus === "checking" ? "Connecting..." : "API Offline"}
            <span className="status-icon">{getStatusIcon()}</span>
          </div>

          <button 
            className="theme-toggle" 
            onClick={toggleTheme} 
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? <FiSun /> : <FiMoon />}
          </button>

          <button 
            className="menu-toggle" 
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <FiX /> : <FiMenu />}
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
