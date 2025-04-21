
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

// Make sure we're not in a test environment
if (import.meta.env.MODE !== 'test') {
  const rootElement = document.getElementById('root');

  if (rootElement) {
    const root = ReactDOM.createRoot(rootElement);
    root.render(
      <React.StrictMode>
        <App />
      </React.StrictMode>
    );
  }
}

// Export App for testing purposes
export default App;
