import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import './ManuscriptList.css';

const ManuscriptList = () => {
  const [manuscripts, setManuscripts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadMetadata = async () => {
      try {
        const response = await fetch('/msdata/metadata.csv');
        const csvText = await response.text();

        Papa.parse(csvText, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            setManuscripts(results.data);
            setLoading(false);
          },
          error: () => {
            setError('Failed to parse metadata');
            setLoading(false);
          }
        });
      } catch (err) {
        setError('Failed to load metadata');
        setLoading(false);
      }
    };

    loadMetadata();
  }, []);

  if (loading) {
    return <div className="loading">Loading manuscripts...</div>;
  }

  if (error) {
    return <div className="error highlight">{error}</div>;
  }

  return (
    <div className="container">
      <div className="main">
        <div className="manuscripts-grid">
          {manuscripts.map((manuscript) => (
            <div key={manuscript.manuscript_id} className="manuscript-card">
              <div className="card">
                <div className="card-image-container">
                  <img
                    src={`/msdata/${manuscript.manuscript_id}/img/thumbnails/1.jpg`}
                    alt={`First folio of ${manuscript.title_lat}`}
                    className="card-image"
                  />
                </div>
                <div className="card-content">
                  <div className='ms-title'>{manuscript.title_ar}</div>
                  <div className='ms-title'>{manuscript.title_lat}</div>
                  <div className='ms-title'>by</div>
                  <div className='ms-title'>{manuscript.author_ar}</div>
                  <div className='ms-title'>{manuscript.author_lat} (d. {manuscript.date} )</div>


                </div>
                <div className="card-links">
                  <a href={`/manuscript/${manuscript.manuscript_id}`} className="viewer-link">
                    View Details
                  </a>
                  <a href={`/viewer/${manuscript.manuscript_id}`} className="viewer-link">
                    Open Viewer
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ManuscriptList;
