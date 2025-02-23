import React from "react";
import "./TranscriptionPanel.css";

const TranscriptionPanel = ({ lines, hoveredLine, setHoveredLine }) => {
  return (
    <div className="transcription-panel">
      <div className="transcription-content">
        {lines.map((line, index) => (
          <div
            key={index}
            className={`line-item ${hoveredLine === line ? "active" : ""}`}
            onMouseEnter={() => setHoveredLine(line)}
            onMouseLeave={() => setHoveredLine(null)}
          >
            <div className="line-number">{line.line}</div>
            <div className="transcription" dir="rtl">
              {line.transcription}
            </div>
            {line.translation && <div className="translation">{line.translation}</div>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default TranscriptionPanel;
