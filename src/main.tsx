import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App  from './App.tsx'
import 'bootstrap/dist/css/bootstrap.min.css';
import NewsTicker from './components/News Ticker/NewsTicker.tsx';



const rootElement = document.getElementById('root');

if (!rootElement) {
  throw new Error("Elemento #root não encontrado no HTML!");
}

createRoot(rootElement).render(
  <StrictMode>
    <App />       
    <NewsTicker />    
  </StrictMode>
);

