import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import { Provider } from 'react-redux';

import store from './store'
import { PersistGate } from 'redux-persist/integration/react';
import { persistStore } from 'redux-persist';
import { GoogleOAuthProvider } from '@react-oauth/google';
let persistor = persistStore(store);



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  //
  
  <React.StrictMode>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GoogleClient}>
    <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
      </PersistGate>
    </Provider>
    </GoogleOAuthProvider>
    
    
    
  </React.StrictMode>
);

