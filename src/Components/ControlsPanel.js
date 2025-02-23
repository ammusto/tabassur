// src/components/ControlsPanel.js
import React from "react";
import "./ControlsPanel.css";

const ControlsPanel = ({
  currentPage,
  setCurrentPage,
  totalImages,
  currentFolio,
  copyright,
  showLineBoxes,
  setShowLineBoxes,
  showHoverText,
  setShowHoverText,
  activePanel,
  setActivePanel,
  showTranscriptionPanel,
  setShowTranscriptionPanel,
  isSmallScreen,
}) => {
  return (
    <div className="combined-controls">
      <div>

        <div>
          <div className="folio-header">
            Folio {currentFolio} (© {copyright})
          </div>
        </div>
        <button
          onClick={() => setCurrentPage((prev) => prev + 1)}
          disabled={currentPage === totalImages}
        >
          Next Page
        </button>
        <button onClick={() => setShowLineBoxes(!showLineBoxes)} className={showLineBoxes ? "active" : ""}>
          Line Box
        </button>
        <button onClick={() => setShowHoverText(!showHoverText)} className={showHoverText ? "active" : ""}>
          Hover Text
        </button>
        {isSmallScreen && (
          <button
            className="toggle-panel-btn"
            onClick={() =>
              setActivePanel((prev) => (prev === "image" ? "transcription" : "image"))
            }
          >
            Show {activePanel === "image" ? "Transcription" : "Image"}
          </button>
        )}
        <button
          className="transcription-toggle-btn"
          onClick={() => setShowTranscriptionPanel((prev) => !prev)}
        >
          {showTranscriptionPanel ? "Hide Transcription" : "Show Transcription"}
        </button>
        <button onClick={() => setCurrentPage((prev) => prev - 1)} disabled={currentPage === 1}>
          Previous Page
        </button>
      </div>
    </div>
  );
};

export default ControlsPanel;
