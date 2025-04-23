import React, { useContext, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ThemeContext } from "../../context/ThemeContext";
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";

const Navbar = ({ apiStatus = "connected" }) => {
  const { isDarkMode, toggleTheme } = useContext(ThemeContext) || { isDarkMode: false, toggleTheme: () => {} };
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Dashboard", path: "/dashboard" },
    { name: "New Job", path: "/job/new" },
    { name: "Documentation", path: "/docs" }
  ];

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <Link to="/" className="logo">
          <span className="logo-icon">📦</span>
          <h1>GOETL</h1>
        </Link>

        <div className={`navbar-links ${isMenuOpen ? 'active' : ''}`}>
          {navLinks.map((link) => (
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
          </div>

          <button 
            className="theme-toggle" 
            onClick={toggleTheme} 
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
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
