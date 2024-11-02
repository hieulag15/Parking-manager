import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import GlobalStyle from './shared/GlobalStyle.js';
import { AppProvider } from './context';
import { BrowserRouter } from 'react-router-dom';
import CustomAntdTheme from './shared/CustomAntdTheme.js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// Tạo một QueryClient
const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById('root')).render(
  <AppProvider>
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <CustomAntdTheme />
        <GlobalStyle />
        <App />
      </QueryClientProvider>
    </BrowserRouter>
  </AppProvider>
);
