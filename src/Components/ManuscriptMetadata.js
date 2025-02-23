import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Papa from 'papaparse';
import './ManuscriptMetadata.css';

const ManuscriptMetadata = () => {
  const { id: manuscriptId } = useParams();
  const [metadata, setMetadata] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    console.log(manuscriptId)
    const loadMetadata = async () => {
      try {
        const response = await fetch('/msdata/metadata.csv');
        const csvText = await response.text();
        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const msData = results.data.find(ms => ms.manuscript_id === manuscriptId);
            if (msData) {
              setMetadata(msData);
            } else {
              setError('Manuscript not found');
            }
            setLoading(false);
          },
          error: () => {
            setError('Failed to parse metadata');
            setLoading(false);
          }
        });
      } catch {
        setError('Failed to load metadata');
        setLoading(false);
      }
    };

    loadMetadata();
  }, [manuscriptId]);

  if (loading) {
    return <div className="text-center p10">Loading manuscript details...</div>;
  }

  if (error) {
    return <div className="text-center p10 highlight">{error}</div>;
  }

  if (!metadata) {
    return <div className="text-center p10">Manuscript not found</div>;
  }

  return (
    <div className="container">
      <div className="main">
        <div className="manuscript-detail">
          <div className="manuscript-titles">
            <h2 className="title-ar" dir="rtl">{metadata.title_ar}</h2>
            <h3 className="title-lat">{metadata.title_lat}</h3>
          </div>
          <div className="manuscript-content">
            <div className="manuscript-image">
              <img
                src={`/msdata/${metadata.manuscript_id}/img/1.jpg`}
                alt={`First folio of ${metadata.title_lat}`}
              />
            </div>
            <div className="manuscript-info">
              <div className="description-section">
                <h3>Description</h3>
                <p>{metadata.description}</p>
              </div>
              <div className="description-section">
                <h3>Issues</h3>
                <p>{metadata.issues}</p>
              </div>
              <div className="metadata-grid">
                <div className="metadata-item">
                  <h4>Author</h4>
                  <p dir="ltr" className="arabic-text">{metadata.author_lat}</p>
                  <p dir="rtl" className="arabic-text">{metadata.author_ar}</p>
                </div>
                <div className="metadata-item">
                  <h4>Death Date</h4>
                  <p>{metadata.date}</p>
                </div>
                <div className="metadata-item">
                  <h4>Language</h4>
                  <p>{metadata.language}</p>
                </div>
                <div className="metadata-item">
                  <h4>Library</h4>
                  <p>{metadata.library}</p>
                </div>
                <div className="metadata-item">
                  <h4>Shelfmark</h4>
                  <p>{metadata.collection_name}</p>
                </div>
                <div className="metadata-item">
                  <h4>Folios</h4>
                  <p>{metadata.start_folio}-{metadata.end_folio}</p>
                </div>
                <div className="metadata-item">
                  <h4>Published</h4>
                  <p>{metadata.published}</p>
                </div>
              </div>

            </div>
          </div>
          <div className="manuscript-titles">
            <div className="viewer-link">
              <a href={`/viewer/${metadata.manuscript_id}`} className="button">
                Open in Viewer
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManuscriptMetadata;
