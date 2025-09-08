import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { BrowserRouter } from 'react-router-dom'
import AppContext from './Context/Context.jsx'
import axios from 'axios'

// Configure axios defaults
axios.defaults.baseURL = 'http://localhost:8000';
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.common['Content-Type'] = 'application/json';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <AppContext>
      <BrowserRouter>
    <App />
      </BrowserRouter>
    </AppContext>
  </React.StrictMode>,
)
