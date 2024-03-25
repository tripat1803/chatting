import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter } from 'react-router-dom';
import AuthState from './context/AuthState';
import SocketState from './context/SocketState';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <SocketState>
        <AuthState>
          <App />
        </AuthState>
      </SocketState>
    </BrowserRouter>
  </React.StrictMode>
);

reportWebVitals();
