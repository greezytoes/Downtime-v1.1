import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { MaintenanceProvider } from './context/MaintenanceContext';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <MaintenanceProvider>
        <App />
      </MaintenanceProvider>
    </ThemeProvider>
  </StrictMode>
);