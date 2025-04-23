import React from "react";
import { Link } from "react-router-dom";
import { FiFileText, FiDatabase, FiCode } from "react-icons/fi";
import FeatureCard from "../components/ui/FeatureCard";

const Home = () => {
  return (
    <div className="home-page">
      <section className="hero">
        <div className="hero-content">
          <h1>ETL Pipeline for LLM Training Data</h1>
          <p className="hero-tagline">
            Extract text from documents, transform into chunks, and load into various formats for LLM training and fine-tuning.
          </p>
          <div className="hero-buttons">
            <Link to="/job/new" className="button primary">Start ETL Job</Link>
            <Link to="/dashboard" className="button secondary">View Dashboard</Link>
          </div>
        </div>
        <div className="hero-image">
          <img src="/assets/etl-diagram.svg" alt="ETL Process Diagram" />
        </div>
      </section>

      <section className="features">
        <h2>Key Features</h2>
        <div className="feature-grid">
          <FeatureCard 
            icon={<FiFileText />}
            title="Extract"
            description="Extract text from PDF and TXT files with OCR support."
          />
          <FeatureCard 
            icon={<FiCode />}
            title="Transform"
            description="Clean, tokenize, and chunk text for optimal training."
          />
          <FeatureCard 
            icon={<FiDatabase />}
            title="Load"
            description="Export to JSONL, CSV, or databases like PostgreSQL, MongoDB, Redis."
          />
        </div>
      </section>
      
      <section className="workflow">
        <h2>Simple Workflow</h2>
        <div className="workflow-steps">
          <div className="step">
            <div className="step-number">1</div>
            <div className="step-content">
              <h3>Configure</h3>
              <p>Select your input file, output format and configure chunking options.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <div className="step-content">
              <h3>Process</h3>
              <p>Our system extracts, cleans, and processes your text documents.</p>
            </div>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <div className="step-content">
              <h3>Use</h3>
              <p>Get your training data in the format you need for your LLM projects.</p>
            </div>
          </div>
        </div>
        <div className="cta-container">
          <Link to="/job/new" className="button primary">Start Now</Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
