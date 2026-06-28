import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App.tsx';
import EventsPage from './pages/EventsPage.tsx';
import CommitteePage from './pages/CommitteePage.tsx';

import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/events" element={<EventsPage />} />
        <Route path="/committee" element={<CommitteePage />} />

      </Routes>
    </BrowserRouter>
  </StrictMode>
);
