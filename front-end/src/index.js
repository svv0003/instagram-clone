import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import InstagramUI from "./InstagramUI";
import NotificationToast from "./components/NotificationToast";
import AuthProvider from "./context/AuthContext";
import ToastProvider from "./context/ToastProvider";
import {BrowserRouter} from "react-router-dom";

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <>
        <AuthProvider>
            <ToastProvider>
                <BrowserRouter>
                    {/*<NotificationToast>*/}
                        <App />
                    {/*</NotificationToast>*/}
                </BrowserRouter>
            </ToastProvider>
        </AuthProvider>
    </>
);