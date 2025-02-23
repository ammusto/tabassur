// src/components/ManuscriptViewer.js
import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Papa from "papaparse";
import ThumbnailPanel from "./ThumbnailPanel";
import ImagePanel from "./ImagePanel";
import TranscriptionPanel from "./TranscriptionPanel";
import ControlsPanel from "./ControlsPanel";
import "./ManuscriptViewer.css";

const ManuscriptViewer = () => {
  const { id: manuscriptId } = useParams();
  const [currentPage, setCurrentPage] = useState(1);
  const [linesData, setLinesData] = useState([]);
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Shared states for panels and interactions
  // activePanel is used on small screens to toggle between image and transcription.
  const [activePanel, setActivePanel] = useState("image");
  // On large screens, this flag controls whether to show the transcription panel alongside the image.
  const [showTranscriptionPanel, setShowTranscriptionPanel] = useState(true);
  const [showLineBoxes, setShowLineBoxes] = useState(true);
  const [showHoverText, setShowHoverText] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [hoveredLine, setHoveredLine] = useState(null);
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 1024);

  // Listen for window resize events. Only force activePanel to "image"
  // when transitioning from large to small.
  useEffect(() => {
    let prevSmallScreen = window.innerWidth <= 1024;
    const handleResize = () => {
      const small = window.innerWidth <= 1024;
      setIsSmallScreen(small);
      if (small && !prevSmallScreen) {
        // Transitioned from large to small; force image panel
        setActivePanel("image");
      }
      prevSmallScreen = small;
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // initial check
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    if (!manuscriptId) {
      setError("No manuscript ID provided");
      setLoading(false);
      return;
    }

    const loadManuscriptData = async () => {
      try {
        const metadataResponse = await fetch("/msdata/metadata.csv");
        const metadataText = await metadataResponse.text();
        Papa.parse(metadataText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const msData = results.data.find((ms) => ms.manuscript_id === manuscriptId);
            if (msData) {
              setMetadata({
                ...msData,
                total_images: parseInt(msData.total_images),
                total_folios: parseInt(msData.total_folios),
                start_folio: msData.start_folio,
              });
            } else {
              setError("Manuscript not found");
              setLoading(false);
              return;
            }
          },
        });

        const msDataResponse = await fetch(`/msdata/${manuscriptId}/ms_data.csv`);
        const msDataText = await msDataResponse.text();
        Papa.parse(msDataText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const processedData = results.data.map((row) => ({
              ...row,
              line: parseInt(row.line, 10),
              start_x: parseFloat(row.start_x),
              start_y: parseFloat(row.start_y),
              end_x: parseFloat(row.end_x),
              end_y: parseFloat(row.end_y),
            }));
            setLinesData(processedData);
            setLoading(false);
          },
          error: () => {
            setError("Failed to parse manuscript data");
            setLoading(false);
          },
        });
      } catch (err) {
        setError("Failed to load manuscript data");
        setLoading(false);
      }
    };

    loadManuscriptData();
  }, [manuscriptId]);

  // Utility to compute folio number
  const getFolioNumber = (startFolio, imageIndex) => {
    const startNum = parseInt(startFolio.match(/\d+/)[0]);
    const startSide = startFolio.slice(-1).toLowerCase();
    const foliosPerNumber = 2;
    const currentFolioNum =
      startNum + Math.floor((imageIndex + (startSide === "b" ? 1 : 0)) / foliosPerNumber);
    const currentSide =
      (imageIndex + (startSide === "b" ? 1 : 0)) % foliosPerNumber === 0 ? "a" : "b";
    return `${currentFolioNum}${currentSide}`;
  };

  // Compute lines for the current page.
  const getCurrentPageLines = () =>
    linesData
      .filter((line) => line.image_id === currentPage.toString())
      .sort((a, b) => a.line - b.line);

  if (loading)
    return (
      <div className="main">
        <div className="text-center p10">Loading manuscript viewer...</div>
      </div>
    );
  if (error)
    return <div className="text-center p10 highlight">{error}</div>;

  const currentFolio = metadata ? getFolioNumber(metadata.start_folio, currentPage - 1) : "";

  return (
    <div className="manuscript-viewer">
      <div className="panels-container">
        <div className="panels-content">
          <ThumbnailPanel 
            metadata={metadata}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            getFolioNumber={getFolioNumber}
            manuscriptId={manuscriptId}
          />
          {isSmallScreen ? (
            activePanel === "image" ? (
              <ImagePanel 
                metadata={metadata}
                manuscriptId={manuscriptId}
                currentPage={currentPage}
                zoom={zoom}
                setZoom={setZoom}
                offset={offset}
                setOffset={setOffset}
                hoveredLine={hoveredLine}
                setHoveredLine={setHoveredLine}
                showLineBoxes={showLineBoxes}
                showHoverText={showHoverText}
                lines={getCurrentPageLines()}
              />
            ) : (
              <TranscriptionPanel 
                lines={getCurrentPageLines()}
                hoveredLine={hoveredLine}
                setHoveredLine={setHoveredLine}
              />
            )
          ) : (
            <>
              <ImagePanel 
                metadata={metadata}
                manuscriptId={manuscriptId}
                currentPage={currentPage}
                zoom={zoom}
                setZoom={setZoom}
                offset={offset}
                setOffset={setOffset}
                hoveredLine={hoveredLine}
                setHoveredLine={setHoveredLine}
                showLineBoxes={showLineBoxes}
                showHoverText={showHoverText}
                lines={getCurrentPageLines()}
                fullWidth={!showTranscriptionPanel} // Pass fullWidth prop here
              />
              {showTranscriptionPanel && (
                <TranscriptionPanel 
                  lines={getCurrentPageLines()}
                  hoveredLine={hoveredLine}
                  setHoveredLine={setHoveredLine}
                />
              )}
            </>
          )}
        </div>
        <ControlsPanel 
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalImages={metadata.total_images}
          currentFolio={currentFolio}
          copyright={metadata.copyright}
          showLineBoxes={showLineBoxes}
          setShowLineBoxes={setShowLineBoxes}
          showHoverText={showHoverText}
          setShowHoverText={setShowHoverText}
          activePanel={activePanel}
          setActivePanel={setActivePanel}
          showTranscriptionPanel={showTranscriptionPanel}
          setShowTranscriptionPanel={setShowTranscriptionPanel}
          isSmallScreen={isSmallScreen}
        />
      </div>
    </div>
  );
};

export default ManuscriptViewer;
