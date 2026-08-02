import React from 'react';
import { NavLink } from 'react-router-dom';

export default function EditorSidebar() {
  return (
    <aside className="editor-sidebar">
      <ul>
        <li><NavLink to="/editor" end>Manage Articles</NavLink></li>
      </ul>
    </aside>
  );
}
