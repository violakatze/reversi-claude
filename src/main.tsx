// アプリケーションエントリーポイント

import React from 'react';
import ReactDOM from 'react-dom/client';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';

import { App } from './App';

// MUIテーマ設定（ライトテーマのみ）
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2d6a2d',
    },
  },
});

const rootElement = document.getElementById('root');
if (!rootElement) throw new Error('ルート要素が見つかりません');

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
