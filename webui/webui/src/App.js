import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [form, setForm] = useState({
    input: "",
    output: "output/data.jsonl",
    chunksize: 200,
    overlap: 20,
    format: "jsonl",
    dburl: "",
    instruction: "Please summarize the following text chunk #%d.",
    parse: false,
    semantic: false,
    semanticout: "output/semantic_graph.json",
  });
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [activeStep, setActiveStep] = useState(0);
  const [showDBFields, setShowDBFields] = useState(false);
  const [formTouched, setFormTouched] = useState(false);
  const [formValid, setFormValid] = useState(false);
  const [animateFields, setAnimateFields] = useState(Array(8).fill(false));
  const [progress, setProgress] = useState(0);
  const [isDragging, setIsDragging] = useState(false);

  const isDBFormat = ['postgres', 'mysql', 'mongodb', 'redis'].includes(form.format);

  // Sequentially animate form fields on mount
  useEffect(() => {
    const timeout = setTimeout(() => {
      const sequence = [...animateFields];
      for (let i = 0; i < sequence.length; i++) {
        setTimeout(() => {
          setAnimateFields(prev => {
            const newState = [...prev];
            newState[i] = true;
            return newState;
          });
        }, i * 100);
      }
    }, 300);
    return () => clearTimeout(timeout);
  }, []);

  // Update DB fields visibility when format changes
  useEffect(() => {
    setShowDBFields(isDBFormat);
  }, [form.format]);

  // Form validation
  useEffect(() => {
    if (form.input.trim()) {
      setFormValid(true);
    } else {
      setFormValid(false);
    }
    if (formTouched && !form.input.trim()) {
      setError("Input path is required");
    } else {
      setError("");
    }
  }, [form, formTouched]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    setFormTouched(true);
  };

  const selectFormat = (format) => {
    setForm((prev) => ({ ...prev, format }));
    // Add subtle animation feedback
    const formatItems = document.querySelectorAll('.format-option');
    formatItems.forEach(item => {
      item.style.transition = 'all 0.3s';
    });
  };

  // File drag and drop handler
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const filePath = files[0].path;
      if (filePath) {
        setForm(prev => ({ ...prev, input: filePath }));
        setFormTouched(true);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValid) {
      setFormTouched(true);
      return;
    }
    
    setLoading(true);
    setResult(null);
    setError("");
    setActiveStep(1);
    setProgress(25);
    
    try {
      // Simulate ETL process steps with progress updates
      await new Promise(r => setTimeout(r, 700)); // Extraction
      setActiveStep(2);
      setProgress(50);
      
      await new Promise(r => setTimeout(r, 700)); // Processing
      setActiveStep(3);
      setProgress(75);
      
      const res = await fetch("/api/etl", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      
      const data = await res.json();
      setActiveStep(4);
      setProgress(100);
      
      if (data.status === "success") setResult(data);
      else setError(data.message || data.error || "Unknown error");
    } catch (err) {
      setError(err.message);
      setActiveStep(0);
      setProgress(0);
    }
    
    setLoading(false);
  };

  const resetForm = () => {
    setResult(null);
    setError("");
    setActiveStep(0);
    setProgress(0);
  };

  const formatOptions = [
    { value: 'jsonl', label: 'JSONL', icon: '📄' },
    { value: 'csv', label: 'CSV', icon: '📊' },
    { value: 'postgres', label: 'PostgreSQL', icon: '🐘' },
    { value: 'mysql', label: 'MySQL', icon: '🐬' },
    { value: 'sqlite', label: 'SQLite', icon: '📱' },
    { value: 'mongodb', label: 'MongoDB', icon: '🍃' },
    { value: 'redis', label: 'Redis', icon: '🔵' }
  ];

  const steps = [
    { label: "Configure", completed: activeStep > 0 },
    { label: "Extract", completed: activeStep > 1 },
    { label: "Process", completed: activeStep > 2 },
    { label: "Load", completed: activeStep > 3 }
  ];

  return (
    <div className="container">
      <div className="header">
        <div className="logo">
          <span className="logo-icon">📦</span>
          <h1>GOETL</h1>
        </div>
        <div>ETL for LLM Dataset Preparation</div>
      </div>

      <div className="progress-indicator">
        {steps.map((step, index) => (
          <div 
            key={index} 
            className={`step ${index === activeStep ? 'active' : ''} ${step.completed ? 'completed' : ''}`}
          >
            <div className="step-number">{index + 1}</div>
            <div className="step-label">{step.label}</div>
          </div>
        ))}
      </div>

      {loading ? (
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <h3>Processing {steps[activeStep].label} Step...</h3>
          <p>This might take a moment depending on the file size.</p>
          <div style={{
            width: '100%',
            height: '8px',
            backgroundColor: '#e0e0e0',
            borderRadius: '4px',
            margin: '20px 0'
          }}>
            <div style={{
              width: `${progress}%`,
              height: '100%',
              backgroundColor: 'var(--primary)',
              borderRadius: '4px',
              transition: 'width 0.5s ease'
            }}></div>
          </div>
        </div>
      ) : result ? (
        <div className="card success-card">
          <h3>✅ ETL Job Completed</h3>
          <p><strong>Message:</strong> {result.message}</p>
          <p><strong>Output Path:</strong> {result.output}</p>
          <p><strong>Processing Time:</strong> {result.elapsed}</p>
          <button onClick={resetForm}>Start New Job</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="form-grid">
            <div 
              className={`form-group full-width ${animateFields[0] ? 'animate-in' : ''} ${isDragging ? 'drag-active' : ''}`}
              style={{
                animation: animateFields[0] ? 'fadeIn 0.5s forwards' : 'none',
                opacity: animateFields[0] ? 1 : 0,
                border: isDragging ? '2px dashed var(--primary)' : 'none',
                borderRadius: '6px',
                padding: isDragging ? '10px' : '0'
              }}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <label>Input File/Directory Path {isDragging && <span>(Drop file here)</span>}</label>
              <input 
                name="input" 
                value={form.input} 
                onChange={handleChange} 
                required 
                placeholder="e.g., /path/to/input.pdf or /path/to/directory"
              />
            </div>
            
            <div 
              className="form-group"
              style={{
                animation: animateFields[1] ? 'fadeIn 0.5s forwards' : 'none',
                opacity: animateFields[1] ? 1 : 0
              }}
            >
              <label>Output Format</label>
              <div className="format-options">
                {formatOptions.map(option => (
                  <div
                    key={option.value}
                    className={`format-option ${form.format === option.value ? 'selected' : ''}`}
                    onClick={() => selectFormat(option.value)}
                  >
                    <div className="icon">{option.icon}</div>
                    <div>{option.label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div 
              className="form-group"
              style={{
                animation: animateFields[2] ? 'fadeIn 0.5s forwards' : 'none',
                opacity: animateFields[2] ? 1 : 0
              }}
            >
              <label>Output Path</label>
              <input 
                name="output" 
                value={form.output} 
                onChange={handleChange} 
                placeholder="e.g., output/data.jsonl"
              />
            </div>

            {showDBFields && (
              <div 
                className="form-group"
                style={{
                  animation: 'slideIn 0.3s forwards',
                }}
              >
                <label>Database URL</label>
                <input 
                  name="dburl" 
                  value={form.dburl} 
                  onChange={handleChange} 
                  placeholder={`e.g., ${form.format === 'mongodb' ? 'mongodb://localhost:27017/db' : 'user:pass@localhost:5432/db'}`}
                />
              </div>
            )}

            <div 
              className="form-group"
              style={{
                animation: animateFields[3] ? 'fadeIn 0.5s forwards' : 'none',
                opacity: animateFields[3] ? 1 : 0
              }}
            >
              <label>Chunk Size (tokens)</label>
              <input 
                name="chunksize" 
                type="number" 
                value={form.chunksize} 
                onChange={handleChange} 
                min="1"
              />
            </div>

            <div 
              className="form-group"
              style={{
                animation: animateFields[4] ? 'fadeIn 0.5s forwards' : 'none',
                opacity: animateFields[4] ? 1 : 0
              }}
            >
              <label>Chunk Overlap (tokens)</label>
              <input 
                name="overlap" 
                type="number" 
                value={form.overlap} 
                onChange={handleChange} 
                min="0"
              />
            </div>

            <div 
              className="form-group full-width"
              style={{
                animation: animateFields[5] ? 'fadeIn 0.5s forwards' : 'none',
                opacity: animateFields[5] ? 1 : 0
              }}
            >
              <label>Instruction Template</label>
              <input 
                name="instruction" 
                value={form.instruction} 
                onChange={handleChange} 
                placeholder="Use %d to represent chunk number"
              />
            </div>

            <div 
              className="form-group"
              style={{
                animation: animateFields[6] ? 'fadeIn 0.5s forwards' : 'none',
                opacity: animateFields[6] ? 1 : 0
              }}
            >
              <div className="checkbox-group">
                <input 
                  name="parse" 
                  type="checkbox" 
                  checked={form.parse} 
                  onChange={handleChange} 
                  id="parse-checkbox"
                />
                <label htmlFor="parse-checkbox">Parse & Analyze Text</label>
              </div>
            </div>

            <div 
              className="form-group"
              style={{
                animation: animateFields[7] ? 'fadeIn 0.5s forwards' : 'none',
                opacity: animateFields[7] ? 1 : 0
              }}
            >
              <div className="checkbox-group">
                <input 
                  name="semantic" 
                  type="checkbox" 
                  checked={form.semantic} 
                  onChange={handleChange} 
                  id="semantic-checkbox"
                />
                <label htmlFor="semantic-checkbox">Semantic Analysis (Directories)</label>
              </div>
            </div>

            {form.semantic && (
              <div 
                className="form-group full-width"
                style={{ animation: 'slideIn 0.3s forwards' }}
              >
                <label>Semantic Graph Output Path</label>
                <input 
                  name="semanticout" 
                  value={form.semanticout} 
                  onChange={handleChange} 
                />
              </div>
            )}
          </div>

          {error && (
            <div className="card error-card" style={{ animation: 'scaleIn 0.3s forwards' }}>
              <strong>Error:</strong> {error}
            </div>
          )}

          <div style={{ marginTop: "2rem", textAlign: "center" }}>
            <button 
              type="submit" 
              disabled={loading || !formValid}
              style={{ animation: animateFields[7] ? 'fadeIn 0.5s forwards' : 'none' }}
            >
              {loading ? "Processing..." : "Start ETL Job"}
            </button>
          </div>
          
          {!formValid && formTouched && (
            <div style={{ textAlign: 'center', color: 'var(--danger)', marginTop: '10px', fontSize: '0.9rem' }}>
              Please provide a valid input path
            </div>
          )}
        </form>
      )}
    </div>
  );
}

export default App;
