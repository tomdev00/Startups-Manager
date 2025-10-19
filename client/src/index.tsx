import 'antd/dist/reset.css';
import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ConfigProvider } from "antd";
import { BrowserRouter } from 'react-router-dom';
import { LoginProvider } from './context/loginProvider';


const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <LoginProvider>
      <BrowserRouter>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#91919191",
              // colorBgBase: "#555",
              colorBgContainer: "#001529",
              colorText: "white"
            },
          }}>
          <App />
        </ConfigProvider>
      </BrowserRouter>
    </LoginProvider>
  </React.StrictMode>
);

reportWebVitals();
