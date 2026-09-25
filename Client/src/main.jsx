import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import { Provider } from "react-redux";
import {store} from './stores/store.js'
import {ToastProvider} from './context/ToastContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Provider store={store}>
    <BrowserRouter>
    <ToastProvider>
    <App />
    </ToastProvider>
    </BrowserRouter>
    </Provider>
  </StrictMode>,
)
