import React from 'react';
import { Routes, Route } from 'react-router-dom';
import EditorNavbar from '../components/EditorNavbar';
import EditorSidebar from '../components/EditorSidebar';
import Articles from '../../admin/pages/Articles'; // reuse Articles management

export default function EditorDashboard() {
  return (
    <div className="editor-wrapper">
      <EditorNavbar />
      <div className="editor-content">
        <EditorSidebar />
        <main className="editor-main">
          <Routes>
            <Route path="/" element={<Articles />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
