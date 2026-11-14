import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App';
import { initializeModernWebFallbacks } from './lib/polyfills';
import './styles/index.css';

initializeModernWebFallbacks();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
