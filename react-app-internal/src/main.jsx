import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './styles/obsidian.css'
import {BrowserRouter} from "react-router-dom";
import {HelmetProvider} from "react-helmet-async";

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <HelmetProvider>
        <App/>
      </HelmetProvider>
    </BrowserRouter>
  </React.StrictMode>
);