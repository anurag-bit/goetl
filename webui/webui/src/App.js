import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "./context/ThemeContext";
import Navbar from "./components/layout/Navbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import JobForm from "./pages/JobForm";
import JobResult from "./pages/JobResult";
import Documentation from "./pages/Documentation";
import NotFound from "./pages/NotFound";
import SystemStatus from "./pages/SystemStatus";

function App() {
  const [apiStatus, setApiStatus] = useState("checking");

  // Check API connectivity on startup and at regular intervals
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        setApiStatus("checking"); // Set status to checking during request
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout
        
        const response = await fetch("/api/ping", { 
          signal: controller.signal,
          headers: { 'Cache-Control': 'no-cache' }
        });
        
        clearTimeout(timeoutId);
        
        if (response.ok) {
          const data = await response.json();
          console.log("API connected, version:", data.version);
          setApiStatus("connected");
        } else {
          console.warn("API returned error status:", response.status);
          setApiStatus("error");
        }
      } catch (err) {
        console.error("API connection error:", err);
        setApiStatus("error");
      }
    };
    
    // Check immediately on mount
    checkApiStatus();
    
    // Then check periodically
    const interval = setInterval(checkApiStatus, 30000); // Check every 30 seconds
    
    // Clean up interval on component unmount
    return () => clearInterval(interval);
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <div className="app-container">
          <Navbar apiStatus={apiStatus} />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/job/new" element={<JobForm />} />
              <Route path="/job/result/:id" element={<JobResult />} />
              <Route path="/docs" element={<Documentation />} />
              <Route path="/system" element={<SystemStatus />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer version="1.1.0" />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;
