
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'
import { initGlobalTypeCheckers } from './utils/debug/globalTypeCheck';

// Initialize global type checkers in development
if (process.env.NODE_ENV !== 'production') {
  initGlobalTypeCheckers();
}

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
)
