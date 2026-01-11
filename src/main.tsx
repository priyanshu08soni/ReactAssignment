import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

// PrimeReact Styles
import "primereact/resources/themes/lara-dark-teal/theme.css"; // Premium dark theme
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css"; // Optional, using if needed for quick layout

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
