import React from 'react';
import ReactDOM from 'react-dom/client';
import { ChakraProvider } from '@chakra-ui/react';
import { Provider } from 'react-redux';
import { ToastContainer } from 'react-toastify';
import { PersistGate } from 'redux-persist/integration/react';

import 'index.scss';
import 'react-toastify/dist/ReactToastify.css';

import App from 'App';
import theme from 'utilities/theme';
import { BrowserRouter } from 'react-router-dom';
import { store, persistor } from 'store';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>
        <ChakraProvider theme={theme}>
          <BrowserRouter>
            <ToastContainer
              position="top-right"
              autoClose={7000}
              newestOnTop={false}
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              bodyClassName="__toastify"
              theme="colored"
            />
            <App />
          </BrowserRouter>
        </ChakraProvider>
      </PersistGate>
    </Provider>
  </React.StrictMode>
);
