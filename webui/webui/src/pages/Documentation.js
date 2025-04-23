import React from "react";

const Documentation = () => {
  return (
    <div className="container documentation">
      <div className="page-header">
        <h2>Documentation</h2>
        <p>Learn how to use GOETL for your ETL workflows</p>
      </div>
      
      <div className="docs-content">
        <aside className="docs-sidebar">
          <nav>
            <ul>
              <li><a href="#getting-started" className="active">Getting Started</a></li>
              <li><a href="#input-formats">Input Formats</a></li>
              <li><a href="#output-formats">Output Formats</a></li>
              <li><a href="#chunking">Text Chunking</a></li>
              <li><a href="#semantic">Semantic Analysis</a></li>
              <li><a href="#api">API Reference</a></li>
              <li><a href="#cli">CLI Reference</a></li>
            </ul>
          </nav>
        </aside>
        
        <main className="docs-main">
          <section id="getting-started">
            <h3>Getting Started</h3>
            <p>GOETL is a utility for extracting text from documents, processing it into chunks suitable for LLM training, and exporting to various formats.</p>
            
            <h4>Quick Start</h4>
            <p>To process a document using the web UI:</p>
            <ol>
              <li>Navigate to the "New Job" page</li>
              <li>Upload or specify the path to your document</li>
              <li>Select your desired output format</li>
              <li>Configure chunking options</li>
              <li>Click "Start ETL Job"</li>
            </ol>
            
            <div className="code-block">
              <pre><code>
{`// CLI Usage Example
goetl -input samples/document.pdf -output data.jsonl -format jsonl -chunksize 200 -overlap 20`}
              </code></pre>
            </div>
          </section>
          
          <section id="input-formats">
            <h3>Input Formats</h3>
            <p>GOETL currently supports these input formats:</p>
            <ul>
              <li><strong>PDF files</strong> - Extract text from PDF documents</li>
              <li><strong>Text files</strong> - Process plain text files directly</li>
              <li><strong>Directories</strong> - For semantic codebase analysis</li>
            </ul>
          </section>
          
          <section id="output-formats">
            <h3>Output Formats</h3>
            <p>GOETL can output processed data to:</p>
            <table className="docs-table">
              <thead>
                <tr>
                  <th>Format</th>
                  <th>Description</th>
                  <th>Use Case</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>JSONL</td>
                  <td>JSON Lines format</td>
                  <td>Most LLM training frameworks</td>
                </tr>
                <tr>
                  <td>CSV</td>
                  <td>Comma-separated values</td>
                  <td>Spreadsheets and data analysis</td>
                </tr>
                <tr>
                  <td>PostgreSQL/MySQL</td>
                  <td>SQL databases</td>
                  <td>Relational database storage</td>
                </tr>
                <tr>
                  <td>SQLite</td>
                  <td>File-based SQL</td>
                  <td>Embedded applications</td>
                </tr>
                <tr>
                  <td>MongoDB</td>
                  <td>NoSQL database</td>
                  <td>Document-oriented storage</td>
                </tr>
                <tr>
                  <td>Redis</td>
                  <td>In-memory data store</td>
                  <td>Fast retrieval and caching</td>
                </tr>
              </tbody>
            </table>
          </section>
          
          {/* More documentation sections would follow */}
        </main>
      </div>
    </div>
  );
};

export default Documentation;
