import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FiUpload, FiDatabase, FiSettings, FiSave } from "react-icons/fi";
import ProgressSteps from "../components/ui/ProgressSteps";
import FormatSelector from "../components/form/FormatSelector";
import Alert from "../components/ui/Alert";

const JobForm = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState(0);
  const [animateFields, setAnimateFields] = useState(Array(8).fill(false));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [activeStep, setActiveStep] = useState(0);
  const [progress, setProgress] = useState(0);

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

  const isDBFormat = ['postgres', 'mysql', 'mongodb', 'redis'].includes(form.format);
  
  // Form validation
  const [formValid, setFormValid] = useState({
    input: false,
    output: true,
    dburl: true,
    overall: false
  });

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

  // Form validation
  useEffect(() => {
    setFormValid(prev => ({
      ...prev,
      input: form.input.trim().length > 0,
      dburl: !isDBFormat || (isDBFormat && form.dburl.trim().length > 0),
    }));
  }, [form, isDBFormat]);

  useEffect(() => {
    setFormValid(prev => ({
      ...prev,
      overall: prev.input && prev.output && prev.dburl
    }));
  }, [formValid.input, formValid.output, formValid.dburl]);

  // Update DB fields visibility
  useEffect(() => {
    if (isDBFormat && !form.dburl) {
      setFormValid(prev => ({ ...prev, dburl: false }));
    }
  }, [form.format, form.dburl, isDBFormat]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value
    }));
    
    // Clear error when user makes changes
    if (error) setError("");
  };

  const selectFormat = (format) => {
    setForm(prev => ({ ...prev, format }));
  };

  // File drag and drop handlers
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
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formValid.overall) {
      if (!formValid.input) {
        setError("Input path is required");
      } else if (!formValid.dburl && isDBFormat) {
        setError("Database URL is required for selected format");
      }
      return;
    }
    
    setLoading(true);
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
      
      if (data.status === "success") {
        // Navigate to the result page with the job result
        navigate("/job/result/latest", { state: { result: data } });
      } else {
        setError(data.message || data.error || "Unknown error");
        setActiveStep(0);
        setProgress(0);
      }
    } catch (err) {
      setError(err.message || "Failed to connect to server");
      setActiveStep(0);
      setProgress(0);
    } finally {
      setLoading(false);
    }
  };

  const steps = [
    { label: "Configure", completed: activeStep > 0 },
    { label: "Extract", completed: activeStep > 1 },
    { label: "Process", completed: activeStep > 2 },
    { label: "Load", completed: activeStep > 3 }
  ];

  const formSections = [
    { id: 'input', title: 'Input Source', icon: <FiUpload /> },
    { id: 'output', title: 'Output Format', icon: <FiDatabase /> },
    { id: 'options', title: 'Processing Options', icon: <FiSettings /> },
  ];

  const nextSection = () => {
    if (activeSection < formSections.length - 1) {
      setActiveSection(activeSection + 1);
    }
  };

  const prevSection = () => {
    if (activeSection > 0) {
      setActiveSection(activeSection - 1);
    }
  };

  if (loading) {
    return (
      <div className="container processing-container">
        <h2>Processing ETL Job</h2>
        <ProgressSteps steps={steps} activeStep={activeStep} />
        
        <div className="loading-indicator">
          <div className="loading-spinner"></div>
          <h3>Processing {steps[activeStep].label} Step...</h3>
          <p>This might take a moment depending on the file size.</p>
          <div className="progress-bar-container">
            <div 
              className="progress-bar-fill" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="page-header">
        <h2>Create ETL Job</h2>
        <p>Configure your extraction, transformation and loading settings</p>
      </div>

      <div className="form-sections">
        <div className="form-section-tabs">
          {formSections.map((section, index) => (
            <button
              key={section.id}
              className={`section-tab ${activeSection === index ? 'active' : ''} ${formValid[section.id] ? 'valid' : ''}`}
              onClick={() => setActiveSection(index)}
            >
              <span className="section-icon">{section.icon}</span>
              <span>{section.title}</span>
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit} className="job-form">
          {/* Input Section */}
          <div className={`form-section ${activeSection === 0 ? 'active' : ''}`}>
            <h3>Input Configuration</h3>
            
            <div 
              className={`form-group full-width drop-zone ${isDragging ? 'drag-active' : ''}`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
            >
              <label>Input File/Directory Path {isDragging && <span>(Drop file here)</span>}</label>
              <div className="input-with-icon">
                <FiUpload className="input-icon" />
                <input 
                  name="input" 
                  value={form.input} 
                  onChange={handleChange} 
                  placeholder="e.g., /path/to/input.pdf or /path/to/directory"
                />
              </div>
              <div className="hint">
                Supported file types: PDF, TXT, or directory for semantic analysis
              </div>
            </div>
            
            <div className="form-group">
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
              
              {form.semantic && (
                <div className="form-group semantic-options">
                  <label>Semantic Graph Output Path</label>
                  <input 
                    name="semanticout" 
                    value={form.semanticout} 
                    onChange={handleChange} 
                  />
                </div>
              )}
            </div>

            <div className="form-group">
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
            
            <div className="section-nav">
              <div></div>
              <button type="button" className="button secondary" onClick={nextSection}>
                Continue to Output
              </button>
            </div>
          </div>
          
          {/* Output Section */}
          <div className={`form-section ${activeSection === 1 ? 'active' : ''}`}>
            <h3>Output Configuration</h3>
            
            <div className="form-group">
              <label>Output Format</label>
              <FormatSelector 
                selected={form.format} 
                onSelect={selectFormat} 
              />
            </div>
            
            <div className="form-group">
              <label>Output Path</label>
              <div className="input-with-icon">
                <FiSave className="input-icon" />
                <input 
                  name="output" 
                  value={form.output} 
                  onChange={handleChange} 
                  placeholder="e.g., output/data.jsonl"
                />
              </div>
            </div>
            
            {isDBFormat && (
              <div className="form-group">
                <label>Database URL</label>
                <div className="input-with-icon">
                  <FiDatabase className="input-icon" />
                  <input 
                    name="dburl" 
                    value={form.dburl} 
                    onChange={handleChange} 
                    placeholder={`e.g., ${form.format === 'mongodb' ? 'mongodb://localhost:27017/db' : 'user:pass@localhost:5432/db'}`}
                  />
                </div>
                <div className="hint">
                  Connection string for your {form.format} database
                </div>
              </div>
            )}
            
            <div className="section-nav">
              <button type="button" className="button text" onClick={prevSection}>
                Back to Input
              </button>
              <button type="button" className="button secondary" onClick={nextSection}>
                Continue to Options
              </button>
            </div>
          </div>
          
          {/* Options Section */}
          <div className={`form-section ${activeSection === 2 ? 'active' : ''}`}>
            <h3>Processing Options</h3>
            
            <div className="form-group">
              <label>Chunk Size (tokens)</label>
              <input 
                name="chunksize" 
                type="number" 
                value={form.chunksize} 
                onChange={handleChange} 
                min="1"
              />
              <div className="hint">Number of tokens per chunk</div>
            </div>
            
            <div className="form-group">
              <label>Chunk Overlap (tokens)</label>
              <input 
                name="overlap" 
                type="number" 
                value={form.overlap} 
                onChange={handleChange} 
                min="0"
              />
              <div className="hint">Overlap between consecutive chunks</div>
            </div>
            
            <div className="form-group full-width">
              <label>Instruction Template</label>
              <textarea 
                name="instruction" 
                value={form.instruction} 
                onChange={handleChange} 
                placeholder="Use %d to represent chunk number"
                rows="2"
              />
              <div className="hint">Template for instructions in JSONL format. Use %d for chunk number.</div>
            </div>
            
            {error && <Alert type="error" message={error} />}
            
            <div className="section-nav">
              <button type="button" className="button text" onClick={prevSection}>
                Back to Output
              </button>
              <button 
                type="submit" 
                className="button primary" 
                disabled={!formValid.overall}
              >
                Start ETL Job
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default JobForm;
