import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Layout from './Layout/Layout';
import ManuscriptList from './Components/ManuscriptList';
import ManuscriptMetadata from './Components/ManuscriptMetadata';
import ManuscriptViewer from './Components/ManuscriptViewer';
import About from './Layout/About';
import './App.css';

const App = () => {
  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<ManuscriptList />} />
          <Route path="/manuscript/:id" element={<ManuscriptMetadata />} />
          <Route path="/viewer/:id" element={<ManuscriptViewer />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </Layout>
    </Router>
  );
};

export default App;