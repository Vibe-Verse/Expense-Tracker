import React, { useRef } from "react";
import "./DataPanel.css";

const DataPanel = ({ count, onExport, onImport }) => {
  const fileInputRef = useRef(null);

  const handleFile = (event) => {
    const file = event.target.files?.[0];
    if (file) onImport(file);
    event.target.value = "";
  };

  return (
    <div className="data-view">
      <section className="data-card">
        <span className="data-card__icon">⬇️</span>
        <h2>Export to CSV</h2>
        <p>
          Download all <strong>{count}</strong>{" "}
          {count === 1 ? "expense" : "expenses"} as a spreadsheet-ready CSV file.
        </p>
        <button type="button" className="primary-btn" onClick={onExport} disabled={count === 0}>
          Export data
        </button>
      </section>

      <section className="data-card">
        <span className="data-card__icon">⬆️</span>
        <h2>Import from CSV</h2>
        <p>
          Upload a CSV with columns <code>title, amount, date</code> to add expenses
          in bulk.
        </p>
        <button
          type="button"
          className="primary-btn"
          onClick={() => fileInputRef.current?.click()}
        >
          Choose file
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv,text/csv"
          onChange={handleFile}
          hidden
        />
      </section>
    </div>
  );
};

export default DataPanel;
