import React from "react";
import "./ThumbnailPanel.css";

const ThumbnailPanel = ({ metadata, currentPage, setCurrentPage, getFolioNumber, manuscriptId }) => {
  if (!metadata) return null;

  return (
    <div className="thumbnail-panel">
      {[...Array(metadata.total_images)].map((_, index) => {
        const pageNumber = index + 1;
        const folioNumber = getFolioNumber(metadata.start_folio, index);
        return (
          <div
            key={pageNumber}
            className={`thumbnail ${currentPage === pageNumber ? "active" : ""}`}
            onClick={() => setCurrentPage(pageNumber)}
          >
            <img
              src={`/msdata/${manuscriptId}/img/thumbnails/${pageNumber}.jpg`}
              alt={`Folio ${folioNumber}`}
              loading="lazy"
            />
            <div className="thumbnail-label">Folio {folioNumber}</div>
          </div>
        );
      })}
    </div>
  );
};

export default ThumbnailPanel;
