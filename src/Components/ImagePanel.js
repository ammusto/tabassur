// src/components/ImagePanel.js
import React, { useState, useRef, useEffect } from "react";
import HoverTooltip from "./HoverTooltip";
import "./ImagePanel.css";

const ImagePanel = ({
  metadata,
  manuscriptId,
  currentPage,
  zoom,
  setZoom,
  offset,
  setOffset,
  hoveredLine,
  setHoveredLine,
  showLineBoxes,
  showHoverText,
  lines,
  fullWidth // new prop for full-width styling when transcription is hidden
}) => {
  const imageRef = useRef(null);
  const [imageNaturalSize, setImageNaturalSize] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (imageRef.current) {
      setImageNaturalSize({
        width: imageRef.current.naturalWidth,
        height: imageRef.current.naturalHeight,
      });
    }
  }, [currentPage]);

  const handleMouseDown = (e) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    dragStart.current = { x: e.clientX - offset.x, y: e.clientY - offset.y };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    setOffset({
      x: e.clientX - dragStart.current.x,
      y: e.clientY - dragStart.current.y,
    });
  };

  const handleMouseUp = () => setIsDragging(false);

  const handleTouchStart = (e) => {
    if (zoom <= 1) return;
    setIsDragging(true);
    const touch = e.touches[0];
    dragStart.current = { x: touch.clientX - offset.x, y: touch.clientY - offset.y };
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const touch = e.touches[0];
    setOffset({
      x: touch.clientX - dragStart.current.x,
      y: touch.clientY - dragStart.current.y,
    });
  };

  const handleTouchEnd = () => setIsDragging(false);

  return (
    <div className={`image-panel ${fullWidth ? "full-width" : ""}`}>
      <div className="image-container">
        <div 
          className="zoom-controls"
          onTouchStart={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          <button onClick={() => setZoom((prev) => Math.min(prev + 0.2, 3))}>+</button>
          <button onClick={() => setZoom((prev) => Math.max(prev - 0.2, 1))}>-</button>
          <button onClick={() => { setZoom(1); setOffset({ x: 0, y: 0 }); }}>Reset</button>
        </div>
        <div
          className="centered-wrapper"
          style={{
            transform: `scale(${zoom}) translate(${offset.x / zoom}px, ${offset.y / zoom}px)`,
            transformOrigin: "0 0",
            cursor: zoom > 1 ? (isDragging ? "grabbing" : "grab") : "default",
          }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          onTouchCancel={handleTouchEnd}
        >
          <img
            draggable="false"
            onDragStart={(e) => e.preventDefault()}
            ref={imageRef}
            src={`/msdata/${manuscriptId}/img/${currentPage}.jpg`}
            alt={`Manuscript folio ${currentPage}`}
            onLoad={(e) =>
              setImageNaturalSize({
                width: e.target.naturalWidth,
                height: e.target.naturalHeight,
              })
            }
            onContextMenu={(e) => e.preventDefault()}
          />
          {lines && imageNaturalSize && imageRef.current && lines.map((item, idx) => {
            const dispWidth = imageRef.current.clientWidth;
            const dispHeight = imageRef.current.clientHeight;
            const scaleX = dispWidth / imageNaturalSize.width;
            const scaleY = dispHeight / imageNaturalSize.height;
            const dispStart = { x: item.start_x * scaleX, y: item.start_y * scaleY };
            const dispEnd = { x: item.end_x * scaleX, y: item.end_y * scaleY };
            const left = Math.min(dispStart.x, dispEnd.x);
            const top = Math.min(dispStart.y, dispEnd.y);
            const width = Math.abs(dispEnd.x - dispStart.x);
            const height = Math.abs(dispEnd.y - dispStart.y);
            return (
              <div
                key={idx}
                className={`rectangle-overlay ${hoveredLine === item ? "active" : ""}`}
                style={{
                  left,
                  top,
                  width,
                  height,
                  opacity: showLineBoxes && hoveredLine === item ? 0.3 : 0,
                  backgroundColor: metadata.bw ? "rgb(247, 255, 178)" : "rgb(255, 255, 255)"
                }}
                onMouseEnter={() => setHoveredLine(item)}
                onMouseLeave={() => setHoveredLine(null)}
              />
            );
          })}
          {hoveredLine && showHoverText && imageNaturalSize && imageRef.current && hoveredLine.transcription && (() => {
            const scaleYVal = imageRef.current.clientHeight / imageNaturalSize.height;
            const bottomOfLine = Math.max(hoveredLine.start_y, hoveredLine.end_y) * scaleYVal;
            const tooltipTop = bottomOfLine + 10;
            return (
              <HoverTooltip
                hoveredLine={hoveredLine}
                showTranscription={true}
                showTranslation={false}
                top={tooltipTop}
              />
            );
          })()}
        </div>
      </div>
    </div>
  );
};

export default ImagePanel;
