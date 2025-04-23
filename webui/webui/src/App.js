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
import "./App.css";

function App() {
  const [apiStatus, setApiStatus] = useState("checking");

  // Check API connectivity on startup
  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        const response = await fetch("/api/ping");
        if (response.ok) {
          setApiStatus("connected");
        } else {
          setApiStatus("error");
        }
      } catch (err) {
        console.error("API connection error:", err);
        setApiStatus("error");
      }
    };
    
    checkApiStatus();
    const interval = setInterval(checkApiStatus, 30000);
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
