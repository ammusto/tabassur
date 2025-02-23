import React from "react";
import "./HoverTooltip.css";

const HoverTooltip = ({ hoveredLine, showTranscription, showTranslation, top }) => (
  <div
    className="hover-tooltip"
    style={{
      top: `${top}px`,
      transform: "translateX(-50%)",
    }}
  >
    {showTranscription && (
      <div className="tooltip-transcription" dir="rtl">
        {hoveredLine.transcription}
      </div>
    )}
    {showTranslation && (
      <div className="tooltip-translation">
        {hoveredLine.translation}
      </div>
    )}
  </div>
);

export default HoverTooltip;
