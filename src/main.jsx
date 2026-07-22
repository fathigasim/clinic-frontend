// import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux';
import { store } from './app/store.js';
// import './index.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import { ToastContainer } from 'react-toastify';
import App from './App.jsx'
// main.jsx or index.js
import 'bootstrap-icons/font/bootstrap-icons.css';

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <Provider store={store}>
        <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        // rtl={i18next.language === 'ar'}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    <App />
    </Provider>

)


